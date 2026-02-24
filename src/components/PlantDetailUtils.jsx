import React from 'react';

export const renderValue = (val, fallback = '---') => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
};

export const getToxicityColor = (level) => {
    const lvl = Number(level);
    switch (lvl) {
        case 1:
            return '#00ff9d'; // Neon Green
        case 2:
            return '#a3e635'; // Lime Green
        case 3:
            return '#facc15'; // Cyber Yellow
        case 4:
            return '#fb923c'; // Neon Orange
        case 5:
            return '#fa4e67'; // Cyber Red/Pink (Design Match)
        default:
            return 'var(--text-secondary)';
    }
};

export const MetricBox = ({ icon: Icon, label, value }) => {
    if (!Icon) return null;
    return (
        <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid var(--accent-color)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon size={14} color="var(--accent-color)" />
                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(value)}</div>
        </div>
    );
};
