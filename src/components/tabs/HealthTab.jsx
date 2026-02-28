import React from 'react';
import {
    Droplet, Droplets, Sun, CloudMoon, Shell,
    Bug, Microscope, Stethoscope, HeartPulse, Activity
} from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const DiagnosticCard = ({ title, content, color = 'var(--accent-color)', icon: Icon }) => {
    if (!content ||
        content.toUpperCase().includes('NOT_APPLICABLE') ||
        content.toLowerCase().includes('---')) return null;

    return (
        <div className="glass-panel" style={{ padding: '20px', width: '100%', marginBottom: '10px', borderLeft: `3px solid ${color}` }}>
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

const HealthTab = ({ data, t }) => {
    if (!data) return null;

    const healthT = t.metrics.health || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.5s ease' }}>
            <div className="glass-panel" style={{ padding: '30px', borderBottom: '1px solid rgba(0, 242, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <Activity size={18} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>{t.healthLabels?.diagnosis || 'VITALITY_DIAGNOSIS'}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.care, t.healthLabels?.monitoring || 'Monitoring specimen health status... Analyze visual cues for diagnostic results.')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <DiagnosticCard
                        title={healthT.overwater || "Overwatering"}
                        content={data.overwater}
                        color="#3b82f6"
                        icon={Droplets}
                    />
                    <DiagnosticCard
                        title={healthT.underwater || "Underwatering"}
                        content={data.underwater}
                        color="#60a5fa"
                        icon={Droplet}
                    />
                    <DiagnosticCard
                        title={healthT.oversun || "Excessive Sun"}
                        content={data.oversun}
                        color="#f59e0b"
                        icon={Sun}
                    />
                    <DiagnosticCard
                        title={healthT.undersun || "Lack of Sun"}
                        content={data.undersun}
                        color="#fbbf24"
                        icon={CloudMoon}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <DiagnosticCard
                        title={healthT.nutrients || "Nutrient Deficiency"}
                        content={data.nutrients}
                        color="#999999"
                        icon={Shell}
                    />
                    <DiagnosticCard
                        title={healthT.fungi || "Fungal Issues"}
                        content={data.fungi}
                        color="#ef4444"
                        icon={Microscope}
                    />
                    <DiagnosticCard
                        title={healthT.pests || "Pest Infestations"}
                        content={data.pests}
                        color="#ef4444"
                        icon={Bug}
                    />
                    <DiagnosticCard
                        title={healthT.treatments || "Recommended Treatments"}
                        content={data.treatments}
                        color="#10b981"
                        icon={Stethoscope}
                    />
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

export default HealthTab;
