import React, { useState, useEffect } from 'react';
import {
    Search, Loader2, Thermometer, Droplets, Sun, Zap,
    Utensils, Heart, Pipette, Sprout, Maximize,
    Calendar, Scissors, Database
} from 'lucide-react';
import { translations } from '../lib/translations';
import { getPlantTabDetails } from '../lib/gemini';

const renderValue = (val, fallback = '---') => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
};

const getToxicityColor = (level) => {
    switch (level) {
        case 1:
            return '#2ecc71'; // verde
        case 2:
            return '#a3e635'; // verde claro
        case 3:
            return '#facc15'; // amarelo
        case 4:
            return '#f97316'; // laranja
        case 5:
            return '#ef4444'; // vermelho
        default:
            return 'var(--text-primary)';
    }
};

const MetricBox = ({ icon: Icon, label, value }) => {
    if (!Icon) return null;
    return (
        <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid var(--accent-color)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon size={14} color="var(--accent-color)" />
                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(value)}</div>
        </div>
    );
};

const PlantDetail = ({ plant, onBack, isLoading, isGeneratingImage, language }) => {
    const t = translations[language] || translations.en;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [loadedTabsData, setLoadedTabsData] = useState({});
    const [tabLoadingStates, setTabLoadingStates] = useState({});

    // Reset and initialize with 'general' data when a new plant arrives
    useEffect(() => {
        if (plant) {
            setLoadedTabsData({ general: plant });
            setTabLoadingStates({});
            setActiveTab('general');
        }
    }, [plant?.scientific_name]);

    useEffect(() => {
        if (plant?.picture_url) {
            setImageLoaded(false);
        }
    }, [plant?.picture_url]);

    const handleTabChange = async (tabId) => {
        setActiveTab(tabId);

        // Don't reload if already loading or already have data
        if (tabId === 'general' || loadedTabsData[tabId] || tabLoadingStates[tabId]) return;

        setTabLoadingStates(prev => ({ ...prev, [tabId]: true }));
        try {
            const data = await getPlantTabDetails(plant.scientific_name, tabId, language);
            if (data) {
                setLoadedTabsData(prev => ({ ...prev, [tabId]: data }));
            }
        } catch (err) {
            console.error(`[PlantDetail] Failed to load tab ${tabId}:`, err);
        } finally {
            setTabLoadingStates(prev => ({ ...prev, [tabId]: false }));
        }
    };

    if (isLoading) {
        return (
            <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
                <p className="mono" style={{ marginTop: '20px', letterSpacing: '2px', fontSize: '1rem', color: 'var(--accent-color)' }}>
                    NEURAL LINK ESTABLISHED: DECRYPTING SPECIMEN DATA...
                </p>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                    ANALYSIS: IN PROGRESS
                </div>
            </div>
        );
    }

    if (!plant) return null;

    const showImageLoading = isGeneratingImage || !imageLoaded || !plant.picture_url;

    // Defensive merge
    const activeTabData = loadedTabsData[activeTab] || {};
    const currentData = {
        ...plant,
        ...activeTabData,
        metadata: {
            ...(plant.metadata || {}),
            ...(activeTabData.metadata || {})
        }
    };

    const isTabLoading = tabLoadingStates[activeTab];

    const tabs = [
        { id: 'general', label: t.tabs.geral },
        { id: 'botany', label: t.tabs.caracteristicas },
        { id: 'culinary', label: t.tabs.culinaria },
        { id: 'medical', label: t.tabs.terapeutico },
        { id: 'cultivation', label: t.tabs.cultivo }
    ];

    return (
        <div className="plant-detail" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button
                onClick={onBack}
                className="mono"
                style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                }}
            >
                <Search size={14} /> {t.backToSearch}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '40px' }}>
                {/* Left Col: Image */}
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
                </div>

                {/* Right Col: Data */}
                <div>
                    <header style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                            <span className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{plant.name || '---'}</span>   gbifId:  {plant.gbifId}
                            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontStyle: 'italic' }}> {plant.popular_name || ''}</span>
                        </div>

                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0', letterSpacing: '-1px' }}>
                            {plant.scientific_name?.toUpperCase() || 'UNKNOWN_SPECIMEN'}
                        </h1>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 10px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {t.tabs.class}: {currentData.class?.toUpperCase() || 'UNKNOWN'}
                            </div>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 10px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {t.tabs.order}: {currentData.order?.toUpperCase() || 'UNKNOWN'}
                            </div>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 10px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {t.tabs.family}: {currentData.family?.toUpperCase() || 'UNKNOWN'}
                            </div>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 10px', fontSize: '0.8rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                                {t.tabs.genus}: {currentData.genus?.toUpperCase() || 'UNKNOWN'}
                            </div>
                            <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '10px 10px', fontSize: '0.8rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                                {t.tabs.species}: {currentData.species?.toUpperCase() || 'UNKNOWN'}
                            </div>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Database size={16} color="var(--accent-color)" />
                                <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>  {t.tabs.knownVarieties.toUpperCase()}</span>
                            </div>
                            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                {renderValue(currentData.varieties, 'NO ADDITIONAL VARIETIES DOCUMENTED IN ARCHIVE.')}
                            </p>
                        </div>

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
                                    onClick={() => handleTabChange(tab.id)}
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

                    <div style={{ minHeight: '400px', position: 'relative' }}>
                        {isTabLoading ? (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(5, 12, 16, 0.5)', backdropFilter: 'blur(4px)', zIndex: 5
                            }}>
                                <Loader2 className="animate-spin" size={32} color="var(--accent-color)" />
                                <div className="mono" style={{ marginTop: '15px', fontSize: '0.6rem', color: 'var(--accent-color)', letterSpacing: '2px' }}>
                                    DECRYPTING_TAB_DATA...
                                </div>
                            </div>
                        ) : (
                            <div key={activeTab} style={{ animation: 'fadeIn 0.3s ease' }}>
                                {activeTab === 'general' && (
                                    <>
                                        <div style={{ color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <Database size={16} color="var(--accent-color)" />
                                                <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t.tabs.description.toUpperCase()}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '800px' }}>
                                                {renderValue(currentData.description, 'NO DESCRIPTION AVAILABLE.')}
                                            </p>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                                            <MetricBox icon={Thermometer} label={t.metrics.tempRange} value={currentData.metadata?.temperature} />
                                            <MetricBox icon={Droplets} label={t.metrics.hydration} value={currentData.metadata?.humidity} />
                                            <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid #ffb700', height: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <Sun size={14} color="#ffb700" />
                                                    <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.luxExposure}</span>
                                                </div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{currentData.metadata?.light}</div>
                                            </div>
                                            <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid #FA4E67', height: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <Zap size={14} color="#FA4E67" />
                                                    <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.bioToxicity}</span>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        color: getToxicityColor(currentData.metadata?.toxicity_level),
                                                        lineHeight: '1.2'
                                                    }}
                                                >
                                                    {t.metrics.toxicityLevel}: {currentData.metadata?.toxicity_level}
                                                </div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{currentData.metadata?.toxicity}</div>
                                            </div>

                                        </div>
                                    </>
                                )}



                                {activeTab === 'botany' && (
                                    <div style={{ display: 'grid', gap: '30px' }}>
                                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                            <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                                                CLASS: {currentData.class?.toUpperCase() || 'UNKNOWN'}
                                            </div>
                                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                ORDER: {currentData.order?.toUpperCase() || 'UNKNOWN'}
                                            </div>
                                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                FAMILY: {currentData.family?.toUpperCase() || 'UNKNOWN'}
                                            </div>
                                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                GENUS: {currentData.genus?.toUpperCase() || 'UNKNOWN'}
                                            </div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <Maximize size={16} color="var(--accent-color)" />
                                                <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.specimenSize}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{renderValue(currentData.size)}</div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <Zap size={16} color="var(--accent-color)" />
                                                <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700', letterSpacing: '1px' }}>{t.metrics.bioToxicity}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Foliage:</span> {renderValue(currentData.foliage)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Seed:</span> {renderValue(currentData.seed)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Flower:</span> {renderValue(currentData.flower)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>fruit:</span> {renderValue(currentData.fruit)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Root:</span> {renderValue(currentData.root)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Stem:</span> {renderValue(currentData.stem)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Fragrance:</span> {renderValue(currentData.fragrance)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Leaves:</span> {renderValue(currentData.leaves)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Pollination Type:</span> {renderValue(currentData.pollinationType)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}> <span className="mono" style={{ fontSize: '0.7rem', color: '#00ff91ff', letterSpacing: '1px' }}>Plant Type:</span> {renderValue(currentData.plantType)}</div>
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
                                            {renderValue(currentData.culinary_use, 'NO DATA AVAILABLE FOR CULINARY APPLICATIONS.')}
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
                                                {renderValue(currentData.therapeutic_use, 'NO DATA AVAILABLE FOR MEDICINAL APPLICATIONS.')}
                                            </p>
                                        </div>
                                        {currentData.oils_and_florals && currentData.oils_and_florals !== 'None' && (
                                            <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid #ffb700' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                                    <Pipette size={20} color="#ffb700" />
                                                    <h4 className="mono" style={{ margin: 0, fontSize: '0.9rem' }}>ESSENCES & OILS</h4>
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                                    {renderValue(currentData.oils_and_florals)}
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
                                                {renderValue(currentData.cultivation, '---')}
                                            </p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                            <MetricBox icon={Thermometer} label="TEMP" value={currentData.metadata?.temperature} />
                                            <MetricBox icon={Droplets} label="HUMIDITY" value={currentData.metadata?.humidity} />
                                            <MetricBox icon={Sun} label="LIGHT" value={currentData.metadata?.light} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div className="glass-panel" style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                    <Scissors size={16} color="var(--accent-color)" />
                                                    <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.pruning}</span>
                                                </div>
                                                <div style={{ fontSize: '1rem' }}>{renderValue(currentData.pruning, '---')}</div>
                                            </div>
                                            <div className="glass-panel" style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                    <Calendar size={16} color="var(--accent-color)" />
                                                    <span className="mono" style={{ fontSize: '0.7rem', color: '#ffb700' }}>{t.metrics.plantingSeason}</span>
                                                </div>
                                                <div style={{ fontSize: '1rem' }}>{currentData.planting_season || '---'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
