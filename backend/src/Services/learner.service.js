const { prisma } = require('../Prisma/client');

/**
 * Learner Service
 * 
 * Business logic for learner operations including:
 * - Browsing and searching courses
 * - Enrolling in courses
 * - Viewing enrolled courses
 * - Viewing profile stats and achievements
 * 
 * @module learner.service
 */

// ============================================================================
// COURSE BROWSING FUNCTIONS
// ============================================================================

/**
 * Get all available courses for learners
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Courses with pagination
 */
async function getAllCourses(options = {}) {
    const {
        page = 1,
        limit = 10,
        search,
        categoryId,
        minRating,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause - only show PUBLISHED courses
    const where = {
        statusCode: 'PUBLISHED',
        isActive: true,
    };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (minRating) {
        where.averageRating = {
            gte: parseFloat(minRating)
        };
    }

    if (maxPrice) {
        where.price = {
            lte: parseFloat(maxPrice)
        };
    }

    // Get total count
    const total = await prisma.course.count({ where });

    // Get courses
    const courses = await prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnailUrl: true,
            price: true,
            discountedPrice: true,
            duration: true,
            enrollmentCount: true,
            averageRating: true,
            totalReviews: true,
            createdAt: true,
            instructor: {
                select: {
                    id: true,
                    name: true,
                }
            },
            topics: {
                include: {
                    subtopics: {
                        include: {
                            questions: {
                                orderBy: {
                                    orderIndex: 'asc'
                                }
                            }
                        },
                        orderBy: {
                            orderIndex: 'asc'
                        }
                    }
                },
                orderBy: {
                    orderIndex: 'asc'
                }
            }
        }
    });

    return {
        courses,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
}

/**
 * Get course details by ID for learners
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID (optional for enrollment check)
 * @returns {Promise<Object>} Course details
 */
async function getCourseDetails(courseId, userId = null) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnailUrl: true,
            price: true,
            discountedPrice: true,
            duration: true,
            enrollmentCount: true,
            averageRating: true,
            totalReviews: true,
            statusCode: true,
            visibilityCode: true,
            accessCode: true,
            createdAt: true,
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            topics: {
                include: {
                    subtopics: {
                        include: {
                            questions: {
                                orderBy: {
                                    orderIndex: 'asc'
                                }
                            }
                        },
                        orderBy: {
                            orderIndex: 'asc'
                        }
                    }
                },
                orderBy: {
                    orderIndex: 'asc'
                }
            },
            reviews: {
                where: {
                    isPublished: true
                },
                select: {
                    id: true,
                    rating: true,
                    reviewText: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10
            }
        }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check if course is published
    if (course.statusCode !== 'PUBLISHED') {
        throw new Error('Course is not available');
    }

    // Check if user is already enrolled (if userId provided)
    let isEnrolled = false;
    let enrollment = null;

    if (userId) {
        enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            select: {
                id: true,
                statusCode: true,
                progressPercent: true,
                enrolledAt: true,
            }
        });

        isEnrolled = !!enrollment;
    }

    return {
        ...course,
        isEnrolled,
        enrollment
    };
}

// ============================================================================
// ENROLLMENT FUNCTIONS
// ============================================================================

/**
 * Enroll user in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Enrollment details
 */
async function enrollInCourse(userId, courseId) {
    // Check if course exists and is published
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            statusCode: true,
            isActive: true,
            price: true,
            accessCode: true,
        }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.statusCode !== 'PUBLISHED') {
        throw new Error('Course is not available for enrollment');
    }

    if (!course.isActive) {
        throw new Error('Course is not active');
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });

    if (existingEnrollment) {
        throw new Error('You are already enrolled in this course');
    }

    // For paid courses, check if payment is required
    if (course.accessCode === 'PAYMENT' && course.price > 0) {
        // In a real system, you would check for payment here
        // For now, we'll allow free enrollment
        // throw new Error('Payment required for this course');
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            statusCode: 'ENROLLED',
            enrolledAt: new Date(),
            progressPercent: 0,
            isActive: true,
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    thumbnailUrl: true,
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    // Update course enrollment count
    await prisma.course.update({
        where: { id: courseId },
        data: {
            enrollmentCount: {
                increment: 1
            }
        }
    });

    return enrollment;
}

/**
 * Get user's enrolled courses
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Enrolled courses with pagination
 */
