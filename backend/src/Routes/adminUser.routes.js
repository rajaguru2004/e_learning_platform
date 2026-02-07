const express = require('express');
const rateLimit = require('express-rate-limit');
const adminUserController = require('../Controllers/adminUser.controller');
const verifyToken = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');

const router = express.Router();

// Apply authentication and authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

/**
 * Rate limiter for impersonation endpoint
 * 
 * SECURITY: Limit impersonation attempts to prevent abuse
 * - 5 requests per 15 minutes per IP
 */
const impersonationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many impersonation attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * User Management Routes
 */

// GET /api/admin/users - List all users with pagination and filters
router.get('/', adminUserController.getAllUsers);

// GET /api/admin/users/:id - Get user profile summary
router.get('/:id', adminUserController.getUserProfile);

// PATCH /api/admin/users/:id/status - Activate/deactivate user
router.patch('/:id/status', adminUserController.updateUserStatus);

// POST /api/admin/users/:id/reset-password - Force password reset
router.post('/:id/reset-password', adminUserController.resetUserPassword);

// POST /api/admin/users/:id/impersonate - Impersonate user (rate limited)
// SECURITY SENSITIVE: This endpoint allows admin to act as another user
router.post('/:id/impersonate', impersonationLimiter, adminUserController.impersonateUser);

module.exports = router;
