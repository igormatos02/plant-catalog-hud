import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, Database, Zap, Loader2, Thermometer, Droplets, Sun, Skull } from 'lucide-react';
import { searchPlants, getPlantDetails, generatePlantImage } from '../lib/gemini';
import PlantDetail from '../components/PlantDetail';
import PlantGrid from '../components/PlantGrid';

const Catalog = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const performSearch = useCallback(async (query, lang) => {
        if (!query) return;
        setIsSearching(true);
        try {
            const geminiResults = await searchPlants(query, lang);
            setResults(geminiResults || []);
        } catch (err) {
            console.error("Search failed:", err);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const loadPlantDetails = useCallback(async (plantName, lang) => {
        setIsLoadingDetail(true);
        setIsGeneratingImage(true);
        try {
            // PHASE 1: Data Decryption (Text & Metadata)
            const geminiDetails = await getPlantDetails(plantName, lang);
            if (geminiDetails) {
                // Initialize plant with text data first
                const basePlant = {
                    name: plantName,
                    description: geminiDetails.description,
                    picture_url: null, // Image will be generated in Phase 2
                    metadata: geminiDetails.metadata
                };

                setSelectedPlant(basePlant);
                setIsLoadingDetail(false); // Text is now visible
                setIsGeneratingImage(true); // Signal Phase 2 start


            }
        } catch (err) {
            console.error("Discovery sequence failure:", err);
            setSelectedPlant({
                name: plantName,
                description: "Critical error in botanical data stream.",
                metadata: { humidity: 'ERR', temperature: 'ERR', light: 'ERR', toxicity: 'ERR' }
            });
            setIsLoadingDetail(false);
            setIsGeneratingImage(false);
        }
    }, []);

    // Trigger search when language changes
    useEffect(() => {
        if (searchQuery) {
            performSearch(searchQuery, language);
        }
        if (selectedPlant) {
            loadPlantDetails(selectedPlant.name, language);
        }
    }, [language, performSearch, loadPlantDetails]);

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(searchQuery, language);
    };

    const handleSelectPlant = (plantName) => {
        loadPlantDetails(plantName, language);
    };

    return (
        <div className="catalog-container" style={{ position: 'relative', minHeight: '80vh' }}>
            {/* Search Loading Overlay */}
            {isSearching && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(5, 12, 16, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--accent-color)',
                    animation: 'fadeIn 0.3s ease'
                }} className="glass-panel">
                    <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
                    <p className="mono" style={{ marginTop: '20px', letterSpacing: '4px', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                        INITIATING GLOBAL ARCHIVE DISCOVERY...
                    </p>
                    <div style={{ marginTop: '10px', fontSize: '0.6rem', color: 'var(--text-secondary)' }} className="mono">
                        AI_ENGINE: PROCESSING_BOTANICAL_QUERY
                    </div>
                </div>
            )}

            {!selectedPlant ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 className="neon-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>ARCHIVE SEARCH</h1>
                        <p className="mono" style={{ color: 'var(--text-secondary)' }}>ACCESSING GLOBAL BOTANICAL DATABASE...</p>
                    </header>

                    <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="glass-panel hud-border"
                            placeholder="ENTER SPECIMEN NAME OR TRAIT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '24px 30px',
                                paddingRight: '70px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: searchQuery ? 'var(--accent-color)' : 'var(--text-secondary)',
                            }}
                        >
                            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                        </button>
                    </form>

                    <PlantGrid plants={results} onSelectPlant={handleSelectPlant} />
                </div>
            ) : (
                <PlantDetail
                    plant={selectedPlant}
                    onBack={() => {
                        setSelectedPlant(null);
                        setSearchQuery('');
                        setResults([]);
                    }}
                    isLoading={isLoadingDetail}
                    isGeneratingImage={isGeneratingImage}
                />
            )}
        </div>
    );
};
export default Catalog;
