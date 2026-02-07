const { prisma } = require('../Prisma/client');

/**
 * Admin Reporting Service
 * Contains business logic for platform-level and drill-down analytics
 */

// ============================================================================
// PLATFORM-LEVEL REPORTS
// ============================================================================

/**
 * Get user growth report with period-based grouping
 * @param {string} period - 'daily', 'weekly', 'monthly', or 'yearly'
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getUserGrowthReport = async (period = 'monthly', from = null, to = null) => {
    try {
        // Build date filter
        const dateFilter = {};
        if (from) dateFilter.gte = new Date(from);
        if (to) dateFilter.lte = new Date(to);

        // Get all users within date range
        const users = await prisma.user.findMany({
            where: from || to ? { createdAt: dateFilter } : {},
            select: {
                id: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Total users
        const totalUsers = await prisma.user.count();

        // Group by period
        const grouped = {};
        users.forEach(user => {
            const date = new Date(user.createdAt);
            let key;

            switch (period) {
                case 'daily':
                    key = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    break;
                case 'weekly':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'monthly':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'yearly':
                    key = String(date.getFullYear());
                    break;
                default:
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!grouped[key]) {
                grouped[key] = 0;
            }
            grouped[key]++;
        });

        // Convert to arrays for chart consumption
        const labels = Object.keys(grouped).sort();
        const newUsers = labels.map(label => grouped[label]);

        // Calculate cumulative growth
        let cumulative = 0;
        const cumulativeGrowth = newUsers.map(count => {
            cumulative += count;
            return cumulative;
        });

        return {
            totalUsers,
            period,
            labels,
            datasets: [
                {
                    label: 'New Users',
                    data: newUsers
                },
                {
                    label: 'Cumulative Growth',
                    data: cumulativeGrowth
                }
            ]
        };
    } catch (error) {
        console.error('Error in getUserGrowthReport:', error);
        throw new Error('Failed to fetch user growth report');
    }
};

/**
 * Get course completion rate report
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getCourseCompletionReport = async (from = null, to = null) => {
    try {
        // Build date filter
        const dateFilter = {};
        if (from) dateFilter.gte = new Date(from);
        if (to) dateFilter.lte = new Date(to);

        // Get enrollment counts by status
        const enrollmentsByStatus = await prisma.enrollment.groupBy({
            by: ['statusCode'],
            where: from || to ? { enrolledAt: dateFilter } : {},
            _count: true
        });

        // Calculate totals
        const totalEnrollments = enrollmentsByStatus.reduce((sum, group) => sum + group._count, 0);
        const completedEnrollments = enrollmentsByStatus.find(g => g.statusCode === 'COMPLETED')?._count || 0;
        const startedEnrollments = enrollmentsByStatus.find(g => g.statusCode === 'STARTED')?._count || 0;
        const enrolledEnrollments = enrollmentsByStatus.find(g => g.statusCode === 'ENROLLED')?._count || 0;
        const droppedEnrollments = enrollmentsByStatus.find(g => g.statusCode === 'DROPPED')?._count || 0;

        // Calculate completion percentage
        const completionPercentage = totalEnrollments > 0
            ? parseFloat(((completedEnrollments / totalEnrollments) * 100).toFixed(2))
            : 0;

        return {
            totalEnrollments,
            completedEnrollments,
            startedEnrollments,
            enrolledEnrollments,
            droppedEnrollments,
            completionPercentage,
            byStatus: enrollmentsByStatus.map(group => ({
                status: group.statusCode,
                count: group._count,
                percentage: totalEnrollments > 0
                    ? parseFloat(((group._count / totalEnrollments) * 100).toFixed(2))
                    : 0
            }))
        };
    } catch (error) {
        console.error('Error in getCourseCompletionReport:', error);
        throw new Error('Failed to fetch course completion report');
    }
};

/**
 * Get quiz performance report
 * NOTE: Placeholder implementation - Quiz models not yet in schema
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getQuizPerformanceReport = async (from = null, to = null) => {
    try {
        // Placeholder response until Quiz/QuizAttempt models are added
        return {
            available: false,
            message: 'Quiz functionality not yet implemented. This report will be available once Quiz and QuizAttempt models are added to the database schema.',
            plannedMetrics: {
                totalQuizzesAttempted: 0,
                averageScore: 0,
                averageAttemptsPerQuiz: 0,
                passRate: 0
            }
        };
    } catch (error) {
        console.error('Error in getQuizPerformanceReport:', error);
        throw new Error('Failed to fetch quiz performance report');
    }
};

/**
 * Get drop-off rate report
 * Analyzes enrollments that were started but not completed
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getDropOffReport = async (from = null, to = null) => {
    try {
        // Build date filter
        const dateFilter = {};
        if (from) dateFilter.gte = new Date(from);
        if (to) dateFilter.lte = new Date(to);

        // Total enrollments
        const totalEnrollments = await prisma.enrollment.count({
            where: from || to ? { enrolledAt: dateFilter } : {}
        });

        // Enrollments that started but didn't complete
        const incompleteEnrollments = await prisma.enrollment.findMany({
            where: {
                statusCode: { in: ['ENROLLED', 'STARTED'] },
                ...(from || to ? { enrolledAt: dateFilter } : {})
            },
            select: {
                id: true,
                progressPercent: true,
                statusCode: true
            }
        });

        const incompleteCount = incompleteEnrollments.length;

        // Calculate average progress before drop
        const avgProgress = incompleteCount > 0
            ? incompleteEnrollments.reduce((sum, e) => sum + e.progressPercent, 0) / incompleteCount
            : 0;

        // Calculate drop-off percentage
        const dropOffPercentage = totalEnrollments > 0
            ? parseFloat(((incompleteCount / totalEnrollments) * 100).toFixed(2))
            : 0;

        // Explicitly dropped enrollments
        const droppedCount = await prisma.enrollment.count({
            where: {
                statusCode: 'DROPPED',
                ...(from || to ? { enrolledAt: dateFilter } : {})
            }
        });

        return {
            totalEnrollments,
            incompleteEnrollments: incompleteCount,
            explicitlyDropped: droppedCount,
            dropOffPercentage,
            averageProgressBeforeDrop: parseFloat(avgProgress.toFixed(2)),
            breakdown: {
                enrolled: incompleteEnrollments.filter(e => e.statusCode === 'ENROLLED').length,
                started: incompleteEnrollments.filter(e => e.statusCode === 'STARTED').length
            }
        };
    } catch (error) {
        console.error('Error in getDropOffReport:', error);
        throw new Error('Failed to fetch drop-off rate report');
    }
};

/**
 * Get popular categories report
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getPopularCategoriesReport = async (from = null, to = null) => {
    try {
        // Build date filter for enrollments
        const enrollmentDateFilter = {};
        if (from) enrollmentDateFilter.gte = new Date(from);
        if (to) enrollmentDateFilter.lte = new Date(to);

        // Get all courses with their categories and enrollment stats
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            select: {
                id: true,
                categoryId: true,
                enrollments: {
                    where: from || to ? { enrolledAt: enrollmentDateFilter } : {},
                    select: {
                        statusCode: true
                    }
                }
            }
        });

        // Group by category
        const categoryStats = {};

        for (const course of courses) {
            const categoryId = course.categoryId || 'uncategorized';

            if (!categoryStats[categoryId]) {
                categoryStats[categoryId] = {
                    categoryId,
                    totalCourses: 0,
                    totalEnrollments: 0,
                    completedEnrollments: 0
                };
            }

            categoryStats[categoryId].totalCourses++;
            categoryStats[categoryId].totalEnrollments += course.enrollments.length;
            categoryStats[categoryId].completedEnrollments += course.enrollments.filter(
                e => e.statusCode === 'COMPLETED'
            ).length;
        }

        // Get category names
        const categoryIds = Object.keys(categoryStats).filter(id => id !== 'uncategorized');
        const categories = await prisma.courseCategory.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true }
        });

        // Build final result
        const result = Object.values(categoryStats).map(stat => {
            const category = categories.find(c => c.id === stat.categoryId);
            const completionRate = stat.totalEnrollments > 0
                ? parseFloat(((stat.completedEnrollments / stat.totalEnrollments) * 100).toFixed(2))
                : 0;

            return {
                categoryId: stat.categoryId,
                categoryName: category?.name || 'Uncategorized',
                totalCourses: stat.totalCourses,
                totalEnrollments: stat.totalEnrollments,
                completedEnrollments: stat.completedEnrollments,
                completionRate
            };
        });

        // Sort by total enrollments descending
        result.sort((a, b) => b.totalEnrollments - a.totalEnrollments);

        return {
            totalCategories: result.length,
            categories: result
        };
    } catch (error) {
        console.error('Error in getPopularCategoriesReport:', error);
        throw new Error('Failed to fetch popular categories report');
    }
};

/**
 * Get revenue report (conditional on PAYMENT_ENABLED setting)
 * @param {string} period - 'monthly' or 'yearly'
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 */
const getRevenueReport = async (period = 'monthly', from = null, to = null) => {
    try {
        // Check if payment feature is enabled
        const paymentSetting = await prisma.systemSetting.findUnique({
            where: { key: 'PAYMENT_ENABLED' }
        });

        const isPaymentEnabled = paymentSetting?.value === 'true';

        if (!isPaymentEnabled) {
            return {
                available: false,
                message: 'Payment functionality is not enabled on this platform.'
            };
        }

        // Build date filter
        const dateFilter = {};
        if (from) dateFilter.gte = new Date(from);
        if (to) dateFilter.lte = new Date(to);

        // Get successful payments
        const successfulPayments = await prisma.payment.findMany({
            where: {
                statusCode: 'SUCCESS',
                ...(from || to ? { createdAt: dateFilter } : {})
            },
            select: {
                amount: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by period
        const grouped = {};
        successfulPayments.forEach(payment => {
            const date = new Date(payment.createdAt);
            let key;

            switch (period) {
                case 'yearly':
                    key = String(date.getFullYear());
                    break;
                case 'monthly':
                default:
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!grouped[key]) {
                grouped[key] = 0;
            }
            grouped[key] += parseFloat(payment.amount.toString());
        });

        // Convert to arrays
        const labels = Object.keys(grouped).sort();
        const revenueData = labels.map(label => parseFloat(grouped[label].toFixed(2)));

        // Total revenue
        const totalRevenue = parseFloat(
            successfulPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0).toFixed(2)
        );

        // Failed payments count
        const failedPaymentsCount = await prisma.payment.count({
            where: {
                statusCode: 'FAILED',
                ...(from || to ? { createdAt: dateFilter } : {})
            }
        });

        return {
            available: true,
            totalRevenue,
            successfulPayments: successfulPayments.length,
            failedPayments: failedPaymentsCount,
            period,
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData
                }
            ]
        };
    } catch (error) {
        console.error('Error in getRevenueReport:', error);
        throw new Error('Failed to fetch revenue report');
    }
};

