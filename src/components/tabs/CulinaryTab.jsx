import React from 'react';
import { Utensils, Skull, AlertTriangle } from 'lucide-react';
import { renderValue, getToxicityColor } from '../PlantDetailUtils';

const CulinaryTab = ({ data, t }) => {
    const toxicityLevel = Number(data.metadata?.toxicity_level || 1);
    const isToxic = toxicityLevel > 1;
    const warningColor = getToxicityColor(toxicityLevel);

    return (
        <div>


            <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Utensils size={24} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>CULINARY USE ARCHIVE</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.culinary_use, 'NO DATA AVAILABLE FOR CULINARY APPLICATIONS.')}
                </p>


            </div>
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
                            {data.metadata?.toxicity || t.warnings.culinary}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CulinaryTab;
