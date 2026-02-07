'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/ui/StatsCard';
import {
    fetchUserGrowthReport,
    fetchCourseCompletionReport,
    fetchQuizPerformanceReport,
    fetchDropoffRateReport,
    fetchPopularCategoriesReport,
    fetchRevenueReport
} from '@/lib/api';
import {
    UserGrowthData,
    CourseCompletionData,
    QuizPerformanceData,
    DropoffRateData,
    PopularCategoriesData,
    RevenueData
} from '@/types/analytics';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Analytics data states
    const [userGrowth, setUserGrowth] = useState<UserGrowthData | null>(null);
    const [courseCompletion, setCourseCompletion] = useState<CourseCompletionData | null>(null);
    const [quizPerformance, setQuizPerformance] = useState<QuizPerformanceData | null>(null);
    const [dropoffRate, setDropoffRate] = useState<DropoffRateData | null>(null);
    const [popularCategories, setPopularCategories] = useState<PopularCategoriesData | null>(null);
    const [revenue, setRevenue] = useState<RevenueData | null>(null);

    const fetchAllData = async () => {
        try {
            setError(null);

            // Fetch all analytics data in parallel
            const [
                userGrowthRes,
                courseCompletionRes,
                quizPerformanceRes,
                dropoffRateRes,
                popularCategoriesRes,
                revenueRes
            ] = await Promise.all([
                fetchUserGrowthReport('monthly'),
                fetchCourseCompletionReport(),
                fetchQuizPerformanceReport(),
                fetchDropoffRateReport(),
                fetchPopularCategoriesReport(),
                fetchRevenueReport('monthly')
            ]);

            setUserGrowth(userGrowthRes.data);
            setCourseCompletion(courseCompletionRes.data);
            setQuizPerformance(quizPerformanceRes.data);
            setDropoffRate(dropoffRateRes.data);
            setPopularCategories(popularCategoriesRes.data);
            setRevenue(revenueRes.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAllData();
    };

    // Helper to get top category by enrollments
    const getTopCategory = () => {
        if (!popularCategories || popularCategories.categories.length === 0) {
            return { name: 'N/A', enrollments: 0 };
        }

        const sorted = [...popularCategories.categories].sort(
            (a, b) => b.totalEnrollments - a.totalEnrollments
        );

        return {
            name: sorted[0].categoryName,
            enrollments: sorted[0].totalEnrollments
        };
    };

    const topCategory = getTopCategory();

    return (
        <AdminLayout
            pageTitle="Reporting & Analytics"
            headerActions={
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
                </button>
            }
        >
            {/* Error Message */}
            {error && (
                <div
                    style={{
                        padding: 'var(--admin-space-lg)',
                        marginBottom: 'var(--admin-space-xl)',
                        backgroundColor: '#fee',
                        border: '1px solid #fdd',
                        borderRadius: 'var(--admin-radius-md)',
                        color: '#c33',
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Platform-Level Reports */}
            <div style={{ marginBottom: 'var(--admin-space-3xl)' }}>
                <h2
                    style={{
                        fontSize: 'var(--admin-text-xl)',
                        fontWeight: 'var(--admin-font-semibold)',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    Platform-Level Reports
                </h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--admin-space-xl)',
                    }}
                >
                    <StatsCard
                        title="Total Users"
                        value={loading ? '...' : userGrowth?.totalUsers.toString() || 'N/A'}
                        subtitle={loading ? 'Loading...' : `Period: ${userGrowth?.period || 'monthly'}`}
                        icon="📈"
                        color="mint"
                    />
                    <StatsCard
                        title="Course Completion Rate"
                        value={loading ? '...' : courseCompletion ? `${courseCompletion.completionPercentage.toFixed(2)}%` : 'N/A'}
                        subtitle={
                            loading
                                ? 'Loading...'
                                : courseCompletion
                                    ? `${courseCompletion.completedEnrollments}/${courseCompletion.totalEnrollments} completed`
                                    : 'No data'
                        }
                        icon="✅"
                        color="mint"
                    />
                    <StatsCard
                        title="Avg Quiz Performance"
                        value={
                            loading
                                ? '...'
                                : quizPerformance?.available
                                    ? `${quizPerformance.plannedMetrics?.averageScore || 0}%`
                                    : 'N/A'
                        }
                        subtitle={loading ? 'Loading...' : quizPerformance?.message || 'Not available'}
                        icon="📊"
                        color="blue"
                    />
                    <StatsCard
                        title="Drop-off Rate"
                        value={loading ? '...' : dropoffRate ? `${dropoffRate.dropOffPercentage.toFixed(2)}%` : 'N/A'}
                        subtitle={
                            loading
                                ? 'Loading...'
                                : dropoffRate
                                    ? `${dropoffRate.incompleteEnrollments}/${dropoffRate.totalEnrollments} incomplete`
                                    : 'No data'
                        }
                        icon="📉"
                        color="coral"
                    />
                    <StatsCard
                        title="Popular Category"
                        value={loading ? '...' : topCategory.name}
                        subtitle={loading ? 'Loading...' : `${topCategory.enrollments} enrollments`}
                        icon="💻"
                        color="yellow"
                    />
                    <StatsCard
                        title="Total Revenue (MTD)"
                        value={loading ? '...' : revenue ? `$${revenue.totalRevenue.toFixed(2)}` : 'N/A'}
                        subtitle={
                            loading
                                ? 'Loading...'
                                : revenue
                                    ? `${revenue.successfulPayments} successful payments`
                                    : 'No data'
                        }
                        icon="💰"
                        color="mint"
                    />
                </div>
            </div>

            {/* Drill-Down Reports */}
            <div style={{ marginBottom: 'var(--admin-space-3xl)' }}>
                <h2
                    style={{
                        fontSize: 'var(--admin-text-xl)',
                        fontWeight: 'var(--admin-font-semibold)',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    Drill-Down Reports
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 'var(--admin-space-xl)' }}>
                    {/* Popular Categories */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Popular Categories
                        </h3>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: 'var(--admin-space-xl)' }}>Loading...</p>
                        ) : popularCategories && popularCategories.categories.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Courses</th>
                                        <th>Enrollments</th>
                                        <th>Completion Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {popularCategories.categories
                                        .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
                                        .map((category) => (
                                            <tr key={category.categoryId}>
                                                <td>{category.categoryName}</td>
                                                <td>{category.totalCourses}</td>
                                                <td>{category.totalEnrollments}</td>
                                                <td
                                                    style={{
                                                        color:
                                                            category.completionRate >= 70
                                                                ? 'var(--admin-mint-green)'
                                                                : category.completionRate >= 50
                                                                    ? 'var(--admin-reward-yellow)'
                                                                    : 'inherit',
                                                        fontWeight: 'var(--admin-font-semibold)',
                                                    }}
                                                >
                                                    {category.completionRate.toFixed(0)}%
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ textAlign: 'center', padding: 'var(--admin-space-xl)', color: 'var(--admin-text-muted)' }}>
                                No category data available
                            </p>
                        )}
                    </div>

                    {/* Enrollment Status Breakdown */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Enrollment Status Breakdown
                        </h3>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: 'var(--admin-space-xl)' }}>Loading...</p>
                        ) : courseCompletion && courseCompletion.byStatus.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseCompletion.byStatus.map((status) => (
                                        <tr key={status.status}>
                                            <td style={{ textTransform: 'capitalize' }}>
                                                {status.status.toLowerCase()}
                                            </td>
                                            <td>{status.count}</td>
                                            <td
                                                style={{
                                                    color:
                                                        status.status === 'COMPLETED'
                                                            ? 'var(--admin-mint-green)'
                                                            : 'inherit',
                                                    fontWeight:
                                                        status.status === 'COMPLETED'
                                                            ? 'var(--admin-font-semibold)'
                                                            : 'normal',
                                                }}
                                            >
                                                {status.percentage.toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ textAlign: 'center', padding: 'var(--admin-space-xl)', color: 'var(--admin-text-muted)' }}>
                                No enrollment data available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
