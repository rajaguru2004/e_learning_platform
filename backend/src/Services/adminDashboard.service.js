const { prisma } = require('../Prisma/client');

/**
 * Admin Dashboard Service
 * Contains business logic for retrieving platform analytics
 */

/**
 * Get user analytics segmented by role
 */
const getUserAnalytics = async () => {
    try {
        // Total users count
        const totalUsers = await prisma.user.count();

        // Active and inactive users
        const activeUsers = await prisma.user.count({
            where: { isActive: true }
        });

        const inactiveUsers = totalUsers - activeUsers;

        // Users grouped by role
        const usersByRole = await prisma.user.groupBy({
            by: ['roleId'],
            _count: true,
        });

        // Get role details for each group
        const roleDetails = await Promise.all(
            usersByRole.map(async (group) => {
                const role = await prisma.role.findUnique({
                    where: { id: group.roleId },
                    select: { code: true, name: true }
                });
                return {
                    roleCode: role?.code || 'UNKNOWN',
                    roleName: role?.name || 'Unknown',
                    count: group._count
                };
            })
        );

        // Organize by specific roles
        const adminCount = roleDetails.find(r => r.roleCode === 'ADMIN')?._count || 0;
        const instructorCount = roleDetails.find(r => r.roleCode === 'INSTRUCTOR')?._count || 0;
        const learnerCount = roleDetails.find(r => r.roleCode === 'LEARNER')?._count || 0;

        return {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            byRole: {
                admin: adminCount,
                instructor: instructorCount,
                learner: learnerCount,
                others: roleDetails.filter(r => !['ADMIN', 'INSTRUCTOR', 'LEARNER'].includes(r.roleCode))
            }
        };
    } catch (error) {
        console.error('Error in getUserAnalytics:', error);
        throw new Error('Failed to fetch user analytics');
    }
};

/**
 * Get course analytics segmented by status
 */
const getCourseAnalytics = async () => {
    try {
        const totalCourses = await prisma.course.count();

        // Courses grouped by status
        const coursesByStatus = await prisma.course.groupBy({
            by: ['statusCode'],
            _count: true
        });

        const draft = coursesByStatus.find(c => c.statusCode === 'DRAFT')?._count || 0;
        const published = coursesByStatus.find(c => c.statusCode === 'PUBLISHED')?._count || 0;
        const archived = coursesByStatus.find(c => c.statusCode === 'ARCHIVED')?._count || 0;

        return {
            total: totalCourses,
            byStatus: {
                draft,
                published,
                archived
            }
        };
    } catch (error) {
        console.error('Error in getCourseAnalytics:', error);
        throw new Error('Failed to fetch course analytics');
    }
};

/**
 * Get enrollment analytics segmented by status
 */
const getEnrollmentAnalytics = async () => {
    try {
        const totalEnrollments = await prisma.enrollment.count();

        // Enrollments grouped by status
        const enrollmentsByStatus = await prisma.enrollment.groupBy({
            by: ['statusCode'],
            _count: true
        });

        const enrolled = enrollmentsByStatus.find(e => e.statusCode === 'ENROLLED')?._count || 0;
        const started = enrollmentsByStatus.find(e => e.statusCode === 'STARTED')?._count || 0;
        const completed = enrollmentsByStatus.find(e => e.statusCode === 'COMPLETED')?._count || 0;
        const dropped = enrollmentsByStatus.find(e => e.statusCode === 'DROPPED')?._count || 0;

        return {
            total: totalEnrollments,
            byStatus: {
                enrolled,
                started,
                completed,
                dropped,
                active: enrolled + started
            }
        };
    } catch (error) {
        console.error('Error in getEnrollmentAnalytics:', error);
        throw new Error('Failed to fetch enrollment analytics');
    }
};

/**
 * Get course progress analytics
 */
const getProgressAnalytics = async () => {
    try {
        // Count of learners with IN_PROGRESS status
        const inProgressCount = await prisma.courseProgress.count({
            where: { statusCode: 'IN_PROGRESS' }
        });

        // Average completion percentage across all progress records
        const avgProgress = await prisma.courseProgress.aggregate({
            _avg: {
                progressPercent: true
            }
        });

        return {
            inProgress: inProgressCount,
            avgCompletionPercent: avgProgress._avg.progressPercent
                ? parseFloat(avgProgress._avg.progressPercent.toFixed(2))
                : 0
        };
    } catch (error) {
        console.error('Error in getProgressAnalytics:', error);
        throw new Error('Failed to fetch progress analytics');
    }
};

/**
 * Get points analytics with distribution by badge level
 */
