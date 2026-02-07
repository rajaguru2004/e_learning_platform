'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/ui/DataTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import {
    fetchBadges,
    createBadge,
    updateBadge,
    updateBadgeIcon,
    fetchPointsLog,
    grantPoints,
    deductPoints,
    fetchLeaderboard,
    fetchUsers,
} from '@/lib/api';
import { Badge, PointsLogEntry, LeaderboardEntry } from '@/types/badges';

type ModalType = 'badge' | 'grant' | 'deduct' | 'leaderboard' | null;

export default function GamificationPage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [pointsLog, setPointsLog] = useState<PointsLogEntry[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [pointsLoading, setPointsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentModal, setCurrentModal] = useState<ModalType>(null);
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Badge form state
    const [badgeFormData, setBadgeFormData] = useState({
        name: '',
        min_points: 0,
        max_points: null as number | null,
        icon_url: '',
        description: '',
    });

    // Points form state
    const [pointsFormData, setPointsFormData] = useState({
        user_id: '',
        points: 0,
        reason: '',
    });

    const [learners, setLearners] = useState<any[]>([]);

    // Fetch data on component mount
    useEffect(() => {
        loadBadges();
        loadPointsLog();
        loadLearners();
    }, []);

    const loadBadges = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchBadges(1, 100);
            setBadges(response.data.badges);
        } catch (err: any) {
            setError(err.message || 'Failed to load badges');
            console.error('Error loading badges:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadLearners = async () => {
        try {
            // Fetch users with role 'LEARNER'
            const response = await fetchUsers(1, 100, 'LEARNER');
            setLearners(response.data.users);
        } catch (err: any) {
            console.error('Error loading learners:', err);
        }
    };

    const loadPointsLog = async () => {
        try {
            setPointsLoading(true);
            const response = await fetchPointsLog(1, 50);
            setPointsLog(response.data.logs);
        } catch (err: any) {
            console.error('Error loading points log:', err);
        } finally {
            setPointsLoading(false);
        }
    };

    const loadLeaderboard = async () => {
        try {
            const response = await fetchLeaderboard(1, 50);
            setLeaderboard(response.data.leaderboard);
        } catch (err: any) {
            alert('Failed to load leaderboard: ' + err.message);
            console.error('Error loading leaderboard:', err);
        }
    };

    const handleOpenBadgeModal = (badge?: Badge) => {
        if (badge) {
            setEditingBadge(badge);
            setBadgeFormData({
                name: badge.name,
                min_points: badge.min_points,
                max_points: badge.max_points,
                icon_url: badge.icon_url || '',
                description: badge.description,
            });
        } else {
            setEditingBadge(null);
            setBadgeFormData({
                name: '',
                min_points: 0,
                max_points: null,
                icon_url: '',
                description: '',
            });
        }
        setCurrentModal('badge');
    };

    const handleOpenGrantModal = () => {
        setPointsFormData({ user_id: '', points: 0, reason: '' });
        setCurrentModal('grant');
    };

    const handleOpenDeductModal = () => {
        setPointsFormData({ user_id: '', points: 0, reason: '' });
        setCurrentModal('deduct');
    };

    const handleOpenLeaderboardModal = async () => {
        setCurrentModal('leaderboard');
        await loadLeaderboard();
    };

    const handleCloseModal = () => {
        setCurrentModal(null);
        setEditingBadge(null);
    };

    const handleBadgeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingBadge) {
                await updateBadge(editingBadge.id, {
                    name: badgeFormData.name,
                    min_points: badgeFormData.min_points,
                    max_points: badgeFormData.max_points,
                    description: badgeFormData.description,
                });

                if (badgeFormData.icon_url !== editingBadge.icon_url) {
                    await updateBadgeIcon(editingBadge.id, {
                        icon_url: badgeFormData.icon_url,
                    });
                }
            } else {
                await createBadge({
                    name: badgeFormData.name,
                    min_points: badgeFormData.min_points,
                    max_points: badgeFormData.max_points,
                    icon_url: badgeFormData.icon_url || undefined,
                    description: badgeFormData.description,
                });
            }

            await loadBadges();
            handleCloseModal();
        } catch (err: any) {
            alert(err.message || 'Failed to save badge');
            console.error('Error saving badge:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePointsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (currentModal === 'grant') {
                await grantPoints({
                    user_id: pointsFormData.user_id,
                    points: pointsFormData.points,
                    reason: pointsFormData.reason,
                });
            } else if (currentModal === 'deduct') {
                await deductPoints({
                    user_id: pointsFormData.user_id,
                    points: pointsFormData.points,
                    reason: pointsFormData.reason,
                });
            }

            await loadPointsLog();
            handleCloseModal();
        } catch (err: any) {
            alert(err.message || 'Failed to process points');
            console.error('Error processing points:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const badgeColumns = [
        {
            key: 'name',
            label: 'Badge',
            render: (value: string, row: Badge) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-md)' }}>
                    {row.icon_url ? (
                        <img
                            src={row.icon_url}
                            alt={row.name}
                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                    ) : (
                        <span style={{ fontSize: '2rem' }}>🏅</span>
                    )}
                    <span style={{ fontWeight: 'var(--admin-font-semibold)' }}>{value}</span>
                </div>
            ),
        },
        {
            key: 'min_points',
            label: 'Point Range',
            render: (value: number, row: Badge) => (
                <span style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>
                    {value.toLocaleString()} - {row.max_points ? row.max_points.toLocaleString() : '∞'} pts
                </span>
            ),
        },
        {
            key: 'users_assigned_count',
            label: 'Users Earned',
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (value: boolean) => <StatusPill status={value ? 'active' : 'inactive'} />,
        },
    ];

    const pointsColumns = [
        {
            key: 'user',
            label: 'User',
            render: (value: any) => value.name,
        },
        {
            key: 'source_code',
            label: 'Action',
            render: (value: string) => value.replace('ADMIN_', '').replace('_', ' '),
        },
        {
            key: 'points',
            label: 'Points',
            render: (value: number) => {
                const isPositive = value > 0;
                return (
                    <span
                        style={{
                            color: isPositive ? 'var(--admin-mint-green)' : 'var(--admin-error-coral)',
                            fontWeight: 'var(--admin-font-semibold)',
                        }}
                    >
                        {isPositive ? '+' : ''}
                        {value}
                    </span>
                );
            },
        },
        {
            key: 'description',
            label: 'Description',
        },
        {
            key: 'created_at',
            label: 'Timestamp',
            render: (value: string) => (
                <span style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                    {new Date(value).toLocaleString()}
                </span>
            ),
        },
    ];

    const leaderboardColumns = [
        {
            key: 'rank',
            label: 'Rank',
            render: (value: number) => (
                <span
                    style={{
                        fontWeight: 'var(--admin-font-bold)',
                        fontSize: 'var(--admin-text-lg)',
                        color: value <= 3 ? 'var(--admin-reward-yellow)' : 'inherit',
                    }}
                >
                    #{value}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'User',
        },
        {
            key: 'total_points',
            label: 'Points',
            render: (value: number) => (
                <span style={{ color: 'var(--admin-reward-yellow)', fontWeight: 'var(--admin-font-semibold)' }}>
                    {value.toLocaleString()} pts
                </span>
            ),
        },
        {
            key: 'badge',
            label: 'Badge',
            render: (value: any) => (value ? value.name : 'No Badge'),
        },
    ];

    const badgeActions = [
        {
            label: 'Edit Badge',
            icon: '✏️',
            onClick: (row: Badge) => handleOpenBadgeModal(row),
        },
    ];

    return (
        <AdminLayout
            pageTitle="Gamification Management"
            headerActions={
                <button className="admin-btn admin-btn-primary" onClick={() => handleOpenBadgeModal()}>
                    + Create Badge
                </button>
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

                {loading && (
                    <div style={{ padding: 'var(--admin-space-xl)', textAlign: 'center' }}>
                        <p>Loading badges...</p>
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            padding: 'var(--admin-space-lg)',
                            backgroundColor: 'var(--admin-error-coral)',
                            color: 'white',
                            borderRadius: 'var(--admin-radius-md)',
                            marginBottom: 'var(--admin-space-lg)',
                        }}
                    >
                        Error: {error}
                    </div>
                )}

                {!loading && !error && <DataTable columns={badgeColumns} data={badges} actions={badgeActions} />}
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
                        <button className="admin-btn admin-btn-success admin-btn-sm" onClick={handleOpenGrantModal}>
                            Grant Points
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleOpenDeductModal}>
                            Deduct Points
                        </button>
                        <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={handleOpenLeaderboardModal}
                        >
                            View Leaderboard
                        </button>
                    </div>
                </div>

                {pointsLoading ? (
                    <div style={{ padding: 'var(--admin-space-xl)', textAlign: 'center' }}>
                        <p>Loading points log...</p>
                    </div>
                ) : (
                    <DataTable columns={pointsColumns} data={pointsLog} />
                )}
            </div>

            {/* Badge Create/Edit Modal */}
            {currentModal === 'badge' && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--admin-radius-lg)',
                            padding: 'var(--admin-space-2xl)',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            style={{
                                fontSize: 'var(--admin-text-2xl)',
                                fontWeight: 'var(--admin-font-bold)',
                                marginBottom: 'var(--admin-space-xl)',
                            }}
                        >
                            {editingBadge ? 'Edit Badge' : 'Create New Badge'}
                        </h2>

                        <form onSubmit={handleBadgeSubmit}>
                            <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    Badge Name *
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={badgeFormData.name}
                                    onChange={(e) => setBadgeFormData({ ...badgeFormData, name: e.target.value })}
                                    required
                                    placeholder="e.g., Gold Champion"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    Description *
                                </label>
                                <textarea
                                    className="admin-input"
                                    value={badgeFormData.description}
                                    onChange={(e) =>
                                        setBadgeFormData({ ...badgeFormData, description: e.target.value })
                                    }
                                    required
                                    rows={3}
                                    placeholder="Badge description"
                                />
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 'var(--admin-space-lg)',
                                    marginBottom: 'var(--admin-space-lg)',
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: 'var(--admin-space-sm)',
                                            fontWeight: 'var(--admin-font-semibold)',
                                        }}
                                    >
                                        Min Points *
                                    </label>
                                    <input
                                        type="number"
                                        className="admin-input"
                                        value={badgeFormData.min_points}
                                        onChange={(e) =>
                                            setBadgeFormData({
                                                ...badgeFormData,
                                                min_points: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        required
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: 'var(--admin-space-sm)',
                                            fontWeight: 'var(--admin-font-semibold)',
                                        }}
                                    >
                                        Max Points
                                    </label>
                                    <input
                                        type="number"
                                        className="admin-input"
                                        value={badgeFormData.max_points || ''}
                                        onChange={(e) =>
                                            setBadgeFormData({
                                                ...badgeFormData,
                                                max_points: e.target.value ? parseInt(e.target.value) : null,
                                            })
                                        }
                                        min="0"
                                        placeholder="Leave empty for ∞"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--admin-space-2xl)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    Icon URL
                                </label>
                                <input
                                    type="url"
                                    className="admin-input"
                                    value={badgeFormData.icon_url}
                                    onChange={(e) => setBadgeFormData({ ...badgeFormData, icon_url: e.target.value })}
                                    placeholder="https://example.com/icon.png"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--admin-space-md)', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editingBadge ? 'Update Badge' : 'Create Badge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grant/Deduct Points Modal */}
            {(currentModal === 'grant' || currentModal === 'deduct') && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--admin-radius-lg)',
                            padding: 'var(--admin-space-2xl)',
                            maxWidth: '500px',
                            width: '90%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            style={{
                                fontSize: 'var(--admin-text-2xl)',
                                fontWeight: 'var(--admin-font-bold)',
                                marginBottom: 'var(--admin-space-xl)',
                            }}
                        >
                            {currentModal === 'grant' ? 'Grant Points' : 'Deduct Points'}
                        </h2>

                        <form onSubmit={handlePointsSubmit}>
                            <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    User *
                                </label>
                                <select
                                    className="admin-select"
                                    value={pointsFormData.user_id}
                                    onChange={(e) => setPointsFormData({ ...pointsFormData, user_id: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: 'var(--admin-radius-md)',
                                        backgroundColor: 'var(--admin-surface)',
                                        color: 'var(--admin-text-primary)',
                                    }}
                                >
                                    <option value="">Select a learner</option>
                                    {learners.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    Points *
                                </label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    value={pointsFormData.points}
                                    onChange={(e) =>
                                        setPointsFormData({ ...pointsFormData, points: parseInt(e.target.value) || 0 })
                                    }
                                    required
                                    min="1"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--admin-space-2xl)' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--admin-space-sm)',
                                        fontWeight: 'var(--admin-font-semibold)',
                                    }}
                                >
                                    Reason *
                                </label>
                                <textarea
                                    className="admin-input"
                                    value={pointsFormData.reason}
                                    onChange={(e) => setPointsFormData({ ...pointsFormData, reason: e.target.value })}
                                    required
                                    rows={3}
                                    placeholder="Reason for points adjustment"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--admin-space-md)', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`admin-btn ${currentModal === 'grant' ? 'admin-btn-success' : 'admin-btn-danger'}`}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? 'Processing...'
                                        : currentModal === 'grant'
                                            ? 'Grant Points'
                                            : 'Deduct Points'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Leaderboard Modal */}
            {currentModal === 'leaderboard' && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--admin-radius-lg)',
                            padding: 'var(--admin-space-2xl)',
                            maxWidth: '800px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--admin-space-xl)',
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: 'var(--admin-text-2xl)',
                                    fontWeight: 'var(--admin-font-bold)',
                                }}
                            >
                                🏆 Leaderboard
                            </h2>
                            <button
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>

                        {leaderboard.length > 0 ? (
                            <DataTable columns={leaderboardColumns} data={leaderboard} />
                        ) : (
                            <div style={{ padding: 'var(--admin-space-xl)', textAlign: 'center' }}>
                                <p>No leaderboard data available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
