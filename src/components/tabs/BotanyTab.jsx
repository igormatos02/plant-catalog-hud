import React from 'react';
import { Maximize, Zap } from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const BotanyTab = ({ data, t }) => {
    return (
        <div style={{ display: 'grid', gap: '30px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                    CLASS: {renderValue(data.class?.toUpperCase(), 'UNKNOWN')}
                </div>
                <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    ORDER: {renderValue(data.order?.toUpperCase(), 'UNKNOWN')}
                </div>
                <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    FAMILY: {renderValue(data.family?.toUpperCase(), 'UNKNOWN')}
                </div>
                <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    GENUS: {renderValue(data.genus?.toUpperCase(), 'UNKNOWN')}
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Maximize size={16} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.specimenSize}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{renderValue(data.size)}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={16} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.bioToxicity}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Foliage:</span> {renderValue(data.foliage)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Seed:</span> {renderValue(data.seed)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Flower:</span> {renderValue(data.flower)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>fruit:</span> {renderValue(data.fruit)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Root:</span> {renderValue(data.root)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Stem:</span> {renderValue(data.stem)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Fragrance:</span> {renderValue(data.fragrance)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Leaves:</span> {renderValue(data.leaves)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Pollination Type:</span> {renderValue(data.pollinationType)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Plant Type:</span> {renderValue(data.plantType)}</div>
            </div>
        </div>
    );
};

export default BotanyTab;
