import React from 'react';
import { Thermometer, Droplets, Sun, Zap, Database, Maximize, Clock, Activity, AlertTriangle, Skull, Map, Waves } from 'lucide-react';
import { renderValue, MetricBox, getToxicityColor, parseToxicity } from '../PlantDetailUtils';

const GeneralTab = ({ data, t }) => {
    const rawToxicityLevel = parseToxicity(data.metadata?.toxicity_level);
    const displayToxicityLevel = rawToxicityLevel;

    let ToxicityIcon = Zap;
    if (rawToxicityLevel > 4) {
        ToxicityIcon = Skull;
    } else if (rawToxicityLevel >= 3) {
        ToxicityIcon = AlertTriangle;
    }

    return (
        <>
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Database size={24} color="var(--accent-color)" />
                    <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t.tabs.description.toUpperCase()}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '40px' }}>
                    {renderValue(data.description, t.tabs.unavailable || 'NO DESCRIPTION AVAILABLE.')}
                </p>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid rgba(0, 242, 255, 0.4)', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Thermometer size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.tempRange}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.temperature)}</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Sun size={14} color="#ffb700" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.luxExposure}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.light)}</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid rgba(0, 242, 255, 0.4)', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Droplets size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.hydration}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.humidity)}</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Waves size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.cultivationLabels?.drainage?.toUpperCase() || 'DRENAGEM'}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.cultivation?.drainage)}</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid rgba(0, 242, 255, 0.4)', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Maximize size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.height}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.height)}</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Thermometer size={14} color="var(--accent-color)" style={{ transform: 'rotate(90deg)' }} />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.crownWidth}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.crown_width)}</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid rgba(0, 242, 255, 0.4)', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Clock size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.timeToAdult}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.time_to_adult)}</div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Activity size={14} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.lifespan}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.lifespan)}</div>
                    </div>
                </div>



                <div className="glass-panel" style={{
                    padding: '15px',
                    borderLeft: `2px solid ${getToxicityColor(displayToxicityLevel)}`,
                    height: '100%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ToxicityIcon size={14} color={getToxicityColor(displayToxicityLevel)} />
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
                        <span className="mono" style={{ color: getToxicityColor(displayToxicityLevel) }}>
                            {displayToxicityLevel > 0 ? displayToxicityLevel : renderValue(data.metadata?.toxicity_level)}
                        </span>
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(data.metadata?.toxicity)}</div>
                </div>
            </div>
        </>
    );
};

export default GeneralTab;
