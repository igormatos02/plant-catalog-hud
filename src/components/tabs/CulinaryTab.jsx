import React from 'react';
import { Utensils } from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const CulinaryTab = ({ data }) => {
    return (
        <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Utensils size={24} color="var(--accent-color)" />
                <h3 className="mono" style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>CULINARY USE ARCHIVE</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {renderValue(data.culinary_use, 'NO DATA AVAILABLE FOR CULINARY APPLICATIONS.')}
            </p>
        </div>
    );
};

export default CulinaryTab;
