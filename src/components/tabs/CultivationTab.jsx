import React from 'react';
import { Thermometer, Droplets, Sun, Sprout, Scissors, Calendar } from 'lucide-react';
import { renderValue, MetricBox } from '../PlantDetailUtils';

const CultivationTab = ({ data, t }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <Sprout size={24} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '1rem' }}>CULTIVATION_PROTOCOL</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                    {renderValue(data.cultivation, '---')}
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <MetricBox icon={Thermometer} label="TEMP" value={data.metadata?.temperature} />
                <MetricBox icon={Droplets} label="HUMIDITY" value={data.metadata?.humidity} />
                <MetricBox icon={Sun} label="LIGHT" value={data.metadata?.light} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Scissors size={16} color="var(--accent-color)" />
                        <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.pruning}</span>
                    </div>
                    <div style={{ fontSize: '1rem' }}>{renderValue(data.pruning, '---')}</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Calendar size={16} color="var(--accent-color)" />
                        <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.plantingSeason}</span>
                    </div>
                    <div style={{ fontSize: '1rem' }}>{renderValue(data.planting_season || '---')}</div>
                </div>
            </div>
        </div>
    );
};

export default CultivationTab;
