'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import { fetchCourses } from '@/lib/api';
import { Course } from '@/types/courses';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadCourses();
    }, [page, statusFilter, searchQuery]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCourses(page, 10, statusFilter, searchQuery);
            setCourses(response.data.courses);
            setTotalPages(response.data.pagination.totalPages);
        } catch (err: any) {
            setError(err.message || 'Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1); // Reset to first page on filter change
    };

    const columns = [
        {
            key: 'title',
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
            render: (value: any) => value.name,
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
        {
            key: 'visibility',
            label: 'Visibility',
            render: (value: string) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'EVERYONE' ? 'rgba(46, 196, 182, 0.1)' : 'rgba(142, 142, 142, 0.1)',
                        color: value === 'EVERYONE' ? 'var(--admin-mint-green)' : 'var(--admin-text-secondary)',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'access_type',
            label: 'Access',
            render: (value: string) => (
                <span
                    className="admin-pill"
                    style={{
                        background: value === 'PAYMENT' ? 'rgba(244, 196, 48, 0.1)' : 'rgba(46, 196, 182, 0.1)',
                        color: value === 'PAYMENT' ? 'var(--admin-reward-yellow)' : 'var(--admin-mint-green)',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            render: (value: string, row: Course) => (
                <span style={{ color: 'var(--admin-text-primary)', fontSize: 'var(--admin-text-sm)' }}>
                    {row.access_type === 'PAYMENT' ? `$${value}` : 'Free'}
                </span>
            ),
        },
        {
            key: 'updated_at',
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
            onClick: (row: any) => alert(`View: ${row.title}`),
        },
        {
            label: 'Force Publish',
            icon: '✅',
            variant: 'primary' as const,
            onClick: (row: any) => alert(`Force publish: ${row.title}`),
        },
        {
            label: 'Force Unpublish',
            icon: '⏸️',
            onClick: (row: any) => alert(`Force unpublish: ${row.title}`),
        },
        {
            label: 'Lock Course',
            icon: '🔒',
            onClick: (row: any) => alert(`Lock: ${row.title}`),
        },
        {
            label: 'Archive',
            icon: '📦',
            onClick: (row: any) => alert(`Archive: ${row.title}`),
        },
        {
            label: 'Delete',
            icon: '🗑️',
            variant: 'danger' as const,
            onClick: (row: any) => alert(`Delete: ${row.title}`),
        },
    ];

    if (loading && courses.length === 0) {
        return (
            <AdminLayout pageTitle="Course Oversight">
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    Loading courses...
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout pageTitle="Course Oversight">
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
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <select
                    className="admin-select"
                    style={{ width: '200px' }}
                    value={statusFilter}
                    onChange={handleStatusFilter}
                >
                    <option value="all">All Statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {/* Courses Table */}
            <DataTable columns={columns} data={courses} actions={actions} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ marginTop: 'var(--admin-space-xl)', display: 'flex', justifyContent: 'center', gap: 'var(--admin-space-sm)' }}>
                    <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
