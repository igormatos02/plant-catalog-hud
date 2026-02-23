import React from 'react';
import { Search, Loader2, Thermometer, Droplets, Sun, Zap } from 'lucide-react';

const MetricBox = ({ icon: Icon, label, value }) => (
    <div className="glass-panel" style={{ padding: '20px', borderLeft: '2px solid var(--accent-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Icon size={16} color="var(--accent-color)" />
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

const PlantDetail = ({ plant, onBack, isLoading, isGeneratingImage }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    // Reset image loading state when the picture URL becomes available or changes
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

    // The image area shows a loading HUD if:
    // 1. The AI is still generating the URL (isGeneratingImage)
    // 2. We have a URL but the browser hasn't finished loading it (!imageLoaded)
    // 3. We don't even have a URL yet (!plant.picture_url)
    const showImageLoading = isGeneratingImage || !imageLoaded || !plant.picture_url;

    return (
        <div className="plant-detail" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={onBack} className="mono" style={{ color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Search size={14} /> BACK TO SEARCH
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
                {/* Left Col: Image & HUD Overlays */}
                <div style={{ position: 'relative', minHeight: '400px' }}>
                    <div className="hud-border" style={{ padding: '4px', background: 'var(--accent-color)', height: '100%', position: 'relative', overflow: 'hidden' }}>
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
                                backdropFilter: 'blur(10px)'
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
                                onError={() => setImageLoaded(true)} // Clear loading state on error to show broken icon/fallback
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    filter: 'grayscale(0.1) contrast(1.1)',
                                    animation: 'fadeIn 0.8s ease',
                                    opacity: imageLoaded ? 1 : 0
                                }}
                            />
                        )}
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
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '10px 0' }}>{plant.name?.toUpperCase()}</h1>
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

export default PlantDetail;
