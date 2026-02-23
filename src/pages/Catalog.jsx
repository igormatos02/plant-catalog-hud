import React, { useState } from 'react';
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

    // Mock Gemini search - in a real app, this would be an API call
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        try {
            const geminiResults = await searchPlants(searchQuery, language);
            setResults(geminiResults || []);
        } catch (err) {
            console.error("Search failed:", err);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectPlant = async (plantName) => {
        setIsLoadingDetail(true);

        try {
            // 1. Check Supabase (Note: we might want to include language in cache key eventually)
            const { data, error } = await supabase
                .from('plants')
                .select('*')
                .eq('name', plantName)
                .single();

            if (data) {
                setSelectedPlant(data);
            } else {
                // 2. Fetch from Gemini
                const geminiDetails = await getPlantDetails(plantName, language);

                if (geminiDetails) {
                    const newPlant = {
                        name: plantName,
                        description: geminiDetails.description,
                        picture_url: `https://images.unsplash.com/photo-1501004318641-73e49c33ba4b?auto=format&fit=crop&q=80&w=1000`, // Placeholder as Gemini doesn't return images directly
                        metadata: geminiDetails.metadata
                    };

                    // 3. Save to Supabase (language-specific caching would be better, but for now we follow the user prompt)
                    await supabase.from('plants').insert([newPlant]);
                    setSelectedPlant(newPlant);
                } else {
                    throw new Error("Failed to get plant details from Gemini");
                }
            }
        } catch (err) {
            console.error("Error fetching plant:", err);
            // Fallback for demo
            setSelectedPlant({
                name: plantName,
                description: "Botanical data retrieval failed. Using cached local profile.",
                picture_url: "https://images.unsplash.com/photo-1501004318641-73e49c33ba4b?auto=format&fit=crop&q=80&w=1000",
                metadata: { humidity: 'N/A', temperature: 'N/A', light: 'N/A', toxicity: 'N/A' }
            });
        } finally {
            setIsLoadingDetail(false);
        }
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
