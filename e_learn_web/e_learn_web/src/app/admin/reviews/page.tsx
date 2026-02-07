'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export default function ReviewsPage() {
    const reviews = [
        {
            id: 1,
            courseName: 'Introduction to Python Programming',
            userName: 'John Smith',
            rating: 5,
            comment: 'Excellent course! Learned a lot from this.',
            date: '2026-02-06',
            status: 'approved',
        },
        {
            id: 2,
            courseName: 'Advanced Machine Learning',
            userName: 'Emily Chen',
            rating: 4,
            comment: 'Great content but could use more practical examples.',
            date: '2026-02-05',
            status: 'approved',
        },
        {
            id: 3,
            courseName: 'Web Development Bootcamp',
            userName: 'Mike Davis',
            rating: 1,
            comment: 'This course is terrible and a waste of money!',
            date: '2026-02-07',
            status: 'under-review',
        },
    ];

    const columns = [
        {
            key: 'courseName',
            label: 'Course',
            render: (value: string, row: any) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)' }}>{value}</div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                        by {row.userName}
                    </div>
                </div>
            ),
        },
        {
            key: 'rating',
            label: 'Rating',
            render: (value: number) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <span
                            key={i}
                            style={{
                                color: i < value ? 'var(--admin-reward-yellow)' : 'var(--admin-border-medium)',
                                fontSize: 'var(--admin-text-lg)',
                            }}
                        >
                            ★
                        </span>
                    ))}
                    <span style={{ marginLeft: 'var(--admin-space-sm)', fontWeight: 'var(--admin-font-semibold)' }}>
                        {value}/5
                    </span>
                </div>
            ),
        },
        {
            key: 'comment',
            label: 'Comment',
            render: (value: string) => (
                <div
                    style={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value}
                </div>
            ),
        },
        {
            key: 'date',
            label: 'Date',
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
            label: 'Approve',
            icon: '✅',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Approve review from ${row.userName}`),
        },
        {
            label: 'Reject',
            icon: '❌',
            onClick: (row: any) => alert(`Reject review from ${row.userName}`),
        },
        {
            label: 'Delete (Abusive)',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Delete abusive review from ${row.userName}`),
        },
        {
            label: 'Block User Reviews',
            icon: '🚫',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Block ${row.userName} from posting reviews`),
        },
    ];

    return (
        <AdminLayout pageTitle="Review Moderation">
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
                    <option>All Ratings</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                    <option>2 Stars</option>
                    <option>1 Star</option>
                </select>
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Statuses</option>
                    <option>Approved</option>
                    <option>Under Review</option>
                    <option>Rejected</option>
                </select>
            </div>

            {/* Reviews Table */}
            <DataTable columns={columns} data={reviews} actions={actions} />
        </AdminLayout>
    );
}
