'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusPill from '@/components/admin/ui/StatusPill';
import { fetchInstructorStats } from '@/lib/api';
import { isInstructor } from '@/lib/auth';
import { InstructorStatsData, EnrichedInstructorCourse } from '@/types/instructor';

export default function InstructorStatsPage() {
    const router = useRouter();
    const [stats, setStats] = useState<InstructorStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

    // Role-based access control
    useEffect(() => {
        if (!isInstructor()) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchInstructorStats();
            setStats(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load enrollment statistics');
            console.error('Error loading stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCourseDetails = (courseId: string) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
    };

    if (!isInstructor()) {
        return null;
    }

    if (loading && !stats) {
        return (
            <AdminLayout pageTitle="Enrollment & Revenue Stats">
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto var(--admin-space-md)' }}></div>
                    <p style={{ color: 'var(--admin-text-secondary)' }}>Loading your performance data...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout pageTitle="Enrollment & Revenue Stats">
                <div
                    className="admin-card"
                    style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)', color: 'var(--admin-danger)' }}
                >
                    <p style={{ fontSize: '1.5rem', marginBottom: 'var(--admin-space-md)' }}>⚠️</p>
                    <p>Error: {error}</p>
                    <button
                        className="admin-btn admin-btn-primary"
                        style={{ marginTop: 'var(--admin-space-md)' }}
                        onClick={loadStats}
                    >
                        Retry
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Enrollment & Revenue Stats">
            {/* Summary Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'var(--admin-space-lg)',
                    marginBottom: 'var(--admin-space-2xl)',
                }}
            >
                <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(31, 60, 136, 0.1)', color: 'var(--admin-primary-blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                    }}>
                        📚
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Courses</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)' }}>{stats?.summary.total_courses || 0}</h2>
                    </div>
                </div>

                <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--admin-success)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                    }}>
                        👥
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)' }}>{stats?.summary.total_students || 0}</h2>
                    </div>
                </div>

                <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(245, 158, 11, 0.1)', color: 'var(--admin-warning)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                    }}>
                        💰
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)' }}>
                            ₹{(stats?.summary.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Courses Table */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 'var(--admin-space-xl)', borderBottom: '1px solid var(--admin-border-light)' }}>
                    <h3 style={{ fontSize: 'var(--admin-text-lg)', fontWeight: 'var(--admin-font-semibold)' }}>Course Performance Breakdown</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--admin-bg-secondary)', borderBottom: '1px solid var(--admin-border-light)' }}>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Course</th>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Status</th>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Price</th>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Students</th>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Revenue</th>
                                <th style={{ padding: 'var(--admin-space-lg)', fontSize: 'var(--admin-text-xs)', textTransform: 'uppercase', color: 'var(--admin-text-secondary)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.courses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: 'var(--admin-space-2xl)', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                                        No courses found
                                    </td>
                                </tr>
                            ) : (
                                stats?.courses.map((course) => (
                                    <React.Fragment key={course.id}>
                                        <tr
                                            style={{
                                                borderBottom: '1px solid var(--admin-border-light)',
                                                transition: 'background 0.2s',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => toggleCourseDetails(course.id)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: 'var(--admin-space-lg)' }}>
                                                <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>{course.title}</div>
                                                <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>{course.slug}</div>
                                            </td>
                                            <td style={{ padding: 'var(--admin-space-lg)' }}>
                                                <StatusPill status={course.statusCode.toLowerCase().replace('_', '-') as any} />
                                            </td>
                                            <td style={{ padding: 'var(--admin-space-lg)', color: 'var(--admin-text-primary)' }}>
                                                ₹{parseFloat(course.price).toFixed(2)}
                                            </td>
                                            <td style={{ padding: 'var(--admin-space-lg)', color: 'var(--admin-text-primary)' }}>
                                                {course.student_count}
                                            </td>
                                            <td style={{ padding: 'var(--admin-space-lg)', fontWeight: 'var(--admin-font-semibold)', color: 'var(--admin-success)' }}>
                                                ₹{course.revenue.toFixed(2)}
                                            </td>
                                            <td style={{ padding: 'var(--admin-space-lg)', textAlign: 'right' }}>
                                                <button
                                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                                    style={{ border: 'none', background: 'transparent', fontSize: '1.25rem' }}
                                                >
                                                    {expandedCourse === course.id ? '🔼' : '🔽'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedCourse === course.id && (
                                            <tr style={{ background: 'var(--admin-bg-secondary)' }}>
                                                <td colSpan={6} style={{ padding: 'var(--admin-space-xl)' }}>
                                                    <div className="admin-card" style={{ padding: 'var(--admin-space-lg)', background: 'var(--admin-bg-surface)' }}>
                                                        <h4 style={{ marginBottom: 'var(--admin-space-md)', fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-semibold)' }}>Enrolled Students Details</h4>
                                                        {course.enrollments.length === 0 ? (
                                                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>No students enrolled in this course yet.</p>
                                                        ) : (
                                                            <table style={{ width: '100%', fontSize: 'var(--admin-text-sm)', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--admin-border-light)' }}>
                                                                        <th style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>Student Name</th>
                                                                        <th style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>Email</th>
                                                                        <th style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>Enrolled Date</th>
                                                                        <th style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>Payment Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {course.enrollments.map((enr, index) => (
                                                                        <tr key={enr.id} style={{ borderBottom: index === course.enrollments.length - 1 ? 'none' : '1px solid var(--admin-border-light)' }}>
                                                                            <td style={{ padding: 'var(--admin-space-md)', color: 'var(--admin-text-primary)' }}>{enr.user.name}</td>
                                                                            <td style={{ padding: 'var(--admin-space-md)', color: 'var(--admin-text-secondary)' }}>{enr.user.email}</td>
                                                                            <td style={{ padding: 'var(--admin-space-md)', color: 'var(--admin-text-secondary)' }}>{new Date(enr.enrolled_at).toLocaleDateString()}</td>
                                                                            <td style={{ padding: 'var(--admin-space-md)' }}>
                                                                                <span style={{
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: '12px',
                                                                                    fontSize: 'var(--admin-text-xs)',
                                                                                    fontWeight: 'var(--admin-font-medium)',
                                                                                    background: enr.payment_status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                                    color: enr.payment_status === 'SUCCESS' ? 'var(--admin-success)' : 'var(--admin-danger)'
                                                                                }}>
                                                                                    {enr.payment_status}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
