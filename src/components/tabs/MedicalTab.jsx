import React from 'react';
import { Heart, Pipette, Coffee, Skull, AlertTriangle } from 'lucide-react';
import { renderValue, getToxicityColor, parseToxicity } from '../PlantDetailUtils';

const PartBox = ({ title, content, color = 'var(--accent-color)', icon: Icon }) => {
    if (!content ||
        content.toUpperCase().includes('NOT_APPLICABLE') ||
        content.toLowerCase().includes('não comumente') ||
        content.toLowerCase().includes('not commonly') ||
        content.toLowerCase().includes('no data') ||
        content.toLowerCase().includes('---')) return null;

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

const MedicalTab = ({ data, fullData, t }) => {
    const meta = fullData?.metadata || data.metadata;
    const toxicityLevel = parseToxicity(meta?.toxicity_level);
    const isToxic = toxicityLevel > 1;
    const warningColor = getToxicityColor(toxicityLevel);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Heart size={18} color="#ff3e3e" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>{t.medicalLabels?.benefits || 'MEDICAL_BENEFITS'}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.therapeutic_use, t.medicalLabels?.noData || 'NO DATA AVAILABLE FOR MEDICINAL APPLICATIONS.')}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <PartBox title={t.medicalLabels?.essences || "ESSENCES & OILS"} content={data.oils_and_florals} color="#ffb700" icon={Pipette} />
                <PartBox title={t.subproducts.tea} content={data.tea} color="#4ade80" icon={Coffee} />
                <PartBox title={t.subproducts.perfume} content={data.perfume} color="var(--accent-color)" icon={Pipette} />
                <PartBox title={t.subproducts.soap} content={data.soap} color="#e2e8f0" icon={Pipette} />
                <PartBox title={t.subproducts.sachets} content={data.sachets} color="#ffffff" icon={Pipette} />
                <PartBox title={t.subproducts.others} content={data.other_subproducts} color="var(--text-secondary)" icon={Pipette} />
            </div>

        </div>

    );
};

export default MedicalTab;
