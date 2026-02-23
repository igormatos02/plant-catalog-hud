import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, Database, Zap, Loader2, Thermometer, Droplets, Sun, Skull } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { searchPlants, getPlantDetails } from '../lib/gemini';
import PlantDetail from '../components/PlantDetail';
import PlantGrid from '../components/PlantGrid';

const Catalog = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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
        try {
            // Check Supabase first (Note: ideally we would have language-specific caching)
            const { data, error } = await supabase
                .from('plants')
                .select('*')
                .eq('name', plantName)
                .single();

            // If found in DB, we still might want to re-fetch if the language is different
            // For now, if it's in DB, we use it, but the user wants the prompt remade.
            // To ensure language changes effect existing selections, we'll bypass cache if we're explicitly changing language

            const geminiDetails = await getPlantDetails(plantName, lang);
            if (geminiDetails) {
                const updatedPlant = {
                    name: plantName,
                    description: geminiDetails.description,
                    picture_url: data?.picture_url || `https://images.unsplash.com/photo-1501004318641-73e49c33ba4b?auto=format&fit=crop&q=80&w=1000`,
                    metadata: geminiDetails.metadata
                };

                // Optional: Update cache
                await supabase.from('plants').upsert([updatedPlant], { onConflict: 'name' });
                setSelectedPlant(updatedPlant);
            }
        } catch (err) {
            console.error("Error fetching plant details:", err);
        } finally {
            setIsLoadingDetail(false);
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
        <div className="catalog-container">
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
                <PlantDetail plant={selectedPlant} onBack={() => setSelectedPlant(null)} isLoading={isLoadingDetail} />
            )}
        </div>
    );
};
export default Catalog;
