const courseService = require('../Services/course.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Create a new course
 */
async function createCourse(req, res) {
    try {
        const courseData = { ...req.body };
        const instructor = req.user;

        // Process uploaded files if any
        if (req.files && req.files.length > 0) {
            const videoFiles = {};

            req.files.forEach(file => {
                // Expected fieldname format: videos_{topicIndex}_{subtopicIndex}
                const match = file.fieldname.match(/^videos_(\d+)_(\d+)$/);
                if (match) {
                    const topicIndex = match[1];
                    const subtopicIndex = match[2];
                    videoFiles[`${topicIndex}_${subtopicIndex}`] = file;
                }
            });

            courseData.videoFiles = videoFiles;
        }

        const course = await courseService.createCourse(courseData, instructor);

        return successResponse(res, course, 'Course created successfully', 201);
    } catch (error) {
        console.error('Error creating course:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Get courses created by logged-in instructor
 */
async function getMyCourses(req, res) {
    try {
        const instructorId = req.user.id;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            statusCode: req.query.statusCode,
            search: req.query.search,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        };

        const result = await courseService.getMyCourses(instructorId, options);

        return successResponse(res, result, 'Courses retrieved successfully');
    } catch (error) {
        console.error('Error retrieving courses:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Get single course by ID
 */
async function getCourseById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const course = await courseService.getCourseById(id, userId);

        return successResponse(res, course, 'Course retrieved successfully');
    } catch (error) {
        console.error('Error retrieving course:', error);
        return errorResponse(res, error.message, 404);
    }
}

/**
 * Update course
 */
async function updateCourse(req, res) {
    try {
        const { id } = req.params;
        const courseData = req.body;
        const instructorId = req.user.id;

        const course = await courseService.updateCourse(id, courseData, instructorId);

        return successResponse(res, course, 'Course updated successfully');
    } catch (error) {
        console.error('Error updating course:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Submit course for review
 */
async function submitForReview(req, res) {
    try {
        const { id } = req.params;
        const instructorId = req.user.id;

        const course = await courseService.submitForReview(id, instructorId);

        return successResponse(res, course, 'Course submitted for review successfully');
    } catch (error) {
        console.error('Error submitting course:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Delete course
 */
async function deleteCourse(req, res) {
    try {
        const { id } = req.params;
        const instructorId = req.user.id;

        const result = await courseService.deleteCourse(id, instructorId);

        return successResponse(res, result, 'Course deleted successfully');
    } catch (error) {
        console.error('Error deleting course:', error);
        return errorResponse(res, error.message, 400);
    }
}

module.exports = {
    createCourse,
    getMyCourses,
    getCourseById,
    updateCourse,
    submitForReview,
    deleteCourse,
};
