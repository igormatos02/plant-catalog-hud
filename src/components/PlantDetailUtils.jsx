import React from 'react';

export const renderValue = (val, fallback = '---') => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
};

export const parseToxicity = (level) => {
    if (level === undefined || level === null) return 0;
    // Try to extract a number first
    const match = String(level).match(/\d+/);
    if (match) {
        return Math.min(Number(match[0]), 5);
    }
    // Fallback for text-based levels
    const lower = String(level).toLowerCase();
    if (lower.includes('high') || lower.includes('alto') || lower.includes('alta') || lower.includes('sever')) return 5;
    if (lower.includes('medium') || lower.includes('médio') || lower.includes('media') || lower.includes('moderad')) return 3;
    if (lower.includes('low') || lower.includes('baixo') || lower.includes('baixa') || lower.includes('mild')) return 2;
    return 0;
};

export const getToxicityColor = (level) => {
    const lvl = parseToxicity(level);
    switch (lvl) {
        case 1:
        case 2:
            return '#00ff9d'; // Green
        case 3:
        case 4:
            return '#fb923c'; // Orange
        case 5:
            return '#ff3e3e'; // Red
        default:
            return 'var(--text-secondary)'; // Gray
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
