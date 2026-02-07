const reviewService = require('../Services/review.service');
const sendResponse = require('../Utils/response');

/**
 * Review Controller
 * 
 * HTTP handlers for course review endpoints
 * 
 * @module review.controller
 */

// ============================================================================
// REVIEW ENDPOINT HANDLERS
// ============================================================================

/**
 * Create a new review for a course
 * POST /api/courses/:courseId/reviews
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id; // From JWT token (verifyToken middleware)

        // Validate required fields
        if (!rating) {
            return sendResponse(res, 400, false, 'Rating is required');
        }

        // Create review
        const review = await reviewService.createReview(courseId, userId, {
            rating,
            comment
        });

        return sendResponse(res, 201, true, 'Review created successfully', {
            id: review.id,
            courseId: review.courseId,
            userId: review.userId,
            rating: review.rating,
            comment: review.reviewText,
            createdAt: review.createdAt
        });
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

/**
 * Get all reviews for a course
 * GET /api/courses/:courseId/reviews
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page, limit, sortBy, sortOrder, rating } = req.query;

        const result = await reviewService.getReviewsByCourse(courseId, {
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            sortBy,
            sortOrder,
            rating
        });

        return sendResponse(res, 200, true, 'Reviews retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

/**
 * Delete a review
 * DELETE /api/courses/:courseId/reviews/:reviewId
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteReview = async (req, res) => {
    try {
        const { courseId, reviewId } = req.params;
        const userId = req.user.id; // From JWT token
        const userRole = req.user.role; // From JWT token

        // Delete review
        const result = await reviewService.deleteReview(reviewId, courseId, userId, userRole);

        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        // Determine appropriate status code based on error message
        let statusCode = 400;
        if (error.message.includes('not found')) {
            statusCode = 404;
        } else if (error.message.includes('permission')) {
            statusCode = 403;
        }

        return sendResponse(res, statusCode, false, error.message);
    }
};

module.exports = {
    createReview,
    getReviews,
    deleteReview,
};
