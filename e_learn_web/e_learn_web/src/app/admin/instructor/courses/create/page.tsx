'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { CreateCourseRequest, Topic, Subtopic } from '@/types/instructor';
import { createCourse } from '@/lib/api';

export default function CreateCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateCourseRequest>({
        title: '',
        slug: '',
        description: '',
        visibilityCode: 'EVERYONE',
        accessCode: 'PAYMENT',
        price: 0,
        duration: 60,
        categoryId: '',
        topics: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            await createCourse(formData);
            router.push('/admin/instructor/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create course');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout pageTitle="Create New Course">
            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: 'var(--admin-space-4xl)' }}>
                {error && (
                    <div className="admin-card" style={{
                        marginBottom: 'var(--admin-space-lg)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--admin-danger)',
                        border: '1px solid var(--admin-danger)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Basic Info Section */}
                    <div className="admin-card" style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--admin-space-lg)', fontSize: '1.25rem', fontWeight: 600 }}>Course Details</h2>

                        <div style={{ display: 'grid', gap: 'var(--admin-space-lg)' }}>
                            <div>
                                <label className="admin-label">Course Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="admin-input"
                                    value={formData.title}
                                    onChange={handleChange}
                                    onBlur={generateSlug}
                                    placeholder="e.g. Advanced React Patterns"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-space-lg)' }}>
                                <div>
                                    <label className="admin-label">Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        className="admin-input"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="course-slug"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">Category ID *</label>
                                    <input
                                        type="text"
                                        name="categoryId"
                                        className="admin-input"
                                        value={formData.categoryId || ''}
                                        onChange={handleChange}
                                        placeholder="Category Identifier"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="admin-label">Description *</label>
                                <textarea
                                    name="description"
                                    className="admin-input"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="What will students learn in this course?"
                                    rows={5}
                                    style={{ resize: 'vertical' }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="admin-card" style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--admin-space-lg)', fontSize: '1.25rem', fontWeight: 600 }}>Settings & Pricing</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-space-lg)' }}>
                            <div>
                                <label className="admin-label">Visibility</label>
                                <select
                                    name="visibilityCode"
                                    className="admin-select"
                                    value={formData.visibilityCode}
                                    onChange={handleChange}
                                >
                                    <option value="EVERYONE">Public</option>
                                    <option value="SIGNED_IN">Signed In Users Only</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>

                            <div>
                                <label className="admin-label">Access Type</label>
                                <select
                                    name="accessCode"
                                    className="admin-select"
                                    value={formData.accessCode}
                                    onChange={handleChange}
                                >
                                    <option value="OPEN">Free</option>
                                    <option value="PAYMENT">Paid</option>
                                    <option value="INVITATION">Invitation Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="admin-label">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="admin-input"
                                    value={formData.price}
                                    onChange={handleChange}
                                    disabled={formData.accessCode !== 'PAYMENT'}
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="admin-label">Total Duration (min)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    className="admin-input"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Curriculum Section */}
                    {/* Using a distinct style for the curriculum builder */}
                    <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--admin-space-md)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>Curriculum</h2>
                            <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                onClick={addTopic}
                            >
                                + Add Module
                            </button>
                        </div>

                        {formData.topics?.length === 0 && (
                            <div className="admin-card" style={{ textAlign: 'center', padding: 'var(--admin-space-2xl)', color: 'var(--admin-text-secondary)' }}>
                                No modules added yet. Start by adding a module to your course.
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: 'var(--admin-space-lg)' }}>
                            {formData.topics?.map((topic, tIndex) => (
                                <div key={tIndex} className="admin-card" style={{ borderLeft: '4px solid var(--admin-primary-blue)' }}>
                                    {/* Module Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--admin-space-md)' }}>
                                        <div style={{ flex: 1, marginRight: 'var(--admin-space-lg)' }}>
                                            <input
                                                type="text"
                                                className="admin-input"
                                                placeholder={`Module ${tIndex + 1} Title`}
                                                value={topic.title}
                                                onChange={(e) => updateTopic(tIndex, 'title', e.target.value)}
                                                style={{ fontWeight: 600, fontSize: '1.1rem' }}
                                            />
                                            <input
                                                type="text"
                                                className="admin-input"
                                                placeholder="Module Description"
                                                value={topic.description}
                                                onChange={(e) => updateTopic(tIndex, 'description', e.target.value)}
                                                style={{ marginTop: 'var(--admin-space-xs)', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-danger admin-btn-sm"
                                            onClick={() => removeTopic(tIndex)}
                                            style={{ alignSelf: 'flex-start' }}
                                        >
                                            Remove Module
                                        </button>
                                    </div>

                                    {/* Lessons List */}
                                    <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--admin-border-color)' }}>
                                        {topic.subtopics.map((sub, sIndex) => (
                                            <div key={sIndex} style={{
                                                backgroundColor: 'var(--admin-bg-secondary)',
                                                padding: 'var(--admin-space-md)',
                                                borderRadius: 'var(--admin-radius-md)',
                                                marginBottom: 'var(--admin-space-md)',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--admin-space-sm)' }}>
                                                    <span style={{ fontWeight: 500, color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
                                                        Lesson {sIndex + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubtopic(tIndex, sIndex)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', fontSize: '0.9rem' }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--admin-space-md)' }}>
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
                                                            value={sub.description}
                                                            onChange={(e) => updateSubtopic(tIndex, sIndex, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div style={{ display: 'grid', gap: 'var(--admin-space-sm)' }}>
                                                        <div>
                                                            <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>Duration (min)</label>
                                                            <input
                                                                type="number"
                                                                className="admin-input"
                                                                value={sub.duration}
                                                                onChange={(e) => updateSubtopic(tIndex, sIndex, 'duration', parseFloat(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>Video File</label>
                                                            <div style={{
                                                                border: '1px dashed var(--admin-border-color)',
                                                                padding: 'var(--admin-space-sm)',
                                                                borderRadius: 'var(--admin-radius-sm)',
                                                                backgroundColor: 'white',
                                                                textAlign: 'center'
                                                            }}>
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) => handleFileChange(tIndex, sIndex, e.target.files ? e.target.files[0] : null)}
                                                                    style={{ width: '100%' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-secondary admin-btn-sm"
                                            onClick={() => addSubtopic(tIndex)}
                                            style={{ marginTop: 'var(--admin-space-xs)' }}
                                        >
                                            + Add Lesson
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--admin-space-md)',
                        paddingTop: 'var(--admin-space-xl)',
                        borderTop: '1px solid var(--admin-border-color)'
                    }}>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => router.push('/admin/instructor/dashboard')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isSubmitting}
                            style={{ paddingLeft: 'var(--admin-space-xl)', paddingRight: 'var(--admin-space-xl)' }}
                        >
                            {isSubmitting ? 'Creating Course...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
