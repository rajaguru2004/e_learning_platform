'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/ui/StatsCard';
import { fetchDashboardData } from '@/lib/api';
import { DashboardData } from '@/types/dashboard';
import { isInstructor } from '@/lib/auth';

export default function DashboardPage() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isInstructor()) {
            router.push('/admin/instructor/dashboard');
            return;
        }

        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetchDashboardData();
                setDashboardData(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
                console.error('Error loading dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Helper function to format numbers
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    // Helper function to format currency
    const formatCurrency = (num: number): string => {
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <AdminLayout pageTitle="Dashboard - Command Center">
            {/* Loading State */}
            {isLoading && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: 'var(--admin-text-lg)',
                    color: 'var(--admin-text-secondary)',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--admin-space-lg)',
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(31, 60, 136, 0.1)',
                            borderTopColor: 'var(--admin-primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}></div>
                        <span>Loading dashboard data...</span>
                    </div>
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div style={{
                    padding: 'var(--admin-space-2xl)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--admin-radius-lg)',
                    color: '#dc2626',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--admin-space-md)' }}>⚠️</div>
                    <h3 style={{ fontSize: 'var(--admin-text-lg)', fontWeight: 'var(--admin-font-semibold)', marginBottom: 'var(--admin-space-sm)' }}>
                        Error Loading Dashboard
                    </h3>
                    <p style={{ fontSize: 'var(--admin-text-base)' }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 'var(--admin-space-lg)',
                            padding: 'var(--admin-space-sm) var(--admin-space-xl)',
                            backgroundColor: 'var(--admin-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--admin-radius-md)',
                            fontSize: 'var(--admin-text-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            cursor: 'pointer',
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Success State - Show Dashboard */}
            {dashboardData && !isLoading && !error && (
                <>
                    {/* Stats Grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'var(--admin-space-xl)',
                            marginBottom: 'var(--admin-space-2xl)',
                        }}
                    >
                        <StatsCard
                            title="Total Users"
                            value={dashboardData.users.total.toString()}
                            subtitle={`Active: ${dashboardData.users.active} | Inactive: ${dashboardData.users.inactive}`}
                            icon="👥"
                            color="blue"
                        />

                        <StatsCard
                            title="Total Courses"
                            value={dashboardData.courses.total.toString()}
                            subtitle={`Published: ${dashboardData.courses.byStatus.published} | Draft: ${dashboardData.courses.byStatus.draft} | Archived: ${dashboardData.courses.byStatus.archived}`}
                            icon="📚"
                            color="blue"
                        />

                        <StatsCard
                            title="Active Enrollments"
                            value={dashboardData.enrollments.byStatus.active.toString()}
                            subtitle={`Total enrollments: ${dashboardData.enrollments.total}`}
                            icon="📝"
                            color="mint"
                        />

                        <StatsCard
                            title="Courses in Progress"
                            value={dashboardData.progress.inProgress.toString()}
                            subtitle={`${dashboardData.progress.avgCompletionPercent.toFixed(1)}% avg completion`}
                            icon="⏳"
                            color="mint"
                        />

                        <StatsCard
                            title="Total Points Awarded"
                            value={formatNumber(dashboardData.points.totalPoints)}
                            subtitle={`This month: ${formatNumber(dashboardData.points.thisMonthPoints)}`}
                            icon="🎯"
                            color="yellow"
                        />

                        <StatsCard
                            title="Average Platform Rating"
                            value={dashboardData.ratings.avgPlatformRating.toFixed(1)}
                            subtitle={`Based on ${dashboardData.ratings.totalReviews} reviews`}
                            icon="⭐"
                            color="yellow"
                        />

                        <StatsCard
                            title="Total Revenue"
                            value={formatCurrency(dashboardData.revenue.totalRevenue)}
                            subtitle={`This month: ${formatCurrency(dashboardData.revenue.thisMonthRevenue)}`}
                            icon="💰"
                            color="mint"
                        />

                        <StatsCard
                            title="Payment Success Rate"
                            value={`${dashboardData.revenue.successfulPayments}/${dashboardData.revenue.successfulPayments + dashboardData.revenue.failedPayments}`}
                            subtitle={`${dashboardData.revenue.failedPayments} failed payments`}
                            icon="📈"
                            color="mint"
                        />
                    </div>

                    {/* Top Courses Section */}
                    {dashboardData.ratings.topCourses.length > 0 && (
                        <div className="admin-card" style={{ marginBottom: 'var(--admin-space-2xl)' }}>
                            <h3 style={{
                                fontSize: 'var(--admin-text-xl)',
                                fontWeight: 'var(--admin-font-semibold)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}>
                                ⭐ Top Rated Courses
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-md)' }}>
                                {dashboardData.ratings.topCourses.map((course) => (
                                    <div key={course.id} style={{
                                        padding: 'var(--admin-space-lg)',
                                        backgroundColor: 'rgba(31, 60, 136, 0.03)',
                                        borderRadius: 'var(--admin-radius-md)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <div>
                                            <h4 style={{
                                                fontSize: 'var(--admin-text-base)',
                                                fontWeight: 'var(--admin-font-medium)',
                                                color: 'var(--admin-text-primary)',
                                                marginBottom: 'var(--admin-space-xs)',
                                            }}>
                                                {course.title}
                                            </h4>
                                            <p style={{
                                                fontSize: 'var(--admin-text-sm)',
                                                color: 'var(--admin-text-secondary)',
                                            }}>
                                                Instructor: {course.instructorName}
                                            </p>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--admin-space-sm)',
                                        }}>
                                            <span style={{
                                                fontSize: 'var(--admin-text-lg)',
                                                fontWeight: 'var(--admin-font-semibold)',
                                                color: 'var(--admin-warning)',
                                            }}>
                                                ⭐ {course.rating.toFixed(1)}
                                            </span>
                                            <span style={{
                                                fontSize: 'var(--admin-text-sm)',
                                                color: 'var(--admin-text-secondary)',
                                            }}>
                                                ({course.reviewCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Growth Trends Placeholder */}
                    <div className="admin-card">
                        <div
                            style={{
                                padding: 'var(--admin-space-3xl)',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, rgba(31, 60, 136, 0.03) 0%, rgba(46, 196, 182, 0.03) 100%)',
                                borderRadius: 'var(--admin-radius-lg)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '3rem',
                                    marginBottom: 'var(--admin-space-lg)',
                                }}
                            >
                                📊
                            </div>
                            <h3
                                style={{
                                    fontSize: 'var(--admin-text-xl)',
                                    fontWeight: 'var(--admin-font-semibold)',
                                    color: 'var(--admin-text-primary)',
                                    marginBottom: 'var(--admin-space-sm)',
                                }}
                            >
                                Growth Trends & Analytics
                            </h3>
                            <p
                                style={{
                                    fontSize: 'var(--admin-text-base)',
                                    color: 'var(--admin-text-secondary)',
                                }}
                            >
                                Advanced analytics and trending data visualization coming soon
                            </p>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
