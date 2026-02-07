const express = require('express');
const { verifyToken, requireRole } = require('../Middlewares/auth.middleware');
const adminReportingController = require('../Controllers/adminReporting.controller');

const router = express.Router();

/**
 * Admin Reporting Routes
 * All routes require authentication and ADMIN role
 */

// Apply authentication and admin-only authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

// ============================================================================
// PLATFORM-LEVEL REPORTS
// ============================================================================

/**
 * @route   GET /api/admin/reports/user-growth
 * @desc    Get user growth report with period-based grouping
 * @query   period (daily|weekly|monthly|yearly), from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/user-growth', adminReportingController.getUserGrowth);

/**
 * @route   GET /api/admin/reports/course-completion
 * @desc    Get course completion rate report
 * @query   from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/course-completion', adminReportingController.getCourseCompletion);

/**
 * @route   GET /api/admin/reports/quiz-performance
 * @desc    Get quiz performance report (placeholder)
 * @query   from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/quiz-performance', adminReportingController.getQuizPerformance);

/**
 * @route   GET /api/admin/reports/dropoff-rate
 * @desc    Get enrollment drop-off rate report
 * @query   from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/dropoff-rate', adminReportingController.getDropOffRate);

/**
 * @route   GET /api/admin/reports/popular-categories
 * @desc    Get popular course categories report
 * @query   from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/popular-categories', adminReportingController.getPopularCategories);

/**
 * @route   GET /api/admin/reports/revenue
 * @desc    Get revenue report with period-based grouping
 * @query   period (monthly|yearly), from (ISO date), to (ISO date)
 * @access  Admin only
 */
router.get('/reports/revenue', adminReportingController.getRevenue);

// ============================================================================
// DRILL-DOWN REPORTS
// ============================================================================

/**
 * @route   GET /api/admin/reports/instructors
 * @desc    Get instructor performance report
 * @query   from (ISO date), to (ISO date), page (number), limit (number)
 * @access  Admin only
 */
router.get('/reports/instructors', adminReportingController.getInstructorPerformance);

/**
 * @route   GET /api/admin/reports/courses
 * @desc    Get course performance report
 * @query   from (ISO date), to (ISO date), page (number), limit (number)
 * @access  Admin only
 */
router.get('/reports/courses', adminReportingController.getCoursePerformance);

/**
 * @route   GET /api/admin/reports/badges
 * @desc    Get badge distribution report
 * @access  Admin only
 */
router.get('/reports/badges', adminReportingController.getBadgeDistribution);

/**
 * @route   GET /api/admin/reports/points
 * @desc    Get points distribution report
 * @access  Admin only
 */
router.get('/reports/points', adminReportingController.getPointsDistribution);

module.exports = router;
