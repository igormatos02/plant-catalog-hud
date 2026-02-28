import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CulinaryTab from './tabs/CulinaryTab';
import MedicalTab from './tabs/MedicalTab';
import CultivationTab from './tabs/CultivationTab';
import HealthTab from './tabs/HealthTab';
import { AlertTriangle, Skull, ChevronRight, Thermometer, Droplets, Maximize, Clock, Activity, Sun, Database } from 'lucide-react';
import { parseToxicity, getToxicityColor, MetricBox, renderValue } from './PlantDetailUtils';

const VisualPdfTemplate = ({ plant, t }) => {
    const tLevel = parseToxicity(plant?.metadata?.toxicity_level);
    const tColor = getToxicityColor(tLevel);

    return (
        <div id="visual-pdf-root" style={{
            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            color: '#000000',
            background: '#ffffff',
            padding: '40px',
            width: '1000px', // Wider to fit more content alongside smaller font
            boxSizing: 'border-box'
        }}>
            <style>{`
                #visual-pdf-root {
                    --bg-primary: #ffffff;
                    --bg-secondary: #f8fafc;
                    --text-primary: #000000;
                    --text-secondary: #334155;
                    --accent-color: #00acc1;
                    font-size: 0.8em;
                }
                
                /* Main section containers keep some styling but we remove borders from inner items 
                   as requested by the user: "remova o contorno de caixas menos para as caixas de descricao inicial..." */
                #visual-pdf-root .glass-panel {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    color: #000000 !important;
                    padding: 5px 10px !important;
                }
                
                /* Except we want to keep the main description box border if needed, 
                   but the user asked to remove borders from boxes "menos para as caixas de descricao inicial".
                   Let's target the inner grid boxes specifically to remove their backgrounds/borders. */
                
                #visual-pdf-root > div > div > .glass-panel:first-child {
                    border: 1px solid #e2e8f0 !important;
                    background: #ffffff !important;
                    padding: 20px !important;
                    margin-bottom: 20px !important;
                }

                #visual-pdf-root .glass-panel * {
                    color: inherit;
                }
                #visual-pdf-root p, #visual-pdf-root span, #visual-pdf-root div {
                    color: #000000;
                }
                #visual-pdf-root .glass-panel p, #visual-pdf-root .glass-panel span {
                    color: #334155 !important;
                }
                #visual-pdf-root .mono {
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                }
                #visual-pdf-root svg {
                    opacity: 0.9;
                }
                /* Disable animations to prevent html2canvas capturing mid-frame */
                #visual-pdf-root * {
                    animation: none !important;
                    transition: none !important;
                }
            `}</style>

            <div style={{ borderBottom: '2px solid #00acc1', paddingBottom: '15px', marginBottom: '15px' }}>
                <h2 className="mono" style={{ color: '#00acc1', fontSize: '0.9rem', marginBottom: '5px' }}>
                    A.G. BOTANICS // {plant.popular_name?.toUpperCase() || 'SPECIMEN_REPORT'}
                </h2>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-1px' }}>
                    {plant.scientific_name?.toUpperCase() || 'UNKNOWN_SPECIMEN'}
                </h1>

                <div className="mono" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.65rem', color: '#64748b' }}>
                    {['class', 'order', 'family', 'genus', 'species'].map((tax, idx) => {
                        const val = tax === 'species' ? plant.metadata?.type : (plant.taxonomy?.[tax] || plant[tax]);
                        if (!val) return null;
                        return (
                            <React.Fragment key={tax}>
                                {idx > 0 && <ChevronRight size={10} style={{ margin: '0 4px', color: '#cbd5e1' }} />}
                                <span style={{ fontWeight: 600, color: '#00acc1' }}>{t.tabs[tax]?.toUpperCase() || tax.toUpperCase()}:</span>
                                <span style={{ marginLeft: '4px', color: '#334155' }}>{val.toUpperCase()}</span>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
            {tLevel >= 3 && (
                <div style={{
                    display: 'flex', alignItems: 'start', gap: '15px', padding: '15px',
                    background: '#fef2f2', border: '1px solid ' + tColor,
                    marginBottom: '15px', borderRadius: '4px'
                }}>
                    <div style={{ background: tColor, padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tLevel >= 4 ? <Skull size={20} color="#ffffff" /> : <AlertTriangle size={20} color="#ffffff" />}
                    </div>
                    <div>
                        <div className="mono" style={{ color: tColor, fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <AlertTriangle size={14} />
                            {(tLevel >= 3 ? t.metrics.danger : t.metrics.caution)?.toUpperCase()}
                        </div>
                        <p className="mono" style={{ fontSize: '0.7rem', color: '#334155', marginTop: '4px' }}>
                            <span style={{ color: tColor, fontWeight: 'bold' }}>
                                Toxicidade {tLevel >= 5 ? 'extremamente alta' : tLevel >= 4 ? 'alta' : 'moderada'}.
                            </span> {plant.metadata?.toxicity}
                        </p>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Custom General Layout for PDF */}
                <div>
                    <div className="glass-panel" style={{ padding: '30px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <Database size={24} color="var(--accent-color)" />
                            <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t.tabs.description.toUpperCase()}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
                            {renderValue(plant.description, t.tabs.unavailable || 'NO DESCRIPTION AVAILABLE.')}

                            {plant.metadata?.toxicity && (
                                <span style={{ display: 'block', marginTop: '15px' }}>
                                    <strong>Toxicidade:</strong> {plant.metadata.toxicity}
                                </span>
                            )}

                            <span style={{ display: 'block', marginTop: '5px' }}>
                                <strong>{t.metrics.origin || 'Origem'}:</strong> {plant.metadata?.native_to || 'Desconhecida'}
                            </span>
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                        <MetricBox icon={Thermometer} label={t.metrics.tempRange} value={plant.metadata?.temperature} />
                        <MetricBox icon={Droplets} label={t.metrics.hydration} value={plant.metadata?.humidity} />
                        <MetricBox icon={Maximize} label={t.metrics.specimenSize} value={plant.metadata?.size} />
                        <MetricBox icon={Clock} label={t.metrics.timeToAdult} value={plant.metadata?.time_to_adult} />
                        <MetricBox icon={Activity} label={t.metrics.lifespan} value={plant.metadata?.lifespan} />

                        <div className="glass-panel" style={{ padding: '15px', borderLeft: '2px solid #ffb700', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Sun size={14} color="#ffb700" />
                                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.metrics.luxExposure}</span>
                            </div>
                            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{renderValue(plant.metadata?.light)}</div>
                        </div>
                    </div>
                </div>
                {plant.culinary && <CulinaryTab data={plant.culinary} fullData={plant} t={t} />}
                {plant.medical && <MedicalTab data={plant.medical} fullData={plant} t={t} />}
                {plant.cultivation && <CultivationTab data={plant.cultivation} t={t} />}
                {plant.health && <HealthTab data={plant.health} t={t} />}
            </div>

            <div className="mono" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', fontSize: '0.65rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>A.G. BOTANICS // HUD_REPORT_MODULE v3.0 // VISUAL_RENDER</span>
                <span>TIMESTAMP: {new Date().toLocaleString()}</span>
            </div>
        </div >
    );
};

export const generateVisualPdf = async (plant, t, setProgress) => {
    return new Promise((resolve, reject) => {
        try {
            setProgress('PREPARING VISUAL DOM...');

            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            document.body.appendChild(container);

            const root = createRoot(container);

            root.render(<VisualPdfTemplate plant={plant} t={t} />);

            // Give React DOM a moment to mount and fonts to apply before capturing
            setTimeout(async () => {
                try {
                    setProgress('CAPTURING ENGINE RENDER...');
                    const element = document.getElementById('visual-pdf-root');
                    if (!element) throw new Error('Root element not found');

                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        logging: false
                    });

                    setProgress('COMPILING PDF DOCUMENT...');
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);

                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    const imgProps = pdf.getImageProperties(imgData);
                    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    let heightLeft = imgHeight;
                    let contentConsumed = 0;

                    const footerSpace = 15; // mm at the bottom reserved for footer
                    const headerSpace = 15; // mm at the top reserved for header

                    // First page: draws from top (0)
                    // We only consume (pageHeight - footerSpace) units of the image per page
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

                    const firstPageHeight = pageHeight - footerSpace;
                    contentConsumed += firstPageHeight;
                    heightLeft -= firstPageHeight;

                    // Subsequent pages
                    while (heightLeft > 0) {
                        // For page 2+, we shift UP by contentConsumed, and DOWN by headerSpace
                        const position = -contentConsumed + headerSpace;

                        pdf.addPage();

                        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);

                        const usableHeight = pageHeight - footerSpace - headerSpace;
                        contentConsumed += usableHeight;
                        heightLeft -= usableHeight;
                    }

                    // Add Header & Footer (Date and Page Numbers)
                    const totalPages = pdf.internal.getNumberOfPages();
                    const dateStr = new Date().toLocaleDateString(navigator.language || 'pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                    });

                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);

                        // Footer background mask
                        pdf.setFillColor(255, 255, 255);
                        pdf.rect(0, pageHeight - 12, pdfWidth, 12, 'F');

                        // Header background mask ONLY on page 2+
                        if (i > 1) {
                            pdf.rect(0, 0, pdfWidth, headerSpace, 'F');

                            pdf.setFontSize(10);
                            pdf.setTextColor(0, 172, 193); // #00acc1 (Accent color)
                            pdf.setFont('helvetica', 'bold');
                            const plantName = plant.popular_name?.toUpperCase() || 'SPECIMEN';
                            pdf.text(`AG. Botanics // ${plantName}`, 15, 12);
                        }

                        pdf.setFontSize(8);
                        pdf.setTextColor(150, 150, 150); // Light gray
                        pdf.setFont('helvetica', 'normal');

                        // Date on left
                        pdf.text(`Generated on ${dateStr}`, 15, pageHeight - 5);

                        // Page x of y on right
                        const pageText = `Page ${i} of ${totalPages}`;
                        const textWidth = pdf.getStringUnitWidth(pageText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                        pdf.text(pageText, pdfWidth - textWidth - 15, pageHeight - 5);
                    }

                    pdf.save(`AG_VISUAL_${plant.popular_name?.replace(/[^a-z0-9]/gi, '_').toUpperCase() || 'SPECIMEN'}.pdf`);

                    // Cleanup
                    root.unmount();
                    document.body.removeChild(container);
                    resolve(true);
                } catch (err) {
                    console.error("html2canvas error:", err);
                    root.unmount();
                    if (document.body.contains(container)) document.body.removeChild(container);
                    reject(err);
                }
            }, 800);

        } catch (error) {
            console.error("PDF outer error:", error);
            reject(error);
        }
    });
};
