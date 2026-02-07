'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import { fetchUsers } from '@/lib/api';
import { User, UsersData } from '@/types/users';

export default function UsersPage() {
    const [usersData, setUsersData] = useState<UsersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch users data
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetchUsers(
                    currentPage,
                    10,
                    roleFilter,
                    statusFilter,
                    searchQuery
                );
                setUsersData(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load users');
                console.error('Error loading users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [currentPage, roleFilter, statusFilter, searchQuery]);

    // Helper to get initials from name
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            render: (value: string, row: User) => (
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
                        {getInitials(row.name)}
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
            render: (value: string, row: User) => (
                <span
                    className="admin-pill"
                    style={{
                        background: row.roleCode === 'ADMIN'
                            ? 'rgba(31, 60, 136, 0.1)'
                            : row.roleCode === 'INSTRUCTOR'
                                ? 'rgba(46, 196, 182, 0.1)'
                                : 'rgba(142, 142, 142, 0.1)',
                        color: row.roleCode === 'ADMIN'
                            ? 'var(--admin-primary-blue)'
                            : row.roleCode === 'INSTRUCTOR'
                                ? 'var(--admin-mint-green)'
                                : 'var(--admin-text-secondary)',
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
            key: 'created_at',
            label: 'Created',
            render: (value: string) => (
                <span style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                    {new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View Profile',
            icon: '👤',
            onClick: (row: User) => alert(`View profile: ${row.name}`),
        },
        {
            label: 'Impersonate User',
            icon: '🔄',
            variant: 'primary' as const,
            onClick: (row: User) => alert(`Impersonate: ${row.name}`),
        },
        {
            label: 'Toggle Status',
            icon: '🔄',
            onClick: (row: User) => alert(`Toggle status: ${row.name}`),
        },
        {
            label: 'Force Password Reset',
            icon: '🔑',
            onClick: (row: User) => alert(`Reset password: ${row.name}`),
        },
        {
            label: 'Delete User',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: User) => alert(`Delete: ${row.name}`),
        },
    ];

    // Handle search with debounce
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <select
                    className="admin-select"
                    style={{ width: '200px' }}
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Roles</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="LEARNER">Learner</option>
                </select>
                <select
                    className="admin-select"
                    style={{ width: '200px' }}
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="admin-card" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: 'var(--admin-text-lg)',
                    color: 'var(--admin-text-secondary)',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--admin-space-lg)',
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(31, 60, 136, 0.1)',
                            borderTopColor: 'var(--admin-primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}></div>
                        <span>Loading users...</span>
                    </div>
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="admin-card" style={{
                    padding: 'var(--admin-space-2xl)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--admin-radius-lg)',
                    color: '#dc2626',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--admin-space-md)' }}>⚠️</div>
                    <h3 style={{ fontSize: 'var(--admin-text-lg)', fontWeight: 'var(--admin-font-semibold)', marginBottom: 'var(--admin-space-sm)' }}>
                        Error Loading Users
                    </h3>
                    <p style={{ fontSize: 'var(--admin-text-base)' }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 'var(--admin-space-lg)',
                            padding: 'var(--admin-space-sm) var(--admin-space-xl)',
                            backgroundColor: 'var(--admin-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--admin-radius-md)',
                            fontSize: 'var(--admin-text-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            cursor: 'pointer',
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Success State - Users Table */}
            {usersData && !isLoading && !error && (
                <>
                    <DataTable columns={columns} data={usersData.users} actions={actions} />

                    {/* Pagination */}
                    {usersData.pagination.totalPages > 1 && (
                        <div className="admin-card" style={{
                            marginTop: 'var(--admin-space-xl)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                Showing page {usersData.pagination.page} of {usersData.pagination.totalPages}
                                ({usersData.pagination.totalCount} total users)
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--admin-space-sm)' }}>
                                <button
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    ← Previous
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: usersData.pagination.totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show first page, last page, current page, and pages around current
                                        return page === 1 ||
                                            page === usersData.pagination.totalPages ||
                                            Math.abs(page - currentPage) <= 1;
                                    })
                                    .map((page, index, array) => {
                                        // Add ellipsis if there's a gap
                                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                                        return (
                                            <React.Fragment key={page}>
                                                {showEllipsisBefore && (
                                                    <span style={{
                                                        padding: 'var(--admin-space-sm) var(--admin-space-md)',
                                                        color: 'var(--admin-text-secondary)'
                                                    }}>...</span>
                                                )}
                                                <button
                                                    className={page === currentPage ? 'admin-btn admin-btn-primary' : 'admin-btn admin-btn-secondary'}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })
                                }

                                <button
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === usersData.pagination.totalPages}
                                    style={{
                                        opacity: currentPage === usersData.pagination.totalPages ? 0.5 : 1,
                                        cursor: currentPage === usersData.pagination.totalPages ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
}