const getPointsAnalytics = async () => {
    try {
        // Total points awarded
        const totalPointsResult = await prisma.pointsLedger.aggregate({
            _sum: {
                points: true
            }
        });

        const totalPoints = totalPointsResult._sum.points || 0;

        // Points awarded this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthPointsResult = await prisma.pointsLedger.aggregate({
            where: {
                createdAt: {
                    gte: startOfMonth
                }
            },
            _sum: {
                points: true
            }
        });

        const thisMonthPoints = thisMonthPointsResult._sum.points || 0;

        // Get user points totals and badge distribution
        const userPointsTotals = await prisma.pointsLedger.groupBy({
            by: ['userId'],
            _sum: {
                points: true
            }
        });

        // Get badge types for distribution
        const badgeTypes = await prisma.badgeType.findMany({
            orderBy: { levelOrder: 'asc' }
        });

        // Calculate distribution by badge level
        const badgeDistribution = badgeTypes.map(badge => {
            const usersInBadge = userPointsTotals.filter(userPoints => {
                const total = userPoints._sum.points || 0;
                const meetsMin = total >= badge.minPoints;
                const meetsMax = badge.maxPoints === null || total <= badge.maxPoints;
                return meetsMin && meetsMax;
            });

            return {
                badgeName: badge.name,
                levelOrder: badge.levelOrder,
                userCount: usersInBadge.length
            };
        });

        return {
            totalPoints,
            thisMonthPoints,
            byBadgeLevel: badgeDistribution
        };
    } catch (error) {
        console.error('Error in getPointsAnalytics:', error);
        throw new Error('Failed to fetch points analytics');
    }
};

/**
 * Get rating analytics including top courses
 */
const getRatingAnalytics = async () => {
    try {
        // Average platform rating
        const avgRatingResult = await prisma.courseReview.aggregate({
            where: { isPublished: true },
            _avg: {
                rating: true
            }
        });

        const avgPlatformRating = avgRatingResult._avg.rating
            ? parseFloat(avgRatingResult._avg.rating.toFixed(2))
            : 0;

        // Total reviews
        const totalReviews = await prisma.courseReview.count({
            where: { isPublished: true }
        });

        // Top 5 rated courses
        const topCourses = await prisma.course.findMany({
            where: {
                totalReviews: { gt: 0 },
                isActive: true
            },
            select: {
                id: true,
                title: true,
                averageRating: true,
                totalReviews: true,
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: [
                { averageRating: 'desc' },
                { totalReviews: 'desc' }
            ],
            take: 5
        });

        return {
            avgPlatformRating,
            totalReviews,
            topCourses: topCourses.map(course => ({
                id: course.id,
                title: course.title,
                rating: course.averageRating ? parseFloat(course.averageRating.toString()) : 0,
                reviewCount: course.totalReviews,
                instructorName: course.instructor.name
            }))
        };
    } catch (error) {
        console.error('Error in getRatingAnalytics:', error);
        throw new Error('Failed to fetch rating analytics');
    }
};

/**
 * Get revenue analytics (conditional based on payment feature enabled)
 */
const getRevenueAnalytics = async () => {
    try {
        // Check if payment feature is enabled
        const paymentSetting = await prisma.systemSetting.findUnique({
            where: { key: 'PAYMENT_ENABLED' }
        });

        const isPaymentEnabled = paymentSetting?.value === 'true';

        if (!isPaymentEnabled) {
            return null; // Don't return revenue data if feature is disabled
        }

        // Total revenue (sum of successful payments)
        const totalRevenueResult = await prisma.payment.aggregate({
            where: { statusCode: 'SUCCESS' },
            _sum: {
                amount: true
            }
        });

        const totalRevenue = totalRevenueResult._sum.amount
            ? parseFloat(totalRevenueResult._sum.amount.toString())
            : 0;

        // Revenue this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthRevenueResult = await prisma.payment.aggregate({
            where: {
                statusCode: 'SUCCESS',
                createdAt: {
                    gte: startOfMonth
                }
            },
            _sum: {
                amount: true
            }
        });

        const thisMonthRevenue = thisMonthRevenueResult._sum.amount
            ? parseFloat(thisMonthRevenueResult._sum.amount.toString())
            : 0;

        // Payment counts by status
        const successfulPayments = await prisma.payment.count({
            where: { statusCode: 'SUCCESS' }
        });

        const failedPayments = await prisma.payment.count({
            where: { statusCode: 'FAILED' }
        });

        return {
            totalRevenue,
            thisMonthRevenue,
            successfulPayments,
            failedPayments
        };
    } catch (error) {
        console.error('Error in getRevenueAnalytics:', error);
        throw new Error('Failed to fetch revenue analytics');
    }
};

/**
 * Main service function to get all dashboard data
 * Uses Promise.all for parallel query execution
 */
const getDashboardData = async () => {
    try {
        const [
            users,
            courses,
            enrollments,
            progress,
            points,
            ratings,
            revenue
        ] = await Promise.all([
            getUserAnalytics(),
            getCourseAnalytics(),
            getEnrollmentAnalytics(),
            getProgressAnalytics(),
            getPointsAnalytics(),
            getRatingAnalytics(),
            getRevenueAnalytics()
        ]);

        const dashboardData = {
            users,
            courses,
            enrollments,
            progress,
            points,
            ratings
        };

        // Only include revenue if payment feature is enabled
        if (revenue !== null) {
            dashboardData.revenue = revenue;
        }

        return dashboardData;
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        throw error;
    }
};

module.exports = {
    getDashboardData
};
