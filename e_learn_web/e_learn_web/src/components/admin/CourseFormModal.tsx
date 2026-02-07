'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/admin/ui/Modal';
import { CreateCourseRequest, UpdateCourseRequest, InstructorCourse, Topic, Subtopic } from '@/types/instructor';

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
        topics: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && course) {
            // Note: Editing topics is not fully supported in this simplified version
            // You might need to fetch full course details including modules/topics if not present in the list view
            setFormData({
                title: course.title,
                slug: course.slug,
                description: course.description,
                visibilityCode: course.visibilityCode,
                accessCode: course.accessCode,
                price: parseFloat(course.price),
                duration: course.duration,
                categoryId: course.categoryId || undefined,
                topics: [], // TODO: Load existing topics if available
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
                topics: [],
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

    // --- Topic Management ---

    const addTopic = () => {
        setFormData(prev => ({
            ...prev,
            topics: [...(prev.topics || []), { title: '', description: '', subtopics: [] }]
        }));
    };

    const removeTopic = (index: number) => {
        setFormData(prev => ({
            ...prev,
            topics: (prev.topics || []).filter((_, i) => i !== index)
        }));
    };

    const updateTopic = (index: number, field: keyof Topic, value: any) => {
        setFormData(prev => {
            const newTopics = [...(prev.topics || [])];
            newTopics[index] = { ...newTopics[index], [field]: value };
            return { ...prev, topics: newTopics };
        });
    };

    // --- Subtopic Management ---

    const addSubtopic = (topicIndex: number) => {
        setFormData(prev => {
            const newTopics = [...(prev.topics || [])];
            const currentTopic = newTopics[topicIndex];
            newTopics[topicIndex] = {
                ...currentTopic,
                subtopics: [...currentTopic.subtopics, { title: '', description: '', duration: 0 }]
            };
            return { ...prev, topics: newTopics };
        });
    };

    const removeSubtopic = (topicIndex: number, subtopicIndex: number) => {
        setFormData(prev => {
            const newTopics = [...(prev.topics || [])];
            const currentTopic = newTopics[topicIndex];
            newTopics[topicIndex] = {
                ...currentTopic,
                subtopics: currentTopic.subtopics.filter((_, i) => i !== subtopicIndex)
            };
            return { ...prev, topics: newTopics };
        });
    };

    const updateSubtopic = (topicIndex: number, subtopicIndex: number, field: keyof Subtopic, value: any) => {
        setFormData(prev => {
            const newTopics = [...(prev.topics || [])];
            const currentTopic = newTopics[topicIndex];
            const newSubtopics = [...currentTopic.subtopics];
            newSubtopics[subtopicIndex] = { ...newSubtopics[subtopicIndex], [field]: value };
            newTopics[topicIndex] = { ...currentTopic, subtopics: newSubtopics };
            return { ...prev, topics: newTopics };
        });
    };

    const handleFileChange = (topicIndex: number, subtopicIndex: number, file: File | null) => {
        updateSubtopic(topicIndex, subtopicIndex, 'videoFile', file);
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
            <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: 'var(--admin-space-sm)' }}>
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

                {/* --- Basic Information --- */}
                <h4 style={{ marginBottom: 'var(--admin-space-md)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: 'var(--admin-space-xs)' }}>Basic Information</h4>

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

                {/* Category ID (Temporary Text Input) */}
                <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                    <label
                        htmlFor="categoryId"
                        style={{
                            display: 'block',
                            marginBottom: 'var(--admin-space-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            color: 'var(--admin-text-primary)',
                            fontSize: 'var(--admin-text-sm)',
                        }}
                    >
                        Category ID
                    </label>
                    <input
                        type="text"
                        id="categoryId"
                        name="categoryId"
                        className="admin-input"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        placeholder="Enter Category ID"
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

                {/* --- Curriculum (Topics & Subtopics) --- */}
                {mode === 'create' && (
                    <>
                        <h4 style={{
                            marginBottom: 'var(--admin-space-md)',
                            marginTop: 'var(--admin-space-xl)',
                            borderBottom: '1px solid var(--admin-border-color)',
                            paddingBottom: 'var(--admin-space-xs)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            Curriculum
                            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTopic}>
                                + Add Module
                            </button>
                        </h4>

                        {formData.topics?.map((topic, tIndex) => (
                            <div key={tIndex} style={{
                                border: '1px solid var(--admin-border-color)',
                                borderRadius: 'var(--admin-radius-md)',
                                padding: 'var(--admin-space-md)',
                                marginBottom: 'var(--admin-space-md)',
                                background: 'var(--admin-bg-secondary)'
                            }}>
                                {/* Topic Header */}
                                <div style={{ display: 'flex', gap: 'var(--admin-space-md)', marginBottom: 'var(--admin-space-sm)' }}>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        placeholder="Module Title"
                                        value={topic.title}
                                        onChange={(e) => updateTopic(tIndex, 'title', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeTopic(tIndex)}>
                                        Remove
                                    </button>
                                </div>
                                <textarea
                                    className="admin-input"
                                    placeholder="Module Description"
                                    rows={2}
                                    value={topic.description}
                                    onChange={(e) => updateTopic(tIndex, 'description', e.target.value)}
                                    style={{ marginBottom: 'var(--admin-space-md)', resize: 'vertical' }}
                                />

                                {/* Subtopics */}
                                <div style={{ paddingLeft: 'var(--admin-space-lg)' }}>
                                    {topic.subtopics.map((sub, sIndex) => (
                                        <div key={sIndex} style={{
                                            background: 'white',
                                            padding: 'var(--admin-space-md)',
                                            borderRadius: 'var(--admin-radius-sm)',
                                            marginBottom: 'var(--admin-space-sm)',
                                            border: '1px solid var(--admin-border-color)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--admin-space-xs)' }}>
                                                <h6>Lesson {sIndex + 1}</h6>
                                                <button type="button"
                                                    style={{ color: 'var(--admin-danger)', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    onClick={() => removeSubtopic(tIndex, sIndex)}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: 'var(--admin-space-sm)' }}>
                                                <input
                                                    type="text"
                                                    className="admin-input"
                                                    placeholder="Lesson Title"
                                                    value={sub.title}
                                                    onChange={(e) => updateSubtopic(tIndex, sIndex, 'title', e.target.value)}
                                                />
                                                <textarea
                                                    className="admin-input"
                                                    placeholder="Lesson Description"
                                                    rows={2}
                                                    value={sub.description}
                                                    onChange={(e) => updateSubtopic(tIndex, sIndex, 'description', e.target.value)}
                                                />
                                                <div style={{ display: 'flex', gap: 'var(--admin-space-md)' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: 'var(--admin-text-xs)' }}>Duration (min)</label>
                                                        <input
                                                            type="number"
                                                            className="admin-input"
                                                            placeholder="Duration"
                                                            value={sub.duration}
                                                            onChange={(e) => updateSubtopic(tIndex, sIndex, 'duration', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 2 }}>
                                                        <label style={{ fontSize: 'var(--admin-text-xs)' }}>Video File</label>
                                                        <input
                                                            type="file"
                                                            className="admin-input"
                                                            accept="video/*"
                                                            onChange={(e) => handleFileChange(tIndex, sIndex, e.target.files ? e.target.files[0] : null)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addSubtopic(tIndex)} style={{ marginTop: 'var(--admin-space-sm)' }}>
                                        + Add Lesson
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}


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
