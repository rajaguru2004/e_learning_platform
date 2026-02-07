'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import Modal from '@/components/admin/ui/Modal';
import { fetchCourses, approveCourse, rejectCourse } from '@/lib/api';
import { Course } from '@/types/courses';

export default function CourseApprovalPage() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('UNDER_REVIEW');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCourses();
    }, [statusFilter]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCourses(1, 100, statusFilter);
            setCourses(response.data.courses);
        } catch (err: any) {
            setError(err.message || 'Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedCourse) return;

        try {
            setIsSubmitting(true);
            await approveCourse(selectedCourse.id);
            alert(`✅ Course "${selectedCourse.title}" has been approved successfully!`);
            setIsModalOpen(false);
            setSelectedCourse(null);
            loadCourses(); // Refresh the list
        } catch (err: any) {
            alert(`❌ Failed to approve course: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedCourse) return;

        if (!rejectionNotes.trim()) {
            alert('⚠️ Rejection notes are mandatory');
            return;
        }

        try {
            setIsSubmitting(true);
            await rejectCourse(selectedCourse.id, rejectionNotes);
            alert(`❌ Course "${selectedCourse.title}" has been rejected.`);
            setIsModalOpen(false);
            setSelectedCourse(null);
            setRejectionNotes('');
            loadCourses(); // Refresh the list
        } catch (err: any) {
            alert(`❌ Failed to reject course: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Course Name',
            render: (value: string, row: Course) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                        {value}
                    </div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', marginTop: '0.25rem' }}>
                        {row.total_enrollments} enrollments • ${row.price}
                    </div>
                </div>
            ),
        },
        {
            key: 'instructor',
            label: 'Instructor',
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
            key: 'created_at',
            label: 'Submitted',
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => {
                const statusMap: Record<string, 'published' | 'draft' | 'under-review' | 'archived'> = {
                    'PUBLISHED': 'published',
                    'DRAFT': 'draft',
                    'UNDER_REVIEW': 'under-review',
                    'ARCHIVED': 'archived',
                };
                return <StatusPill status={statusMap[value] || 'draft'} />;
            },
        },
    ];

    const actions = [
        {
            label: 'Review',
            icon: '📋',
            variant: 'primary' as const,
            onClick: (row: Course) => {
                setSelectedCourse(row);
                setIsModalOpen(true);
            },
        },
    ];

    const courseCounts = {
        underReview: courses.filter(c => c.status === 'UNDER_REVIEW').length,
        published: courses.filter(c => c.status === 'PUBLISHED').length,
        draft: courses.filter(c => c.status === 'DRAFT').length,
        all: courses.length,
    };

    if (loading) {
        return (
            <AdminLayout pageTitle="Course Approval Workflow">
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    Loading courses...
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout pageTitle="Course Approval Workflow">
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)', color: 'var(--admin-danger)' }}>
                    Error: {error}
                    <button
                        className="admin-btn admin-btn-primary"
                        style={{ marginTop: 'var(--admin-space-md)' }}
                        onClick={loadCourses}
                    >
                        Retry
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Course Approval Workflow">
            {/* Status Filter */}
            <div
                className="admin-card"
                style={{
                    marginBottom: 'var(--admin-space-xl)',
                    display: 'flex',
                    gap: 'var(--admin-space-md)',
                }}
            >
                <button
                    className={`admin-btn ${statusFilter === 'UNDER_REVIEW' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setStatusFilter('UNDER_REVIEW')}
                >
                    Under Review ({courseCounts.underReview})
                </button>
                <button
                    className={`admin-btn ${statusFilter === 'PUBLISHED' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setStatusFilter('PUBLISHED')}
                >
                    Published ({courseCounts.published})
                </button>
                <button
                    className={`admin-btn ${statusFilter === 'DRAFT' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setStatusFilter('DRAFT')}
                >
                    Draft ({courseCounts.draft})
                </button>
                <button
                    className={`admin-btn ${statusFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setStatusFilter('all')}
                >
                    All Courses ({courseCounts.all})
                </button>
            </div>

            {/* Courses Table */}
            <DataTable columns={columns} data={courses} actions={actions} emptyMessage="No courses pending approval" />

            {/* Review Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setSelectedCourse(null);
                        setRejectionNotes('');
                    }
                }}
                title="Course Review"
                size="lg"
            >
                {selectedCourse && (
                    <div>
                        {/* Course Summary */}
                        <div style={{ marginBottom: 'var(--admin-space-2xl)' }}>
                            <h3
                                style={{
                                    fontSize: 'var(--admin-text-xl)',
                                    fontWeight: 'var(--admin-font-semibold)',
                                    marginBottom: 'var(--admin-space-sm)',
                                }}
                            >
                                {selectedCourse.title}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-space-md)' }}>
                                <div>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Instructor:</strong> {selectedCourse.instructor.name}
                                    </p>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Email:</strong> {selectedCourse.instructor.email}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Price:</strong> ${selectedCourse.price}
                                    </p>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Enrollments:</strong> {selectedCourse.total_enrollments}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review Notes */}
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
                                Review Notes {selectedCourse.status === 'UNDER_REVIEW' && '(Mandatory for rejection)'}
                            </label>
                            <textarea
                                className="admin-textarea"
                                value={rejectionNotes}
                                onChange={(e) => setRejectionNotes(e.target.value)}
                                placeholder="Enter your review notes here..."
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--admin-space-md)', justifyContent: 'flex-end' }}>
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setRejectionNotes('');
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-danger"
                                onClick={handleReject}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Rejecting...' : 'Reject Course'}
                            </button>
                            <button
                                className="admin-btn admin-btn-success"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Approving...' : 'Approve Course'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
