const express = require('express');
const rateLimit = require('express-rate-limit');
const adminGamificationController = require('../Controllers/adminGamification.controller');
const { verifyToken, requireRole } = require('../Middlewares/auth.middleware');

const router = express.Router();

// Apply authentication and authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

/**
 * Rate limiter for manual point operations (grant/deduct)
 * 
 * SECURITY: Prevent abuse of manual point operations
 * - 10 requests per 15 minutes per IP
 */
const pointsOperationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many point operation attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ============================================================================
// BADGE MANAGEMENT ROUTES
// ============================================================================

/**
 * @route POST /api/admin/badges
 * @desc Create a new badge
 * @access Admin only
 */
router.post('/badges', adminGamificationController.createBadge);

/**
 * @route PATCH /api/admin/badges/:id
 * @desc Update badge details
 * @access Admin only
 */
router.patch('/badges/:id', adminGamificationController.updateBadge);

/**
 * @route PATCH /api/admin/badges/:id/status
 * @desc Activate or deactivate badge
 * @access Admin only
 */
router.patch('/badges/:id/status', adminGamificationController.updateBadgeStatus);

/**
 * @route POST /api/admin/badges/:id/icon
 * @desc Update badge icon URL
 * @access Admin only
 */
router.post('/badges/:id/icon', adminGamificationController.updateBadgeIcon);

/**
 * @route GET /api/admin/badges
 * @desc Get all badges with pagination and filters
 * @access Admin only
 */
router.get('/badges', adminGamificationController.getAllBadges);

// ============================================================================
// POINTS CONTROL ROUTES
// ============================================================================

/**
 * @route GET /api/admin/points
 * @desc Get points log with pagination and filters
 * @access Admin only
 */
router.get('/points', adminGamificationController.getPointsLog);

/**
 * @route POST /api/admin/points/grant
 * @desc Grant bonus points to a user (rate limited)
 * @access Admin only
 */
router.post('/points/grant', pointsOperationLimiter, adminGamificationController.grantPoints);

/**
 * @route POST /api/admin/points/deduct
 * @desc Deduct points from a user (rate limited)
 * @access Admin only
 */
router.post('/points/deduct', pointsOperationLimiter, adminGamificationController.deductPoints);

// ============================================================================
// LEADERBOARD ROUTES
// ============================================================================

/**
 * @route GET /api/admin/leaderboard
 * @desc Get leaderboard with rankings
 * @access Admin only
 */
router.get('/leaderboard', adminGamificationController.getLeaderboard);

module.exports = router;
