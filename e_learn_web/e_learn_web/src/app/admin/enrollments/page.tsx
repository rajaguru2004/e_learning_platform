'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export default function EnrollmentsPage() {
    const enrollments = [
        {
            id: 1,
            learnerName: 'John Smith',
            email: 'john.smith@example.com',
            courseName: 'Introduction to Python Programming',
            enrollmentDate: '2026-01-15',
            accessExpiry: '2026-07-15',
            status: 'active',
            progress: '65%',
        },
        {
            id: 2,
            learnerName: 'Emily Chen',
            email: 'emily.chen@example.com',
            courseName: 'Advanced Machine Learning',
            enrollmentDate: '2026-02-01',
            accessExpiry: 'Lifetime',
            status: 'active',
            progress: '23%',
        },
        {
            id: 3,
            learnerName: 'Mike Davis',
            email: 'mike.davis@example.com',
            courseName: 'Web Development Bootcamp',
            enrollmentDate: '2025-12-10',
            accessExpiry: '2026-03-10',
            status: 'inactive',
            progress: '100%',
        },
    ];

    const columns = [
        {
            key: 'learnerName',
            label: 'Learner',
            render: (value: string, row: any) => (
                <div>
                    <div style={{ fontWeight: 'var(--admin-font-medium)' }}>{value}</div>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                        {row.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'courseName',
            label: 'Course',
        },
        {
            key: 'enrollmentDate',
            label: 'Enrolled',
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'accessExpiry',
            label: 'Access Expiry',
            render: (value: string) => (
                <span
                    style={{
                        color: value === 'Lifetime' ? 'var(--admin-mint-green)' : 'var(--admin-text-primary)',
                        fontWeight: value === 'Lifetime' ? 'var(--admin-font-medium)' : 'normal',
                    }}
                >
                    {value === 'Lifetime' ? value : new Date(value).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'progress',
            label: 'Progress',
            render: (value: string) => (
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
                                width: value,
                                height: '100%',
                                background: 'var(--admin-mint-green)',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <span style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)', minWidth: '40px' }}>
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusPill status={value as any} />,
        },
    ];

    const actions = [
        {
            label: 'Extend Access',
            icon: '⏰',
            onClick: (row: any) => alert(`Extend access: ${row.learnerName} - ${row.courseName}`),
        },
        {
            label: 'Override Payment',
            icon: '💳',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Override payment: ${row.learnerName}`),
        },
        {
            label: 'Remove Enrollment',
            icon: '❌',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Remove: ${row.learnerName} from ${row.courseName}`),
        },
    ];

    return (
        <AdminLayout
            pageTitle="Enrollment Management"
            headerActions={
                <button className="admin-btn admin-btn-primary">
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
                <select className="admin-select" style={{ flex: 1 }}>
                    <option>All Courses</option>
                    <option>Introduction to Python Programming</option>
                    <option>Advanced Machine Learning</option>
                    <option>Web Development Bootcamp</option>
                </select>
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Enrollments Table */}
            <DataTable columns={columns} data={enrollments} actions={actions} />
        </AdminLayout>
    );
}
