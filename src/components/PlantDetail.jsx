import React from 'react';
import { Search, Loader2, Thermometer, Droplets, Sun, Zap, Utensils, Heart, Pipette, Sprout, Maximize, Calendar, Scissors, Database } from 'lucide-react';

const MetricBox = ({ icon: Icon, label, value }) => (
    <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid var(--accent-color)', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icon size={14} color="var(--accent-color)" />
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.2' }}>{value}</div>
    </div>
);

const PlantDetail = ({ plant, onBack, isLoading, isGeneratingImage }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    React.useEffect(() => {
        if (plant?.picture_url) {
            setImageLoaded(false);
        }
    }, [plant?.picture_url]);

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

    return (
        <div className="plant-detail" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={onBack} className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease' }} onMouseOver={e => e.target.style.color = 'var(--accent-color)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                <Search size={14} /> BACK TO SEARCH
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
                            <span className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>IDENTIFIED_SPECIMEN</span>
                            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontStyle: 'italic' }}>{plant.scientific_name}</span>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0', letterSpacing: '-1px' }}>{plant.name?.toUpperCase()}</h1>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div className="mono" style={{ background: 'rgba(0,242,255,0.1)', color: 'var(--accent-color)', padding: '4px 12px', fontSize: '0.65rem', border: '1px solid rgba(0,242,255,0.2)' }}>
                                CLASS: {plant.class?.toUpperCase() || 'UNKNOWN'}
                            </div>
                            <div className="mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 12px', fontSize: '0.65rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                FAMILY: {plant.family?.toUpperCase() || 'UNKNOWN'}
                            </div>
                        </div>
                    </header>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '800px' }}>
                        {plant.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                        <MetricBox icon={Thermometer} label="TEMP_RANGE" value={plant.metadata?.temperature || '---'} />
                        <MetricBox icon={Droplets} label="HYDRATION" value={plant.metadata?.humidity || '---'} />
                        <MetricBox icon={Sun} label="LUX_EXPOSURE" value={plant.metadata?.light || '---'} />
                        <MetricBox icon={Zap} label="BIO_TOXICITY" value={plant.metadata?.toxicity || '---'} />

                        <MetricBox icon={Utensils} label="CULINARY_USE" value={plant.metadata?.culinary_use || '---'} />
                        <MetricBox icon={Heart} label="THERAPEUTIC" value={plant.metadata?.therapeutic_use || '---'} />
                        {plant.metadata?.oils_and_florals && plant.metadata.oils_and_florals !== 'None' && (
                            <MetricBox icon={Pipette} label="OILS_FLORALS" value={plant.metadata.oils_and_florals} />
                        )}

                        <MetricBox icon={Sprout} label="CULTIVATION" value={plant.metadata?.cultivation || '---'} />
                        <MetricBox icon={Maximize} label="SPECIMEN_SIZE" value={plant.metadata?.size || '---'} />
                        <MetricBox icon={Calendar} label="SEASONAL_CYCLE" value={plant.metadata?.planting_season || '---'} />
                        <MetricBox icon={Scissors} label="PRUNING_REG" value={plant.metadata?.pruning || '---'} />
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
