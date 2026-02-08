const express = require('express');
const instructorController = require('../Controllers/instructor.controller');
const { verifyToken } = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');

const router = express.Router();

// Apply authentication and instructor role requirement to all routes
router.use(verifyToken);
router.use(requireRole(['INSTRUCTOR']));

/**
 * Instructor Management Routes
 */

// GET /api/instructor/enrollments - Get enrollment stats for instructor's courses
router.get('/enrollments', instructorController.getEnrollmentStats);

module.exports = router;
