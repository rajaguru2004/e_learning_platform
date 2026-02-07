const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/course.controller');
const { verifyToken, requireRole } = require('../Middlewares/auth.middleware');
const upload = require('../Middlewares/upload.middleware');

/**
 * Course Routes (Instructor)
 * 
 * All routes require authentication
 * Create/update/delete require INSTRUCTOR role
 */

// Create new course (INSTRUCTOR only)
router.post('/',
    verifyToken,
    requireRole(['INSTRUCTOR']),
    upload.any(), // Accept any files, filtering is done in middleware/controller
    courseController.createCourse
);

// Get my courses (INSTRUCTOR only)
router.get('/my',
    verifyToken,
    requireRole(['INSTRUCTOR']),
    courseController.getMyCourses
);

// Get course by ID (authenticated users)
router.get('/:id',
    verifyToken,
    courseController.getCourseById
);

// Update course (INSTRUCTOR only)
router.put('/:id',
    verifyToken,
    requireRole(['INSTRUCTOR']),
    courseController.updateCourse
);

// Submit course for review (INSTRUCTOR only)
router.post('/:id/submit',
    verifyToken,
    requireRole(['INSTRUCTOR']),
    courseController.submitForReview
);

// Delete course (INSTRUCTOR only)
router.delete('/:id',
    verifyToken,
    requireRole(['INSTRUCTOR']),
    courseController.deleteCourse
);

module.exports = router;
