'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        defaultPassPercentage: 60,
        maxUploadSize: 50,
        quizRetryLimits: 3,
        videoCompletionPercentage: 80,
    });

    const [featureFlags, setFeatureFlags] = useState({
        gamification: true,
        payment: true,
        reviewSystem: true,
    });

    const handleSettingChange = (key: string, value: number) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleFeatureToggle = (key: string) => {
        setFeatureFlags({ ...featureFlags, [key]: !featureFlags[key as keyof typeof featureFlags] });
    };

    return (
        <AdminLayout
            pageTitle="System Configuration"
            headerActions={
                <button className="admin-btn admin-btn-primary">💾 Save Changes</button>
            }
        >
            {/* System Settings */}
            <div className="admin-card" style={{ marginBottom: 'var(--admin-space-2xl)' }}>
                <h2
                    style={{
                        fontSize: 'var(--admin-text-xl)',
                        fontWeight: 'var(--admin-font-semibold)',
                        marginBottom: 'var(--admin-space-xl)',
                        paddingBottom: 'var(--admin-space-lg)',
                        borderBottom: '1px solid var(--admin-border-light)',
                    }}
                >
                    System Settings
                </h2>

                <div style={{ display: 'grid', gap: 'var(--admin-space-2xl)' }}>
                    {/* Default Pass Percentage */}
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Default Pass Percentage
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.defaultPassPercentage}
                                onChange={(e) => handleSettingChange('defaultPassPercentage', parseInt(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="admin-input"
                                value={settings.defaultPassPercentage}
                                onChange={(e) => handleSettingChange('defaultPassPercentage', parseInt(e.target.value))}
                                style={{ width: '100px', textAlign: 'center' }}
                            />
                            <span style={{ fontSize: 'var(--admin-text-lg)', fontWeight: 'var(--admin-font-semibold)' }}>%</span>
                        </div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', marginTop: 'var(--admin-space-xs)' }}>
                            Minimum score required to pass quizzes
                        </p>
                    </div>

                    {/* Max Upload Size */}
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Maximum Upload Size (MB)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={settings.maxUploadSize}
                                onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="admin-input"
                                value={settings.maxUploadSize}
                                onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                                style={{ width: '100px', textAlign: 'center' }}
                            />
                            <span style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>MB</span>
                        </div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', marginTop: 'var(--admin-space-xs)' }}>
                            Maximum file size for course content uploads
                        </p>
                    </div>

                    {/* Quiz Retry Limits */}
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Quiz Retry Limits
                        </label>
                        <input
                            type="number"
                            className="admin-input"
                            value={settings.quizRetryLimits}
                            onChange={(e) => handleSettingChange('quizRetryLimits', parseInt(e.target.value))}
                            style={{ maxWidth: '200px' }}
                        />
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', marginTop: 'var(--admin-space-xs)' }}>
                            Number of attempts allowed per quiz
                        </p>
                    </div>

                    {/* Video Completion Percentage */}
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Video Completion Percentage
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-lg)' }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.videoCompletionPercentage}
                                onChange={(e) => handleSettingChange('videoCompletionPercentage', parseInt(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="admin-input"
                                value={settings.videoCompletionPercentage}
                                onChange={(e) => handleSettingChange('videoCompletionPercentage', parseInt(e.target.value))}
                                style={{ width: '100px', textAlign: 'center' }}
                            />
                            <span style={{ fontSize: 'var(--admin-text-lg)', fontWeight: 'var(--admin-font-semibold)' }}>%</span>
                        </div>
                        <p style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-muted)', marginTop: 'var(--admin-space-xs)' }}>
                            Percentage of video that must be watched to mark as complete
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Flags */}
            <div className="admin-card">
                <h2
                    style={{
                        fontSize: 'var(--admin-text-xl)',
                        fontWeight: 'var(--admin-font-semibold)',
                        marginBottom: 'var(--admin-space-xl)',
                        paddingBottom: 'var(--admin-space-lg)',
                        borderBottom: '1px solid var(--admin-border-light)',
                    }}
                >
                    Feature Flags
                </h2>

                <div style={{ display: 'grid', gap: 'var(--admin-space-xl)' }}>
                    {/* Gamification Toggle */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--admin-space-lg)',
                            background: 'var(--admin-bg-secondary)',
                            borderRadius: 'var(--admin-radius-md)',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: 'var(--admin-text-base)', fontWeight: 'var(--admin-font-semibold)', marginBottom: 'var(--admin-space-xs)' }}>
                                Gamification Module
                            </h3>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                Enable points, badges, and leaderboards
                            </p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px' }}>
                            <input
                                type="checkbox"
                                checked={featureFlags.gamification}
                                onChange={() => handleFeatureToggle('gamification')}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: featureFlags.gamification ? 'var(--admin-mint-green)' : 'var(--admin-border-dark)',
                                    borderRadius: '34px',
                                    transition: 'background 0.3s',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '24px',
                                        width: '24px',
                                        left: featureFlags.gamification ? '32px' : '4px',
                                        bottom: '4px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s',
                                    }}
                                />
                            </span>
                        </label>
                    </div>

                    {/* Payment Module Toggle */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--admin-space-lg)',
                            background: 'var(--admin-bg-secondary)',
                            borderRadius: 'var(--admin-radius-md)',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: 'var(--admin-text-base)', fontWeight: 'var(--admin-font-semibold)', marginBottom: 'var(--admin-space-xs)' }}>
                                Payment Module
                            </h3>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                Enable paid courses and revenue tracking
                            </p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px' }}>
                            <input
                                type="checkbox"
                                checked={featureFlags.payment}
                                onChange={() => handleFeatureToggle('payment')}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: featureFlags.payment ? 'var(--admin-mint-green)' : 'var(--admin-border-dark)',
                                    borderRadius: '34px',
                                    transition: 'background 0.3s',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '24px',
                                        width: '24px',
                                        left: featureFlags.payment ? '32px' : '4px',
                                        bottom: '4px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s',
                                    }}
                                />
                            </span>
                        </label>
                    </div>

                    {/* Review System Toggle */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--admin-space-lg)',
                            background: 'var(--admin-bg-secondary)',
                            borderRadius: 'var(--admin-radius-md)',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: 'var(--admin-text-base)', fontWeight: 'var(--admin-font-semibold)', marginBottom: 'var(--admin-space-xs)' }}>
                                Review System
                            </h3>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                                Allow users to rate and review courses
                            </p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px' }}>
                            <input
                                type="checkbox"
                                checked={featureFlags.reviewSystem}
                                onChange={() => handleFeatureToggle('reviewSystem')}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: featureFlags.reviewSystem ? 'var(--admin-mint-green)' : 'var(--admin-border-dark)',
                                    borderRadius: '34px',
                                    transition: 'background 0.3s',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '24px',
                                        width: '24px',
                                        left: featureFlags.reviewSystem ? '32px' : '4px',
                                        bottom: '4px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s',
                                    }}
                                />
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
