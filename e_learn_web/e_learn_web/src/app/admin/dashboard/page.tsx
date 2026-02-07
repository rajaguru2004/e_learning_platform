import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/ui/StatsCard';

export default function DashboardPage() {
    return (
        <AdminLayout pageTitle="Dashboard - Command Center">
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
                    value="2,847"
                    subtitle="Admin: 5 | Instructors: 42 | Learners: 2,800"
                    icon="👥"
                    color="blue"
                />

                <StatsCard
                    title="Total Courses"
                    value="156"
                    subtitle="Published: 128 | Draft: 18 | Archived: 10"
                    icon="📚"
                    color="blue"
                />

                <StatsCard
                    title="Active Enrollments"
                    value="8,943"
                    subtitle="↑ 12% from last month"
                    icon="📝"
                    color="mint"
                />

                <StatsCard
                    title="Courses in Progress"
                    value="4,521"
                    subtitle="50.6% completion rate"
                    icon="⏳"
                    color="mint"
                />

                <StatsCard
                    title="Total Points Awarded"
                    value="1.2M"
                    subtitle="Gamification engagement: High"
                    icon="🎯"
                    color="yellow"
                />

                <StatsCard
                    title="Average Platform Rating"
                    value="4.7"
                    subtitle="Based on 3,429 reviews"
                    icon="⭐"
                    color="yellow"
                />

                <StatsCard
                    title="Total Revenue"
                    value="$47,890"
                    subtitle="↑ 8.3% from last month"
                    icon="💰"
                    color="mint"
                />

                <StatsCard
                    title="New Users (30d)"
                    value="342"
                    subtitle="↑ 15.2% growth rate"
                    icon="📈"
                    color="mint"
                />
            </div>

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
        </AdminLayout>
    );
}
