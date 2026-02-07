import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/ui/StatsCard';

export default function AnalyticsPage() {
    return (
        <AdminLayout
            pageTitle="Reporting & Analytics"
            headerActions={
                <button className="admin-btn admin-btn-primary">📥 Export to CSV</button>
            }
        >
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
                    <StatsCard title="User Growth (30d)" value="+342" subtitle="15.2% increase" icon="📈" color="mint" />
                    <StatsCard title="Course Completion Rate" value="68.4%" subtitle="↑ 5.2% from last month" icon="✅" color="mint" />
                    <StatsCard title="Avg Quiz Performance" value="78.5%" subtitle="Platform-wide average" icon="📊" color="blue" />
                    <StatsCard title="Drop-off Rate" value="12.3%" subtitle="↓ 2.1% improvement" icon="📉" color="coral" />
                    <StatsCard title="Popular Category" value="Technology" subtitle="42% of enrollments" icon="💻" color="yellow" />
                    <StatsCard title="Total Revenue (MTD)" value="$47,890" subtitle="↑ 8.3% from last month" icon="💰" color="mint" />
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--admin-space-xl)' }}>
                    {/* Per Instructor Performance */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Top Instructors by Enrollment
                        </h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Instructor</th>
                                    <th>Courses</th>
                                    <th>Enrollments</th>
                                    <th>Avg Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sarah Johnson</td>
                                    <td>8</td>
                                    <td>2,450</td>
                                    <td>⭐ 4.8</td>
                                </tr>
                                <tr>
                                    <td>Robert Wilson</td>
                                    <td>6</td>
                                    <td>1,820</td>
                                    <td>⭐ 4.6</td>
                                </tr>
                                <tr>
                                    <td>Jennifer Lee</td>
                                    <td>5</td>
                                    <td>1,230</td>
                                    <td>⭐ 4.9</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Per Course Performance */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Top Courses by Completion Rate
                        </h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Enrolled</th>
                                    <th>Completed</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Introduction to Python</td>
                                    <td>1,250</td>
                                    <td>980</td>
                                    <td style={{ color: 'var(--admin-mint-green)', fontWeight: 'var(--admin-font-semibold)' }}>78%</td>
                                </tr>
                                <tr>
                                    <td>Web Development Bootcamp</td>
                                    <td>890</td>
                                    <td>645</td>
                                    <td style={{ color: 'var(--admin-mint-green)', fontWeight: 'var(--admin-font-semibold)' }}>72%</td>
                                </tr>
                                <tr>
                                    <td>Machine Learning Advanced</td>
                                    <td>670</td>
                                    <td>420</td>
                                    <td style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>63%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Badge Distribution */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Badge Distribution
                        </h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Badge</th>
                                    <th>Users</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>🥉 Beginner</td>
                                    <td>1,250</td>
                                    <td>44.5%</td>
                                </tr>
                                <tr>
                                    <td>🥈 Silver Star</td>
                                    <td>580</td>
                                    <td>20.6%</td>
                                </tr>
                                <tr>
                                    <td>🏆 Gold Champion</td>
                                    <td>210</td>
                                    <td>7.5%</td>
                                </tr>
                                <tr>
                                    <td>💎 Diamond Elite</td>
                                    <td>42</td>
                                    <td>1.5%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Points Distribution */}
                    <div className="admin-card">
                        <h3
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-semibold)',
                                marginBottom: 'var(--admin-space-lg)',
                            }}
                        >
                            Points Distribution (Top Earners)
                        </h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Points</th>
                                    <th>Badge</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Emily Chen</td>
                                    <td style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>5,200</td>
                                    <td>💎 Diamond</td>
                                </tr>
                                <tr>
                                    <td>Robert Wilson</td>
                                    <td style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>4,850</td>
                                    <td>💎 Diamond</td>
                                </tr>
                                <tr>
                                    <td>Sarah Johnson</td>
                                    <td style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>3,400</td>
                                    <td>💎 Diamond</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
