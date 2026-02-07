'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import Modal from '@/components/admin/ui/Modal';
import { fetchCourses, fetchCourseEnrollments, manualEnrollUser, fetchUsers } from '@/lib/api';
import { Enrollment } from '@/types/enrollments';
import { Course } from '@/types/courses';
import { User } from '@/types/users';

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manual enrollment form state
    const [enrollUserId, setEnrollUserId] = useState('');
    const [accessDurationType, setAccessDurationType] = useState<'LIFETIME' | 'FIXED_DAYS'>('LIFETIME');
    const [durationDays, setDurationDays] = useState(90);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadEnrollments();
        }
    }, [selectedCourseId]);

    const loadCourses = async () => {
        try {
            const response = await fetchCourses(1, 100, 'PUBLISHED');
            setCourses(response.data.courses);
            if (response.data.courses.length > 0 && !selectedCourseId) {
                setSelectedCourseId(response.data.courses[0].id);
            }
        } catch (err: any) {
            console.error('Error loading courses:', err);
        }
    };

    const loadEnrollments = async () => {
        if (!selectedCourseId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetchCourseEnrollments(selectedCourseId, 1, 100);
            setEnrollments(response.data.enrollments);
        } catch (err: any) {
            setError(err.message || 'Failed to load enrollments');
            console.error('Error loading enrollments:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await fetchUsers(1, 100, 'LEARNER', 'active');
            setUsers(response.data.users);
        } catch (err: any) {
            console.error('Error loading users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleOpenEnrollModal = () => {
        setIsEnrollModalOpen(true);
        loadUsers();
    };

    const handleManualEnroll = async () => {
        if (!enrollUserId.trim()) {
            alert('⚠️ Please enter a User ID');
            return;
        }

        if (!selectedCourseId) {
            alert('⚠️ Please select a course');
            return;
        }

        try {
            setIsSubmitting(true);
            const enrollData = {
                user_id: enrollUserId,
                access_duration_type: accessDurationType,
                ...(accessDurationType === 'FIXED_DAYS' && { duration_days: durationDays }),
            };

            await manualEnrollUser(selectedCourseId, enrollData);
            alert('✅ User enrolled successfully!');
            setIsEnrollModalOpen(false);
            setEnrollUserId('');
            setAccessDurationType('LIFETIME');
            setDurationDays(90);
            loadEnrollments(); // Refresh the list
        } catch (err: any) {
            alert(`❌ Failed to enroll user: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'user',
            label: 'Learner',
            render: (value: any) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)' }}>{value.name}</div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                        {value.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'course',
            label: 'Course',
            render: (value: any) => value.title,
        },
        {
            key: 'enrolled_at',
            label: 'Enrolled',
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'expires_at',
            label: 'Access Expiry',
            render: (value: string | null) => (
                <span
                    style={{
                        color: !value ? 'var(--admin-mint-green)' : 'var(--admin-text-primary)',
                        fontWeight: !value ? 'var(--admin-font-medium)' : 'normal',
                    }}
                >
                    {!value ? 'Lifetime' : new Date(value).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'progress_percent',
            label: 'Progress',
            render: (value: number) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-sm)' }}>
                    <div
                        style={{
                            flex: 1,
                            height: '8px',
                            background: 'var(--admin-bg-secondary)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${value}%`,
                                height: '100%',
                                background: 'var(--admin-mint-green)',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <span style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', minWidth: '40px' }}>
                        {value}%
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => {
                const statusMap: Record<string, 'active' | 'inactive'> = {
                    'ENROLLED': 'active',
                    'COMPLETED': 'active',
                    'EXPIRED': 'inactive',
                    'CANCELLED': 'inactive',
                };
                return <StatusPill status={statusMap[value] || 'active'} />;
            },
        },
        {
            key: 'payment_status',
            label: 'Payment',
            render: (value: string | null) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'SUCCESS' ? 'rgba(46, 196, 182, 0.1)' : 'rgba(244, 196, 48, 0.1)',
                        color: value === 'SUCCESS' ? 'var(--admin-mint-green)' : 'var(--admin-reward-yellow)',
                    }}
                >
                    {value || 'FREE'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Extend Access',
            icon: '⏰',
            onClick: (row: any) => alert(`Extend access: ${row.user.name} - ${row.course.title}`),
        },
        {
            label: 'View Details',
            icon: '📊',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`View details: ${row.user.name}`),
        },
        {
            label: 'Remove Enrollment',
            icon: '❌',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Remove: ${row.user.name} from ${row.course.title}`),
        },
    ];

    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    return (
        <AdminLayout
            pageTitle="Enrollment Management"
            headerActions={
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={handleOpenEnrollModal}
                    disabled={!selectedCourseId}
                >
                    + Manually Enroll User
                </button>
            }
        >
            {/* Course Filter */}
            <div
                className="admin-card"
                style={{
                    marginBottom: 'var(--admin-space-xl)',
                    display: 'flex',
                    gap: 'var(--admin-space-md)',
                    alignItems: 'center',
                }}
            >
                <select
                    className="admin-select"
                    style={{ flex: 1 }}
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                    <option value="">Select a course...</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.title} ({course.total_enrollments} enrollments)
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    Loading enrollments...
                </div>
            ) : error ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)', color: 'var(--admin-danger)' }}>
                    Error: {error}
                    <button
                        className="admin-btn admin-btn-primary"
                        style={{ marginTop: 'var(--admin-space-md)' }}
                        onClick={loadEnrollments}
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Enrollments Table */}
                    <DataTable
                        columns={columns}
                        data={enrollments}
                        actions={actions}
                        emptyMessage={selectedCourseId ? "No enrollments found for this course" : "Please select a course"}
                    />
                </>
            )}

            {/* Manual Enroll Modal */}
            <Modal
                isOpen={isEnrollModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsEnrollModalOpen(false);
                        setEnrollUserId('');
                        setAccessDurationType('LIFETIME');
                        setDurationDays(90);
                    }
                }}
                title="Manually Enroll User"
                size="md"
            >
                <div>
                    <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Course
                        </label>
                        <input
                            type="text"
                            className="admin-input"
                            value={selectedCourse?.title || ''}
                            disabled
                            style={{ background: 'var(--admin-bg-secondary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Select User *
                        </label>
                        {loadingUsers ? (
                            <div style={{ padding: 'var(--admin-space-md)', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                                Loading users...
                            </div>
                        ) : (
                            <select
                                className="admin-select"
                                value={enrollUserId}
                                onChange={(e) => setEnrollUserId(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">Select a user...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Access Duration Type *
                        </label>
                        <select
                            className="admin-select"
                            value={accessDurationType}
                            onChange={(e) => setAccessDurationType(e.target.value as 'LIFETIME' | 'FIXED_DAYS')}
                            disabled={isSubmitting}
                        >
                            <option value="LIFETIME">Lifetime Access</option>
                            <option value="FIXED_DAYS">Fixed Days</option>
                        </select>
                    </div>

                    {accessDurationType === 'FIXED_DAYS' && (
                        <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 'var(--admin-text-sm)',
                                    fontWeight: 'var(--admin-font-medium)',
                                    color: 'var(--admin-text-primary)',
                                    marginBottom: 'var(--admin-space-sm)',
                                }}
                            >
                                Duration (Days) *
                            </label>
                            <input
                                type="number"
                                className="admin-input"
                                value={durationDays}
                                onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                                min="1"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--admin-space-md)', justifyContent: 'flex-end' }}>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => {
                                setIsEnrollModalOpen(false);
                                setEnrollUserId('');
                                setAccessDurationType('LIFETIME');
                                setDurationDays(90);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={handleManualEnroll}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enrolling...' : 'Enroll User'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