// ============================================================================
// DRILL-DOWN REPORTS
// ============================================================================

/**
 * Get instructor performance report
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 */
const getInstructorPerformanceReport = async (from = null, to = null, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;

        // Get instructor role
        const instructorRole = await prisma.role.findUnique({
            where: { code: 'INSTRUCTOR' }
        });

        if (!instructorRole) {
            throw new Error('Instructor role not found');
        }

        // Get total count
        const totalInstructors = await prisma.user.count({
            where: { roleId: instructorRole.id, isActive: true }
        });

        // Get instructors with pagination
        const instructors = await prisma.user.findMany({
            where: { roleId: instructorRole.id, isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            },
            skip,
            take: limit
        });

        // Check if payment is enabled
        const paymentSetting = await prisma.systemSetting.findUnique({
            where: { key: 'PAYMENT_ENABLED' }
        });
        const isPaymentEnabled = paymentSetting?.value === 'true';

        // Get performance stats for each instructor
        const performanceData = await Promise.all(
            instructors.map(async (instructor) => {
                // Total courses
                const totalCourses = await prisma.course.count({
                    where: { instructorId: instructor.id }
                });

                // Get courses for enrollment calculations
                const courses = await prisma.course.findMany({
                    where: { instructorId: instructor.id },
                    select: {
                        id: true,
                        averageRating: true,
                        enrollments: {
                            select: {
                                statusCode: true
                            }
                        }
                    }
                });

                // Calculate enrollments
                let totalEnrollments = 0;
                let completedEnrollments = 0;
                let totalRating = 0;
                let ratedCourses = 0;

                courses.forEach(course => {
                    totalEnrollments += course.enrollments.length;
                    completedEnrollments += course.enrollments.filter(e => e.statusCode === 'COMPLETED').length;

                    if (course.averageRating && parseFloat(course.averageRating.toString()) > 0) {
                        totalRating += parseFloat(course.averageRating.toString());
                        ratedCourses++;
                    }
                });

                const completionRate = totalEnrollments > 0
                    ? parseFloat(((completedEnrollments / totalEnrollments) * 100).toFixed(2))
                    : 0;

                const averageRating = ratedCourses > 0
                    ? parseFloat((totalRating / ratedCourses).toFixed(2))
                    : 0;

                // Revenue (if enabled)
                let revenueGenerated = 0;
                if (isPaymentEnabled) {
                    const courseIds = courses.map(c => c.id);
                    const payments = await prisma.payment.aggregate({
                        where: {
                            courseId: { in: courseIds },
                            statusCode: 'SUCCESS'
                        },
                        _sum: { amount: true }
                    });
                    revenueGenerated = payments._sum.amount
                        ? parseFloat(payments._sum.amount.toString())
                        : 0;
                }

                return {
                    instructorId: instructor.id,
                    instructorName: instructor.name,
                    instructorEmail: instructor.email,
                    totalCourses,
                    totalEnrollments,
                    completedEnrollments,
                    completionRate,
                    averageCourseRating: averageRating,
                    revenueGenerated: isPaymentEnabled ? revenueGenerated : null
                };
            })
        );

        // Sort by total enrollments descending
        performanceData.sort((a, b) => b.totalEnrollments - a.totalEnrollments);

        return {
            totalInstructors,
            page,
            limit,
            totalPages: Math.ceil(totalInstructors / limit),
            instructors: performanceData
        };
    } catch (error) {
        console.error('Error in getInstructorPerformanceReport:', error);
        throw new Error('Failed to fetch instructor performance report');
    }
};

