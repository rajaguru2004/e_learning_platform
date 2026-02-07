const { prisma } = require('../Prisma/client');

/**
 * Review Service
 * 
 * Business logic for course review management operations
 * 
 * @module review.service
 */

// ============================================================================
// REVIEW CRUD FUNCTIONS
// ============================================================================

/**
 * Create a new review for a course
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID creating the review
 * @param {Object} reviewData - Review data (rating, comment)
 * @returns {Promise<Object>} Created review
 */
async function createReview(courseId, userId, reviewData) {
    const { rating, comment } = reviewData;

    // Validate rating range
    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check if user is enrolled in the course (optional but recommended)
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });

    if (!enrollment) {
        throw new Error('You must be enrolled in this course to leave a review');
    }

    // Check for duplicate review (one review per user per course)
    const existingReview = await prisma.courseReview.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });

    if (existingReview) {
        throw new Error('You have already reviewed this course');
    }

    // Create review and recalculate course rating in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create the review (auto-approved, no workflow)
        const review = await tx.courseReview.create({
            data: {
                userId,
                courseId,
                rating,
                reviewText: comment || null,
                statusCode: 'APPROVED', // Auto-approve
                isPublished: true, // Auto-publish
                approvedAt: new Date(),
            }
        });

        // Recalculate average rating and total reviews for the course
        await recalculateCourseRating(courseId, tx);

        return review;
    });

    return result;
}

/**
 * Get all reviews for a course
 * @param {string} courseId - Course ID
 * @param {Object} options - Query options (page, limit, sortBy, sortOrder, rating)
 * @returns {Promise<Object>} Reviews with pagination
 */
async function getReviewsByCourse(courseId, options = {}) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
        courseId,
        isPublished: true // Only show published reviews
    };

    // Filter by rating if provided
    if (rating) {
        where.rating = parseInt(rating);
    }

    // Get total count
    const total = await prisma.courseReview.count({ where });

    // Get reviews with user details
    const reviews = await prisma.courseReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return {
        reviews,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID attempting to delete
 * @param {string} userRole - User's role code
 * @returns {Promise<Object>} Result message
 */
async function deleteReview(reviewId, courseId, userId, userRole) {
    // Check if review exists
    const review = await prisma.courseReview.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        throw new Error('Review not found');
    }

    // Verify review belongs to the specified course
    if (review.courseId !== courseId) {
        throw new Error('Review does not belong to this course');
    }

    // Authorization: Only review owner or ADMIN can delete
    const isOwner = review.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
        throw new Error('You do not have permission to delete this review');
    }

    // Delete review and recalculate course rating in a transaction
    await prisma.$transaction(async (tx) => {
        // Delete the review
        await tx.courseReview.delete({
            where: { id: reviewId }
        });

        // Recalculate average rating and total reviews for the course
        await recalculateCourseRating(courseId, tx);
    });

    return {
        message: 'Review deleted successfully',
        reviewId
    };
}

/**
 * Recalculate and update course average rating and total reviews
 * @param {string} courseId - Course ID
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Promise<void>}
 */
async function recalculateCourseRating(courseId, tx = null) {
    const client = tx || prisma;

    // Calculate average rating using Prisma aggregate
    const stats = await client.courseReview.aggregate({
        where: {
            courseId,
            isPublished: true // Only count published reviews
        },
        _avg: {
            rating: true
        },
        _count: {
            id: true
        }
    });

    const averageRating = stats._avg.rating || 0;
    const totalReviews = stats._count.id || 0;

    // Update course with new statistics
    await client.course.update({
        where: { id: courseId },
        data: {
            averageRating: averageRating,
            totalReviews: totalReviews
        }
    });
}

module.exports = {
    createReview,
    getReviewsByCourse,
    deleteReview,
    recalculateCourseRating,
};
