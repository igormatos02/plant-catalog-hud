import React from 'react';
import {
    Maximize, Zap, Leaf, Flower2, Apple, CircleDot,
    ArrowDown, AlignLeft, Wind, Sprout, Database,
    Dna
} from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const TraitBox = ({ icon: Icon, label, value, color = 'var(--accent-color)' }) => {
    if (!value || value === '---' || value === 'UNKNOWN') return null;
    return (
        <div className="glass-panel" style={{ padding: '15px', borderLeft: `2px solid ${color}`, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon size={14} color={color} />
                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{renderValue(value)}</div>
        </div>
    );
};

const BotanyTab = ({ data, t }) => {
    return (
        <div style={{ display: 'grid', gap: '30px', animation: 'fadeIn 0.4s ease' }}>
            {/* Botanical Summary */}
            <div style={{ color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Dna size={16} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>BOTANICAL_ANALYSIS</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '20px', maxWidth: '800px' }}>
                    {renderValue(data.botanical_description, 'NEURAL INTERFACE: ANALYZING MORPHOLOGICAL STRUCTURE... NO SPECIFIC SUMMARY GENERATED.')}
                </p>
            </div>

            {/* Core Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                <TraitBox icon={Maximize} label={t.metrics.specimenSize} value={data.size} color="#ffb700" />
                <TraitBox icon={Sprout} label="Plant Type" value={data.plantType} />
                <TraitBox icon={Zap} label="Pollination" value={data.pollinationType} />
            </div>

            {/* Detailed traits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                <TraitBox icon={Leaf} label="Foliage" value={data.foliage} />
                <TraitBox icon={Leaf} label="Leaves" value={data.leaves} />
                <TraitBox icon={Flower2} label="Flower" value={data.flower} />
                <TraitBox icon={Apple} label="Fruit" value={data.fruit} />
                <TraitBox icon={CircleDot} label="Seed" value={data.seed} color="#a3e635" />
                <TraitBox icon={ArrowDown} label="Root" value={data.root} color="#94a3b8" />
                <TraitBox icon={AlignLeft} label="Stem" value={data.stem} color="#94a3b8" />
                <TraitBox icon={Wind} label="Fragrance" value={data.fragrance} color="#00f2ff" />
            </div>
        </div>
    );
};

export default BotanyTab;