/**
 * Get course performance report
 * @param {Date} from - Start date filter (optional)
 * @param {Date} to - End date filter (optional)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 */
const getCoursePerformanceReport = async (from = null, to = null, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;

        // Build date filter for enrollments
        const enrollmentDateFilter = {};
        if (from) enrollmentDateFilter.gte = new Date(from);
        if (to) enrollmentDateFilter.lte = new Date(to);

        // Get total count
        const totalCourses = await prisma.course.count({
            where: { isActive: true }
        });

        // Get courses with enrollment stats
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                averageRating: true,
                totalReviews: true,
                enrollments: {
                    where: from || to ? { enrolledAt: enrollmentDateFilter } : {},
                    select: {
                        statusCode: true
                    }
                },
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { enrollmentCount: 'desc' }
        });

        // Calculate performance metrics for each course
        const performanceData = await Promise.all(
            courses.map(async (course) => {
                const totalEnrollments = course.enrollments.length;
                const completedEnrollments = course.enrollments.filter(e => e.statusCode === 'COMPLETED').length;
                const droppedEnrollments = course.enrollments.filter(e => e.statusCode === 'DROPPED').length;

                const completionRate = totalEnrollments > 0
                    ? parseFloat(((completedEnrollments / totalEnrollments) * 100).toFixed(2))
                    : 0;

                const dropOffRate = totalEnrollments > 0
                    ? parseFloat((((totalEnrollments - completedEnrollments) / totalEnrollments) * 100).toFixed(2))
                    : 0;

                // Total points earned from this course
                const pointsResult = await prisma.pointsLedger.aggregate({
                    where: {
                        referenceType: 'COURSE',
                        referenceId: course.id
                    },
                    _sum: { points: true }
                });

                const totalPointsEarned = pointsResult._sum.points || 0;

                return {
                    courseId: course.id,
                    courseTitle: course.title,
                    instructorName: course.instructor.name,
                    totalEnrollments,
                    completedEnrollments,
                    droppedEnrollments,
                    completionRate,
                    dropOffRate,
                    averageRating: course.averageRating ? parseFloat(course.averageRating.toString()) : 0,
                    totalReviews: course.totalReviews,
                    totalPointsEarned
                };
            })
        );

        return {
            totalCourses,
            page,
            limit,
            totalPages: Math.ceil(totalCourses / limit),
            courses: performanceData
        };
    } catch (error) {
        console.error('Error in getCoursePerformanceReport:', error);
        throw new Error('Failed to fetch course performance report');
    }
};

