import React from 'react';
import { Search, Loader2, Thermometer, Droplets, Sun, Zap, Utensils, Heart, Pipette, Sprout, Maximize, Calendar, Scissors, Database } from 'lucide-react';
import { translations } from '../lib/translations';

const MetricBox = ({ icon: Icon, label, value }) => (
    <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid var(--accent-color)', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icon size={14} color="var(--accent-color)" />
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.2' }}>{value}</div>
    </div>
);

const PlantDetail = ({ plant, onBack, isLoading, isGeneratingImage, language }) => {
    const t = translations[language] || translations.en;
    const [imageLoaded, setImageLoaded] = React.useState(false);

    React.useEffect(() => {
        if (plant?.picture_url) {
            setImageLoaded(false);
        }
    }, [plant?.picture_url]);

    const [activeTab, setActiveTab] = React.useState('general');

    if (isLoading) {
        return (
            <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
                <p className="mono" style={{ marginTop: '20px', letterSpacing: '2px', fontSize: '1rem', color: 'var(--accent-color)' }}>
                    NEURAL LINK ESTABLISHED: DECRYPTING SPECIMEN DATA...
                </p>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                    AI_ANALYSIS: IN PROGRESS
                </div>
            </div>
        );
    }

    if (!plant) return null;

    const showImageLoading = isGeneratingImage || !imageLoaded || !plant.picture_url;

    const tabs = [
        { id: 'general', label: t.tabs.geral },
        { id: 'varieties', label: t.tabs.variedades },
        { id: 'botany', label: t.tabs.caracteristicas },
        { id: 'culinary', label: t.tabs.culinaria },
        { id: 'medical', label: t.tabs.terapeutico },
        { id: 'cultivation', label: t.tabs.cultivo }
    ];

    return (
        <div className="plant-detail" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={onBack} className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease' }} onMouseOver={e => e.target.style.color = 'var(--accent-color)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                <Search size={14} /> {t.backToSearch}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '40px' }}>
                {/* Left Col: Image & HUD Overlays */}
                <div style={{ position: 'relative', height: 'fit-content' }}>
                    <div className="hud-border" style={{ padding: '4px', background: 'var(--accent-color)', position: 'relative', overflow: 'hidden' }}>
                        {showImageLoading && (
                            <div style={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(5, 12, 16, 0.9)',
                                backdropFilter: 'blur(10px)',
                                minHeight: '400px'
                            }}>
                                <Loader2 className="animate-spin" size={32} color="var(--accent-color)" />
                                <p className="mono" style={{ marginTop: '15px', fontSize: '0.7rem', color: 'var(--accent-color)', letterSpacing: '2px', textAlign: 'center', padding: '0 20px' }}>
                                    {isGeneratingImage ? "SYNCHRONIZING WITH PLANTNET ARCHIVE..." : "RETRIEVING SPECIMEN IMAGERY..."}
                                </p>
                                <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                    {isGeneratingImage ? "ALIGNING_TAXONOMIC_DATA" : "RESOLVING_GBIF_OCCURRENCE_MEDIA"}
                                </div>
                            </div>
                        )}
                        {plant.picture_url && (
                            <img
                                src={plant.picture_url}
                                alt={plant.name}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(true)}
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    filter: 'grayscale(0.1) contrast(1.1)',
                                    animation: 'fadeIn 0.8s ease',
                                    opacity: imageLoaded ? 1 : 0
                                }}
                            />
                        )}
                        {!plant.picture_url && !isGeneratingImage && (
                            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                <Database size={32} color="var(--text-secondary)" opacity={0.3} />
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'absolute', top: '20px', left: '-10px', width: '40px', height: '2px', background: 'var(--accent-color)' }} />
                    <div style={{ position: 'absolute', top: '-10px', left: '20px', width: '2px', height: '40px', background: 'var(--accent-color)' }} />

                    <div className="glass-panel" style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '15px', borderRadius: '4px' }}>
                        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-color)' }}>ANALYSIS_PROGRESS</div>
                        <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '5px' }}>
                            <div style={{ width: '85%', height: '100%', background: 'var(--accent-color)' }} />
                        </div>
                    </div>
                </div>

                {/* Right Col: Data */}
                <div>
                    <header style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                            <span className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{plant.name}</span>
                            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontStyle: 'italic' }}> {plant.popular_name}</span>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0', letterSpacing: '-1px' }}>{plant.scientific_name?.toUpperCase()}</h1>

                        {/* Tabs Navigation */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            paddingBottom: '0',
                            overflowX: 'auto',
                            scrollbarWidth: 'none'
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="mono"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === tab.id ? '2px solid var(--accent-color)' : '2px solid transparent',
                                        color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                                        padding: '10px 5px',
                                        fontSize: '0.65rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* Tab Content */}
                    <div style={{ minHeight: '400px', animation: 'fadeIn 0.3s ease' }} key={activeTab}>
                        {activeTab === 'general' && (
                            <>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '800px' }}>
                                    {plant.description}
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                                    <MetricBox icon={Thermometer} label={t.metrics.tempRange} value={plant.metadata?.temperature || '---'} />
                                    <MetricBox icon={Droplets} label={t.metrics.hydration} value={plant.metadata?.humidity || '---'} />
                                    <MetricBox icon={Sun} label={t.metrics.luxExposure} value={plant.metadata?.light || '---'} />
                                    <MetricBox icon={Zap} label={t.metrics.bioToxicity} value={plant.metadata?.toxicity || '---'} />
                                </div>
                            </>
                        )}

                        {activeTab === 'varieties' && (
                            <div style={{ color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Database size={16} color="var(--accent-color)" />
                                    <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KNOWN SPECIMEN VARIETIES</span>
                                </div>
                                <p className="mono" style={{ fontSize: '0.9rem' }}>
                                    {plant.metadata?.varieties || 'NO ADDITIONAL VARIETIES DOCUMENTED IN ARCHIVE.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'botany' && (
                            <div style={{ display: 'grid', gap: '30px' }}>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                                        CLASS: {plant.class?.toUpperCase() || 'UNKNOWN'}
                                    </div>
                                    <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        FAMILY: {plant.family?.toUpperCase() || 'UNKNOWN'}
                                    </div>
                                </div>

                                <div className="glass-panel" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Maximize size={16} color="var(--accent-color)" />
                                        <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.specimenSize}</span>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{plant.metadata?.size || '---'}</div>
                                </div>

                                <div className="glass-panel" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Zap size={16} color="var(--accent-color)" />
                                        <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.bioToxicity}</span>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{plant.metadata?.toxicity || '---'}</div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'culinary' && (
                            <div className="glass-panel" style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <Utensils size={24} color="var(--accent-color)" />
                                    <h3 className="mono" style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>CULINARY USE ARCHIVE</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                    {plant.metadata?.culinary_use || 'NO DATA AVAILABLE FOR CULINARY APPLICATIONS.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'medical' && (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div className="glass-panel" style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <Heart size={24} color="#ff3e3e" />
                                        <h3 className="mono" style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>MEDICAL_BENEFITS</h3>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                        {plant.metadata?.therapeutic_use || 'NO DATA AVAILABLE FOR MEDICINAL APPLICATIONS.'}
                                    </p>
                                </div>

                                {plant.metadata?.oils_and_florals && plant.metadata.oils_and_florals !== 'None' && (
                                    <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid #ffb700' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                            <Pipette size={20} color="#ffb700" />
                                            <h4 className="mono" style={{ margin: 0, fontSize: '0.9rem' }}>ESSENCES & OILS</h4>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                            {plant.metadata.oils_and_florals}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'cultivation' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                <div className="glass-panel" style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <Sprout size={24} color="var(--accent-color)" />
                                        <h3 className="mono" style={{ margin: 0, fontSize: '1rem' }}>CULTIVATION_PROTOCOL</h3>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                                        {plant.metadata?.cultivation || '---'}
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="glass-panel" style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <Scissors size={16} color="var(--accent-color)" />
                                            <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.pruning}</span>
                                        </div>
                                        <div style={{ fontSize: '1rem' }}>{plant.metadata?.pruning || '---'}</div>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <Calendar size={16} color="var(--accent-color)" />
                                            <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.plantingSeason}</span>
                                        </div>
                                        <div style={{ fontSize: '1rem' }}>{plant.metadata?.planting_season || '---'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                    <MetricBox icon={Thermometer} label="TEMP" value={plant.metadata?.temperature || '---'} />
                                    <MetricBox icon={Droplets} label="HUMIDITY" value={plant.metadata?.humidity || '---'} />
                                    <MetricBox icon={Sun} label="LIGHT" value={plant.metadata?.light || '---'} />
                                </div>
                            </div>
                        )}
                    </div>
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

export default PlantDetail;
