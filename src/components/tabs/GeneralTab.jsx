import React from 'react';
import { Thermometer, Droplets, Sun, Zap, Database } from 'lucide-react';
import { renderValue, MetricBox, getToxicityColor } from '../PlantDetailUtils';

const GeneralTab = ({ data, t }) => {
    return (
        <>
            <div style={{ color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Database size={16} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t.tabs.description.toUpperCase()}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '800px' }}>
                    {renderValue(data.description, 'NO DESCRIPTION AVAILABLE.')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                <MetricBox icon={Thermometer} label={t.metrics.tempRange} value={data.metadata?.temperature} />
                <MetricBox icon={Droplets} label={t.metrics.hydration} value={data.metadata?.humidity} />
                <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid #ffb700', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sun size={14} color="#ffb700" />
                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.luxExposure}</span>
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.light)}</div>
                </div>
                <div className="glass-panel" style={{
                    padding: '15px',
                    borderLeft: `2px solid ${getToxicityColor(data.metadata?.toxicity_level)}`,
                    height: '100%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Zap size={14} color={getToxicityColor(data.metadata?.toxicity_level)} />
                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.bioToxicity}</span>
                    </div>
                    <div
                        style={{
                            fontSize: '0.7rem',
                            lineHeight: '1.2',
                            marginBottom: '4px'
                        }}
                    >
                        <span className="mono" style={{ color: 'var(--text-secondary)' }}>{t.metrics.toxicityLevel}: </span>
                        <span className="mono" style={{ color: getToxicityColor(data.metadata?.toxicity_level) }}>
                            {renderValue(data.metadata?.toxicity_level)}
                        </span>
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.toxicity)}</div>
                </div>
            </div>
        </>
    );
};

export default GeneralTab;
