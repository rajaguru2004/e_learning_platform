const instructorService = require('../Services/instructor.service');
const sendResponse = require('../Utils/response');

/**
 * Instructor Controller
 * 
 * Request handlers for instructor-specific endpoints
 * 
 * @module instructor.controller
 */

/**
 * Get enrollment statistics for the authenticated instructor
 * 
 * @route GET /api/instructor/enrollments
 */
const getEnrollmentStats = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const stats = await instructorService.getInstructorEnrollmentStats(instructorId);

        return sendResponse(res, 200, true, 'Enrollment statistics retrieved successfully', stats);
    } catch (error) {
        console.error('Error in getEnrollmentStats:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    getEnrollmentStats,
};
