const express = require('express');
const adminCourseController = require('../Controllers/adminCourse.controller');
const { verifyToken } = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');

const router = express.Router();

// Apply authentication and authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

/**
 * Admin Course Governance Routes
 * 
 * All routes require ADMIN role
 */

// ============================================================================
// COURSE OVERSIGHT ROUTES
// ============================================================================

// GET /api/admin/courses - List all courses with pagination and filters
router.get('/', adminCourseController.getAllCourses);

// PATCH /api/admin/courses/:id/publish - Force publish/unpublish course
router.patch('/:id/publish', adminCourseController.forcePublishCourse);

// PATCH /api/admin/courses/:id/archive - Archive course
router.patch('/:id/archive', adminCourseController.archiveCourse);

// PATCH /api/admin/courses/:id/lock - Lock/unlock course
router.patch('/:id/lock', adminCourseController.lockCourse);

// ============================================================================
// APPROVAL WORKFLOW ROUTES
// ============================================================================

// PATCH /api/admin/courses/:id/approve - Approve course for publishing
router.patch('/:id/approve', adminCourseController.approveCourse);

// PATCH /api/admin/courses/:id/reject - Reject course submission
router.patch('/:id/reject', adminCourseController.rejectCourse);

// ============================================================================
// ENROLLMENT MANAGEMENT ROUTES
// ============================================================================

// GET /api/admin/courses/:id/enrollments - Get enrollments for a course
router.get('/:id/enrollments', adminCourseController.getCourseEnrollments);

// POST /api/admin/courses/:id/enroll - Manually enroll user (admin override)
router.post('/:id/enroll', adminCourseController.manuallyEnrollUser);

module.exports = router;
