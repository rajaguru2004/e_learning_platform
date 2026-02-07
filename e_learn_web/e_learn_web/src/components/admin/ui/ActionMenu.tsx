'use client';

import React, { useState } from 'react';

interface ActionMenuItem {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'primary';
    icon?: string;
}

interface ActionMenuProps {
    items: ActionMenuItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getItemColor = (variant?: 'default' | 'danger' | 'primary') => {
        switch (variant) {
            case 'danger':
                return 'var(--admin-error-coral)';
            case 'primary':
                return 'var(--admin-primary-blue)';
            default:
                return 'var(--admin-text-primary)';
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Menu Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: 'var(--admin-space-sm)',
                    background: 'transparent',
                    border: '1px solid var(--admin-border-medium)',
                    borderRadius: 'var(--admin-radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--admin-text-sm)',
                    color: 'var(--admin-text-secondary)',
                    transition: 'all var(--admin-transition-base)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                    e.currentTarget.style.borderColor = 'var(--admin-border-dark)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--admin-border-medium)';
                }}
            >
                ⋮
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close menu */}
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999,
                        }}
                    />

                    {/* Menu Items */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            right: 0,
                            minWidth: '200px',
                            background: 'var(--admin-bg-surface)',
                            border: '1px solid var(--admin-border-light)',
                            borderRadius: 'var(--admin-radius-md)',
                            boxShadow: 'var(--admin-shadow-lg)',
                            padding: 'var(--admin-space-sm)',
                            zIndex: 1000,
                        }}
                    >
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--admin-space-sm)',
                                    padding: 'var(--admin-space-md)',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: 'var(--admin-radius-sm)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--admin-text-sm)',
                                    fontWeight: 'var(--admin-font-normal)',
                                    color: getItemColor(item.variant),
                                    textAlign: 'left',
                                    transition: 'background var(--admin-transition-fast)',
                                    fontFamily: 'var(--admin-font-family)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {item.icon && <span>{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
