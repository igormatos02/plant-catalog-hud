import React, { useState, useEffect } from 'react';
import { Sprout, Flower, Apple, Scissors, WheatOff, Wheat } from 'lucide-react';

const parsePlantingSeason = (seasonStr, rawFoliageCurve, userLatitude) => {
    let curve = new Array(12).fill(0);
    if (!seasonStr || typeof seasonStr !== 'string' || seasonStr === 'NOT_APPLICABLE' || seasonStr === 'Sem Dados') return rawFoliageCurve || curve;
    const s = seasonStr.toLowerCase();

    // Any time of the year
    if (s.match(/ano todo|year round|ano inteiro|qualquer época|all year/)) {
        return new Array(12).fill(10);
    }

    let hasMatch = false;

    // Detect explicitly mentioned months
    const monthsRegexArray = [
        /(jan|janeiro)/, /(feb|fev|fevereiro)/, /(mar|março)/, /(apr|abr|abril)/,
        /(may|mai|maio)/, /(jun|junho)/, /(jul|julho)/, /(aug|ago|agosto)/,
        /(sep|set|setembro)/, /(oct|out|outubro)/, /(nov|novembro)/, /(dec|dez|dezembro)/
    ];
    let foundMonths = [];
    monthsRegexArray.forEach((regex, idx) => {
        if (regex.test(s)) foundMonths.push(idx);
    });

    if (foundMonths.length >= 2) {
        // Find min and max
        const minMonth = Math.min(...foundMonths);
        const maxMonth = Math.max(...foundMonths);

        // If it looks like a range spanning over new year e.g. "nov a mar"
        if (s.match(/até|a|to|through|-/)) {
            if (maxMonth - minMonth > 6) { // e.g. nov(10) to mar(2) 
                for (let i = maxMonth; i <= 11; i++) curve[i] = 10;
                for (let i = 0; i <= minMonth; i++) curve[i] = 10;
            } else { // standard range mar(2) to may(4)
                for (let i = minMonth; i <= maxMonth; i++) curve[i] = 10;
            }
        } else {
            foundMonths.forEach(m => curve[m] = 10);
        }
        hasMatch = true;
    } else if (foundMonths.length > 0) {
        hasMatch = true;
        curve[foundMonths[0]] = 10;
    }

    if (!hasMatch) {
        // Use user's actual hemisphere if available, otherwise fallback to guessing by language
        const isPt = s.match(/(primavera|verão|verao|outono|inverno)/);
        const isSouthern = userLatitude !== null
            ? userLatitude < 0
            : isPt;

        if (isSouthern) {
            // Sep-Dec (Spring)
            if (s.match(/primavera|spring/)) { curve[8] = Math.max(curve[8], 5); curve[9] = Math.max(curve[9], 10); curve[10] = Math.max(curve[10], 8); curve[11] = Math.max(curve[11], 4); hasMatch = true; }
            // Dec-Mar (Summer)
            if (s.match(/verão|verao|summer/)) { curve[11] = Math.max(curve[11], 5); curve[0] = Math.max(curve[0], 10); curve[1] = Math.max(curve[1], 8); curve[2] = Math.max(curve[2], 4); hasMatch = true; }
            // Mar-Jun (Autumn)
            if (s.match(/outono|fall|autumn/)) { curve[2] = Math.max(curve[2], 5); curve[3] = Math.max(curve[3], 10); curve[4] = Math.max(curve[4], 8); curve[5] = Math.max(curve[5], 4); hasMatch = true; }
            // Jun-Sep (Winter)
            if (s.match(/inverno|winter/)) { curve[5] = Math.max(curve[5], 5); curve[6] = Math.max(curve[6], 10); curve[7] = Math.max(curve[7], 8); curve[8] = Math.max(curve[8], 4); hasMatch = true; }
        } else {
            // Mar-Jun (Spring)
            if (s.match(/primavera|spring/)) { curve[2] = Math.max(curve[2], 5); curve[3] = Math.max(curve[3], 10); curve[4] = Math.max(curve[4], 8); curve[5] = Math.max(curve[5], 4); hasMatch = true; }
            // Jun-Sep (Summer)
            if (s.match(/verão|verao|summer/)) { curve[5] = Math.max(curve[5], 5); curve[6] = Math.max(curve[6], 10); curve[7] = Math.max(curve[7], 8); curve[8] = Math.max(curve[8], 4); hasMatch = true; }
            // Sep-Dec (Autumn)
            if (s.match(/outono|fall|autumn/)) { curve[8] = Math.max(curve[8], 5); curve[9] = Math.max(curve[9], 10); curve[10] = Math.max(curve[10], 8); curve[11] = Math.max(curve[11], 4); hasMatch = true; }
            // Dec-Mar (Winter)
            if (s.match(/inverno|winter/)) { curve[11] = Math.max(curve[11], 5); curve[0] = Math.max(curve[0], 10); curve[1] = Math.max(curve[1], 8); curve[2] = Math.max(curve[2], 4); hasMatch = true; }
        }
    }

    // Apply smoothing if we matched months flatly
    if (hasMatch) {
        for (let i = 0; i < 12; i++) {
            if (curve[i] === 10) {
                const prev = (i - 1 + 12) % 12;
                const next = (i + 1) % 12;
                if (curve[prev] === 0) curve[prev] = 4;
                if (curve[next] === 0) curve[next] = 4;
            }
        }
    }

    return hasMatch ? curve : (rawFoliageCurve || curve);
};

