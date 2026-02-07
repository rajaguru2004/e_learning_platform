'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/admin/ui/Modal';
import { CreateCourseRequest, UpdateCourseRequest, InstructorCourse } from '@/types/instructor';

interface CourseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCourseRequest | UpdateCourseRequest) => Promise<void>;
    course?: InstructorCourse | null;
    mode: 'create' | 'edit';
}

export default function CourseFormModal({
    isOpen,
    onClose,
    onSubmit,
    course,
    mode,
}: CourseFormModalProps) {
    const [formData, setFormData] = useState<CreateCourseRequest>({
        title: '',
        slug: '',
        description: '',
        visibilityCode: 'EVERYONE',
        accessCode: 'PAYMENT',
        price: 0,
        duration: 60,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && course) {
            setFormData({
                title: course.title,
                slug: course.slug,
                description: course.description,
                visibilityCode: course.visibilityCode,
                accessCode: course.accessCode,
                price: parseFloat(course.price),
                duration: course.duration,
            });
        } else {
            setFormData({
                title: '',
                slug: '',
                description: '',
                visibilityCode: 'EVERYONE',
                accessCode: 'PAYMENT',
                price: 0,
                duration: 60,
            });
        }
        setError(null);
    }, [mode, course, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'duration' ? parseFloat(value) || 0 : value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        setFormData((prev) => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!formData.slug.trim()) {
            setError('Slug is required');
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }
        if (formData.accessCode === 'PAYMENT' && (formData.price === undefined || formData.price <= 0)) {
            setError('Price must be greater than 0 for paid courses');
            return;
        }
        if (formData.duration <= 0) {
            setError('Duration must be greater than 0');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save course');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Create New Course' : 'Edit Course'}
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div
                        style={{
                            padding: 'var(--admin-space-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--admin-danger)',
                            borderRadius: 'var(--admin-radius-md)',
                            marginBottom: 'var(--admin-space-lg)',
                            fontSize: 'var(--admin-text-sm)',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Title */}
                <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                    <label
                        htmlFor="title"
                        style={{
                            display: 'block',
                            marginBottom: 'var(--admin-space-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            color: 'var(--admin-text-primary)',
                            fontSize: 'var(--admin-text-sm)',
                        }}
                    >
                        Course Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="admin-input"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={mode === 'create' ? generateSlug : undefined}
                        placeholder="Enter course title"
                        required
                    />
                </div>

                {/* Slug */}
                <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                    <label
                        htmlFor="slug"
                        style={{
                            display: 'block',
                            marginBottom: 'var(--admin-space-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            color: 'var(--admin-text-primary)',
                            fontSize: 'var(--admin-text-sm)',
                        }}
                    >
                        Slug *
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--admin-space-sm)' }}>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            className="admin-input"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="course-slug"
                            required
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={generateSlug}
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                    <label
                        htmlFor="description"
                        style={{
                            display: 'block',
                            marginBottom: 'var(--admin-space-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            color: 'var(--admin-text-primary)',
                            fontSize: 'var(--admin-text-sm)',
                        }}
                    >
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="admin-input"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter course description"
                        rows={4}
                        required
                        style={{ resize: 'vertical' }}
                    />
                </div>

                {/* Visibility and Access in a row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--admin-space-md)',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    {/* Visibility */}
                    <div>
                        <label
                            htmlFor="visibilityCode"
                            style={{
                                display: 'block',
                                marginBottom: 'var(--admin-space-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                fontSize: 'var(--admin-text-sm)',
                            }}
                        >
                            Visibility *
                        </label>
                        <select
                            id="visibilityCode"
                            name="visibilityCode"
                            className="admin-select"
                            value={formData.visibilityCode}
                            onChange={handleChange}
                            required
                        >
                            <option value="EVERYONE">Everyone</option>
                            <option value="SIGNED_IN">Signed In Users</option>
                            <option value="PRIVATE">Private</option>
                        </select>
                    </div>

                    {/* Access */}
                    <div>
                        <label
                            htmlFor="accessCode"
                            style={{
                                display: 'block',
                                marginBottom: 'var(--admin-space-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                fontSize: 'var(--admin-text-sm)',
                            }}
                        >
                            Access Type *
                        </label>
                        <select
                            id="accessCode"
                            name="accessCode"
                            className="admin-select"
                            value={formData.accessCode}
                            onChange={handleChange}
                            required
                        >
                            <option value="OPEN">Open (Free)</option>
                            <option value="PAYMENT">Payment Required</option>
                            <option value="INVITATION">Invitation Only</option>
                        </select>
                    </div>
                </div>

                {/* Price and Duration in a row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--admin-space-md)',
                        marginBottom: 'var(--admin-space-lg)',
                    }}
                >
                    {/* Price */}
                    <div>
                        <label
                            htmlFor="price"
                            style={{
                                display: 'block',
                                marginBottom: 'var(--admin-space-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                fontSize: 'var(--admin-text-sm)',
                            }}
                        >
                            Price ($) {formData.accessCode === 'PAYMENT' && '*'}
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="admin-input"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="49.99"
                            min="0"
                            step="0.01"
                            disabled={formData.accessCode !== 'PAYMENT'}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label
                            htmlFor="duration"
                            style={{
                                display: 'block',
                                marginBottom: 'var(--admin-space-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                fontSize: 'var(--admin-text-sm)',
                            }}
                        >
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            className="admin-input"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="120"
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--admin-space-md)',
                        marginTop: 'var(--admin-space-xl)',
                    }}
                >
                    <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? mode === 'create'
                                ? 'Creating...'
                                : 'Updating...'
                            : mode === 'create'
                                ? 'Create Course'
                                : 'Update Course'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
