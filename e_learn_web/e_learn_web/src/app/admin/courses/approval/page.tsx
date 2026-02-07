'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import Modal from '@/components/admin/ui/Modal';

export default function CourseApprovalPage() {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionNotes, setRejectionNotes] = useState('');

    const courses = [
        {
            id: 1,
            name: 'Blockchain Development Basics',
            instructor: 'Alex Martinez',
            instructorEmail: 'alex.m@example.com',
            submittedDate: '2026-02-05',
            status: 'under-review',
            lessonsCount: 12,
            duration: '8 hours',
        },
        {
            id: 2,
            name: 'iOS App Development',
            instructor: 'Jennifer Lee',
            instructorEmail: 'jennifer.l@example.com',
            submittedDate: '2026-02-06',
            status: 'under-review',
            lessonsCount: 15,
            duration: '10 hours',
        },
        {
            id: 3,
            name: 'Digital Marketing 101',
            instructor: 'Michael Brown',
            instructorEmail: 'michael.b@example.com',
            submittedDate: '2026-02-04',
            status: 'approved',
            lessonsCount: 8,
            duration: '5 hours',
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Course Name',
            render: (value: string, row: any) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                        {value}
                    </div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', marginTop: '0.25rem' }}>
                        {row.lessonsCount} lessons • {row.duration}
                    </div>
                </div>
            ),
        },
        {
            key: 'instructor',
            label: 'Instructor',
            render: (value: string, row: any) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)' }}>{value}</div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                        {row.instructorEmail}
                    </div>
                </div>
            ),
        },
        {
            key: 'submittedDate',
            label: 'Submitted',
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusPill status={value as any} />,
        },
    ];

    const actions = [
        {
            label: 'Review',
            icon: '📋',
            variant: 'primary' as const,
            onClick: (row: any) => {
                setSelectedCourse(row);
                setIsModalOpen(true);
            },
        },
    ];

    const handleApprove = () => {
        alert(`Approved: ${selectedCourse?.name}`);
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

    const handleReject = () => {
        if (!rejectionNotes.trim()) {
            alert('Rejection notes are mandatory');
            return;
        }
        alert(`Rejected: ${selectedCourse?.name}\nNotes: ${rejectionNotes}`);
        setIsModalOpen(false);
        setSelectedCourse(null);
        setRejectionNotes('');
    };

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
                <button className="admin-btn admin-btn-primary admin-btn-sm">Under Review (2)</button>
                <button className="admin-btn admin-btn-secondary admin-btn-sm">Approved (1)</button>
                <button className="admin-btn admin-btn-secondary admin-btn-sm">Rejected (0)</button>
                <button className="admin-btn admin-btn-secondary admin-btn-sm">All Courses (3)</button>
            </div>

            {/* Courses Table */}
            <DataTable columns={columns} data={courses} actions={actions} emptyMessage="No courses pending approval" />

            {/* Review Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCourse(null);
                    setRejectionNotes('');
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
                                {selectedCourse.name}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-space-md)' }}>
                                <div>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Instructor:</strong> {selectedCourse.instructor}
                                    </p>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Email:</strong> {selectedCourse.instructorEmail}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Lessons:</strong> {selectedCourse.lessonsCount}
                                    </p>
                                    <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                        <strong>Duration:</strong> {selectedCourse.duration}
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
                                Review Notes {selectedCourse.status === 'under-review' && '(Mandatory for rejection)'}
                            </label>
                            <textarea
                                className="admin-textarea"
                                value={rejectionNotes}
                                onChange={(e) => setRejectionNotes(e.target.value)}
                                placeholder="Enter your review notes here..."
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
                            >
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={handleReject}>
                                Reject Course
                            </button>
                            <button className="admin-btn admin-btn-success" onClick={handleApprove}>
                                Approve Course
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
