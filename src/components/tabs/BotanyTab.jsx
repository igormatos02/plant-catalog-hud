import React from 'react';
import {
    Maximize, Zap, Leaf, Flower2, Apple, CircleDot,
    ArrowDown, AlignLeft, Wind, Sprout, Dna,
    Target, LayoutPanelLeft, Binary
} from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const PropertyRow = ({ icon: Icon, label, value, color = 'var(--accent-color)' }) => {
    if (!value || value === '---' || value === 'UNKNOWN' || value === 'None') return null;
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px border-style: dashed; border-color: rgba(255,255,255,0.05)',
            gap: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={14} color={color} opacity={0.8} />
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 500 }}>{renderValue(value)}</div>
        </div>
    );
};

const ArchitecturePanel = ({ data, t }) => {
    const hasData = data.size || data.plantType || data.leaves || data.foliage || data.stem || data.root;
    if (!hasData) return null;

    return (
        <div className="glass-panel" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.03 }}>
                <LayoutPanelLeft size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Target size={18} color="var(--accent-color)" />
                <h3 className="mono" style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '2px' }}>SPECIMEN_ARCHITECTURE</h3>
            </div>

            <PropertyRow icon={Maximize} label={t.metrics.specimenSize} value={data.size} color="#ffb700" />
            <PropertyRow icon={Sprout} label="Growth Form" value={data.plantType} />
            <PropertyRow icon={Leaf} label="Leaf Structure" value={data.leaves} />
            <PropertyRow icon={Leaf} label="Foliage Type" value={data.foliage} />
            <PropertyRow icon={AlignLeft} label="Stem System" value={data.stem} color="#94a3b8" />
            <PropertyRow icon={ArrowDown} label="Root Network" value={data.root} color="#94a3b8" />
        </div>
    );
};

const BiologicalPanel = ({ data }) => {
    const hasData = data.flower || data.fruit || data.seed || data.pollinationType || data.fragrance;
    if (!hasData) return null;

    return (
        <div className="glass-panel" style={{ padding: '25px', borderLeft: '3px solid #00f2ff22' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Binary size={18} color="#00f2ff" />
                <h3 className="mono" style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '2px', color: '#00f2ff' }}>BIO_REPRODUCTION</h3>
            </div>

            <PropertyRow icon={Flower2} label="Inflorescence" value={data.flower} color="#00f2ff" />
            <PropertyRow icon={Apple} label="Fructification" value={data.fruit} color="#00f2ff" />
            <PropertyRow icon={CircleDot} label="Seed Details" value={data.seed} color="#a3e635" />
            <PropertyRow icon={Zap} label="Pollination" value={data.pollinationType} />
            <PropertyRow icon={Wind} label="Aromatic Profile" value={data.fragrance} color="#00f2ff" />
        </div>
    );
};

const BotanyTab = ({ data, t }) => {
    return (
        <div style={{ display: 'grid', gap: '25px', animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {/* Intelligent Description */}
            <div style={{ position: 'relative', padding: '0 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '1px', background: 'var(--accent-color)' }}></div>
                    <Dna size={16} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-color)' }}>ANALYSIS_OVERVIEW</span>
                </div>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    lineHeight: '1.7',
                    margin: 0,
                    maxWidth: '850px',
                    fontWeight: 300,
                    fontStyle: 'italic'
                }}>
                    "{renderValue(data.botanical_description, 'Structural scan in progress... decoding morphological signatures for precise identification.')}"
                </p>
            </div>

            {/* Smart 2-Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
                marginTop: '10px'
            }}>
                <ArchitecturePanel data={data} t={t} />
                <BiologicalPanel data={data} />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .glass-panel {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }
                .glass-panel:hover {
                    transform: translateY(-2px);
                    border-color: rgba(0, 242, 255, 0.3);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
            `}} />
        </div>
    );
};

export default BotanyTab;
