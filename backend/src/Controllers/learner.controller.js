const learnerService = require('../Services/learner.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Learner Controller
 * 
 * Handles HTTP requests for learner operations
 * 
 * @module learner.controller
 */

// ============================================================================
// COURSE BROWSING ENDPOINTS
// ============================================================================

/**
 * Get all available courses
 * @route GET /api/learner/courses
 */
async function getAllCourses(req, res) {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            search: req.query.search,
            categoryId: req.query.categoryId,
            minRating: req.query.minRating,
            maxPrice: req.query.maxPrice,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        };

        const result = await learnerService.getAllCourses(options);

        return successResponse(res, result, 'Courses retrieved successfully');
    } catch (error) {
        console.error('Error retrieving courses:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Get course details by ID
 * @route GET /api/learner/courses/:id
 */
async function getCourseDetails(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Optional - user might not be logged in

        const course = await learnerService.getCourseDetails(id, userId);

        return successResponse(res, course, 'Course details retrieved successfully');
    } catch (error) {
        console.error('Error retrieving course details:', error);
        return errorResponse(res, error.message, 404);
    }
}

/**
 * Search courses
 * @route GET /api/learner/courses/search
 */
async function searchCourses(req, res) {
    try {
        const filters = {
            query: req.query.q || req.query.query,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };

        const result = await learnerService.searchCourses(filters);

        return successResponse(res, result, 'Search results retrieved successfully');
    } catch (error) {
        console.error('Error searching courses:', error);
        return errorResponse(res, error.message, 400);
    }
}

// ============================================================================
// ENROLLMENT ENDPOINTS
// ============================================================================

/**
 * Enroll in a course
 * @route POST /api/learner/enrollments
 */
async function enrollInCourse(req, res) {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return errorResponse(res, 'Course ID is required', 400);
        }

        const enrollment = await learnerService.enrollInCourse(userId, courseId);

        return successResponse(res, enrollment, 'Successfully enrolled in course', 201);
    } catch (error) {
        console.error('Error enrolling in course:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Get user's enrolled courses
 * @route GET /api/learner/enrollments
 */
async function getEnrolledCourses(req, res) {
    try {
        const userId = req.user.id;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status, // all, in_progress, completed
            search: req.query.search,
            sortBy: req.query.sortBy || 'enrolledAt',
            sortOrder: req.query.sortOrder || 'desc',
        };

        const result = await learnerService.getEnrolledCourses(userId, options);

        return successResponse(res, result, 'Enrolled courses retrieved successfully');
    } catch (error) {
        console.error('Error retrieving enrolled courses:', error);
        return errorResponse(res, error.message, 400);
    }
}

// ============================================================================
// USER PROFILE & STATS ENDPOINTS
// ============================================================================

/**
 * Get user profile with stats
 * @route GET /api/learner/profile
 */
async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;

        const profile = await learnerService.getUserProfile(userId);

        return successResponse(res, profile, 'Profile retrieved successfully');
    } catch (error) {
        console.error('Error retrieving profile:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Get user achievements
 * @route GET /api/learner/achievements
 */
async function getUserAchievements(req, res) {
    try {
        const userId = req.user.id;

        const achievements = await learnerService.getUserAchievements(userId);

        return successResponse(res, achievements, 'Achievements retrieved successfully');
    } catch (error) {
        console.error('Error retrieving achievements:', error);
        return errorResponse(res, error.message, 400);
    }
}

module.exports = {
    getAllCourses,
    getCourseDetails,
    searchCourses,
    enrollInCourse,
    getEnrolledCourses,
    getUserProfile,
    getUserAchievements,
};
