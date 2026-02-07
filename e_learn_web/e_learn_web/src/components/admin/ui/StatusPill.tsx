import React from 'react';

type StatusType =
    | 'active'
    | 'inactive'
    | 'draft'
    | 'published'
    | 'archived'
    | 'rejected'
    | 'under-review'
    | 'approved';

interface StatusPillProps {
    status: StatusType;
    label?: string;
}

export default function StatusPill({ status, label }: StatusPillProps) {
    const statusConfig: Record<StatusType, { label: string; className: string }> = {
        active: { label: 'Active', className: 'admin-pill-active' },
        inactive: { label: 'Inactive', className: 'admin-pill-inactive' },
        draft: { label: 'Draft', className: 'admin-pill-draft' },
        published: { label: 'Published', className: 'admin-pill-published' },
        archived: { label: 'Archived', className: 'admin-pill-archived' },
        rejected: { label: 'Rejected', className: 'admin-pill-rejected' },
        'under-review': { label: 'Under Review', className: 'admin-pill-under-review' },
        approved: { label: 'Approved', className: 'admin-pill-published' },
    };

    const config = statusConfig[status];
    const displayLabel = label || config.label;

    return <span className={`admin-pill ${config.className}`}>{displayLabel}</span>;
}
