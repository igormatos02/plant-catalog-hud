import React from 'react';
import { Utensils, Skull, AlertTriangle, Coffee, Droplet } from 'lucide-react';
import { renderValue, getToxicityColor } from '../PlantDetailUtils';

const PartBox = ({ title, content, hasTea, hasOil, t }) => {
    if (!content ||
        content.toUpperCase().includes('NOT_APPLICABLE') ||
        content.toLowerCase().includes('não comumente') ||
        content.toLowerCase().includes('not commonly') ||
        content.toLowerCase().includes('no data') ||
        content.toLowerCase().includes('---')) return null;

    return (
        <div className="glass-panel" style={{ padding: '20px', width: '100%', marginBottom: '10px', borderLeft: '2px solid var(--accent-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 className="mono" style={{ margin: 0, fontSize: '0.7rem', color: 'var(--accent-color)', letterSpacing: '1px' }}>{title.toUpperCase()}</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {hasTea && (
                        <div className="mono" style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.6rem', background: 'rgba(0, 242, 255, 0.1)',
                            padding: '2px 8px', border: '1px solid rgba(0, 242, 255, 0.3)', color: 'var(--accent-color)'
                        }}>
                            <Coffee size={10} /> {t.culinaryParts.tea.toUpperCase()}
                        </div>
                    )}
                    {hasOil && (
                        <div className="mono" style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.6rem', background: 'rgba(255, 183, 0, 0.1)',
                            padding: '2px 8px', border: '1px solid rgba(255, 183, 0, 0.3)', color: '#ffb700'
                        }}>
                            <Droplet size={10} /> {t.culinaryParts.oil.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                {content}
            </p>
        </div>
    );
};

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <PartBox title={t.culinaryParts.leaves} content={data.culinary_leaves} hasTea={data.leaves_makes_tea} hasOil={data.leaves_makes_oil} t={t} />
                <PartBox title={t.culinaryParts.seeds} content={data.culinary_seeds} hasTea={data.seeds_makes_tea} hasOil={data.seeds_makes_oil} t={t} />
                <PartBox title={t.culinaryParts.fruits} content={data.culinary_fruits} hasTea={data.fruits_makes_tea} hasOil={data.fruits_makes_oil} t={t} />
                <PartBox title={t.culinaryParts.stem} content={data.culinary_stem} hasTea={data.stem_makes_tea} hasOil={data.stem_makes_oil} t={t} />
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
