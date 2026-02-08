const { prisma } = require('../Prisma/client');

/**
 * Instructor Service
 * 
 * Business logic for instructor-specific operations
 * 
 * @module instructor.service
 */

/**
 * Get enrollment statistics and payment info for courses owned by the instructor
 * @param {string} instructorId - Instructor ID
 * @returns {Promise<Object>} Enrollment stats and details
 */
async function getInstructorEnrollmentStats(instructorId) {
    // 1. Get all courses for this instructor
    const courses = await prisma.course.findMany({
        where: { instructorId },
        select: {
            id: true,
            title: true,
            slug: true,
            statusCode: true,
            price: true,
            enrollmentCount: true,
            createdAt: true,
        },
    });

    if (!courses.length) {
        return {
            summary: {
                total_courses: 0,
                total_students: 0,
                total_revenue: 0,
            },
            courses: [],
        };
    }

    const courseIds = courses.map(c => c.id);

    // 2. Get enrollments for these courses
    const enrollments = await prisma.enrollment.findMany({
        where: {
            courseId: { in: courseIds },
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
        },
    });

    // 3. Get payments for these courses
    const payments = await prisma.payment.findMany({
        where: {
            courseId: { in: courseIds },
            statusCode: 'SUCCESS',
        },
    });

    // 4. Enrich course data with enrollments and revenue
    let totalRevenue = 0;
    let totalStudents = 0;

    const enrichedCourses = courses.map(course => {
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        const coursePayments = payments.filter(p => p.courseId === course.id);

        const courseRevenue = coursePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        totalRevenue += courseRevenue;
        totalStudents += courseEnrollments.length;

        return {
            ...course,
            student_count: courseEnrollments.length,
            revenue: courseRevenue,
            enrollments: courseEnrollments.map(e => ({
                id: e.id,
                enrolled_at: e.enrolledAt,
                user: e.user,
                payment_status: coursePayments.find(p => p.userId === e.userId)?.statusCode || 'NOT_PAID',
            })),
        };
    });

    return {
        summary: {
            total_courses: courses.length,
            total_students: totalStudents,
            total_revenue: totalRevenue,
        },
        courses: enrichedCourses,
    };
}

module.exports = {
    getInstructorEnrollmentStats,
};
