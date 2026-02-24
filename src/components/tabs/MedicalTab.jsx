import React from 'react';
import { Heart, Pipette } from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const MedicalTab = ({ data }) => {
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
        </div>
    );
};

export default MedicalTab;
