'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CourseFormModal from '@/components/admin/CourseFormModal';
import StatusPill from '@/components/admin/ui/StatusPill';
import {
    fetchMyCourses,
    createCourse,
    updateCourse,
    submitCourseForReview,
    deleteCourse,
} from '@/lib/api';
import { isInstructor } from '@/lib/auth';
import { InstructorCourse, CreateCourseRequest, UpdateCourseRequest } from '@/types/instructor';

export default function InstructorDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedCourse, setSelectedCourse] = useState<InstructorCourse | null>(null);

    // Role-based access control
    useEffect(() => {
        if (!isInstructor()) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    useEffect(() => {
        loadCourses();
    }, [page]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchMyCourses(page, 10);
            setCourses(response.data.courses);
            setTotalPages(response.data.pagination.totalPages);
        } catch (err: any) {
            setError(err.message || 'Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (data: CreateCourseRequest | UpdateCourseRequest) => {
        await createCourse(data as CreateCourseRequest);
        await loadCourses();
    };

    const handleUpdateCourse = async (data: CreateCourseRequest | UpdateCourseRequest) => {
        if (selectedCourse) {
            await updateCourse(selectedCourse.id, data as UpdateCourseRequest);
            await loadCourses();
        }
    };

    const handleSubmitForReview = async (courseId: string) => {
        if (confirm('Are you sure you want to submit this course for review?')) {
            try {
                await submitCourseForReview(courseId);
                await loadCourses();
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                await deleteCourse(courseId);
                await loadCourses();
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    const openEditModal = (course: InstructorCourse) => {
        setModalMode('edit');
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || course.statusCode === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (!isInstructor()) {
        return null; // Prevent rendering if not instructor
    }

    if (loading && courses.length === 0) {
        return (
            <AdminLayout pageTitle="My Courses">
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    Loading courses...
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout pageTitle="My Courses">
                <div
                    className="admin-card"
                    style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)', color: 'var(--admin-danger)' }}
                >
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
            pageTitle="My Courses"
            headerActions={
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => router.push('/admin/instructor/courses/create')}
                >
                    + Create Course
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="admin-select"
                    style={{ width: '200px' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)' }}>
                    <p style={{ color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-md)' }}>
                        {searchQuery || statusFilter !== 'ALL'
                            ? 'No courses match your search criteria'
                            : 'You have not created any courses yet'}
                    </p>
                    {!searchQuery && statusFilter === 'ALL' && (
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => router.push('/admin/instructor/courses/create')}
                        >
                            Create Your First Course
                        </button>
                    )}
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: 'var(--admin-space-lg)',
                    }}
                >
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="admin-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all var(--admin-transition-base)',
                            }}
                        >
                            {/* Course Header */}
                            <div style={{ marginBottom: 'var(--admin-space-md)' }}>
                                <h3
                                    style={{
                                        fontSize: 'var(--admin-text-lg)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                        color: 'var(--admin-text-primary)',
                                        marginBottom: 'var(--admin-space-sm)',
                                    }}
                                >
                                    {course.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 'var(--admin-text-sm)',
                                        color: 'var(--admin-text-secondary)',
                                        marginBottom: 'var(--admin-space-sm)',
                                    }}
                                >
                                    {course.slug}
                                </p>
                            </div>

                            {/* Course Description */}
                            <p
                                style={{
                                    fontSize: 'var(--admin-text-sm)',
                                    color: 'var(--admin-text-secondary)',
                                    marginBottom: 'var(--admin-space-md)',
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {course.description}
                            </p>

                            {/* Course Stats */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 'var(--admin-space-md)',
                                    marginBottom: 'var(--admin-space-md)',
                                    fontSize: 'var(--admin-text-sm)',
                                    color: 'var(--admin-text-secondary)',
                                }}
                            >
                                <span>👥 {course.enrollmentCount} students</span>
                                <span>⭐ {course.averageRating}</span>
                                <span>⏱️ {course.duration} min</span>
                            </div>

                            {/* Status and Price */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--admin-space-md)',
                                }}
                            >
                                <StatusPill
                                    status={
                                        course.statusCode === 'PUBLISHED'
                                            ? 'published'
                                            : course.statusCode === 'UNDER_REVIEW'
                                                ? 'under-review'
                                                : course.statusCode === 'ARCHIVED'
                                                    ? 'archived'
                                                    : 'draft'
                                    }
                                />
                                <span
                                    style={{
                                        fontSize: 'var(--admin-text-lg)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                        color: 'var(--admin-primary-blue)',
                                    }}
                                >
                                    {course.accessCode === 'OPEN'
                                        ? 'Free'
                                        : `$${parseFloat(course.price).toFixed(2)}`}
                                </span>
                            </div>

                            {/* Review Note (if rejected) */}
                            {course.reviewNote && (
                                <div
                                    style={{
                                        padding: 'var(--admin-space-sm)',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: 'var(--admin-radius-md)',
                                        marginBottom: 'var(--admin-space-md)',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: 'var(--admin-text-xs)',
                                            color: 'var(--admin-danger)',
                                        }}
                                    >
                                        <strong>Review Note:</strong> {course.reviewNote}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 'var(--admin-space-sm)',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button
                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                    onClick={() => openEditModal(course)}
                                    style={{ flex: 1 }}
                                >
                                    ✏️ Edit
                                </button>
                                {course.statusCode === 'DRAFT' && (
                                    <button
                                        className="admin-btn admin-btn-primary admin-btn-sm"
                                        onClick={() => handleSubmitForReview(course.id)}
                                        style={{ flex: 1 }}
                                    >
                                        📤 Submit
                                    </button>
                                )}
                                <button
                                    className="admin-btn admin-btn-danger admin-btn-sm"
                                    onClick={() => handleDeleteCourse(course.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    style={{
                        marginTop: 'var(--admin-space-xl)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--admin-space-sm)',
                    }}
                >
                    <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span style={{ padding: 'var(--admin-space-sm)', color: 'var(--admin-text-secondary)' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Course Form Modal */}
            <CourseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === 'create' ? handleCreateCourse : handleUpdateCourse}
                course={selectedCourse}
                mode={modalMode}
            />
        </AdminLayout>
    );
}
