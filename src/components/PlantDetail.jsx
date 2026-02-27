import React, { useState, useEffect } from 'react';
import { Search, Loader2, Database } from 'lucide-react';
import { translations } from '../lib/translations';
import { getCompletePlantData } from '../lib/gemini';
import { renderValue } from './PlantDetailUtils';

// Import Tab Components
import GeneralTab from './tabs/GeneralTab';
import BotanyTab from './tabs/BotanyTab';
import CulinaryTab from './tabs/CulinaryTab';
import MedicalTab from './tabs/MedicalTab';
import CultivationTab from './tabs/CultivationTab';
import SpecimenCarousel from './SpecimenCarousel';
import LifecycleChart from './LifecycleChart';
import ReportGenerator from './ReportGenerator';

const PlantDetail = ({ plant, onBack, isLoading, isGeneratingImage, language }) => {
    const t = translations[language] || translations.en;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [fullPlantData, setFullPlantData] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    // Load ALL data at once when a plant is selected
    useEffect(() => {
        const fetchAllDetails = async () => {
            if (!plant?.scientific_name) return;

            setFullPlantData(null);
            setIsDetailsLoading(true);
            try {
                const data = await getCompletePlantData(plant.scientific_name, language);
                if (data) {
                    setFullPlantData(data);
                } else {
                    // Fallback to basic plant info if complete fetch fails
                    setFullPlantData(plant);
                }
            } catch (err) {
                console.error(`[PlantDetail] Failed to load comprehensive data:`, err);
                setFullPlantData(plant);
            } finally {
                setIsDetailsLoading(false);
            }
        };

        if (plant) {
            setActiveTab('general');
            fetchAllDetails();
        }
    }, [plant?.scientific_name, language]);

    useEffect(() => {
        if (!isGeneratingImage && (plant?.picture_url || plant?.picture_urls)) {
            setImageLoaded(true);
        } else if (isGeneratingImage) {
            setImageLoaded(false);
        }
    }, [isGeneratingImage, plant?.picture_url, plant?.picture_urls]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
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

    // Use fullPlantData if available, otherwise fallback to the skeleton plant
    const currentData = fullPlantData || plant;
    const isTabLoading = isDetailsLoading;

    const tabs = [
        { id: 'general', label: t.tabs.geral },
        { id: 'botany', label: t.tabs.caracteristicas },
        { id: 'culinary', label: t.tabs.culinaria },
        { id: 'medical', label: t.tabs.terapeutico },
        { id: 'cultivation', label: t.tabs.cultivo }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralTab data={currentData} t={t} />;
            case 'botany':
                return <BotanyTab data={currentData.botany || currentData} t={t} />;
            case 'culinary':
                return <CulinaryTab data={currentData.culinary || currentData} t={t} />;
            case 'medical':
                return <MedicalTab data={currentData.medical || currentData} t={t} />;
            case 'cultivation':
                return <CultivationTab data={currentData.cultivation || currentData} t={t} />;
            default:
                return null;
        }
    };

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
                {/* Left Col: Image / Carousel */}
                <div style={{ position: 'relative', height: 'fit-content' }}>
                    {showImageLoading ? (
                        <div className="hud-border" style={{
                            padding: '4px',
                            background: 'var(--accent-color)',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(5, 12, 16, 0.9)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Loader2 className="animate-spin" size={32} color="var(--accent-color)" />
                            <p className="mono" style={{ marginTop: '15px', fontSize: '0.7rem', color: 'var(--accent-color)', letterSpacing: '2px', textAlign: 'center', padding: '0 20px' }}>
                                {isGeneratingImage ? "SYNCHRONIZING WITH PLANTNET ARCHIVE..." : "RETRIEVING SPECIMEN IMAGERY..."}
                            </p>
                        </div>
                    ) : (
                        <SpecimenCarousel images={plant.picture_urls || [plant.picture_url]} name={plant.scientific_name} />
                    )}

                    {/* Chart below image */}
                    {!isLoading && currentData.lifecycle && (
                        <LifecycleChart data={currentData.lifecycle} />
                    )}
                </div>

                {/* Right Col: Data */}
                <div>
                    <header style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                            <span className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{plant.name || '---'}</span>   gbifId:  {plant.gbifId}
                            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontStyle: 'italic' }}> {plant.popular_name || ''}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0', letterSpacing: '-1px' }}>
                                {plant.scientific_name?.toUpperCase() || 'UNKNOWN_SPECIMEN'}
                            </h1>
                            <ReportGenerator
                                plant={currentData}
                                currentLanguage={language}
                                t={t}
                            />
                        </div>
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
                                {renderTabContent()}
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
