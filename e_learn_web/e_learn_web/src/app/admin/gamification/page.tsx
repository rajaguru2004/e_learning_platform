'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export default function GamificationPage() {
    const badges = [
        {
            id: 1,
            name: 'Beginner',
            icon: '🥉',
            pointThreshold: 100,
            status: 'active',
            usersEarned: 1250,
        },
        {
            id: 2,
            name: 'Silver Star',
            icon: '🥈',
            pointThreshold: 500,
            status: 'active',
            usersEarned: 580,
        },
        {
            id: 3,
            name: 'Gold Champion',
            icon: '🏆',
            pointThreshold: 1500,
            status: 'active',
            usersEarned: 210,
        },
        {
            id: 4,
            name: 'Diamond Elite',
            icon: '💎',
            pointThreshold: 3000,
            status: 'active',
            usersEarned: 42,
        },
    ];

    const pointsLog = [
        {
            id: 1,
            userName: 'John Smith',
            action: 'Quiz Completed',
            points: '+50',
            timestamp: '2026-02-07 14:30',
        },
        {
            id: 2,
            userName: 'Emily Chen',
            action: 'Course Completed',
            points: '+200',
            timestamp: '2026-02-07 13:15',
        },
        {
            id: 3,
            userName: 'Mike Davis',
            action: 'Admin Bonus',
            points: '+100',
            timestamp: '2026-02-07 10:45',
        },
    ];

    const badgeColumns = [
        {
            key: 'name',
            label: 'Badge',
            render: (value: string, row: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-md)' }}>
                    <span style={{ fontSize: '2rem' }}>{row.icon}</span>
                    <span style={{ fontWeight: 'var(--admin-font-semibold)' }}>{value}</span>
                </div>
            ),
        },
        {
            key: 'pointThreshold',
            label: 'Threshold',
            render: (value: number) => (
                <span style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>
                    {value.toLocaleString()} pts
                </span>
            ),
        },
        {
            key: 'usersEarned',
            label: 'Users Earned',
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusPill status={value as any} />,
        },
    ];

    const pointsColumns = [
        {
            key: 'userName',
            label: 'User',
        },
        {
            key: 'action',
            label: 'Action',
        },
        {
            key: 'points',
            label: 'Points',
            render: (value: string) => {
                const isPositive = value.startsWith('+');
                return (
                    <span
                        style={{
                            color: isPositive ? 'var(--admin-mint-green)' : 'var(--admin-error-coral)',
                            fontWeight: 'var(--admin-font-semibold)',
                        }}
                    >
                        {value}
                    </span>
                );
            },
        },
        {
            key: 'timestamp',
            label: 'Timestamp',
            render: (value: string) => (
                <span style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>{value}</span>
            ),
        },
    ];

    const badgeActions = [
        {
            label: 'Edit Badge',
            icon: '✏️',
            onClick: (row: any) => alert(`Edit badge: ${row.name}`),
        },
        {
            label: 'Toggle Status',
            icon: '🔄',
            onClick: (row: any) => alert(`Toggle: ${row.name}`),
        },
    ];

    return (
        <AdminLayout
            pageTitle="Gamification Management"
            headerActions={
                <button className="admin-btn admin-btn-primary">+ Create Badge</button>
            }
        >
            {/* Badge Management Section */}
            <div style={{ marginBottom: 'var(--admin-space-3xl)' }}>
                <h2
                    style={{
                        fontSize: 'var(--admin-text-xl)',
                        fontWeight: 'var(--admin-font-semibold)',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    Badge Management
                </h2>
                <DataTable columns={badgeColumns} data={badges} actions={badgeActions} />
            </div>

            {/* Points Control Section */}
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    <h2
                        style={{
                            fontSize: 'var(--admin-text-xl)',
                            fontWeight: 'var(--admin-font-semibold)',
                        }}
                    >
                        Points Log
                    </h2>
                    <div style={{ display: 'flex', gap: 'var(--admin-space-sm)' }}>
                        <button className="admin-btn admin-btn-success admin-btn-sm">Grant Points</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm">Deduct Points</button>
                        <button className="admin-btn admin-btn-secondary admin-btn-sm">View Leaderboard</button>
                    </div>
                </div>
                <DataTable columns={pointsColumns} data={pointsLog} />
            </div>
        </AdminLayout>
    );
}
