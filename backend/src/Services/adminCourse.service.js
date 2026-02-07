const { prisma } = require('../Prisma/client');
const { logAuditEvent, getIpAddress, ACTION_TYPES } = require('../Utils/auditLog.helper');

/**
 * Admin Course Governance Service
 * 
 * Business logic for admin course management operations:
 * - Course oversight (view all, publish, archive, lock)
 * - Course approval workflow (approve, reject)
 * - Enrollment management (view, create, remove, extend, override payment)
 * 
 * @module adminCourse.service
 */

// ============================================================================
// COURSE OVERSIGHT FUNCTIONS
// ============================================================================

/**
 * Get all courses with pagination, filtering, search, and sorting
 * Accessible to admins - includes all courses regardless of status
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {string} options.statusCode - Filter by status code
 * @param {string} options.instructorId - Filter by instructor ID
 * @param {string} options.visibilityCode - Filter by visibility code
 * @param {string} options.accessCode - Filter by access type code
 * @param {string} options.search - Search by title
 * @param {string} options.sortBy - Sort field (created_at, title, enrollment_count)
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Courses list with pagination metadata
 */
const getAllCourses = async ({
    page = 1,
    limit = 10,
    statusCode,
    instructorId,
    visibilityCode,
    accessCode,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
}) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (statusCode) {
        where.statusCode = statusCode.toUpperCase();
    }

    if (instructorId) {
        where.instructorId = instructorId;
    }

    if (visibilityCode) {
        where.visibilityCode = visibilityCode.toUpperCase();
    }

    if (accessCode) {
        where.accessCode = accessCode.toUpperCase();
    }

    if (search) {
        where.title = { contains: search, mode: 'insensitive' };
    }

    // Map sort fields
    const sortMapping = {
        created_at: 'createdAt',
        title: 'title',
        enrollment_count: 'enrollmentCount',
        updated_at: 'updatedAt',
    };

    const prismaSortField = sortMapping[sortBy] || 'createdAt';

    // Execute query with pagination
    const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
            where,
            skip,
            take,
            orderBy: {
                [prismaSortField]: sortOrder,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                statusCode: true,
                visibilityCode: true,
                accessCode: true,
                price: true,
                enrollmentCount: true,
                averageRating: true,
                isActive: true,
                isLocked: true,
                createdAt: true,
                updatedAt: true,
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
                topics: {
                    include: {
                        subtopics: {
                            orderBy: {
                                orderIndex: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
            },
        }),
        prisma.course.count({ where }),
    ]);

    return {
        courses: courses.map((course) => ({
            id: course.id,
            title: course.title,
            slug: course.slug,
            instructor: {
                id: course.instructor.id,
                name: course.instructor.name,
                email: course.instructor.email,
            },
            status: course.statusCode,
            visibility: course.visibilityCode,
            access_type: course.accessCode,
            price: course.price,
            total_enrollments: course._count.enrollments,
            average_rating: course.averageRating,
            is_locked: course.isLocked,
            is_active: course.isActive,
            created_at: course.createdAt,
            updated_at: course.updatedAt,
            topics: course.topics,
        })),
        pagination: {
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take),
            totalCount,
        },
    };
};

/**
 * Force publish or unpublish a course
 * Admin override - bypasses normal approval workflow
 * 
 * @param {string} courseId - Course ID
 * @param {boolean} publish - True to publish, false to unpublish
 * @param {Object} admin - Admin user making the change
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated course
 */
const forcePublishCourse = async (courseId, publish, admin, req = null) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: true },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // Prevent publishing archived courses
    if (publish && course.statusCode === 'ARCHIVED') {
        throw new Error('Cannot publish an archived course. Unarchive it first.');
    }

    const newStatus = publish ? 'PUBLISHED' : 'DRAFT';

    const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
            statusCode: newStatus,
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.COURSE_PUBLISHED,
        admin,
        targetType: 'COURSE',
        targetId: courseId,
        details: {
            course_title: course.title,
            previous_status: course.statusCode,
            new_status: newStatus,
            instructor_email: course.instructor.email,
            forced_by_admin: true,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedCourse;
};

