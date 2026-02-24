import React from 'react';

/**
 * PlantGrid Component
 * Displays a grid of botanical specimens retrieved from the archive.
 */
const PlantGrid = ({ plants, onSelectPlant }) => {
    if (!plants || plants.length === 0) return null;

    return (
        <div style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
        }}>
            {plants.map((r, index) => (
                <button
                    key={r.id || index}
                    onClick={() => onSelectPlant(r.scientific_name)}
                    className="glass-panel hud-border"
                    style={{
                        padding: '20px',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                    }}
                >

                    <div style={{ fontWeight: 600, color: 'var(--accent-color)', }}>
                        {r.scientific_name}
                    </div>
                    <div style={{

                        fontSize: '0.7rem',
                        color: 'var(--text-primary)',
                        fontStyle: 'italic'
                    }}>
                        {r.name} <div>{r.popular_name}</div>
                    </div>
                    <div style={{

                        fontSize: '0.8rem',
                        color: '#ffb700',
                        fontStyle: 'italic'
                    }}>
                        {r.type}
                    </div>
                    <div style={{

                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic'
                    }}>
                        {r.origin}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default PlantGrid;
