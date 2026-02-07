/**
 * Audit Logging Helper
 * 
 * Tracks sensitive admin actions for security and compliance.
 * Currently logs to console with structured format.
 * 
 * FUTURE ENHANCEMENT: Add database persistence via AuditLog model
 * 
 * @module auditLog.helper
 */

const ACTION_TYPES = {
    USER_STATUS_CHANGE: 'USER_STATUS_CHANGE',
    PASSWORD_RESET: 'PASSWORD_RESET',
    USER_IMPERSONATION: 'USER_IMPERSONATION',
    ROLE_CREATED: 'ROLE_CREATED',
    ROLE_DELETED: 'ROLE_DELETED',
    PERMISSIONS_UPDATED: 'PERMISSIONS_UPDATED',
    ROLE_CLONED: 'ROLE_CLONED',
    // Course Governance
    COURSE_PUBLISHED: 'COURSE_PUBLISHED',
    COURSE_ARCHIVED: 'COURSE_ARCHIVED',
    COURSE_LOCKED: 'COURSE_LOCKED',
    COURSE_APPROVED: 'COURSE_APPROVED',
    COURSE_REJECTED: 'COURSE_REJECTED',
    // Enrollment Management
    ENROLLMENT_CREATED_BY_ADMIN: 'ENROLLMENT_CREATED_BY_ADMIN',
    ENROLLMENT_REMOVED: 'ENROLLMENT_REMOVED',
    ACCESS_EXTENDED: 'ACCESS_EXTENDED',
    PAYMENT_OVERRIDDEN: 'PAYMENT_OVERRIDDEN',
    // Gamification Management
    BADGE_CREATED: 'BADGE_CREATED',
    BADGE_UPDATED: 'BADGE_UPDATED',
    BADGE_STATUS_CHANGED: 'BADGE_STATUS_CHANGED',
    POINTS_GRANTED: 'POINTS_GRANTED',
    POINTS_DEDUCTED: 'POINTS_DEDUCTED',
    // Reporting & Analytics
    REPORT_ACCESSED: 'REPORT_ACCESSED',
    REPORT_EXPORTED: 'REPORT_EXPORTED',
};

/**
 * Log an admin action
 * 
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action type from ACTION_TYPES
 * @param {Object} params.admin - Admin user object (from req.user)
 * @param {string} params.targetType - Target entity type (USER, ROLE, etc.)
 * @param {string} params.targetId - Target entity ID
 * @param {Object} params.details - Additional context/metadata
 * @param {string} params.ipAddress - Optional IP address
 * 
 * @example
 * logAuditEvent({
 *   action: ACTION_TYPES.USER_STATUS_CHANGE,
 *   admin: req.user,
 *   targetType: 'USER',
 *   targetId: userId,
 *   details: { is_active: false, reason: 'Account suspended' }
 * });
 */
const logAuditEvent = async ({ action, admin, targetType, targetId, details = {}, ipAddress = null }) => {
    try {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            action,
            admin: {
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
            target: {
                type: targetType,
                id: targetId,
            },
            details,
            ipAddress,
        };

        // Console logging (formatted)
        console.log('🔒 [AUDIT LOG]', JSON.stringify(auditEntry, null, 2));

        // TODO: Database persistence
        // Uncomment when AuditLog model is added to Prisma schema
        /*
        const { prisma } = require('../Prisma/client');
        await prisma.auditLog.create({
            data: {
                action,
                adminId: admin.id,
                targetType,
                targetId,
                details: JSON.stringify(details),
                ipAddress,
            },
        });
        */

        return auditEntry;
    } catch (error) {
        console.error('❌ [AUDIT LOG ERROR]', error.message);
        // Don't throw - audit logging failure shouldn't break the operation
    }
};

/**
 * Get IP address from request object
 * Handles various proxy scenarios
 * 
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
const getIpAddress = (req) => {
    return req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        'unknown';
};

module.exports = {
    logAuditEvent,
    getIpAddress,
    ACTION_TYPES,
};
