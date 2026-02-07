const express = require('express');
const adminCourseController = require('../Controllers/adminCourse.controller');
const { verifyToken } = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');

const router = express.Router();

// Apply authentication and authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

/**
 * Admin Enrollment Management Routes
 * 
 * Separate router for enrollment-specific operations
 * All routes require ADMIN role
 */

// DELETE /api/admin/enrollments/:id - Remove (soft delete) enrollment
router.delete('/:id', adminCourseController.removeEnrollment);

// PATCH /api/admin/enrollments/:id/extend - Extend enrollment access duration
router.patch('/:id/extend', adminCourseController.extendEnrollmentAccess);

// PATCH /api/admin/enrollments/:id/override-payment - Override payment status
router.patch('/:id/override-payment', adminCourseController.overrideEnrollmentPayment);

module.exports = router;
