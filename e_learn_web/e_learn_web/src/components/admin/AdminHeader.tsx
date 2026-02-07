'use client';

import React from 'react';

interface AdminHeaderProps {
    title: string;
    actions?: React.ReactNode;
}

export default function AdminHeader({ title, actions }: AdminHeaderProps) {
    return (
        <header
            style={{
                height: 'var(--admin-header-height)',
                background: 'var(--admin-bg-surface)',
                borderBottom: '1px solid var(--admin-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--admin-space-2xl)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            {/* Page Title */}
            <h1
                style={{
                    fontSize: 'var(--admin-text-2xl)',
                    fontWeight: 'var(--admin-font-bold)',
                    color: 'var(--admin-text-primary)',
                }}
            >
                {title}
            </h1>

            {/* Actions and User Info */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-lg)',
                }}
            >
                {/* Optional Action Buttons */}
                {actions && <div style={{ display: 'flex', gap: 'var(--admin-space-md)' }}>{actions}</div>}

                {/* Admin User Info */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--admin-space-md)',
                        padding: 'var(--admin-space-sm) var(--admin-space-md)',
                        background: 'var(--admin-bg-secondary)',
                        borderRadius: 'var(--admin-radius-lg)',
                        cursor: 'pointer',
                        transition: 'background var(--admin-transition-base)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            background: 'var(--admin-primary-blue)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--admin-text-white)',
                            fontSize: 'var(--admin-text-sm)',
                            fontWeight: 'var(--admin-font-semibold)',
                        }}
                    >
                        AD
                    </div>

                    {/* User Info */}
                    <div>
                        <p
                            style={{
                                fontSize: 'var(--admin-text-sm)',
                                fontWeight: 'var(--admin-font-medium)',
                                color: 'var(--admin-text-primary)',
                                lineHeight: 1.2,
                                marginBottom: '0.125rem',
                            }}
                        >
                            Admin User
                        </p>
                        <p
                            style={{
                                fontSize: 'var(--admin-text-xs)',
                                color: 'var(--admin-text-secondary)',
                                lineHeight: 1,
                            }}
                        >
                            System Administrator
                        </p>
                    </div>

                    {/* Dropdown Arrow */}
                    <span
                        style={{
                            fontSize: 'var(--admin-text-xs)',
                            color: 'var(--admin-text-muted)',
                        }}
                    >
                        ▼
                    </span>
                </div>
            </div>
        </header>
    );
}
