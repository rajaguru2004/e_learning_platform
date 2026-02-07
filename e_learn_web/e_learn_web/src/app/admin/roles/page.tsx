'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/ui/Modal';
import { fetchRoles, createRole } from '@/lib/api';
import { Role, RolesData } from '@/types/roles';

export default function RolesPage() {
    const [rolesData, setRolesData] = useState<RolesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Form state for creating a role
    const [newRoleName, setNewRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // Available permissions (you can expand this list based on your backend)
    const availablePermissions = [
        'CREATE_COURSE',
        'EDIT_COURSE',
        'DELETE_COURSE',
        'VIEW_COURSE',
        'CREATE_USER',
        'EDIT_USER',
        'DELETE_USER',
        'VIEW_USER',
        'MANAGE_ROLES',
        'VIEW_ANALYTICS',
        'MANAGE_SETTINGS',
        'APPROVE_CONTENT',
    ];

    // Fetch roles data
    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchRoles();
            setRolesData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load roles');
            console.error('Error loading roles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const openRoleDetails = (role: Role) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) {
            setCreateError('Role name is required');
            return;
        }

        if (selectedPermissions.length === 0) {
            setCreateError('Please select at least one permission');
            return;
        }

        try {
            setIsCreating(true);
            setCreateError(null);
            await createRole({
                name: newRoleName,
                permissions: selectedPermissions,
            });

            // Reset form
            setNewRoleName('');
            setSelectedPermissions([]);
            setIsCreateModalOpen(false);

            // Reload roles
            loadRoles();
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create role');
            console.error('Error creating role:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const togglePermission = (permission: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    return (
        <AdminLayout
            pageTitle="Role Management"
            headerActions={
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    + Create Custom Role
                </button>
            }
        >
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
                        <span>Loading roles...</span>
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
                        Error Loading Roles
                    </h3>
                    <p style={{ fontSize: 'var(--admin-text-base)' }}>{error}</p>
                    <button
                        onClick={loadRoles}
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

            {/* Success State - Roles List */}
            {rolesData && !isLoading && !error && (
                <div style={{ display: 'grid', gap: 'var(--admin-space-xl)' }}>
                    {rolesData.roles.map((role) => (
                        <div key={role.id} className="admin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-md)', marginBottom: 'var(--admin-space-sm)' }}>
                                        <h3
                                            style={{
                                                fontSize: 'var(--admin-text-xl)',
                                                fontWeight: 'var(--admin-font-semibold)',
                                                color: 'var(--admin-text-primary)',
                                            }}
                                        >
                                            {role.name}
                                        </h3>
                                        {role.isSystemRole && (
                                            <span
                                                className="admin-pill"
                                                style={{
                                                    background: 'rgba(31, 60, 136, 0.1)',
                                                    color: 'var(--admin-primary-blue)',
                                                }}
                                            >
                                                System Role
                                            </span>
                                        )}
                                        {role.isActive ? (
                                            <span
                                                className="admin-pill"
                                                style={{
                                                    background: 'rgba(46, 196, 182, 0.1)',
                                                    color: 'var(--admin-mint-green)',
                                                }}
                                            >
                                                Active
                                            </span>
                                        ) : (
                                            <span
                                                className="admin-pill"
                                                style={{
                                                    background: 'rgba(142, 142, 142, 0.1)',
                                                    color: 'var(--admin-text-secondary)',
                                                }}
                                            >
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 'var(--admin-text-sm)',
                                            color: 'var(--admin-text-secondary)',
                                            marginBottom: 'var(--admin-space-md)',
                                        }}
                                    >
                                        Code: <strong>{role.code}</strong>
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 'var(--admin-text-xs)',
                                            color: 'var(--admin-text-muted)',
                                        }}
                                    >
                                        <strong>{role.permissionsCount}</strong> permissions • Created {new Date(role.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--admin-space-sm)' }}>
                                    <button
                                        className="admin-btn admin-btn-secondary admin-btn-sm"
                                        onClick={() => openRoleDetails(role)}
                                    >
                                        View Details
                                    </button>
                                    {!role.isSystemRole && (
                                        <>
                                            <button className="admin-btn admin-btn-secondary admin-btn-sm">
                                                Edit
                                            </button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Role Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${selectedRole?.name} - Details`}
                size="md"
                footer={
                    <button className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </button>
                }
            >
                {selectedRole && (
                    <div>
                        <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-sm)' }}>
                                <strong>Role Code:</strong>
                            </p>
                            <p style={{ fontSize: 'var(--admin-text-base)' }}>{selectedRole.code}</p>
                        </div>

                        <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-sm)' }}>
                                <strong>Type:</strong>
                            </p>
                            <p style={{ fontSize: 'var(--admin-text-base)' }}>
                                {selectedRole.isSystemRole ? 'System Role (Cannot be modified)' : 'Custom Role'}
                            </p>
                        </div>

                        <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-sm)' }}>
                                <strong>Status:</strong>
                            </p>
                            <p style={{ fontSize: 'var(--admin-text-base)' }}>
                                {selectedRole.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>

                        <div style={{ marginBottom: 'var(--admin-space-lg)' }}>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-sm)' }}>
                                <strong>Permissions:</strong>
                            </p>
                            <p style={{ fontSize: 'var(--admin-text-base)' }}>
                                {selectedRole.permissionsCount} permission{selectedRole.permissionsCount !== 1 ? 's' : ''} assigned
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-sm)' }}>
                                <strong>Created:</strong>
                            </p>
                            <p style={{ fontSize: 'var(--admin-text-base)' }}>
                                {new Date(selectedRole.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Role Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setNewRoleName('');
                    setSelectedPermissions([]);
                    setCreateError(null);
                }}
                title="Create Custom Role"
                size="lg"
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setNewRoleName('');
                                setSelectedPermissions([]);
                                setCreateError(null);
                            }}
                            disabled={isCreating}
                        >
                            Cancel
                        </button>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={handleCreateRole}
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Create Role'}
                        </button>
                    </>
                }
            >
                <div>
                    {createError && (
                        <div style={{
                            padding: 'var(--admin-space-md)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--admin-radius-md)',
                            color: '#dc2626',
                            marginBottom: 'var(--admin-space-lg)',
                            fontSize: 'var(--admin-text-sm)',
                        }}>
                            {createError}
                        </div>
                    )}

                    <div style={{ marginBottom: 'var(--admin-space-xl)' }}>
                        <label
                            htmlFor="roleName"
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-sm)',
                            }}
                        >
                            Role Name <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                            id="roleName"
                            type="text"
                            className="admin-input"
                            placeholder="e.g., Content Manager"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            disabled={isCreating}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                marginBottom: 'var(--admin-space-md)',
                            }}
                        >
                            Permissions <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 'var(--admin-space-md)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: 'var(--admin-space-md)',
                            border: '1px solid var(--admin-border-color)',
                            borderRadius: 'var(--admin-radius-md)',
                        }}>
                            {availablePermissions.map((permission) => (
                                <label
                                    key={permission}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--admin-space-sm)',
                                        cursor: 'pointer',
                                        padding: 'var(--admin-space-sm)',
                                        borderRadius: 'var(--admin-radius-sm)',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isCreating) {
                                            e.currentTarget.style.backgroundColor = 'var(--admin-bg-secondary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        className="admin-checkbox"
                                        checked={selectedPermissions.includes(permission)}
                                        onChange={() => togglePermission(permission)}
                                        disabled={isCreating}
                                    />
                                    <span style={{
                                        fontSize: 'var(--admin-text-sm)',
                                        color: 'var(--admin-text-primary)',
                                    }}>
                                        {permission.replace(/_/g, ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p style={{
                            fontSize: 'var(--admin-text-xs)',
                            color: 'var(--admin-text-secondary)',
                            marginTop: 'var(--admin-space-sm)',
                        }}>
                            {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
                        </p>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
