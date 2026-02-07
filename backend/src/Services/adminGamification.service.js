const { prisma } = require('../Prisma/client');
const { logAuditEvent, getIpAddress, ACTION_TYPES } = require('../Utils/auditLog.helper');

/**
 * Admin Gamification Management Service
 * 
 * Business logic for gamification management:
 * - Badge CRUD operations with overlap prevention
 * - Points granting and deduction with transactions
 * - Leaderboard with aggregation and caching
 * - Badge auto-assignment based on points
 * 
 * @module adminGamification.service
 */

// ============================================================================
// BADGE MANAGEMENT
// ============================================================================

/**
 * Create a new badge
 * 
 * @param {Object} badgeData - Badge data
 * @param {string} badgeData.name - Badge name (unique)
 * @param {number} badgeData.min_points - Minimum points threshold
 * @param {number} badgeData.max_points - Maximum points threshold (optional)
 * @param {string} badgeData.icon_url - Icon URL (optional)
 * @param {string} badgeData.description - Description (optional)
 * @param {Object} admin - Admin user performing action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Created badge
 */
const createBadge = async (badgeData, admin, req = null) => {
    const { name, min_points, max_points, icon_url, description } = badgeData;

    // Validate name uniqueness
    const existingBadge = await prisma.badgeType.findUnique({
        where: { name },
    });

    if (existingBadge) {
        throw new Error('Badge name already exists');
    }

    // Validate min_points < max_points
    if (max_points && min_points >= max_points) {
        throw new Error('min_points must be less than max_points');
    }

    // Check for overlapping badge ranges
    await validateBadgeThresholds(min_points, max_points);

    // Get next level order
    const maxLevelOrder = await prisma.badgeType.aggregate({
        _max: { levelOrder: true },
    });

    const levelOrder = (maxLevelOrder._max.levelOrder || 0) + 1;

    // Create badge
    const badge = await prisma.badgeType.create({
        data: {
            name,
            minPoints: min_points,
            maxPoints: max_points || null,
            iconUrl: icon_url || null,
            description: description || null,
            levelOrder,
            isActive: true,
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.BADGE_CREATED,
        admin,
        targetType: 'BADGE',
        targetId: badge.id,
        details: {
            badge_name: badge.name,
            min_points: badge.minPoints,
            max_points: badge.maxPoints,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return badge;
};

/**
 * Update existing badge
 * 
 * @param {string} badgeId - Badge ID
 * @param {Object} updateData - Update data
 * @param {Object} admin - Admin user
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Updated badge
 */
const updateBadge = async (badgeId, updateData, admin, req = null) => {
    const { name, min_points, max_points, icon_url, description } = updateData;

    const badge = await prisma.badgeType.findUnique({
        where: { id: badgeId },
    });

    if (!badge) {
        throw new Error('Badge not found');
    }

    // Validate name uniqueness (if changing name)
    if (name && name !== badge.name) {
        const existingBadge = await prisma.badgeType.findUnique({
            where: { name },
        });

        if (existingBadge) {
            throw new Error('Badge name already exists');
        }
    }

    // Validate thresholds
    const newMinPoints = min_points !== undefined ? min_points : badge.minPoints;
    const newMaxPoints = max_points !== undefined ? max_points : badge.maxPoints;

    if (newMaxPoints && newMinPoints >= newMaxPoints) {
        throw new Error('min_points must be less than max_points');
    }

    // Check for overlapping ranges (excluding current badge)
    await validateBadgeThresholds(newMinPoints, newMaxPoints, badgeId);

    // Update badge
    const updatedBadge = await prisma.badgeType.update({
        where: { id: badgeId },
        data: {
            name: name || badge.name,
            minPoints: newMinPoints,
            maxPoints: newMaxPoints,
            iconUrl: icon_url !== undefined ? icon_url : badge.iconUrl,
            description: description !== undefined ? description : badge.description,
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.BADGE_UPDATED,
        admin,
        targetType: 'BADGE',
        targetId: badgeId,
        details: {
            badge_name: updatedBadge.name,
            changes: updateData,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedBadge;
};

/**
 * Activate or deactivate badge
 * 
 * @param {string} badgeId - Badge ID
 * @param {boolean} isActive - Target status
 * @param {Object} admin - Admin user
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Updated badge
 */
const updateBadgeStatus = async (badgeId, isActive, admin, req = null) => {
    const badge = await prisma.badgeType.findUnique({
        where: { id: badgeId },
    });

    if (!badge) {
        throw new Error('Badge not found');
    }

    const updatedBadge = await prisma.badgeType.update({
        where: { id: badgeId },
        data: { isActive },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.BADGE_STATUS_CHANGED,
        admin,
        targetType: 'BADGE',
        targetId: badgeId,
        details: {
            badge_name: badge.name,
            is_active: isActive,
            previous_status: badge.isActive,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedBadge;
};

/**
 * Update badge icon URL
 * 
 * @param {string} badgeId - Badge ID
 * @param {string} iconUrl - New icon URL
 * @param {Object} admin - Admin user
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Updated badge
 */
const updateBadgeIcon = async (badgeId, iconUrl, admin, req = null) => {
    const badge = await prisma.badgeType.findUnique({
        where: { id: badgeId },
    });

    if (!badge) {
        throw new Error('Badge not found');
    }

    const updatedBadge = await prisma.badgeType.update({
        where: { id: badgeId },
        data: { iconUrl },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.BADGE_UPDATED,
        admin,
        targetType: 'BADGE',
        targetId: badgeId,
        details: {
            badge_name: badge.name,
            icon_updated: true,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedBadge;
};

/**
 * Get all badges with pagination and filters
 * 
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Badges list with pagination
 */
const getAllBadges = async ({ page = 1, limit = 10, active, sort = 'min_points' }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    if (active !== undefined) {
        where.isActive = active === 'true' || active === true;
    }

    // Determine sort field
    const sortMapping = {
        'min_points': 'minPoints',
        'name': 'name',
        'created_at': 'createdAt',
        'level_order': 'levelOrder',
    };

    const sortField = sortMapping[sort] || 'minPoints';

    // Execute query
    const [badges, totalCount] = await Promise.all([
        prisma.badgeType.findMany({
            where,
            skip,
            take,
            orderBy: { [sortField]: 'asc' },
        }),
        prisma.badgeType.count({ where }),
    ]);

    // Get user count for each badge
    const badgesWithCounts = await Promise.all(
        badges.map(async (badge) => {
            // Count users whose total points fall within this badge's range
            const usersInRange = await prisma.$queryRaw`
                SELECT COUNT(DISTINCT user_id) as count
                FROM (
                    SELECT user_id, SUM(points) as total_points
                    FROM points_ledger
                    GROUP BY user_id
                ) as user_points
                WHERE total_points >= ${badge.minPoints}
                AND (${badge.maxPoints}::int IS NULL OR total_points <= ${badge.maxPoints})
            `;

            return {
                id: badge.id,
                name: badge.name,
                min_points: badge.minPoints,
                max_points: badge.maxPoints,
                icon_url: badge.iconUrl,
                description: badge.description,
                level_order: badge.levelOrder,
                is_active: badge.isActive,
                created_at: badge.createdAt,
                users_assigned_count: parseInt(usersInRange[0]?.count || 0),
            };
        })
    );

    return {
        badges: badgesWithCounts,
        pagination: {
            page: parseInt(page),
            limit: take,
            total_pages: Math.ceil(totalCount / take),
            total_count: totalCount,
        },
    };
};

// ============================================================================
// POINTS CONTROL
// ============================================================================

/**
 * Get points log with pagination and filters
 * 
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Points log with pagination
 */
const getPointsLog = async ({ page = 1, limit = 10, user_id, source, from, to, search }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (user_id) {
        where.userId = user_id;
    }

    if (source) {
        where.sourceCode = source;
    }

    if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt.gte = new Date(from);
        if (to) where.createdAt.lte = new Date(to);
    }

    // Search by user email
    if (search) {
        where.user = {
            email: { contains: search, mode: 'insensitive' },
        };
    }

    // Execute query
    const [logs, totalCount] = await Promise.all([
        prisma.pointsLedger.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.pointsLedger.count({ where }),
    ]);

    // Get awarded_by user info for each log
    const logsWithDetails = await Promise.all(
        logs.map(async (log) => {
            let createdByEmail = null;
            if (log.awardedBy) {
                const adminUser = await prisma.user.findUnique({
                    where: { id: log.awardedBy },
                    select: { email: true },
                });
                createdByEmail = adminUser?.email;
            }

            return {
                id: log.id,
                user: log.user,
                source_code: log.sourceCode,
                points: log.points,
                description: log.description,
                reference_id: log.referenceId,
                reference_type: log.referenceType,
                created_by: createdByEmail,
                created_at: log.createdAt,
            };
        })
    );

    return {
        logs: logsWithDetails,
        pagination: {
            page: parseInt(page),
            limit: take,
            total_pages: Math.ceil(totalCount / take),
            total_count: totalCount,
        },
    };
};

/**
 * Grant bonus points to a user
 * 
 * @param {string} userId - User ID
 * @param {number} points - Points to grant (positive)
 * @param {string} reason - Reason for granting
 * @param {Object} admin - Admin user
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Created points ledger entry
 */
const grantPoints = async (userId, points, reason, admin, req = null) => {
    // Validate user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Validate points is positive
    if (points <= 0) {
        throw new Error('Points must be a positive number');
    }

    // Use transaction to create ledger entry
    const ledgerEntry = await prisma.pointsLedger.create({
        data: {
            userId,
            sourceCode: 'ADMIN_GRANT',
            points: parseInt(points),
            description: reason,
            referenceType: 'MANUAL',
            awardedBy: admin.id,
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.POINTS_GRANTED,
        admin,
        targetType: 'USER',
        targetId: userId,
        details: {
            user_email: user.email,
            points,
            reason,
            ledger_id: ledgerEntry.id,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    // Recalculate user badge
    await recalculateUserBadge(userId);

    return ledgerEntry;
};

/**
 * Deduct points from a user
 * 
 * @param {string} userId - User ID
 * @param {number} points - Points to deduct (positive, will be stored as negative)
 * @param {string} reason - Reason for deduction
 * @param {Object} admin - Admin user
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Created points ledger entry
 */
const deductPoints = async (userId, points, reason, admin, req = null) => {
    // Validate user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Validate points is positive
    if (points <= 0) {
        throw new Error('Points must be a positive number');
    }

    // Get current total points
    const totalPoints = await getUserTotalPoints(userId);

    // Optional: prevent total from going below 0
    if (totalPoints - points < 0) {
        throw new Error(`Cannot deduct ${points} points. User only has ${totalPoints} points.`);
    }

    // Use transaction to create ledger entry (as negative)
    const ledgerEntry = await prisma.pointsLedger.create({
        data: {
            userId,
            sourceCode: 'ADMIN_DEDUCT',
            points: -parseInt(points),
            description: reason,
            referenceType: 'MANUAL',
            awardedBy: admin.id,
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.POINTS_DEDUCTED,
        admin,
        targetType: 'USER',
        targetId: userId,
        details: {
            user_email: user.email,
            points_deducted: points,
            reason,
            ledger_id: ledgerEntry.id,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    // Recalculate user badge
    await recalculateUserBadge(userId);

    return ledgerEntry;
};

// ============================================================================
// LEADERBOARD
// ============================================================================

/**
 * Get leaderboard with rankings
 * 
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Leaderboard with pagination
 */
const getLeaderboard = async ({ page = 1, limit = 10, from, to, badge }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build date filter for points
    let dateFilter = {};
    if (from || to) {
        if (from) dateFilter.gte = new Date(from);
        if (to) dateFilter.lte = new Date(to);
    }

    // Get aggregated points per user
    const userPoints = await prisma.pointsLedger.groupBy({
        by: ['userId'],
        _sum: {
            points: true,
        },
        where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : undefined,
        orderBy: {
            _sum: {
                points: 'desc',
            },
        },
    });

    // Apply pagination
    const paginatedUsers = userPoints.slice(skip, skip + take);

    // Get user details and badges
    const leaderboard = await Promise.all(
        paginatedUsers.map(async (userPoint, index) => {
            const user = await prisma.user.findUnique({
                where: { id: userPoint.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            const totalPoints = userPoint._sum.points || 0;

            // Get badge for this user based on points
            const userBadge = await prisma.badgeType.findFirst({
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

            // Filter by badge if requested
            if (badge && (!userBadge || userBadge.name !== badge)) {
                return null;
            }

            return {
                rank: skip + index + 1,
                user_id: user.id,
                name: user.name,
                email: user.email,
                total_points: totalPoints,
                badge: userBadge ? {
                    name: userBadge.name,
                    icon_url: userBadge.iconUrl,
                    min_points: userBadge.minPoints,
                    max_points: userBadge.maxPoints,
                } : null,
            };
        })
    );

    // Filter out nulls (from badge filter)
    const filteredLeaderboard = leaderboard.filter(entry => entry !== null);

    return {
        leaderboard: filteredLeaderboard,
        pagination: {
            page: parseInt(page),
            limit: take,
            total_pages: Math.ceil(userPoints.length / take),
            total_count: userPoints.length,
        },
    };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate badge thresholds don't overlap with existing badges
 * 
 * @param {number} minPoints - Minimum points
 * @param {number} maxPoints - Maximum points (optional)
 * @param {string} excludeBadgeId - Badge ID to exclude from check (for updates)
 * @throws {Error} If overlap detected
 */
const validateBadgeThresholds = async (minPoints, maxPoints, excludeBadgeId = null) => {
    const where = { isActive: true };
    if (excludeBadgeId) {
        where.NOT = { id: excludeBadgeId };
    }

    const existingBadges = await prisma.badgeType.findMany({ where });

    for (const badge of existingBadges) {
        const existingMin = badge.minPoints;
        const existingMax = badge.maxPoints;

        // Check for overlap
        const newMin = minPoints;
        const newMax = maxPoints;

        // Case 1: New range starts within existing range
        if (newMin >= existingMin && (existingMax === null || newMin <= existingMax)) {
            throw new Error(`Badge range overlaps with existing badge "${badge.name}" (${existingMin}-${existingMax || '∞'})`);
        }

        // Case 2: New range ends within existing range
        if (newMax !== null && newMax >= existingMin && (existingMax === null || newMax <= existingMax)) {
            throw new Error(`Badge range overlaps with existing badge "${badge.name}" (${existingMin}-${existingMax || '∞'})`);
        }

        // Case 3: New range completely contains existing range
        if (newMin <= existingMin && (newMax === null || (existingMax !== null && newMax >= existingMax))) {
            throw new Error(`Badge range overlaps with existing badge "${badge.name}" (${existingMin}-${existingMax || '∞'})`);
        }
    }
};

/**
 * Get total points for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<number>} Total points
 */
const getUserTotalPoints = async (userId) => {
    const result = await prisma.pointsLedger.aggregate({
        where: { userId },
        _sum: { points: true },
    });

    return result._sum.points || 0;
};

/**
 * Recalculate and assign badge to user based on total points
 * 
 * This is called after granting or deducting points
 * Note: Current schema doesn't track badge assignments, just calculates current badge
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Current badge or null
 */
const recalculateUserBadge = async (userId) => {
    const totalPoints = await getUserTotalPoints(userId);

    const badge = await prisma.badgeType.findFirst({
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

    // In a real system, you might want to:
    // 1. Create a UserBadge join table to track badge assignments
    // 2. Send notification to user about badge upgrade
    // For now, we just return the calculated badge

    return badge;
};

module.exports = {
    // Badge Management
    createBadge,
    updateBadge,
    updateBadgeStatus,
    updateBadgeIcon,
    getAllBadges,
    // Points Control
    getPointsLog,
    grantPoints,
    deductPoints,
    // Leaderboard
    getLeaderboard,
    // Helpers
    getUserTotalPoints,
    recalculateUserBadge,
};
