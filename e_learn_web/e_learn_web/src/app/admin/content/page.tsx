'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';

export default function ContentPage() {
    const content = [
        {
            id: 1,
            courseName: 'Introduction to Python Programming',
            lessonName: 'Variables and Data Types',
            type: 'Video',
            provider: 'YouTube',
            hasAttachments: true,
            instructor: 'Sarah Johnson',
        },
        {
            id: 2,
            courseName: 'Introduction to Python Programming',
            lessonName: 'Control Flow Quiz',
            type: 'Quiz',
            provider: 'Platform',
            hasAttachments: false,
            instructor: 'Sarah Johnson',
            quizQuestions: 10,
            rewardPoints: 50,
        },
        {
            id: 3,
            courseName: 'Web Development Bootcamp',
            lessonName: 'HTML Basics',
            type: 'Document',
            provider: 'Platform',
            hasAttachments: true,
            instructor: 'Sarah Johnson',
        },
        {
            id: 4,
            courseName: 'Advanced Machine Learning',
            lessonName: 'Neural Networks Explained',
            type: 'Video',
            provider: 'Vimeo',
            hasAttachments: true,
            instructor: 'Robert Wilson',
        },
    ];

    const columns = [
        {
            key: 'courseName',
            label: 'Course',
            render: (value: string, row: any) => (
                <div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)' }}>
                        {value}
                    </div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                        {row.lessonName}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (value: string) => {
                const typeIcons: Record<string, string> = {
                    Video: '🎥',
                    Quiz: '📝',
                    Document: '📄',
                    Image: '🖼️',
                };
                return (
                    <span
                        className="admin-pill"
                        style={{
                            background: 'rgba(31, 60, 136, 0.1)',
                            color: 'var(--admin-primary-blue)',
                        }}
                    >
                        {typeIcons[value]} {value}
                    </span>
                );
            },
        },
        {
            key: 'provider',
            label: 'Provider',
        },
        {
            key: 'hasAttachments',
            label: 'Attachments',
            render: (value: boolean) =>
                value ? (
                    <span style={{ color: 'var(--admin-mint-green)' }}>✓ Yes</span>
                ) : (
                    <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                ),
        },
        {
            key: 'instructor',
            label: 'Instructor',
        },
    ];

    const actions = [
        {
            label: 'View Details',
            icon: '👁️',
            onClick: (row: any) => alert(`View: ${row.lessonName}`),
        },
        {
            label: 'View Quiz Structure',
            icon: '📋',
            onClick: (row: any) => {
                if (row.type === 'Quiz') {
                    alert(`Quiz: ${row.lessonName}\nQuestions: ${row.quizQuestions}\nReward: ${row.rewardPoints} points`);
                }
            },
        },
        {
            label: 'Reset Quiz Attempts',
            icon: '🔄',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Reset attempts for: ${row.lessonName}`),
        },
        {
            label: 'Delete Content',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Delete: ${row.lessonName}`),
        },
    ];

    return (
        <AdminLayout pageTitle="Content & Quiz Oversight">
            {/* Filters */}
            <div
                className="admin-card"
                style={{
                    marginBottom: 'var(--admin-space-xl)',
                    display: 'flex',
                    gap: 'var(--admin-space-md)',
                }}
            >
                <select className="admin-select" style={{ flex: 1 }}>
                    <option>All Courses</option>
                    <option>Introduction to Python Programming</option>
                    <option>Advanced Machine Learning</option>
                    <option>Web Development Bootcamp</option>
                </select>
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Types</option>
                    <option>Video</option>
                    <option>Quiz</option>
                    <option>Document</option>
                    <option>Image</option>
                </select>
            </div>

            {/* Content Table */}
            <DataTable columns={columns} data={content} actions={actions} />
        </AdminLayout>
    );
}
