import React from 'react';
import { Utensils, Skull, AlertTriangle, Coffee, Droplet, Leaf, CircleDot, Apple, GitCommit } from 'lucide-react';
import { renderValue, getToxicityColor, parseToxicity } from '../PlantDetailUtils';

const PartBox = ({ title, content, hasTea, hasOil, t, icon: Icon, color = 'var(--accent-color)' }) => {
    if (!content ||
        content.toUpperCase().includes('NOT_APPLICABLE') ||
        content.toLowerCase().includes('não comumente') ||
        content.toLowerCase().includes('not commonly') ||
        content.toLowerCase().includes('no data') ||
        content.toLowerCase().includes('---')) return null;

    return (
        <div className="glass-panel" style={{ padding: '20px', width: '100%', marginBottom: '10px', borderLeft: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={14} color={color} />}
                    <h4 className="mono" style={{ margin: 0, fontSize: '0.7rem', color: color, letterSpacing: '1px' }}>{title.toUpperCase()}</h4>
                </div>
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

const CulinaryTab = ({ data, fullData, t }) => {
    const meta = fullData?.metadata || data.metadata;
    const toxicityLevel = parseToxicity(meta?.toxicity_level);
    const isToxic = toxicityLevel > 1;
    const warningColor = getToxicityColor(toxicityLevel);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Utensils size={24} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>{t.culinaryLabels?.archive || 'CULINARY USE ARCHIVE'}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.culinary_use, t.culinaryLabels?.noData || 'NO DATA AVAILABLE FOR CULINARY APPLICATIONS.')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <PartBox title={t.culinaryParts.leaves} content={data.culinary_leaves} hasTea={data.leaves_makes_tea} hasOil={data.leaves_makes_oil} t={t} icon={Leaf} color="#10b981" />
                    <PartBox title={t.culinaryParts.seeds} content={data.culinary_seeds} hasTea={data.seeds_makes_tea} hasOil={data.seeds_makes_oil} t={t} icon={CircleDot} color="#ffb700" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <PartBox title={t.culinaryParts.fruits} content={data.culinary_fruits} hasTea={data.fruits_makes_tea} hasOil={data.fruits_makes_oil} t={t} icon={Apple} color="#ef4444" />
                    <PartBox title={t.culinaryParts.stem} content={data.culinary_stem} hasTea={data.stem_makes_tea} hasOil={data.stem_makes_oil} t={t} icon={GitCommit} color="var(--accent-color)" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />

        </div>
    );
};

export default CulinaryTab;
