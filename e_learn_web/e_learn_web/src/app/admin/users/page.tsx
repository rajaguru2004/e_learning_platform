'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export default function UsersPage() {
    // Mock data
    const users = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'Learner',
            status: 'active',
            enrolledCourses: 5,
            points: 1250,
            badge: '🏆 Gold',
            avatar: 'JS',
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            role: 'Instructor',
            status: 'active',
            enrolledCourses: 0,
            points: 3400,
            badge: '💎 Diamond',
            avatar: 'SJ',
        },
        {
            id: 3,
            name: 'Mike Davis',
            email: 'mike.davis@example.com',
            role: 'Learner',
            status: 'inactive',
            enrolledCourses: 2,
            points: 450,
            badge: '🥈 Silver',
            avatar: 'MD',
        },
        {
            id: 4,
            name: 'Emily Chen',
            email: 'emily.chen@example.com',
            role: 'Learner',
            status: 'active',
            enrolledCourses: 8,
            points: 2100,
            badge: '🏆 Gold',
            avatar: 'EC',
        },
        {
            id: 5,
            name: 'Robert Wilson',
            email: 'robert.w@example.com',
            role: 'Instructor',
            status: 'active',
            enrolledCourses: 0,
            points: 5200,
            badge: '💎 Diamond',
            avatar: 'RW',
        },
    ];

    const columns = [
        {
            key: 'avatar',
            label: 'User',
            render: (value: string, row: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-md)' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--admin-primary-blue)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--admin-text-sm)',
                            fontWeight: 'var(--admin-font-semibold)',
                        }}
                    >
                        {value}
                    </div>
                    <div>
                        <div style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                            {row.name}
                        </div>
                        <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                            {row.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (value: string) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'Admin' ? 'rgba(31, 60, 136, 0.1)' : value === 'Instructor' ? 'rgba(46, 196, 182, 0.1)' : 'rgba(142, 142, 142, 0.1)',
                        color: value === 'Admin' ? 'var(--admin-primary-blue)' : value === 'Instructor' ? 'var(--admin-mint-green)' : 'var(--admin-text-secondary)',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusPill status={value as any} />,
        },
        {
            key: 'enrolledCourses',
            label: 'Enrolled',
        },
        {
            key: 'points',
            label: 'Points',
            render: (value: number) => (
                <span style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>
                    {value.toLocaleString()}
                </span>
            ),
        },
        {
            key: 'badge',
            label: 'Badge',
        },
    ];

    const actions = [
        {
            label: 'View Profile',
            icon: '👤',
            onClick: (row: any) => alert(`View profile: ${row.name}`),
        },
        {
            label: 'Impersonate User',
            icon: '🔄',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Impersonate: ${row.name}`),
        },
        {
            label: 'Toggle Status',
            icon: '🔄',
            onClick: (row: any) => alert(`Toggle status: ${row.name}`),
        },
        {
            label: 'Force Password Reset',
            icon: '🔑',
            onClick: (row: any) => alert(`Reset password: ${row.name}`),
        },
        {
            label: 'Delete User',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Delete: ${row.name}`),
        },
    ];

    return (
        <AdminLayout
            pageTitle="User Management"
            headerActions={
                <button className="admin-btn admin-btn-primary">
                    + Add User
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
                    placeholder="Search users by name or email..."
                    className="admin-input"
                    style={{ flex: 1 }}
                />
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Instructor</option>
                    <option>Learner</option>
                </select>
                <select className="admin-select" style={{ width: '200px' }}>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Users Table */}
            <DataTable columns={columns} data={users} actions={actions} />
        </AdminLayout>
    );
}
