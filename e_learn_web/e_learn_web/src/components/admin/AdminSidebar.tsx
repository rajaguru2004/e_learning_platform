'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isInstructor } from '@/lib/auth';

interface NavItem {
    label: string;
    href: string;
    icon: string;
    children?: NavItem[];
}

const navigationItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: '📊',
    },
    {
        label: 'My Courses',
        href: '/admin/instructor/dashboard',
        icon: '📝',
    },
    {
        label: 'Enrollment Stats',
        href: '/admin/instructor/stats',
        icon: '📈',
    },
    {
        label: 'User Management',
        href: '/admin/users',
        icon: '👥',
    },
    {
        label: 'Role Management',
        href: '/admin/roles',
        icon: '🔐',
    },
    {
        label: 'Course Governance',
        href: '/admin/courses',
        icon: '📚',
        children: [
            { label: 'Course Oversight', href: '/admin/courses', icon: '' },
            { label: 'Course Approval', href: '/admin/courses/approval', icon: '' },
            { label: 'Enrollment Management', href: '/admin/enrollments', icon: '' },
        ],
    },
    {
        label: 'Gamification',
        href: '/admin/gamification',
        icon: '🏆',
    },
    {
        label: 'Review Moderation',
        href: '/admin/reviews',
        icon: '⭐',
    },
    {
        label: 'Analytics & Reports',
        href: '/admin/analytics',
        icon: '📈',
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = useState<string | null>('Course Governance');
    const [isUserInstructor, setIsUserInstructor] = useState(false);

    useEffect(() => {
        setIsUserInstructor(isInstructor());
    }, []);

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    const toggleExpand = (label: string) => {
        setExpandedItem(expandedItem === label ? null : label);
    };

    return (
        <aside
            style={{
                width: 'var(--admin-sidebar-width)',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                background: 'var(--admin-bg-surface)',
                borderRight: '1px solid var(--admin-border-light)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Logo / Branding */}
            <div
                style={{
                    padding: 'var(--admin-space-xl)',
                    borderBottom: '1px solid var(--admin-border-light)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--admin-space-md)',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--admin-primary-blue)',
                            borderRadius: 'var(--admin-radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                        }}
                    >
                        🎓
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: 'var(--admin-text-lg)',
                                fontWeight: 'var(--admin-font-bold)',
                                color: 'var(--admin-text-primary)',
                                lineHeight: 1,
                                marginBottom: '0.25rem',
                            }}
                        >
                            Metis.
                        </h1>
                        <p
                            style={{
                                fontSize: 'var(--admin-text-xs)',
                                color: 'var(--admin-text-secondary)',
                                fontWeight: 'var(--admin-font-medium)',
                            }}
                        >
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav
                style={{
                    flex: 1,
                    padding: 'var(--admin-space-lg) 0',
                }}
            >
                {navigationItems
                    .filter((item) => {
                        // If user is instructor, show "My Courses" and "Enrollment Stats"
                        if (isUserInstructor) {
                            return ['My Courses', 'Enrollment Stats'].includes(item.label);
                        }
                        // For non-instructors, show everything EXCEPT those
                        return !['My Courses', 'Enrollment Stats'].includes(item.label);
                    })
                    .map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleExpand(item.label)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--admin-space-md) var(--admin-space-xl)',
                                            fontSize: 'var(--admin-text-sm)',
                                            fontWeight: 'var(--admin-font-medium)',
                                            color: isActive(item.href)
                                                ? 'var(--admin-primary-blue)'
                                                : 'var(--admin-text-secondary)',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all var(--admin-transition-base)',
                                            fontFamily: 'var(--admin-font-family)',
                                            textAlign: 'left',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive(item.href)) {
                                                e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive(item.href)) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-md)' }}>
                                            <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                                            {item.label}
                                        </span>
                                        <span style={{ fontSize: '0.75rem' }}>
                                            {expandedItem === item.label ? '▼' : '▶'}
                                        </span>
                                    </button>
                                    {expandedItem === item.label && (
                                        <div style={{ paddingLeft: 'var(--admin-space-2xl)' }}>
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    style={{
                                                        display: 'block',
                                                        padding: 'var(--admin-space-sm) var(--admin-space-xl)',
                                                        fontSize: 'var(--admin-text-sm)',
                                                        fontWeight: 'var(--admin-font-normal)',
                                                        color: isActive(child.href)
                                                            ? 'var(--admin-primary-blue)'
                                                            : 'var(--admin-text-secondary)',
                                                        textDecoration: 'none',
                                                        borderLeft: isActive(child.href)
                                                            ? '3px solid var(--admin-primary-blue)'
                                                            : '3px solid transparent',
                                                        transition: 'all var(--admin-transition-base)',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isActive(child.href)) {
                                                            e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                                                            e.currentTarget.style.color = 'var(--admin-text-primary)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isActive(child.href)) {
                                                            e.currentTarget.style.background = 'transparent';
                                                            e.currentTarget.style.color = 'var(--admin-text-secondary)';
                                                        }
                                                    }}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--admin-space-md)',
                                        padding: 'var(--admin-space-md) var(--admin-space-xl)',
                                        fontSize: 'var(--admin-text-sm)',
                                        fontWeight: 'var(--admin-font-medium)',
                                        color: isActive(item.href)
                                            ? 'var(--admin-primary-blue)'
                                            : 'var(--admin-text-secondary)',
                                        textDecoration: 'none',
                                        background: isActive(item.href) ? 'rgba(31, 60, 136, 0.05)' : 'transparent',
                                        borderLeft: isActive(item.href)
                                            ? '3px solid var(--admin-primary-blue)'
                                            : '3px solid transparent',
                                        transition: 'all var(--admin-transition-base)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive(item.href)) {
                                            e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                                            e.currentTarget.style.color = 'var(--admin-text-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive(item.href)) {
                                            e.currentTarget.style.background = isActive(item.href)
                                                ? 'rgba(31, 60, 136, 0.05)'
                                                : 'transparent';
                                            e.currentTarget.style.color = isActive(item.href)
                                                ? 'var(--admin-primary-blue)'
                                                : 'var(--admin-text-secondary)';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
            </nav>

            {/* Footer / Version Info */}
            <div
                style={{
                    padding: 'var(--admin-space-lg) var(--admin-space-xl)',
                    borderTop: '1px solid var(--admin-border-light)',
                    fontSize: 'var(--admin-text-xs)',
                    color: 'var(--admin-text-muted)',
                }}
            >
                <p>Metis Platform v1.0</p>
                <p>© 2026 Admin Panel</p>
            </div>
        </aside>
    );
}