/**
 * Get badge distribution report
 */
const getBadgeDistributionReport = async () => {
    try {
        // Get all badge types
        const badgeTypes = await prisma.badgeType.findMany({
            where: { isActive: true },
            orderBy: { levelOrder: 'asc' }
        });

        // Get user points totals
        const userPointsTotals = await prisma.pointsLedger.groupBy({
            by: ['userId'],
            _sum: {
                points: true
            }
        });

        const totalUsers = await prisma.user.count({ where: { isActive: true } });

        // Calculate distribution
        const distribution = badgeTypes.map(badge => {
            const usersInBadge = userPointsTotals.filter(userPoints => {
                const total = userPoints._sum.points || 0;
                const meetsMin = total >= badge.minPoints;
                const meetsMax = badge.maxPoints === null || total <= badge.maxPoints;
                return meetsMin && meetsMax;
            });

            const userCount = usersInBadge.length;
            const percentage = totalUsers > 0
                ? parseFloat(((userCount / totalUsers) * 100).toFixed(2))
                : 0;

            return {
                badgeId: badge.id,
                badgeName: badge.name,
                levelOrder: badge.levelOrder,
                minPoints: badge.minPoints,
                maxPoints: badge.maxPoints,
                userCount,
                percentageOfTotalUsers: percentage,
                iconUrl: badge.iconUrl
            };
        });

        // Users with no points
        const usersWithPoints = userPointsTotals.length;
        const usersWithoutPoints = totalUsers - usersWithPoints;

        return {
            totalUsers,
            usersWithPoints,
            usersWithoutPoints,
            badgeDistribution: distribution
        };
    } catch (error) {
        console.error('Error in getBadgeDistributionReport:', error);
        throw new Error('Failed to fetch badge distribution report');
    }
};

