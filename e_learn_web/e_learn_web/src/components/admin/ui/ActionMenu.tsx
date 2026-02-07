'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Update position when menu opens
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            // Default to aligning right edge of menu with right edge of button
            // But we need to check if that puts it off screen
            // For now, let's just default to a safe position relative to the button

            // Calculate position: below the button, aligned to the right
            setPosition({
                top: rect.bottom + scrollY + 4,
                left: rect.right + scrollX - 200, // Assuming 200px width, align right
            });
        }
    }, [isOpen]);

    // Handle scroll and resize to close menu
    useEffect(() => {
        if (!isOpen) return;

        const handleScrollOrResize = () => setIsOpen(false);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen]);

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
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Menu Trigger Button */}
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                style={{
                    padding: 'var(--admin-space-sm)',
                    background: 'transparent',
                    border: '1px solid var(--admin-border-medium)',
                    borderRadius: 'var(--admin-radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--admin-text-sm)',
                    color: 'var(--admin-text-secondary)',
                    transition: 'all var(--admin-transition-base)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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

            {/* Dropdown Menu via Portal */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <>
                    {/* Backdrop to close menu */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            cursor: 'default',
                        }}
                    />

                    {/* Menu Items */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            width: '200px',
                            background: '#ffffff',
                            border: '1px solid var(--admin-border-light)',
                            borderRadius: 'var(--admin-radius-md)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            padding: 'var(--admin-space-sm)',
                            zIndex: 10000,
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
                                    fontWeight: '500',
                                    color: getItemColor(item.variant),
                                    textAlign: 'left',
                                    transition: 'background 0.2s ease',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
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
                </>,
                document.body
            )}
        </div>
    );
}
