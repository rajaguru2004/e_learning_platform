'use client';

import React from 'react';
import ActionMenu from './ActionMenu';

interface ActionMenuItem {
    label: string;
    onClick: (row: any) => void;
    variant?: 'default' | 'danger' | 'primary';
    icon?: string;
}

interface DataTableColumn {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps {
    columns: DataTableColumn[];
    data: any[];
    actions?: ActionMenuItem[];
    emptyMessage?: string;
}

export default function DataTable({ columns, data, actions, emptyMessage = 'No data available' }: DataTableProps) {
    if (data.length === 0) {
        return (
            <div
                className="admin-card"
                style={{
                    padding: 'var(--admin-space-3xl)',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        fontSize: 'var(--admin-text-base)',
                        color: 'var(--admin-text-muted)',
                    }}
                >
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div
            className="admin-card"
            style={{
                padding: 0,
                overflow: 'hidden',
            }}
        >
            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>
                                    {column.label}
                                </th>
                            ))}
                            {actions && actions.length > 0 && <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                                {actions && actions.length > 0 && (
                                    <td style={{ textAlign: 'center' }}>
                                        <ActionMenu
                                            items={actions.map((action) => ({
                                                ...action,
                                                onClick: () => action.onClick(row),
                                            }))}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