const calculateMomentum = (data, monthIndex, key) => {
    if (!data || data[monthIndex] === undefined) return { val: 0, text: 'Sem Dados' };

    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;

    // Handle arrays dynamically generated from strings like Planting Season
    let val, prev, next;

    if (typeof data[monthIndex] === 'number') {
        // Flat Array case
        val = data[monthIndex];
        prev = data[prevMonthIndex] || 0;
        next = data[nextMonthIndex] || 0;
    } else {
        // Normal JSON Object Array case
        val = data[monthIndex]?.[key] || 0;
        prev = data[prevMonthIndex]?.[key] || 0;
        next = data[nextMonthIndex]?.[key] || 0;
    }

    let text = "Fora de Temporada";
    if (val === 0) {
        text = "Fora de Temporada";
    } else if (val > prev && prev === 0) {
        text = "Início da Temporada";
    } else if (val >= prev && val >= next) {
        text = "Auge da Temporada";
    } else if (val < prev) {
        text = "Fim da Temporada";
    } else if (val > prev) {
        text = "Início da Temporada";
    }

    return { val: val * 10, text }; // value 0 to 100
};

const Gauge = ({ title, momentum, text, color, icon: Icon, isStringOnly }) => {
    // If it's completely out of season, display it with extremely low opacity to keep UI clean
    const isActive = isStringOnly ? true : momentum > 0;
    const opacity = isActive ? 1 : 0.4;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 15px',
            background: (isActive && !isStringOnly) ? `linear-gradient(to right, ${color}25 ${momentum}%, rgba(5, 12, 16, 0.4) ${momentum}%)` : 'rgba(5, 12, 16, 0.4)',
            border: `1px solid ${isActive ? color + '40' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '4px',
            width: '100%',
            opacity: opacity,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                background: isActive ? color : 'rgba(255,255,255,0.1)',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                flexShrink: 0
            }}>
                <Icon size={18} color={isActive ? "#000" : "var(--text-secondary)"} />
            </div>

            <div style={{ zIndex: 2, flex: 1, minWidth: 0 }}>
                <div className="mono" style={{
                    color: isActive ? color : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                    marginBottom: '2px'
                }}>
                    {title.toUpperCase()}
                </div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    <span style={{ color: isActive ? color : 'var(--text-secondary)' }}>{text}</span>
                </div>
            </div>

            {(!isStringOnly && typeof momentum === 'number') && (
                <div className="mono" style={{ zIndex: 2, fontSize: '0.9rem', fontWeight: 'bold', color: isActive ? color : 'var(--text-secondary)' }}>
                    {momentum}%
                </div>
            )}
        </div>
    );
};

const calculateHarvestCurve = (originalData) => {
    // Deep clone to avoid mutating parent props directly
    const data = JSON.parse(JSON.stringify(originalData));

    // Find the peak of fructification
    let peakVal = 0;
    let peakIdx = 0;
    for (let i = 0; i < 12; i++) {
        const f = data[i].fructification || 0;
        if (f > peakVal) {
            peakVal = f;
            peakIdx = i;
        }
    }

    if (peakVal === 0) {
        data.forEach(d => d.harvest = 0);
        return data;
    }

    // Find start index (walk backwards from peak)
    let startIdx = peakIdx;
    for (let i = 1; i <= 12; i++) {
        const current = (peakIdx - i + 12) % 12;
        const nextInWalk = (current - 1 + 12) % 12;
        if ((data[current].fructification || 0) === 0 ||
            (data[nextInWalk].fructification || 0) > (data[current].fructification || 0)) {
            startIdx = (current + 1) % 12;
            break;
        }
    }

    // Find end index (walk forwards from peak)
    let endIdx = peakIdx;
    for (let i = 1; i <= 12; i++) {
        const current = (peakIdx + i) % 12;
        const nextInWalk = (current + 1) % 12;
        if ((data[current].fructification || 0) === 0 ||
            (data[nextInWalk].fructification || 0) > (data[current].fructification || 0)) {
            endIdx = (current - 1 + 12) % 12;
            break;
        }
    }

    // Calculate continuous duration (1 to 12)
    let diffEndStart = endIdx - startIdx;
    if (diffEndStart < 0) diffEndStart += 12;
    const duration = diffEndStart + 1;

    // Applying User Formulas:
    // início_colheita ≈ início_frutificação + 0.25 * duração_frutificação
    // pico_colheita ≈ pico_frutificação
    // fim_colheita ≈ fim_frutificação - 0.1 * duração_frutificação

    const hStartOffset = Math.min(0.25 * duration, diffEndStart);
    const hEndOffset = Math.max(diffEndStart - 0.1 * duration, 0);

    let hPeakOffset = (peakIdx - startIdx + 12) % 12;
    // ensure peak is between start and end mathematically
    if (hPeakOffset <= hStartOffset) hPeakOffset = hStartOffset + 0.1;
    if (hPeakOffset >= hEndOffset) hPeakOffset = hEndOffset - 0.1;

    // Distribute harvest values
    for (let i = 0; i < 12; i++) {
        const offset = (i - startIdx + 12) % 12;
        let hVal = 0;

        if (offset >= hStartOffset && offset <= hPeakOffset) {
            const ratio = (offset - hStartOffset) / (hPeakOffset - hStartOffset);
            hVal = ratio * peakVal;
        } else if (offset > hPeakOffset && offset <= hEndOffset) {
            const ratio = 1 - ((offset - hPeakOffset) / (hEndOffset - hPeakOffset));
            hVal = ratio * peakVal;
        }

        data[i].harvest = Math.max(0, Math.min(10, Math.round(hVal * 10) / 10));
    }

    return data;
};

const SeasonalGauges = ({ data: rawData, cultivation }) => {
    const [userLatitude, setUserLatitude] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLatitude(position.coords.latitude);
                },
                (error) => {
                    console.warn("[SeasonalGauges] Geolocation denied or unavailable.", error);
                }
            );
        }
    }, []);

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) return null;

    const data = calculateHarvestCurve(rawData);
    const currentMonthIndex = new Date().getMonth(); // 0 is Jan, 11 is Dec

    // We map out the 5 requested KPIs
    const metrics = [
        { key: 'planting', title: 'Plantio', icon: Sprout, color: '#10b981' }, // emerald green
        { key: 'flowering', title: 'Floração', icon: Flower, color: '#d946ef' }, // fuchsia 
        { key: 'fructification', title: 'Frutificação', icon: Apple, color: '#fa4e67' }, // ruby red
        { key: 'harvest', title: 'Colheita', icon: Wheat, color: '#f59e0b' }, // amber
        { key: 'pruning', title: 'Poda', icon: Scissors, color: '#ffb700' }  // yellow
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(5, 12, 16, 0.6)',
            border: '1px solid rgba(0, 242, 255, 0.15)',
            borderRadius: '6px'
        }}>
            <h4 className="mono" style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
                MOMENTUM SAZONAL ({data[currentMonthIndex]?.month.toUpperCase()})
            </h4>

            {metrics.map(metric => {
                if (metric.key === 'planting') {
                    const textValue = cultivation?.planting_season || (cultivation && Object.keys(cultivation).length > 0 ? 'NOT_APPLICABLE' : 'Sem Dados');
                    // Hide if truly missing
                    if (textValue === 'NOT_APPLICABLE' || textValue === 'Sem Dados') return null;

                    // Parse the text into a 12-month data curve and calculate momentum
                    const foliageFallbackCurve = data.map(d => Math.max(0, (d.foliage || 0) * 0.8)); // slightly dim foliage as fallback
                    const plantingCurve = parsePlantingSeason(textValue, foliageFallbackCurve, userLatitude);

                    const { val, text } = calculateMomentum(plantingCurve, currentMonthIndex, null);

                    return (
                        <Gauge
                            key={metric.key}
                            title={metric.title}
                            momentum={val}
                            text={`${text} • ${textValue.length > 50 ? textValue.substring(0, 50) + '...' : textValue}`}
                            color={metric.color}
                            icon={metric.icon}
                            isStringOnly={false}
                        />
                    );
                }

                if (metric.key === 'flowering' || metric.key === 'fructification' || metric.key === 'harvest') {
                    // Check if there is absolutely no data across the whole year for this metric
                    // For harvest, we rely on checking fructification data
                    const sourceKey = metric.key === 'harvest' ? 'fructification' : metric.key;
                    const hasAnyData = data.some(d => (d[sourceKey] || 0) > 0);
                    if (!hasAnyData) return null;
                }

                const { val, text } = calculateMomentum(data, currentMonthIndex, metric.key);
                return (
                    <Gauge
                        key={metric.key}
                        title={metric.title}
                        momentum={val}
                        text={text}
                        color={metric.color}
                        icon={metric.icon}
                    />
                );
            })}
        </div>
    );
};

export default SeasonalGauges;
