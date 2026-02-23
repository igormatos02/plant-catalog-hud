import React from 'react';

const About = () => {
    return (
        <div className="about-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="neon-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>ABOUT US</h1>
                <div style={{ height: '2px', width: '60px', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-glow)' }} />
            </header>

            <section className="glass-panel" style={{ padding: '40px', borderRadius: '12px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    Welcome to <span className="neon-text">A.G. BOTANICS</span>, where cutting-edge technology meets the timeless beauty of the natural world.
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Our mission is to archive and analyze every plant species on the planet using advanced neural networks and deep-learning algorithms.
                    By combining botanical science with high-fidelity digital visualization, we provide an unparalleled biological reference system.
                </p>

                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="hud-border" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="mono" style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>PRECISION</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Atomic-level scanning of botanical structures.</p>
                    </div>
                    <div className="hud-border" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="mono" style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>INTELLIGENCE</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI-driven taxonomic classification and analysis.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
