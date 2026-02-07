import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';

export default function AuditLogsPage() {
    const auditLogs = [
        {
            id: 1,
            user: 'Admin User',
            action: 'Updated',
            module: 'System Settings',
            entityId: 'SETTING_001',
            oldValue: 'Pass % = 50',
            newValue: 'Pass % = 60',
            timestamp: '2026-02-07 15:30:22',
        },
        {
            id: 2,
            user: 'Sarah Johnson',
            action: 'Created',
            module: 'Course',
            entityId: 'COURSE_156',
            oldValue: '—',
            newValue: 'Introduction to Python',
            timestamp: '2026-02-07 14:15:08',
        },
        {
            id: 3,
            user: 'Admin User',
            action: 'Deleted',
            module: 'Review',
            entityId: 'REVIEW_892',
            oldValue: 'Abusive review text',
            newValue: '—',
            timestamp: '2026-02-07 13:45:33',
        },
        {
            id: 4,
            user: 'Admin User',
            action: 'Force Published',
            module: 'Course',
            entityId: 'COURSE_142',
            oldValue: 'Status: Draft',
            newValue: 'Status: Published',
            timestamp: '2026-02-07 11:20:15',
        },
        {
            id: 5,
            user: 'Robert Wilson',
            action: 'Updated',
            module: 'Quiz',
            entityId: 'QUIZ_045',
            oldValue: 'Retry Limit = 2',
            newValue: 'Retry Limit = 3',
            timestamp: '2026-02-07 10:05:42',
        },
        {
            id: 6,
            user: 'Admin User',
            action: 'Granted Points',
            module: 'Gamification',
            entityId: 'USER_234',
            oldValue: '500 pts',
            newValue: '600 pts (+100)',
            timestamp: '2026-02-07 09:30:18',
        },
        {
            id: 7,
            user: 'Admin User',
            action: 'Blocked Reviews',
            module: 'User',
            entityId: 'USER_567',
            oldValue: 'Review Posting: Enabled',
            newValue: 'Review Posting: Blocked',
            timestamp: '2026-02-06 16:45:29',
        },
        {
            id: 8,
            user: 'Admin User',
            action: 'Activated',
            module: 'Feature Flag',
            entityId: 'FEATURE_PAYMENT',
            oldValue: 'Payment Module: OFF',
            newValue: 'Payment Module: ON',
            timestamp: '2026-02-06 14:20:05',
        },
    ];

    const columns = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            render: (value: string) => (
                <span style={{ fontFamily: 'monospace', fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                    {value}
                </span>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (value: string) => (
                <span style={{ fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-primary)' }}>
                    {value}
                </span>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            render: (value: string) => {
                const actionColors: Record<string, string> = {
                    Created: 'var(--admin-mint-green)',
                    Updated: 'var(--admin-primary-blue)',
                    Deleted: 'var(--admin-error-coral)',
                    'Force Published': 'var(--admin-reward-yellow)',
                    'Granted Points': 'var(--admin-mint-green)',
                    'Blocked Reviews': 'var(--admin-error-coral)',
                    Activated: 'var(--admin-mint-green)',
                };
                return (
                    <span
                        className="admin-pill"
                        style={{
                            background: `${actionColors[value] || 'var(--admin-text-secondary)'}15`,
                            color: actionColors[value] || 'var(--admin-text-secondary)',
                        }}
                    >
                        {value}
                    </span>
                );
            },
        },
        {
            key: 'module',
            label: 'Module',
            render: (value: string) => (
                <span style={{ fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-medium)' }}>{value}</span>
            ),
        },
        {
            key: 'entityId',
            label: 'Entity ID',
            render: (value: string) => (
                <span style={{ fontFamily: 'monospace', fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)' }}>
                    {value}
                </span>
            ),
        },
        {
            key: 'oldValue',
            label: 'Old Value',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: 'var(--admin-text-sm)',
                        color: value === '—' ? 'var(--admin-text-muted)' : 'var(--admin-text-secondary)',
                        maxWidth: '150px',
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'newValue',
            label: 'New Value',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: 'var(--admin-text-sm)',
                        color: value === '—' ? 'var(--admin-text-muted)' : 'var(--admin-text-primary)',
                        fontWeight: value === '—' ? 'normal' : 'var(--admin-font-medium)',
                        maxWidth: '150px',
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout
            pageTitle="Security & Audit Logs"
            headerActions={
                <>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm">🔍 Filter</button>
                    <button className="admin-btn admin-btn-primary admin-btn-sm">📥 Export</button>
                </>
            }
        >
            {/* Immutability Notice */}
            <div
                style={{
                    padding: 'var(--admin-space-lg)',
                    background: 'rgba(31, 60, 136, 0.05)',
                    border: '1px solid rgba(31, 60, 136, 0.2)',
                    borderRadius: 'var(--admin-radius-md)',
                    marginBottom: 'var(--admin-space-xl)',
                }}
            >
                <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-primary)' }}>
                    <strong>🔒 Audit Trail:</strong> This is a read-only, immutable record of all administrative actions performed on the platform.
                    Logs cannot be modified or deleted to ensure data integrity and accountability.
                </p>
            </div>

            {/* Audit Logs Table */}
            <DataTable columns={columns} data={auditLogs} emptyMessage="No audit logs available" />
        </AdminLayout>
    );
}
