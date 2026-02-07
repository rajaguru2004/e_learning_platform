const express = require('express');
const router = express.Router();
const learnerController = require('../Controllers/learner.controller');
const { verifyToken, requireRole, optionalVerifyToken } = require('../Middlewares/auth.middleware');

/**
 * Learner Routes
 * 
 * All routes for learner functionality including:
 * - Course browsing and discovery
 * - Course enrollment
 * - Profile and achievements
 */

// ============================================================================
// COURSE BROWSING ROUTES (Public & Authenticated)
// ============================================================================

/**
 * @route   GET /api/learner/courses/search
 * @desc    Search courses
 * @access  Public
 */
router.get('/courses/search', learnerController.searchCourses);

/**
 * @route   GET /api/learner/courses/:id
 * @desc    Get course details by ID
 * @access  Public (enrollment status requires auth)
 */
router.get('/courses/:id', optionalVerifyToken, learnerController.getCourseDetails);

/**
 * @route   GET /api/learner/courses
 * @desc    Get all available courses with filters
 * @access  Public
 */
router.get('/courses', learnerController.getAllCourses);

// ============================================================================
// ENROLLMENT ROUTES (Authenticated - Learner Only)
// ============================================================================

/**
 * @route   POST /api/learner/enrollments
 * @desc    Enroll in a course
 * @access  Private (Learner)
 */
router.post('/enrollments',
    verifyToken,
    requireRole(['LEARNER']),
    learnerController.enrollInCourse
);

/**
 * @route   GET /api/learner/enrollments
 * @desc    Get user's enrolled courses
 * @access  Private (Learner)
 */
router.get('/enrollments',
    verifyToken,
    requireRole(['LEARNER']),
    learnerController.getEnrolledCourses
);

// ============================================================================
// PROFILE & ACHIEVEMENTS ROUTES (Authenticated - Learner Only)
// ============================================================================

/**
 * @route   GET /api/learner/profile
 * @desc    Get user profile with stats
 * @access  Private (Learner)
 */
router.get('/profile',
    verifyToken,
    requireRole(['LEARNER']),
    learnerController.getUserProfile
);

/**
 * @route   GET /api/learner/achievements
 * @desc    Get user achievements and learning path
 * @access  Private (Learner)
 */
router.get('/achievements',
    verifyToken,
    requireRole(['LEARNER']),
    learnerController.getUserAchievements
);

module.exports = router;