/**
 * Archive a course
 * Prevents further enrollment and editing
 * 
 * @param {string} courseId - Course ID
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Archived course
 */
const archiveCourse = async (courseId, admin, req = null) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: true },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.statusCode === 'ARCHIVED') {
        throw new Error('Course is already archived');
    }

    const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
            statusCode: 'ARCHIVED',
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.COURSE_ARCHIVED,
        admin,
        targetType: 'COURSE',
        targetId: courseId,
        details: {
            course_title: course.title,
            previous_status: course.statusCode,
            instructor_email: course.instructor.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedCourse;
};

/**
 * Lock or unlock a course
 * Locked courses cannot be edited by instructor
 * 
 * @param {string} courseId - Course ID
 * @param {boolean} isLocked - Lock status
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated course
 */
const lockCourse = async (courseId, isLocked, admin, req = null) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: true },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
            isLocked,
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.COURSE_LOCKED,
        admin,
        targetType: 'COURSE',
        targetId: courseId,
        details: {
            course_title: course.title,
            is_locked: isLocked,
            previous_lock_status: course.isLocked,
            instructor_email: course.instructor.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedCourse;
};

// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================================================

/**
 * Approve a course for publishing
 * Changes status from UNDER_REVIEW to PUBLISHED
 * 
 * @param {string} courseId - Course ID
 * @param {Object} admin - Admin user performing the approval
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Approved course
 */
