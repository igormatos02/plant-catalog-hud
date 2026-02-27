import React from 'react';
import { translations } from '../lib/translations';

const About = ({ language }) => {
    const t = translations[language] || translations.en;
    const info = t.aboutPage;

    return (
        <div className="about-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="neon-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>{info.title}</h1>
                <div style={{ height: '2px', width: '60px', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-glow)' }} />
            </header>

            <section className="glass-panel" style={{ padding: '40px', borderRadius: '12px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {info.welcome.split('A.G. BOTANICS')[0]}<span className="neon-text">A.G. BOTANICS</span>{info.welcome.split('A.G. BOTANICS')[1]}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {info.mission}
                </p>

                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="hud-border" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="mono" style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>{info.precision}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{info.precisionText}</p>
                    </div>
                    <div className="hud-border" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="mono" style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>{info.intelligence}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{info.intelligenceText}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
