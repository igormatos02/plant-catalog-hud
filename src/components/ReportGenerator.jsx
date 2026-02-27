import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { getPlantPdfReportData } from '../lib/gemini';

const ReportGenerator = ({ plant, currentLanguage, t }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');

    // Unique method to gather data for the report in a single AI call
    const gatherReportData = async () => {
        // If the plant already has full data (e.g. from Supabase in PlantDetail), use it immediately!
        if (plant.metadata?.time_to_adult || plant.culinary) {
            console.log('[PDF] Using already loaded specimen data');
            return plant;
        }

        console.log('[PDF] Fetching data for plant:', plant.scientific_name);
        setProgress('DECRYPTING ARCHIVE...');
        const data = await getPlantPdfReportData(plant.scientific_name, currentLanguage);
        // Fallback to local props if AI fails
        return data || {
            scientific_name: plant.scientific_name,
            popular_name: plant.popular_name,
            description: plant.description,
            taxonomy: {
                class: plant.class,
                order: plant.order,
                family: plant.family,
                genus: plant.genus
            },
            metadata: plant.metadata,
            culinary: {},
            medical: {},
            cultivation: {}
        };
    };

    const generatePdf = async () => {
        setIsGenerating(true);
        setProgress('INITIATING SCAN...');

        try {
            // 1. Fetch comprehensive data
            const reportData = await gatherReportData();

            // 2. Prepare the PDF using direct jsPDF commands
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;

            const checkPageBreak = (neededHeight) => {
                if (currentY + neededHeight > pageHeight - margin) {
                    pdf.addPage();
                    currentY = margin;
                    return true;
                }
                return false;
            };

            // Branding/Header
            pdf.setFont('courier', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(0, 172, 193); // #00acc1
            pdf.text('A.G. BOTANICS // SPECIMEN_REPORT', margin, 15);

            pdf.setDrawColor(0, 172, 193);
            pdf.setLineWidth(0.5);
            pdf.line(margin, 18, pageWidth - margin, 18);

            // Names
            pdf.setTextColor(5, 12, 16);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(32);
            pdf.text(String(reportData.popular_name || 'UNIDENTIFIED').toUpperCase(), margin, 35);

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(0, 172, 193);
            pdf.text(String(reportData.scientific_name || 'Specimen Unknown'), margin, 43);

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(153, 153, 153);
            pdf.text(`ARCHIVE_REF: ${reportData.metadata?.gbifId || '---'}`, margin, 48);

            // --- SECTION: TAXONOMY & VITALS ---
            let currentY = 55;
            pdf.setDrawColor(0, 172, 193);
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, currentY, 80, 55, 'FD'); // Increased height

            pdf.setTextColor(0, 172, 193);
            pdf.setFontSize(8);
            pdf.setFont('courier', 'bold');
            pdf.text('[TAXON_DATA]', margin + 5, currentY + 7);

            pdf.setTextColor(153, 153, 153);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(`CLASS:  ${String(reportData.taxonomy?.class || '---')}`, margin + 5, currentY + 15);
            pdf.text(`ORDER:  ${String(reportData.taxonomy?.order || '---')}`, margin + 5, currentY + 22);
            pdf.text(`FAMILY: ${String(reportData.taxonomy?.family || '---')}`, margin + 5, currentY + 29);
            pdf.text(`GENUS:  ${String(reportData.taxonomy?.genus || '---')}`, margin + 5, currentY + 36);
            pdf.text(`SPECIES: ${String(reportData.taxonomy?.species || reportData.metadata?.type || '---')}`, margin + 5, currentY + 43);

            pdf.setDrawColor(245, 158, 11);
            pdf.setFillColor(255, 252, 240);
            pdf.rect(110, currentY, 80, 55, 'FD'); // Increased height

            pdf.setTextColor(245, 158, 11);
            pdf.setFont('courier', 'bold');
            pdf.setFontSize(8);
            pdf.text('[VITAL_SIGNS]', 115, currentY + 7);

            pdf.setTextColor(153, 153, 153);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(`HUMIDITY: ${String(reportData.metadata?.humidity || '---')}`, 115, currentY + 15);
            pdf.text(`TEMP:     ${String(reportData.metadata?.temperature || '---')}`, 115, currentY + 22);
            pdf.text(`LIGHT:    ${String(reportData.metadata?.light || '---')}`, 115, currentY + 29);
            pdf.text(`${(t.metrics.timeToAdult || 'ADULT_AT').toUpperCase()}: ${String(reportData.metadata?.time_to_adult || '---')}`, 115, currentY + 36);
            pdf.text(`${(t.metrics.lifespan || 'LIFESPAN').toUpperCase()}: ${String(reportData.metadata?.lifespan || '---')}`, 115, currentY + 43);

            const toxLevel = parseInt(reportData.metadata?.toxicity_level || '1');
            pdf.setTextColor(toxLevel > 2 ? 239 : 153, toxLevel > 2 ? 68 : 153, toxLevel > 2 ? 68 : 153);
            pdf.text(`TOXICITY: LEVEL ${toxLevel}`, 115, currentY + 50);

            currentY = 120; // Adjusted starting Y for next section

            // --- SECTION: DESCRIPTION ---
            checkPageBreak(30);
            pdf.setTextColor(0, 172, 193);
            pdf.setFont('courier', 'bold');
            pdf.setFontSize(8);
            pdf.text('[ARCHIVE_SUMMARY]', margin, currentY);

            pdf.setTextColor(51, 65, 85);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            const splitDescription = pdf.splitTextToSize(reportData.description || '---', pageWidth - 40);
            pdf.text(splitDescription, margin, currentY + 10);
            currentY += (splitDescription.length * 5) + 20;

            // --- SECTION: CULTIVATION ---
            if (reportData.cultivation && reportData.cultivation.cultivation !== 'NOT_APPLICABLE') {
                checkPageBreak(40);
                pdf.setTextColor(16, 185, 129); // Green/Emerald
                pdf.setFont('courier', 'bold');
                pdf.setFontSize(8);
                pdf.text('[CULTIVATION_PROTOCOL]', margin, currentY);

                pdf.setTextColor(51, 65, 85);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                const cultMain = pdf.splitTextToSize(reportData.cultivation.cultivation || '---', pageWidth - 40);
                pdf.text(cultMain, margin, currentY + 8);
                currentY += (cultMain.length * 5) + 12;

                const cultItems = [
                    { label: 'SOIL/SUBSTRATE:', val: reportData.cultivation.soil },
                    { label: 'DRAINAGE:      ', val: reportData.cultivation.drainage },
                    { label: 'PROPAGATION:   ', val: reportData.cultivation.propagation },
                    { label: 'SYMBIOSIS:     ', val: reportData.cultivation.symbiosis },
                    { label: 'PRUNING:       ', val: reportData.cultivation.pruning }
                ];

                cultItems.forEach(item => {
                    if (item.val && item.val !== 'NOT_APPLICABLE') {
                        const itemLines = pdf.splitTextToSize(item.val, pageWidth - 65);
                        checkPageBreak((itemLines.length * 5) + 2);
                        pdf.setTextColor(16, 185, 129);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setFontSize(8);
                        pdf.text(item.label, margin + 5, currentY);

                        pdf.setTextColor(153, 153, 153);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(itemLines, 55, currentY);
                        currentY += (itemLines.length * 5) + 2;
                    }
                });
                currentY += 10;
            }

            // --- SECTION: MEDICAL ---
            if (reportData.medical && reportData.medical.therapeutic_use && reportData.medical.therapeutic_use !== 'NOT_APPLICABLE') {
                checkPageBreak(40);
                pdf.setTextColor(239, 68, 68); // Red
                pdf.setFont('courier', 'bold');
                pdf.setFontSize(8);
                pdf.text('[PHARMACOLOGICAL_DATA]', margin, currentY);

                pdf.setTextColor(51, 65, 85);
                const medMain = pdf.splitTextToSize(reportData.medical.therapeutic_use, pageWidth - 40);
                pdf.text(medMain, margin, currentY + 8);
                currentY += (medMain.length * 5) + 12;

                const medItems = [
                    { label: 'OILS/FLORALS: ', val: reportData.medical.oils_and_florals },
                    { label: 'TEA/INFUSION: ', val: reportData.medical.tea },
                    { label: 'OTHER USES:   ', val: reportData.medical.perfume || reportData.medical.soap }
                ];

                medItems.forEach(m => {
                    if (m.val && m.val !== 'NOT_APPLICABLE') {
                        const mLines = pdf.splitTextToSize(m.val, pageWidth - 65);
                        checkPageBreak((mLines.length * 5) + 2);
                        pdf.setTextColor(239, 68, 68);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(m.label, margin + 5, currentY);
                        pdf.setTextColor(153, 153, 153);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(mLines, 55, currentY);
                        currentY += (mLines.length * 5) + 2;
                    }
                });
                currentY += 10;
            }

            // --- SECTION: CULINARY ---
            if (reportData.culinary && reportData.culinary.culinary_use && reportData.culinary.culinary_use !== 'NOT_APPLICABLE') {
                checkPageBreak(40);
                pdf.setTextColor(245, 158, 11); // Amber for Culinary to distinguish from Cultivation
                pdf.setFont('courier', 'bold');
                pdf.setFontSize(8);
                pdf.text('[CULINARY_PROTOCOL]', margin, currentY);

                pdf.setTextColor(51, 65, 85);
                const culMain = pdf.splitTextToSize(reportData.culinary.culinary_use, pageWidth - 40);
                pdf.text(culMain, margin, currentY + 8);
                currentY += (culMain.length * 5) + 12;

                const culParts = [
                    { label: 'LEAVES:', val: reportData.culinary.culinary_leaves },
                    { label: 'SEEDS: ', val: reportData.culinary.culinary_seeds },
                    { label: 'FRUIT: ', val: reportData.culinary.culinary_fruits },
                    { label: 'STEM:  ', val: reportData.culinary.culinary_stem }
                ];

                culParts.forEach(p => {
                    if (p.val && p.val !== 'NOT_APPLICABLE') {
                        const pLines = pdf.splitTextToSize(p.val, pageWidth - 65);
                        checkPageBreak((pLines.length * 5) + 2);
                        pdf.setTextColor(245, 158, 11);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(p.label, margin + 5, currentY);
                        pdf.setTextColor(153, 153, 153);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(pLines, 55, currentY);
                        currentY += (pLines.length * 5) + 2;
                    }
                });
            }

            // Footer
            pdf.setTextColor(153, 153, 153);
            pdf.setFontSize(7);
            pdf.setFont('courier', 'normal');
            pdf.text(`A.G. BOTANICS // HUD_REPORT_MODULE v2.7 // MULTI_PAGE_STABLE`, margin, pageHeight - 10);
            pdf.text(`TIMESTAMP: ${new Date().toLocaleString()}`, pageWidth - 70, pageHeight - 10);

            // 4. Download
            pdf.save(`AG_REPORT_${reportData.popular_name.replace(/[^a-z0-9]/gi, '_').toUpperCase()}.pdf`);
            setIsGenerating(false);
            setProgress('');

        } catch (error) {
            console.error('[PDFGenerator] Error:', error);
            setIsGenerating(false);
            setProgress('ERROR_SCAN_FAILED');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="mono"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 15px',
                    background: isGenerating ? 'rgba(255,255,255,0.05)' : 'rgba(0, 172, 193, 0.1)',
                    border: '1px solid rgba(0, 172, 193, 0.4)',
                    color: isGenerating ? 'var(--text-secondary)' : '#00acc1',
                    fontSize: '0.75rem',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '2px',
                    letterSpacing: '1px'
                }}
            >
                {isGenerating ? <Loader2 className="spin" size={14} /> : <FileDown size={14} />}
                {isGenerating ? 'PROCESSING...' : (t.downloadPdf ? t.downloadPdf.toUpperCase() : 'DOWNLOAD PDF')}
            </button>
            {progress && (
                <div className="mono" style={{ fontSize: '0.65rem', color: '#00acc1' }}>
                    {progress}
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