/**
 * Get points distribution report
 */
const getPointsDistributionReport = async () => {
    try {
        // Total points awarded
        const totalPointsResult = await prisma.pointsLedger.aggregate({
            _sum: { points: true }
        });
        const totalPoints = totalPointsResult._sum.points || 0;

        // User points totals
        const userPointsTotals = await prisma.pointsLedger.groupBy({
            by: ['userId'],
            _sum: {
                points: true
            }
        });

        const totalUsersWithPoints = userPointsTotals.length;
        const averagePointsPerUser = totalUsersWithPoints > 0
            ? parseFloat((totalPoints / totalUsersWithPoints).toFixed(2))
            : 0;

        // Get top 10 users
        const topUsersData = userPointsTotals
            .sort((a, b) => (b._sum.points || 0) - (a._sum.points || 0))
            .slice(0, 10);

        const topUsers = await Promise.all(
            topUsersData.map(async (userData, index) => {
                const user = await prisma.user.findUnique({
                    where: { id: userData.userId },
                    select: { id: true, name: true, email: true }
                });

                return {
                    rank: index + 1,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email,
                    totalPoints: userData._sum.points || 0
                };
            })
        );

        // Get badge thresholds for distribution ranges
        const badgeTypes = await prisma.badgeType.findMany({
            where: { isActive: true },
            orderBy: { levelOrder: 'asc' }
        });

        // Create distribution ranges based on badges
        const distributionRanges = badgeTypes.map(badge => {
            const usersInRange = userPointsTotals.filter(userPoints => {
                const total = userPoints._sum.points || 0;
                const meetsMin = total >= badge.minPoints;
                const meetsMax = badge.maxPoints === null || total <= badge.maxPoints;
                return meetsMin && meetsMax;
            });

            const rangeLabel = badge.maxPoints
                ? `${badge.minPoints}-${badge.maxPoints}`
                : `${badge.minPoints}+`;

            return {
                range: rangeLabel,
                badgeName: badge.name,
                userCount: usersInRange.length
            };
        });

        return {
            totalPointsAwarded: totalPoints,
            totalUsersWithPoints,
            averagePointsPerUser,
            topUsers,
            distributionByRange: distributionRanges
        };
    } catch (error) {
        console.error('Error in getPointsDistributionReport:', error);
        throw new Error('Failed to fetch points distribution report');
    }
};

module.exports = {
    getUserGrowthReport,
    getCourseCompletionReport,
    getQuizPerformanceReport,
    getDropOffReport,
    getPopularCategoriesReport,
    getRevenueReport,
    getInstructorPerformanceReport,
    getCoursePerformanceReport,
    getBadgeDistributionReport,
    getPointsDistributionReport
};
