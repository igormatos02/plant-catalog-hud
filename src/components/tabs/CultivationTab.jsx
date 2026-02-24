import React from 'react';
import { Thermometer, Droplets, Sun, Sprout, Scissors, Calendar } from 'lucide-react';
import { renderValue, MetricBox } from '../PlantDetailUtils';

const PartBox = ({ title, content, icon: Icon, color = 'var(--accent-color)' }) => {
    if (!content || content.toUpperCase().includes('NOT_APPLICABLE')) return null;

    return (
        <div className="glass-panel" style={{ padding: '20px', width: '100%', marginBottom: '10px', borderLeft: `2px solid ${color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                {Icon && <Icon size={14} color={color} />}
                <h4 className="mono" style={{ margin: 0, fontSize: '0.7rem', color: color, letterSpacing: '1px' }}>{title.toUpperCase()}</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                {content}
            </p>
        </div>
    );
};

const CultivationTab = ({ data, t }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Header Summary */}
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Sprout size={24} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>CULTIVATION_PROTOCOL</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.cultivation, 'NO DATA AVAILABLE FOR CULTIVATION PROTOCOLS.')}
                </p>
            </div>

            {/* Detailed Info Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <PartBox title={t.metrics.plantingSeason} content={data.planting_season} icon={Calendar} color="#ffb700" />
                    <PartBox title={t.cultivationLabels.pruning} content={data.pruning} icon={Scissors} color="#e2e8f0" />
                </div>

                <PartBox title={t.cultivationLabels.soil} content={data.soil} icon={Sprout} color="#8b5cf6" />
                <PartBox title={t.cultivationLabels.drainage} content={data.drainage} icon={Droplets} color="#3b82f6" />
                <PartBox title={t.cultivationLabels.propagation} content={data.propagation} icon={Sprout} color="#ec4899" />
                <PartBox title={t.cultivationLabels.symbiosis} content={data.symbiosis} icon={Sprout} color="#10b981" />
                <PartBox title={t.cultivationLabels.protection} content={data.protection} icon={Sun} color="#f59e0b" />
            </div>
        </div>
    );
};

export default CultivationTab;
