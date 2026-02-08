const { prisma } = require('../Prisma/client');

/**
 * Course Service
 * 
 * Business logic for instructor course management operations
 * 
 * @module course.service
 */

// ============================================================================
// COURSE CRUD FUNCTIONS
// ============================================================================

/**
 * Create a new course
 * @param {Object} courseData - Course data
 * @param {Object} instructor - Instructor creating the course
 * @returns {Promise<Object>} Created course
 */
async function createCourse(courseData, instructor) {
    const {
        title,
        slug,
        description,
        categoryId,
        visibilityCode = 'EVERYONE',
        accessCode = 'OPEN',
        thumbnailUrl,
        price = 0,
        discountedPrice,
        duration,
    } = courseData;

    // Validate slug uniqueness
    const existingCourse = await prisma.course.findUnique({
        where: { slug }
    });

    if (existingCourse) {
        throw new Error('Course slug already exists');
    }

    // Get DRAFT status
    const draftStatus = await prisma.courseStatusType.findUnique({
        where: { code: 'DRAFT' }
    });

    if (!draftStatus) {
        throw new Error('DRAFT status not found in system');
    }

    // Create course transaction
    const result = await prisma.$transaction(async (prisma) => {
        // 1. Create Course
        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                instructorId: instructor.id,
                categoryId,
                statusCode: draftStatus.code,
                visibilityCode,
                accessCode,
                thumbnailUrl,
                price: parseFloat(price),
                discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
                duration: duration ? parseInt(duration) : null,
                isActive: true,
                isLocked: false,
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // 2. Process Topics and Subtopics if provided
        if (courseData.topics) {
            let topics = [];
            try {
                topics = typeof courseData.topics === 'string'
                    ? JSON.parse(courseData.topics)
                    : courseData.topics;
            } catch (e) {
                console.error('Error parsing topics JSON:', e);
            }


            if (Array.isArray(topics) && topics.length > 0) {
                for (const [tIndex, topic] of topics.entries()) {
                    const createdTopic = await prisma.topic.create({
                        data: {
                            courseId: course.id,
                            title: topic.title,
                            description: topic.description,
                            orderIndex: tIndex,
                        }
                    });
                    if (Array.isArray(topic.subtopics) && topic.subtopics.length > 0) {
                        for (const [sIndex, subtopic] of topic.subtopics.entries()) {
                            // Check if video file exists for this subtopic
                            let videoUrl = null;
                            if (courseData.videoFiles && courseData.videoFiles[`${tIndex}_${sIndex}`]) {
                                const file = courseData.videoFiles[`${tIndex}_${sIndex}`];
                                const uploadResult = await require('../Utils/minio.util').uploadVideo(
                                    file,
                                    course.id,
                                    createdTopic.id
                                );
                                videoUrl = uploadResult;
                            }

                            const createdSubtopic = await prisma.subtopic.create({
                                data: {
                                    topicId: createdTopic.id,
                                    title: subtopic.title,
                                    description: subtopic.description,
                                    videoUrl: videoUrl,
                                    duration: subtopic.duration ? parseInt(subtopic.duration) : null,
                                    orderIndex: sIndex,
                                }
                            });

                            // 3. Process Questions if provided
                            if (Array.isArray(subtopic.questions) && subtopic.questions.length > 0) {
                                for (const [qIndex, question] of subtopic.questions.entries()) {
                                    await prisma.question.create({
                                        data: {
                                            subtopicId: createdSubtopic.id,
                                            questionText: question.questionText,
                                            questionTypeId: question.questionTypeId, // Optional: if using QuestionType relation
                                            options: question.options, // JSON array of options
                                            correctAnswer: question.correctAnswer,
                                            points: question.points ? parseInt(question.points) : 1,
                                            orderIndex: qIndex,
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        return course;
    });

    // Fetch complete course with topics
    const completeCourse = await prisma.course.findUnique({
        where: { id: result.id },
        include: {
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
            }
        }
    });

    return completeCourse;
}

/**
 * Get courses created by instructor
 * @param {string} instructorId - Instructor ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Courses with pagination
 */
async function getMyCourses(instructorId, options = {}) {
    const {
        page = 1,
        limit = 10,
        statusCode,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
        instructorId,
    };

    if (statusCode) {
        where.statusCode = statusCode;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
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
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            reviewer: {
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
 * Get course by ID
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID requesting the course
 * @returns {Promise<Object>} Course details
 */
async function getCourseById(courseId, userId) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            reviewer: {
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
            }
        }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check if user has access to view this course
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: true
        }
    });

    const isAdmin = user.role.code === 'ADMIN';
    const isOwner = course.instructorId === userId;
    const isPublished = course.statusCode === 'PUBLISHED';

    if (!isAdmin && !isOwner && !isPublished) {
        throw new Error('You do not have permission to view this course');
    }

    return course;
}

/**
 * Update course
 * @param {string} courseId - Course ID
 * @param {Object} courseData - Updated course data
 * @param {string} instructorId - Instructor ID
 * @returns {Promise<Object>} Updated course
 */
async function updateCourse(courseId, courseData, instructorId) {
    // Get existing course
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check ownership
    if (course.instructorId !== instructorId) {
        throw new Error('You do not have permission to update this course');
    }

    // Check if course is locked
    if (course.isLocked) {
        throw new Error('Course is locked and cannot be edited. Contact admin for assistance.');
    }

    // Check if course is under review or published
    if (course.statusCode === 'UNDER_REVIEW') {
        throw new Error('Course is under review and cannot be edited');
    }

    if (course.statusCode === 'PUBLISHED') {
        throw new Error('Published courses cannot be edited. Create a new version instead.');
    }

    // Check if slug is being changed and validate uniqueness
    if (courseData.slug && courseData.slug !== course.slug) {
        const existingCourse = await prisma.course.findUnique({
            where: { slug: courseData.slug }
        });

        if (existingCourse) {
            throw new Error('Course slug already exists');
        }
    }

    // Update course
    const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
            ...courseData,
            updatedAt: new Date(),
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    return updatedCourse;
}

/**
 * Submit course for review
 * @param {string} courseId - Course ID
 * @param {string} instructorId - Instructor ID
 * @returns {Promise<Object>} Updated course
 */
async function submitForReview(courseId, instructorId) {
    // Get existing course
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check ownership
    if (course.instructorId !== instructorId) {
        throw new Error('You do not have permission to submit this course');
    }

    // Check if course is locked
    if (course.isLocked) {
        throw new Error('Course is locked and cannot be submitted');
    }

    // Check if course is in DRAFT status
    if (course.statusCode !== 'DRAFT') {
        throw new Error('Only draft courses can be submitted for review');
    }

    // Get UNDER_REVIEW status
    const underReviewStatus = await prisma.courseStatusType.findUnique({
        where: { code: 'UNDER_REVIEW' }
    });

    if (!underReviewStatus) {
        throw new Error('UNDER_REVIEW status not found in system');
    }

    // Update course status
    const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
            statusCode: underReviewStatus.code,
            reviewNote: null, // Clear any previous review notes
            updatedAt: new Date(),
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    return updatedCourse;
}

/**
 * Delete course (soft delete for drafts only)
 * @param {string} courseId - Course ID
 * @param {string} instructorId - Instructor ID
 * @returns {Promise<Object>} Result message
 */
async function deleteCourse(courseId, instructorId) {
    // Get existing course
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Check ownership
    if (course.instructorId !== instructorId) {
        throw new Error('You do not have permission to delete this course');
    }

    // Check if course is locked
    if (course.isLocked) {
        throw new Error('Course is locked and cannot be deleted');
    }

    // Only allow deletion of DRAFT courses
    if (course.statusCode !== 'DRAFT') {
        throw new Error('Only draft courses can be deleted');
    }

    // Delete the course
    await prisma.course.delete({
        where: { id: courseId }
    });

    return {
        message: 'Course deleted successfully',
        courseId
    };
}

module.exports = {
    createCourse,
    getMyCourses,
    getCourseById,
    updateCourse,
    submitForReview,
    deleteCourse,
};
