import React from 'react';
import { Thermometer, Droplets, Sun, Sprout, Scissors, Calendar } from 'lucide-react';
import { renderValue } from '../PlantDetailUtils';

const CultivationCard = ({ title, content, icon: Icon, color = 'var(--accent-color)' }) => {
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

const CultivationTab = ({ data, t }) => {
    if (!data) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.5s ease' }}>
            <div className="glass-panel" style={{ padding: '30px', borderBottom: '1px solid rgba(0, 242, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <Sprout size={18} color="var(--accent-color)" />
                    <h3 className="mono" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>{t.cultivationLabels?.protocol || 'CULTIVATION_PROTOCOL'}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
                    {renderValue(data.cultivation, t.cultivationLabels?.noData || 'NO DATA AVAILABLE FOR CULTIVATION PROTOCOLS.')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <CultivationCard title={t.metrics?.plantingSeason || "Planting Season"} content={data.planting_season} icon={Calendar} color="#ffb700" />
                    <CultivationCard title={t.cultivationLabels?.pruning || "Pruning"} content={data.pruning} icon={Scissors} color="#e2e8f0" />
                    <CultivationCard title={t.cultivationLabels?.symbiosis || "Companion Plants"} content={data.symbiosis} icon={Sprout} color="#10b981" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <CultivationCard title={t.cultivationLabels?.soil || "Soil & Mixture"} content={data.soil} icon={Sprout} color="#999999" />
                    <CultivationCard title={t.cultivationLabels?.drainage || "Drainage Control"} content={data.drainage} icon={Droplets} color="#3b82f6" />
                    <CultivationCard title={t.cultivationLabels?.propagation || "Propagation"} content={data.propagation} icon={Sprout} color="var(--accent-color)" />
                    <CultivationCard title={t.cultivationLabels?.protection || "Protection"} content={data.protection} icon={Sun} color="#f59e0b" />
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

export default CultivationTab;