const approveCourse = async (courseId, admin, req = null) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: true },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.statusCode !== 'UNDER_REVIEW') {
        throw new Error('Only courses under review can be approved');
    }

    const updatedCourse = await prisma.$transaction(async (tx) => {
        return await tx.course.update({
            where: { id: courseId },
            data: {
                statusCode: 'PUBLISHED',
                reviewNote: null, // Clear any previous review notes
                reviewedBy: admin.id,
                reviewedAt: new Date(),
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.COURSE_APPROVED,
        admin,
        targetType: 'COURSE',
        targetId: courseId,
        details: {
            course_title: course.title,
            instructor_email: course.instructor.email,
            reviewer_email: admin.email,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedCourse;
};

/**
 * Reject a course submission
 * Changes status from UNDER_REVIEW back to DRAFT with review notes
 * 
 * @param {string} courseId - Course ID
 * @param {string} reviewNote - Reason for rejection
 * @param {Object} admin - Admin user performing the rejection
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Rejected course
 */
const rejectCourse = async (courseId, reviewNote, admin, req = null) => {
    if (!reviewNote || reviewNote.trim().length === 0) {
        throw new Error('Review note is required when rejecting a course');
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { instructor: true },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.statusCode !== 'UNDER_REVIEW') {
        throw new Error('Only courses under review can be rejected');
    }

    const updatedCourse = await prisma.$transaction(async (tx) => {
        return await tx.course.update({
            where: { id: courseId },
            data: {
                statusCode: 'DRAFT',
                reviewNote,
                reviewedBy: admin.id,
                reviewedAt: new Date(),
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.COURSE_REJECTED,
        admin,
        targetType: 'COURSE',
        targetId: courseId,
        details: {
            course_title: course.title,
            instructor_email: course.instructor.email,
            reviewer_email: admin.email,
            review_note: reviewNote,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedCourse;
};

// ============================================================================
// ENROLLMENT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Get enrollments for a specific course
 * 
 * @param {string} courseId - Course ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.statusCode - Filter by enrollment status
 * @param {string} options.search - Search by user name/email
 * @returns {Promise<Object>} Enrollments list with pagination
 */
const getCourseEnrollments = async (courseId, { page = 1, limit = 10, statusCode, search }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {
        courseId,
        isActive: true, // Only active enrollments
    };

    if (statusCode) {
        where.statusCode = statusCode.toUpperCase();
    }

    if (search) {
        where.user = {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        };
    }

    const [enrollments, totalCount] = await Promise.all([
        prisma.enrollment.findMany({
            where,
            skip,
            take,
            orderBy: {
                enrolledAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),
        prisma.enrollment.count({ where }),
    ]);

    // Get payment info for each enrollment
    const enrichedEnrollments = await Promise.all(
        enrollments.map(async (enrollment) => {
            const payment = await prisma.payment.findFirst({
                where: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    statusCode: true,
                    amount: true,
                    createdAt: true,
                },
            });

            return {
                enrollment_id: enrollment.id,
                user: enrollment.user,
                course: enrollment.course,
                status: enrollment.statusCode,
                progress_percent: enrollment.progressPercent,
                enrolled_at: enrollment.enrolledAt,
                completed_at: enrollment.completedAt,
                expires_at: enrollment.expiresAt,
                payment_status: payment?.statusCode || null,
                payment_amount: payment?.amount || null,
            };
        })
    );

    return {
        enrollments: enrichedEnrollments,
        pagination: {
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take),
            totalCount,
        },
    };
};

/**
 * Manually enroll a user in a course (admin override)
 * Creates enrollment and overrides payment requirement
 * 
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID to enroll
 * @param {string} accessDurationType - Access duration type (LIFETIME, FIXED_DAYS)
 * @param {number} durationDays - Duration in days (if FIXED_DAYS)
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Created enrollment
 */
const manuallyEnrollUser = async (
    courseId,
    userId,
    accessDurationType = 'LIFETIME',
    durationDays = null,
    admin,
    req = null
) => {
    // Validate course exists and is not archived
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.statusCode === 'ARCHIVED') {
        throw new Error('Cannot enroll users in an archived course');
    }

    // Validate user exists and is active
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (!user.isActive) {
        throw new Error('Cannot enroll inactive user');
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });

    if (existingEnrollment && existingEnrollment.isActive) {
        throw new Error('User is already enrolled in this course');
    }

    // Calculate expiration date
    let expiresAt = null;
    if (accessDurationType === 'FIXED_DAYS' && durationDays) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(durationDays));
    }

    // Create enrollment and payment in transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create or update enrollment
        const enrollment = await tx.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            update: {
                statusCode: 'ENROLLED',
                isActive: true,
                expiresAt,
                enrolledAt: new Date(),
            },
            create: {
                userId,
                courseId,
                statusCode: 'ENROLLED',
                expiresAt,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
            },
        });

        // Create payment record with SUCCESS status (admin override)
        const payment = await tx.payment.create({
            data: {
                userId,
                courseId,
                amount: course.price || 0,
                statusCode: 'SUCCESS',
                paymentMethod: 'ADMIN_OVERRIDE',
                paymentGateway: 'ADMIN',
                metadata: {
                    admin_enrollment: true,
                    enrolled_by: admin.id,
                    enrolled_by_email: admin.email,
                },
            },
        });

        return { enrollment, payment };
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ENROLLMENT_CREATED_BY_ADMIN,
        admin,
        targetType: 'ENROLLMENT',
        targetId: result.enrollment.id,
        details: {
            user_email: user.email,
            course_title: course.title,
            access_duration_type: accessDurationType,
            duration_days: durationDays,
            expires_at: expiresAt,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return result.enrollment;
};

/**
 * Remove (soft delete) an enrollment
 * 
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} reason - Reason for removal
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated enrollment
 */
const removeEnrollment = async (enrollmentId, reason, admin, req = null) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: true,
            course: true,
        },
    });

    if (!enrollment) {
        throw new Error('Enrollment not found');
    }

    if (!enrollment.isActive) {
        throw new Error('Enrollment is already removed');
    }

    const updatedEnrollment = await prisma.$transaction(async (tx) => {
        return await tx.enrollment.update({
            where: { id: enrollmentId },
            data: {
                isActive: false,
                deletedBy: admin.id,
                deletedAt: new Date(),
                deletionReason: reason || 'Removed by admin',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ENROLLMENT_REMOVED,
        admin,
        targetType: 'ENROLLMENT',
        targetId: enrollmentId,
        details: {
            user_email: enrollment.user.email,
            course_title: enrollment.course.title,
            reason: reason || 'Removed by admin',
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedEnrollment;
};

/**
 * Extend enrollment access duration
 * 
 * @param {string} enrollmentId - Enrollment ID
 * @param {number} extendDays - Number of days to extend
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated enrollment
 */
const extendEnrollmentAccess = async (enrollmentId, extendDays, admin, req = null) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: true,
            course: true,
        },
    });

    if (!enrollment) {
        throw new Error('Enrollment not found');
    }

    if (!enrollment.isActive) {
        throw new Error('Cannot extend access for inactive enrollment');
    }

    // Calculate new expiration date
    const currentExpiresAt = enrollment.expiresAt || new Date();
    const newExpiresAt = new Date(currentExpiresAt);
    newExpiresAt.setDate(newExpiresAt.getDate() + parseInt(extendDays));

    const updatedEnrollment = await prisma.$transaction(async (tx) => {
        return await tx.enrollment.update({
            where: { id: enrollmentId },
            data: {
                expiresAt: newExpiresAt,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ACCESS_EXTENDED,
        admin,
        targetType: 'ENROLLMENT',
        targetId: enrollmentId,
        details: {
            user_email: enrollment.user.email,
            course_title: enrollment.course.title,
            extend_days: extendDays,
            previous_expires_at: enrollment.expiresAt,
            new_expires_at: newExpiresAt,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return updatedEnrollment;
};

/**
 * Override payment status for an enrollment
 * Admin can mark payment as successful to grant access
 * 
 * @param {string} enrollmentId - Enrollment ID
 * @param {Object} admin - Admin user performing the action
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated enrollment and payment
 */
const overrideEnrollmentPayment = async (enrollmentId, admin, req = null) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: true,
            course: true,
        },
    });

    if (!enrollment) {
        throw new Error('Enrollment not found');
    }

    const result = await prisma.$transaction(async (tx) => {
        // Find existing payment or create new one
        let payment = await tx.payment.findFirst({
            where: {
                userId: enrollment.userId,
                courseId: enrollment.courseId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (payment) {
            // Update existing payment
            payment = await tx.payment.update({
                where: { id: payment.id },
                data: {
                    statusCode: 'SUCCESS',
                    metadata: {
                        ...(payment.metadata || {}),
                        admin_override: true,
                        overridden_by: admin.id,
                        overridden_by_email: admin.email,
                        overridden_at: new Date().toISOString(),
                    },
                },
            });
        } else {
            // Create new payment record
            payment = await tx.payment.create({
                data: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    amount: enrollment.course.price || 0,
                    statusCode: 'SUCCESS',
                    paymentMethod: 'ADMIN_OVERRIDE',
                    paymentGateway: 'ADMIN',
                    metadata: {
                        admin_override: true,
                        overridden_by: admin.id,
                        overridden_by_email: admin.email,
                    },
                },
            });
        }

        // Update enrollment status to ENROLLED if not already
        const updatedEnrollment = await tx.enrollment.update({
            where: { id: enrollmentId },
            data: {
                statusCode: enrollment.statusCode === 'INVITED' ? 'ENROLLED' : enrollment.statusCode,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return { enrollment: updatedEnrollment, payment };
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.PAYMENT_OVERRIDDEN,
        admin,
        targetType: 'PAYMENT',
        targetId: result.payment.id,
        details: {
            enrollment_id: enrollmentId,
            user_email: enrollment.user.email,
            course_title: enrollment.course.title,
            payment_amount: result.payment.amount,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return result;
};

module.exports = {
    // Course Oversight
    getAllCourses,
    forcePublishCourse,
    archiveCourse,
    lockCourse,
    // Approval Workflow
    approveCourse,
    rejectCourse,
    // Enrollment Management
    getCourseEnrollments,
    manuallyEnrollUser,
    removeEnrollment,
    extendEnrollmentAccess,
    overrideEnrollmentPayment,
};
