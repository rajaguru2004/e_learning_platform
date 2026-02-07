'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export default function CoursesPage() {
    const courses = [
        {
            id: 1,
            name: 'Introduction to Python Programming',
            instructor: 'Sarah Johnson',
            status: 'published',
            visibility: 'Public',
            accessType: 'Free',
            lastUpdated: '2026-02-05',
        },
        {
            id: 2,
            name: 'Advanced Machine Learning',
            instructor: 'Robert Wilson',
            status: 'published',
            visibility: 'Public',
            accessType: 'Paid',
            lastUpdated: '2026-02-06',
        },
        {
            id: 3,
            name: 'Web Development Bootcamp',
            instructor: 'Sarah Johnson',
            status: 'draft',
            visibility: 'Private',
            accessType: 'Free',
            lastUpdated: '2026-02-07',
        },
        {
            id: 4,
            name: 'Data Science Fundamentals',
            instructor: 'Robert Wilson',
            status: 'archived',
            visibility: 'Public',
            accessType: 'Paid',
            lastUpdated: '2026-01-20',
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Course Name',
            render: (value: string) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                        {value}
                    </div>
                </div>
            ),
        },
        {
            key: 'instructor',
            label: 'Instructor',
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusPill status={value as any} />,
        },
        {
            key: 'visibility',
            label: 'Visibility',
            render: (value: string) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'Public' ? 'rgba(46, 196, 182, 0.1)' : 'rgba(142, 142, 142, 0.1)',
                        color: value === 'Public' ? 'var(--admin-mint-green)' : 'var(--admin-text-secondary)',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'accessType',
            label: 'Access',
            render: (value: string) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'Paid' ? 'rgba(244, 196, 48, 0.1)' : 'rgba(46, 196, 182, 0.1)',
                        color: value === 'Paid' ? 'var(--admin-reward-yellow)' : 'var(--admin-mint-green)',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'lastUpdated',
            label: 'Last Updated',
            render: (value: string) => (
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: 'var(--admin-text-sm)' }}>
                    {new Date(value).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View Course',
            icon: '👁️',
            onClick: (row: any) => alert(`View: ${row.name}`),
        },
        {
            label: 'Force Publish',
            icon: '✅',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Force publish: ${row.name}`),
        },
        {
            label: 'Force Unpublish',
            icon: '⏸️',
            onClick: (row: any) => alert(`Force unpublish: ${row.name}`),
        },
        {
            label: 'Lock Course',
            icon: '🔒',
            onClick: (row: any) => alert(`Lock: ${row.name}`),
        },
        {
            label: 'Archive',
            icon: '📦',
            onClick: (row: any) => alert(`Archive: ${row.name}`),
        },
        {
            label: 'Delete',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Delete: ${row.name}`),
        },
    ];

    return (
        <AdminLayout
            pageTitle="Course Oversight"
            headerActions={
                <button className="admin-btn admin-btn-primary">
                    + Add Course
                </button>
            }
        >
            {/* Search and Filters */}
            <div
                className="admin-card"
                style={{
                    marginBottom: 'var(--admin-space-xl)',
                    display: 'flex',
                    gap: 'var(--admin-space-md)',
                    alignItems: 'center',
                }}
            >
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="admin-input"
                    style={{ flex: 1 }}
                />
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Statuses</option>
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Archived</option>
                </select>
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Instructors</option>
                    <option>Sarah Johnson</option>
                    <option>Robert Wilson</option>
                </select>
            </div>

            {/* Courses Table */}
            <DataTable columns={columns} data={courses} actions={actions} />
        </AdminLayout>
    );
}
