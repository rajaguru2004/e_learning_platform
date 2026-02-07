'use client';

import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../app/admin/admin.css';

interface AdminLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    headerActions?: React.ReactNode;
}

export default function AdminLayout({ children, pageTitle, headerActions }: AdminLayoutProps) {
    return (
        <div className="admin-container">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div
                style={{
                    marginLeft: 'var(--admin-sidebar-width)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <AdminHeader title={pageTitle} actions={headerActions} />

                {/* Page Content */}
                <main
                    style={{
                        flex: 1,
                        padding: 'var(--admin-space-2xl)',
                        background: 'var(--admin-bg-secondary)',
                    }}
                    className="admin-fade-in"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
