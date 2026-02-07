import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: 'blue' | 'mint' | 'yellow' | 'coral';
}

export default function StatsCard({ title, value, subtitle, icon, color = 'blue' }: StatsCardProps) {
    const colorMap = {
        blue: 'var(--admin-primary-blue)',
        mint: 'var(--admin-mint-green)',
        yellow: 'var(--admin-reward-yellow)',
        coral: 'var(--admin-error-coral)',
    };

    const accentColor = colorMap[color];

    return (
        <div className="admin-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Color Accent Bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: accentColor,
                }}
            />

            {/* Card Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <p
                        style={{
                            fontSize: 'var(--admin-text-sm)',
                            fontWeight: 'var(--admin-font-medium)',
                            color: 'var(--admin-text-secondary)',
                            marginBottom: 'var(--admin-space-sm)',
                        }}
                    >
                        {title}
                    </p>
                    <h3
                        style={{
                            fontSize: 'var(--admin-text-3xl)',
                            fontWeight: 'var(--admin-font-bold)',
                            color: 'var(--admin-text-primary)',
                            lineHeight: 1,
                            marginBottom: subtitle ? 'var(--admin-space-xs)' : '0',
                        }}
                    >
                        {value}
                    </h3>
                    {subtitle && (
                        <p
                            style={{
                                fontSize: 'var(--admin-text-xs)',
                                color: 'var(--admin-text-muted)',
                                marginTop: 'var(--admin-space-xs)',
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Icon */}
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--admin-radius-lg)',
                        background: `${accentColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
