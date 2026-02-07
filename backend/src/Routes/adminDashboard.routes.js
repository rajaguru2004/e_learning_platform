const express = require('express');
const authenticate = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');
const adminDashboardController = require('../Controllers/adminDashboard.controller');

const router = express.Router();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard analytics
 * @access  Private (Admin and Instructor)
 */
router.get(
    '/dashboard',
    authenticate,
    requireRole(['ADMIN', 'INSTRUCTOR']),
    adminDashboardController.getDashboardData
);

module.exports = router;
