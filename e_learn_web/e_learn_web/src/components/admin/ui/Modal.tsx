'use client';

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizeMap = {
        sm: '400px',
        md: '600px',
        lg: '800px',
        xl: '1000px',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.2s ease-out',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: sizeMap[size],
                    maxHeight: '90vh',
                    background: 'var(--admin-bg-surface)',
                    borderRadius: 'var(--admin-radius-xl)',
                    boxShadow: 'var(--admin-shadow-lg)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: 'var(--admin-space-xl)',
                        borderBottom: '1px solid var(--admin-border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2
                        style={{
                            fontSize: 'var(--admin-text-xl)',
                            fontWeight: 'var(--admin-font-semibold)',
                            color: 'var(--admin-text-primary)',
                        }}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: 'var(--admin-text-2xl)',
                            color: 'var(--admin-text-muted)',
                            cursor: 'pointer',
                            padding: '0',
                            lineHeight: 1,
                            transition: 'color var(--admin-transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--admin-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--admin-text-muted)';
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        padding: 'var(--admin-space-xl)',
                        overflowY: 'auto',
                    }}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            padding: 'var(--admin-space-xl)',
                            borderTop: '1px solid var(--admin-border-light)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--admin-space-md)',
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}
