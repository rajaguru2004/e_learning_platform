const adminGamificationService = require('../Services/adminGamification.service');
const sendResponse = require('../Utils/response');

/**
 * Admin Gamification Management Controller
 * 
 * Request handlers for admin gamification endpoints
 * - Badge CRUD operations
 * - Points granting and deduction
 * - Leaderboard viewing
 * 
 * @module adminGamification.controller
 */

// ============================================================================
// BADGE MANAGEMENT
// ============================================================================

/**
 * Create a new badge
 * 
 * @route POST /api/admin/badges
 * @body { name, min_points, max_points?, icon_url?, description? }
 */
const createBadge = async (req, res) => {
    try {
        const { name, min_points, max_points, icon_url, description } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return sendResponse(res, 400, false, 'Badge name is required');
        }

        if (min_points === undefined || min_points === null) {
            return sendResponse(res, 400, false, 'min_points is required');
        }

        if (typeof min_points !== 'number' || min_points < 0) {
            return sendResponse(res, 400, false, 'min_points must be a non-negative number');
        }

        if (max_points !== undefined && max_points !== null && typeof max_points !== 'number') {
            return sendResponse(res, 400, false, 'max_points must be a number');
        }

        const badge = await adminGamificationService.createBadge(
            { name, min_points, max_points, icon_url, description },
            req.user,
            req
        );

        return sendResponse(res, 201, true, 'Badge created successfully', badge);
    } catch (error) {
        console.error('Error in createBadge:', error);
        const statusCode = error.message.includes('already exists') || error.message.includes('overlaps') ? 400 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Update existing badge
 * 
 * @route PATCH /api/admin/badges/:id
 * @body { name?, min_points?, max_points?, icon_url?, description? }
 */
const updateBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, min_points, max_points, icon_url, description } = req.body;

        // Validation
        if (min_points !== undefined && (typeof min_points !== 'number' || min_points < 0)) {
            return sendResponse(res, 400, false, 'min_points must be a non-negative number');
        }

        if (max_points !== undefined && max_points !== null && typeof max_points !== 'number') {
            return sendResponse(res, 400, false, 'max_points must be a number');
        }

        const badge = await adminGamificationService.updateBadge(
            id,
            { name, min_points, max_points, icon_url, description },
            req.user,
            req
        );

        return sendResponse(res, 200, true, 'Badge updated successfully', badge);
    } catch (error) {
        console.error('Error in updateBadge:', error);
        const statusCode = error.message === 'Badge not found' ? 404 :
            (error.message.includes('already exists') || error.message.includes('overlaps')) ? 400 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Activate or deactivate badge
 * 
 * @route PATCH /api/admin/badges/:id/status
 * @body { is_active: boolean }
 */
const updateBadgeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return sendResponse(res, 400, false, 'is_active must be a boolean');
        }

        const badge = await adminGamificationService.updateBadgeStatus(id, is_active, req.user, req);

        return sendResponse(res, 200, true, `Badge ${is_active ? 'activated' : 'deactivated'} successfully`, badge);
    } catch (error) {
        console.error('Error in updateBadgeStatus:', error);
        const statusCode = error.message === 'Badge not found' ? 404 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Update badge icon URL
 * 
 * @route POST /api/admin/badges/:id/icon
 * @body { icon_url: string }
 */
const updateBadgeIcon = async (req, res) => {
    try {
        const { id } = req.params;
        const { icon_url } = req.body;

        if (!icon_url || typeof icon_url !== 'string') {
            return sendResponse(res, 400, false, 'icon_url must be a valid string');
        }

        const badge = await adminGamificationService.updateBadgeIcon(id, icon_url, req.user, req);

        return sendResponse(res, 200, true, 'Badge icon updated successfully', badge);
    } catch (error) {
        console.error('Error in updateBadgeIcon:', error);
        const statusCode = error.message === 'Badge not found' ? 404 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Get all badges with pagination and filters
 * 
 * @route GET /api/admin/badges
 * @query { page?, limit?, active?, sort? }
 */
const getAllBadges = async (req, res) => {
    try {
        const { page, limit, active, sort } = req.query;

        const result = await adminGamificationService.getAllBadges({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            active,
            sort: sort || 'min_points',
        });

        return sendResponse(res, 200, true, 'Badges retrieved successfully', result);
    } catch (error) {
        console.error('Error in getAllBadges:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

// ============================================================================
// POINTS CONTROL
// ============================================================================

/**
 * Get points log with pagination and filters
 * 
 * @route GET /api/admin/points
 * @query { page?, limit?, user_id?, source?, from?, to?, search? }
 */
const getPointsLog = async (req, res) => {
    try {
        const { page, limit, user_id, source, from, to, search } = req.query;

        const result = await adminGamificationService.getPointsLog({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            user_id,
            source,
            from,
            to,
            search,
        });

        return sendResponse(res, 200, true, 'Points log retrieved successfully', result);
    } catch (error) {
        console.error('Error in getPointsLog:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

/**
 * Grant bonus points to a user
 * 
 * @route POST /api/admin/points/grant
 * @body { user_id, points, reason }
 */
const grantPoints = async (req, res) => {
    try {
        const { user_id, points, reason } = req.body;

        // Validation
        if (!user_id) {
            return sendResponse(res, 400, false, 'user_id is required');
        }

        if (!points || typeof points !== 'number' || points <= 0) {
            return sendResponse(res, 400, false, 'points must be a positive number');
        }

        if (!reason || !reason.trim()) {
            return sendResponse(res, 400, false, 'reason is required');
        }

        const ledgerEntry = await adminGamificationService.grantPoints(
            user_id,
            points,
            reason,
            req.user,
            req
        );

        return sendResponse(res, 201, true, 'Points granted successfully', {
            id: ledgerEntry.id,
            user_id: ledgerEntry.userId,
            points: ledgerEntry.points,
            source_code: ledgerEntry.sourceCode,
            description: ledgerEntry.description,
            created_at: ledgerEntry.createdAt,
        });
    } catch (error) {
        console.error('Error in grantPoints:', error);
        const statusCode = error.message === 'User not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Deduct points from a user
 * 
 * @route POST /api/admin/points/deduct
 * @body { user_id, points, reason }
 */
const deductPoints = async (req, res) => {
    try {
        const { user_id, points, reason } = req.body;

        // Validation
        if (!user_id) {
            return sendResponse(res, 400, false, 'user_id is required');
        }

        if (!points || typeof points !== 'number' || points <= 0) {
            return sendResponse(res, 400, false, 'points must be a positive number');
        }

        if (!reason || !reason.trim()) {
            return sendResponse(res, 400, false, 'reason is required');
        }

        const ledgerEntry = await adminGamificationService.deductPoints(
            user_id,
            points,
            reason,
            req.user,
            req
        );

        return sendResponse(res, 201, true, 'Points deducted successfully', {
            id: ledgerEntry.id,
            user_id: ledgerEntry.userId,
            points: ledgerEntry.points,
            source_code: ledgerEntry.sourceCode,
            description: ledgerEntry.description,
            created_at: ledgerEntry.createdAt,
        });
    } catch (error) {
        console.error('Error in deductPoints:', error);
        const statusCode = error.message === 'User not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

// ============================================================================
// LEADERBOARD
// ============================================================================

/**
 * Get leaderboard with rankings
 * 
 * @route GET /api/admin/leaderboard
 * @query { page?, limit?, from?, to?, badge? }
 */
const getLeaderboard = async (req, res) => {
    try {
        const { page, limit, from, to, badge } = req.query;

        const result = await adminGamificationService.getLeaderboard({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            from,
            to,
            badge,
        });

        return sendResponse(res, 200, true, 'Leaderboard retrieved successfully', result);
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        return sendResponse(res, 500, false, error.message);
    }
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
};
