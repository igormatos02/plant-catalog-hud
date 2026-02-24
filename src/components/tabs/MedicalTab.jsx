import React from 'react';
import { Heart, Pipette, Skull, AlertTriangle } from 'lucide-react';
import { renderValue, getToxicityColor } from '../PlantDetailUtils';

const MedicalTab = ({ data, t }) => {
    const toxicityLevel = Number(data.metadata?.toxicity_level || 1);
    const isToxic = toxicityLevel > 1;
    const warningColor = getToxicityColor(toxicityLevel);

    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Heart size={24} color="#ff3e3e" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>MEDICAL_BENEFITS</h3>
                </div>



                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    {renderValue(data.therapeutic_use, 'NO DATA AVAILABLE FOR MEDICINAL APPLICATIONS.')}
                </p>
            </div>
            {data.oils_and_florals && data.oils_and_florals !== 'None' && (
                <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid #ffb700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <Pipette size={20} color="#ffb700" />
                        <h4 className="mono" style={{ margin: 0, fontSize: '0.9rem' }}>ESSENCES & OILS</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {renderValue(data.oils_and_florals)}
                    </p>
                </div>
            )}
            {isToxic && (
                <div style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '15px',
                    padding: '15px',
                    background: `${warningColor}15`,
                    border: `1px solid ${warningColor}40`,
                    marginBottom: '20px',
                    borderRadius: '4px'
                }}>
                    <div style={{
                        background: warningColor,
                        padding: '8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {toxicityLevel >= 4 ? <Skull size={20} color="#000" /> : <AlertTriangle size={20} color="#000" />}
                    </div>
                    <div>
                        <div className="mono" style={{
                            color: warningColor,
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            letterSpacing: '1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <AlertTriangle size={14} />
                            {(toxicityLevel >= 3 ? t.metrics.danger : t.metrics.caution).toUpperCase()}
                        </div>
                        <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                            {data.metadata?.toxicity || t.warnings.medical}
                        </p>
                    </div>
                </div>
            )}
        </div>

    );
};

export default MedicalTab;
