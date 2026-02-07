'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/ui/Modal';

export default function RolesPage() {
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const roles = [
        {
            id: 1,
            name: 'Admin',
            description: 'Full system access and control',
            userCount: 5,
            isSystem: true,
            permissions: {
                users: { view: true, create: true, edit: true, delete: true },
                courses: { view: true, create: true, edit: true, delete: true },
                content: { view: true, create: true, edit: true, delete: true },
                settings: { view: true, create: true, edit: true, delete: true },
            },
        },
        {
            id: 2,
            name: 'Instructor',
            description: 'Can create and manage courses',
            userCount: 42,
            isSystem: true,
            permissions: {
                users: { view: true, create: false, edit: false, delete: false },
                courses: { view: true, create: true, edit: true, delete: false },
                content: { view: true, create: true, edit: true, delete: true },
                settings: { view: false, create: false, edit: false, delete: false },
            },
        },
        {
            id: 3,
            name: 'Learner',
            description: 'Can enroll in and complete courses',
            userCount: 2800,
            isSystem: true,
            permissions: {
                users: { view: false, create: false, edit: false, delete: false },
                courses: { view: true, create: false, edit: false, delete: false },
                content: { view: true, create: false, edit: false, delete: false },
                settings: { view: false, create: false, edit: false, delete: false },
            },
        },
    ];

    const openRoleEditor = (role: any) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout
            pageTitle="Role Management"
            headerActions={
                <button className="admin-btn admin-btn-primary">
                    + Create Custom Role
                </button>
            }
        >
            {/* Roles List */}
            <div style={{ display: 'grid', gap: 'var(--admin-space-xl)' }}>
                {roles.map((role) => (
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
                                    {role.isSystem && (
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
                                </div>
                                <p
                                    style={{
                                        fontSize: 'var(--admin-text-sm)',
                                        color: 'var(--admin-text-secondary)',
                                        marginBottom: 'var(--admin-space-md)',
                                    }}
                                >
                                    {role.description}
                                </p>
                                <p
                                    style={{
                                        fontSize: 'var(--admin-text-xs)',
                                        color: 'var(--admin-text-muted)',
                                    }}
                                >
                                    <strong>{role.userCount}</strong> users assigned
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--admin-space-sm)' }}>
                                <button
                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                    onClick={() => openRoleEditor(role)}
                                >
                                    View Permissions
                                </button>
                                {!role.isSystem && (
                                    <>
                                        <button className="admin-btn admin-btn-secondary admin-btn-sm">
                                            Clone
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

            {/* Role Editor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${selectedRole?.name} - Permissions`}
                size="lg"
                footer={
                    <>
                        <button className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Close
                        </button>
                        {!selectedRole?.isSystem && (
                            <button className="admin-btn admin-btn-primary">
                                Save Changes
                            </button>
                        )}
                    </>
                }
            >
                {selectedRole && (
                    <div>
                        <p style={{ marginBottom: 'var(--admin-space-xl)', color: 'var(--admin-text-secondary)' }}>
                            Configure permissions for the <strong>{selectedRole.name}</strong> role.
                            {selectedRole.isSystem && ' System roles cannot be modified.'}
                        </p>

                        {/* Permissions Grid */}
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Module</th>
                                    <th style={{ textAlign: 'center' }}>View</th>
                                    <th style={{ textAlign: 'center' }}>Create</th>
                                    <th style={{ textAlign: 'center' }}>Edit</th>
                                    <th style={{ textAlign: 'center' }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(selectedRole.permissions).map(([module, perms]: [string, any]) => (
                                    <tr key={module}>
                                        <td style={{ fontWeight: 'var(--admin-font-medium)', textTransform: 'capitalize' }}>
                                            {module}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={perms.view}
                                                disabled={selectedRole.isSystem}
                                                className="admin-checkbox"
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={perms.create}
                                                disabled={selectedRole.isSystem}
                                                className="admin-checkbox"
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={perms.edit}
                                                disabled={selectedRole.isSystem}
                                                className="admin-checkbox"
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={perms.delete}
                                                disabled={selectedRole.isSystem}
                                                className="admin-checkbox"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
