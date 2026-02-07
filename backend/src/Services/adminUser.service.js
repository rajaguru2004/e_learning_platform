const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../Prisma/client');
const { logAuditEvent, getIpAddress, ACTION_TYPES } = require('../Utils/auditLog.helper');

/**
 * Admin User Management Service
 * 
 * Business logic for admin user management operations
 * - User listing with pagination, filtering, search
 * - User profile with aggregations
 * - Account activation/deactivation
 * - Password reset
 * - User impersonation
 * 
 * @module adminUser.service
 */

/**
 * Get all users with pagination, filtering, search, and sorting
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {string} options.role - Filter by role code
 * @param {string} options.status - Filter by status (active/inactive)
 * @param {string} options.search - Search by name or email
 * @param {string} options.sortBy - Sort field (created_at, name, email)
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Users list with pagination metadata
 */
const getAllUsers = async ({ page = 1, limit = 10, role, status, search, sortBy = 'created_at', sortOrder = 'desc' }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    // Filter by role
    if (role) {
        const roleRecord = await prisma.role.findUnique({
            where: { code: role.toUpperCase() },
        });
        if (roleRecord) {
            where.roleId = roleRecord.id;
        }
    }

    // Filter by status
    if (status) {
        where.isActive = status === 'active';
    }

    // Search by name or email
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Map sort fields to Prisma model fields
    const sortMapping = {
        'created_at': 'createdAt',
        'name': 'name',
        'email': 'email',
        'status': 'isActive',
    };

    const prismaSortField = sortMapping[sortBy] || 'createdAt';

    // Execute query with pagination
    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: {
                [prismaSortField]: sortOrder,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                role: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            roleCode: user.role.code,
            status: user.isActive ? 'active' : 'inactive',
            created_at: user.createdAt,
        })),
        pagination: {
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take),
            totalCount,
        },
    };
};

/**
 * Get user profile with detailed summary
 * Includes enrollments, points, badges, etc.
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile with aggregated data
 */
const getUserProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get enrollment count
    const enrollmentCount = await prisma.enrollment.count({
        where: { userId },
    });

    // Get total points
    const pointsData = await prisma.pointsLedger.aggregate({
        where: { userId },
        _sum: {
            points: true,
        },
    });

    const totalPoints = pointsData._sum.points || 0;

    // Get current badge based on points
    const currentBadge = await prisma.badgeType.findFirst({
        where: {
            minPoints: { lte: totalPoints },
            OR: [
                { maxPoints: { gte: totalPoints } },
                { maxPoints: null },
            ],
            isActive: true,
        },
        orderBy: {
            levelOrder: 'desc',
        },
    });

    // Get enrollment status breakdown
    const enrollmentStatusBreakdown = await prisma.enrollment.groupBy({
        by: ['statusCode'],
        where: { userId },
        _count: {
            statusCode: true,
        },
    });

    const statusBreakdown = enrollmentStatusBreakdown.reduce((acc, item) => {
        acc[item.statusCode] = item._count.statusCode;
        return acc;
    }, {});

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
        ...userWithoutPassword,
        enrollmentCount,
        totalPoints,
        currentBadge: currentBadge ? {
            name: currentBadge.name,
            minPoints: currentBadge.minPoints,
            maxPoints: currentBadge.maxPoints,
            iconUrl: currentBadge.iconUrl,
        } : null,
        enrollmentStatusBreakdown: statusBreakdown,
        lastLogin: null, // TODO: Implement last login tracking
    };
};

/**
 * Update user account status (activate/deactivate)
 * 
 * @param {string} userId - User ID to update
 * @param {boolean} isActive - Target status
 * @param {Object} admin - Admin user making the change
 * @param {Object} req - Express request object (for IP logging)
 * @returns {Promise<Object>} Updated user
 */
const updateUserStatus = async (userId, isActive, admin, req = null) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Prevent self-deactivation if user is admin
    if (!isActive && userId === admin.id) {
        throw new Error('Cannot deactivate your own account');
    }

    // Update status
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive },
        include: {
            role: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.USER_STATUS_CHANGE,
        admin,
        targetType: 'USER',
        targetId: userId,
        details: {
            is_active: isActive,
            previous_status: user.isActive,
            user_email: user.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};

/**
 * Generate temporary password and reset user password
 * 
 * @param {string} userId - User ID
 * @param {Object} admin - Admin user performing the reset
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Temporary password
 */
const resetUserPassword = async (userId, admin, req = null) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Generate random temporary password
    const tempPassword = generateTemporaryPassword();

    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user password
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.PASSWORD_RESET,
        admin,
        targetType: 'USER',
        targetId: userId,
        details: {
            user_email: user.email,
            reset_by: admin.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        tempPassword,
        message: 'Password reset successfully. Please communicate this password securely to the user.',
    };
};

/**
 * Impersonate user - generate JWT token for target user
 * 
 * SECURITY SENSITIVE: This allows admin to act as another user
 * - Only ADMIN can impersonate
 * - Regular admins cannot impersonate other admins
 * - All impersonation events are logged
 * 
 * @param {string} targetUserId - User ID to impersonate
 * @param {Object} admin - Admin user performing impersonation
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Impersonation token
 */
const impersonateUser = async (targetUserId, admin, req = null) => {
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { role: true },
    });

    if (!targetUser) {
        throw new Error('Target user not found');
    }

    if (!targetUser.isActive) {
        throw new Error('Cannot impersonate inactive user');
    }

    // Security check: prevent impersonating another admin
    // Only allow if admin performing the action has a "super admin" permission
    // For now, we'll prevent regular admins from impersonating other admins
    if (targetUser.role.code === 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
        throw new Error('Insufficient permissions to impersonate admin users');
    }

    // Prevent self-impersonation (makes no sense)
    if (targetUserId === admin.id) {
        throw new Error('Cannot impersonate yourself');
    }

    // Generate impersonation token with special claim
    const impersonationToken = jwt.sign(
        {
            id: targetUser.id,
            email: targetUser.email,
            role: targetUser.role.code,
            roleId: targetUser.role.id,
            impersonated_by: admin.id, // Special claim to track impersonation
            impersonation: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Shorter expiry for security
    );

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.USER_IMPERSONATION,
        admin,
        targetType: 'USER',
        targetId: targetUserId,
        details: {
            target_user_email: targetUser.email,
            target_user_role: targetUser.role.code,
            admin_email: admin.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        impersonationToken,
        targetUser: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role.code,
        },
        expiresIn: '1h',
        warning: 'This token allows you to act as the target user. Use with extreme caution.',
    };
};

/**
 * Generate a secure temporary password
 * 
 * @returns {string} Random password
 */
const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = 12;
    let password = '';

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserStatus,
    resetUserPassword,
    impersonateUser,
};
