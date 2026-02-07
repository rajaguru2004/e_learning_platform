const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/review.controller');
const { verifyToken } = require('../Middlewares/auth.middleware');

/**
 * Review Routes
 * 
 * All routes require authentication
 * Any authenticated user can create a review
 * Only review owner or ADMIN can delete a review
 */

// Get all reviews for a course (authenticated users only)
router.get('/:courseId/reviews',
    verifyToken,
    reviewController.getReviews
);

// Create a review for a course (authenticated users only)
router.post('/:courseId/reviews',
    verifyToken,
    reviewController.createReview
);

// Delete a review (owner or ADMIN only - authorization handled in service)
router.delete('/:courseId/reviews/:reviewId',
    verifyToken,
    reviewController.deleteReview
);

module.exports = router;