async function getEnrolledCourses(userId, options = {}) {
    const {
        page = 1,
        limit = 10,
        status, // all, in_progress, completed
        search,
        sortBy = 'enrolledAt',
        sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
        userId,
        isActive: true,
    };

    // Filter by status
    if (status === 'in_progress') {
        where.statusCode = 'STARTED';
    } else if (status === 'completed') {
        where.statusCode = 'COMPLETED';
    }
    // 'all' means no status filter

    if (search) {
        where.course = {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        };
    }

    // Get total count
    const total = await prisma.enrollment.count({ where });

    // Get enrolled courses
    const enrollments = await prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnailUrl: true,
                    duration: true,
                    averageRating: true,
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return {
        enrollments,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
}

// ============================================================================
// USER PROFILE & STATS FUNCTIONS
// ============================================================================

/**
 * Get user profile with stats
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile with stats
 */
async function getUserProfile(userId) {
    // Get user basic info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: {
                select: {
                    code: true,
                    name: true,
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get enrollment stats
    const enrollmentStats = await prisma.enrollment.groupBy({
        by: ['statusCode'],
        where: {
            userId,
            isActive: true,
        },
        _count: {
            id: true,
        }
    });

    const enrolled = enrollmentStats.reduce((sum, stat) => sum + stat._count.id, 0);
    const completed = enrollmentStats.find(s => s.statusCode === 'COMPLETED')?._count.id || 0;
    const inProgress = enrollmentStats.find(s => s.statusCode === 'STARTED')?._count.id || 0;

    // Get total points
    const pointsResult = await prisma.pointsLedger.aggregate({
        where: {
            userId,
        },
        _sum: {
            points: true,
        }
    });

    const totalPoints = pointsResult._sum.points || 0;

    // Get current badge/rank based on points
    const currentBadge = await prisma.badgeType.findFirst({
        where: {
            minPoints: {
                lte: totalPoints
            },
            OR: [
                { maxPoints: { gte: totalPoints } },
                { maxPoints: null }
            ],
            isActive: true
        },
        orderBy: {
            levelOrder: 'desc'
        }
    });

    // Get next badge
    const nextBadge = await prisma.badgeType.findFirst({
        where: {
            minPoints: {
                gt: totalPoints
            },
            isActive: true
        },
        orderBy: {
            minPoints: 'asc'
        }
    });

    // Calculate weekly effort score (last 7 days activity)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await prisma.courseProgress.aggregate({
        where: {
            userId,
            lastAccessedAt: {
                gte: sevenDaysAgo
            }
        },
        _sum: {
            timeSpentSeconds: true
        },
        _count: {
            id: true
        }
    });

    const weeklyTimeSpent = recentActivity._sum.timeSpentSeconds || 0;
    const weeklyLessonsAccessed = recentActivity._count.id || 0;

    // Simple effort score calculation (0-100)
    // Based on time spent (in hours) and lessons accessed
    const weeklyHours = weeklyTimeSpent / 3600;
    const effortScore = Math.min(100, Math.round((weeklyHours * 10) + (weeklyLessonsAccessed * 5)));

    return {
        user,
        stats: {
            enrolled,
            completed,
            inProgress,
            totalPoints,
            currentBadge: currentBadge ? {
                name: currentBadge.name,
                minPoints: currentBadge.minPoints,
                maxPoints: currentBadge.maxPoints,
                iconUrl: currentBadge.iconUrl,
            } : null,
            nextBadge: nextBadge ? {
                name: nextBadge.name,
                minPoints: nextBadge.minPoints,
                pointsNeeded: nextBadge.minPoints - totalPoints,
            } : null,
            weeklyEffortScore: effortScore,
        }
    };
}

/**
 * Get user achievements and learning path progress
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Achievements data
 */
async function getUserAchievements(userId) {
    // Get user basic info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get total points
    const pointsResult = await prisma.pointsLedger.aggregate({
        where: { userId },
        _sum: { points: true }
    });

    const totalPoints = pointsResult._sum.points || 0;

    // Get current badge
    const currentBadge = await prisma.badgeType.findFirst({
        where: {
            minPoints: { lte: totalPoints },
            OR: [
                { maxPoints: { gte: totalPoints } },
                { maxPoints: null }
            ],
            isActive: true
        },
        orderBy: {
            levelOrder: 'desc'
        }
    });

    // Get next badge
    const nextBadge = await prisma.badgeType.findFirst({
        where: {
            minPoints: { gt: totalPoints },
            isActive: true
        },
        orderBy: {
            minPoints: 'asc'
        }
    });

    // Define learning path milestones
    const learningPath = [
        {
            name: 'Newbie',
            description: 'Started your journey',
            threshold: 0,
            achieved: true // Always achieved
        },
        {
            name: 'Explorer',
            description: 'Completed 3 courses',
            threshold: 3,
            achieved: false
        },
        {
            name: 'Specialist',
            description: 'Earned 2,000 points',
            threshold: 2000,
            achieved: false
        },
        {
            name: 'Expert',
            description: 'Completed 10 courses',
            threshold: 10,
            achieved: false
        }
    ];

    // Get completed courses count
    const completedCount = await prisma.enrollment.count({
        where: {
            userId,
            statusCode: 'COMPLETED',
            isActive: true
        }
    });

    // Update achievement status based on actual data
    learningPath.forEach(milestone => {
        if (milestone.name === 'Explorer' || milestone.name === 'Expert') {
            milestone.achieved = completedCount >= milestone.threshold;
        } else if (milestone.name === 'Specialist') {
            milestone.achieved = totalPoints >= milestone.threshold;
        }
    });

    // Calculate overall progress percentage
    const achievedCount = learningPath.filter(m => m.achieved).length;
    const progressPercent = Math.round((achievedCount / learningPath.length) * 100);

    return {
        user,
        currentRank: currentBadge?.name || 'Beginner',
        totalPoints,
        nextLevel: nextBadge?.name || null,
        pointsToNextLevel: nextBadge ? nextBadge.minPoints - totalPoints : 0,
        totalPointsForNextLevel: nextBadge?.minPoints || 0,
        learningPath,
        progressPercent,
        completedCourses: completedCount,
    };
}

/**
 * Search courses with advanced filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>} Search results
 */
async function searchCourses(filters = {}) {
    const {
        query,
        page = 1,
        limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
        statusCode: 'PUBLISHED',
        isActive: true,
    };

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
        ];
    }

    const total = await prisma.course.count({ where });

    const courses = await prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            averageRating: 'desc'
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            price: true,
            discountedPrice: true,
            averageRating: true,
            enrollmentCount: true,
            instructor: {
                select: {
                    name: true,
                }
            }
        }
    });

    return {
        courses,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
}

module.exports = {
    getAllCourses,
    getCourseDetails,
    enrollInCourse,
    getEnrolledCourses,
    getUserProfile,
    getUserAchievements,
    searchCourses,
};
