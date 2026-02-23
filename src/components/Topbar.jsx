import React from 'react';
import { Wifi, Battery, Search, Bell } from 'lucide-react';

const Topbar = ({ language, setLanguage }) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'pt', label: 'PT' },
        { code: 'fi', label: 'FI' },
        { code: 'de', label: 'DE' },
        { code: 'uk', label: 'UK' }
    ];

    return (
        <div
            className="glass-panel"
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                left: 0,
                height: 'var(--topbar-height)',
                zIndex: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 40px',
                borderBottom: '1px solid var(--border-color)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Language Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>LANG:</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className="mono"
                                style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    background: language === lang.code ? 'var(--accent-color)' : 'transparent',
                                    color: language === lang.code ? 'var(--bg-color)' : 'var(--text-secondary)',
                                    border: `1px solid ${language === lang.code ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
                <div className="mono" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem' }}>STATUS:</span>
                    <span style={{ color: 'var(--accent-color)' }}>OPTIMAL</span>
                </div>

                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
                    <Bell size={18} />
                    <Wifi size={18} />
                    <Battery size={18} />
                </div>

                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />

                <div className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {currentTime}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
