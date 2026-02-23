import React, { useState } from 'react';
import { Search, Info, Database, Zap, Loader2, Thermometer, Droplets, Sun, Skull } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { searchPlants, getPlantDetails } from '../lib/gemini';

const Catalog = () => {
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
            const geminiResults = await searchPlants(searchQuery);
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
            // 1. Check Supabase
            const { data, error } = await supabase
                .from('plants')
                .select('*')
                .eq('name', plantName)
                .single();

            if (data) {
                setSelectedPlant(data);
            } else {
                // 2. Fetch from Gemini
                const geminiDetails = await getPlantDetails(plantName);

                if (geminiDetails) {
                    const newPlant = {
                        name: plantName,
                        description: geminiDetails.description,
                        picture_url: `https://images.unsplash.com/photo-1501004318641-73e49c33ba4b?auto=format&fit=crop&q=80&w=1000`, // Placeholder as Gemini doesn't return images directly
                        metadata: geminiDetails.metadata
                    };

                    // 3. Save to Supabase
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

                    <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {results.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => handleSelectPlant(r.name)}
                                className="glass-panel hud-border"
                                style={{
                                    padding: '20px',
                                    textAlign: 'left',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-color)', marginBottom: '4px' }}>CODE: SPL-{r.id}</div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{r.scientific_name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <PlantDetail plant={selectedPlant} onBack={() => setSelectedPlant(null)} isLoading={isLoadingDetail} />
            )}
        </div>
    );
};

const PlantDetail = ({ plant, onBack, isLoading }) => {
    if (isLoading) {
        return (
            <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
                <p className="mono" style={{ marginTop: '20px', letterSpacing: '2px' }}>DECRYPTING SPECIMEN DATA...</p>
            </div>
        );
    }

    return (
        <div className="plant-detail" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={onBack} className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={14} /> BACK TO SEARCH
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
                {/* Left Col: Image & HUD Overlays */}
                <div style={{ position: 'relative' }}>
                    <div className="hud-border" style={{ padding: '4px', background: 'var(--accent-color)' }}>
                        <img
                            src={plant.picture_url}
                            alt={plant.name}
                            style={{ width: '100%', display: 'block', filter: 'grayscale(0.2) contrast(1.1)' }}
                        />
                    </div>

                    {/* HUD Accents */}
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
                        <span className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>IDENTIFIED_SPECIMEN</span>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0' }}>{plant.name.toUpperCase()}</h1>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '4px 10px', fontSize: '0.7rem' }}>CAT_A_CLASS</div>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', fontSize: '0.7rem' }}>VER_4.0.2</div>
                        </div>
                    </header>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
                        {plant.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <MetricBox icon={Thermometer} label="TARGET_TEMP" value={plant.metadata?.temperature || '24.2°C'} />
                        <MetricBox icon={Droplets} label="HYDRATION" value={plant.metadata?.humidity || '68%'} />
                        <MetricBox icon={Sun} label="LUX_EXPOSURE" value={plant.metadata?.light || 'HYBRID'} />
                        <MetricBox icon={Zap} label="BIOE_LVM" value={plant.metadata?.toxicity || 'STABLE'} />
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

const MetricBox = ({ icon: Icon, label, value }) => (
    <div className="glass-panel" style={{ padding: '20px', borderLeft: '2px solid var(--accent-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Icon size={16} color="var(--accent-color)" />
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

export default Catalog;
