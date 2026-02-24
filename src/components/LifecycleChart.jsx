import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Sun, Activity, Scissors, Leaf, Apple, Flower } from 'lucide-react';

const LifecycleChart = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                <Activity size={24} style={{ marginBottom: '10px' }} />
                <div className="mono" style={{ fontSize: '0.7rem' }}>LIFECYCLE_DATA_UNAVAILABLE</div>
            </div>
        );
    }

    const width = 600;
    const height = 180;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (index) => padding + (index * (chartWidth / (data.length - 1)));
    const getY = (value) => height - padding - (value * (chartHeight / 10));

    const generatePath = (key) => {
        return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
    };

    const series = [
        { key: 'flowering', color: '#d946ef', label: 'FLOWERING_PHASE', icon: Flower },
        { key: 'fructification', color: '#fa4e67', label: 'FRUCTIFICATION', icon: Apple },
        { key: 'foliage', color: '#00ff9d', label: 'LEAVES_INDEX', icon: Leaf },
        { key: 'pruning', color: '#ffb700', label: 'PRUNING_PHASE', icon: Scissors }
    ];

    return (
        <div className="glass-panel" style={{
            padding: '20px',
            marginTop: '20px',
            position: 'relative',
            border: '1px solid rgba(0, 242, 255, 0.1)',
            background: 'rgba(5, 12, 16, 0.5)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Activity size={16} color="var(--accent-color)" />
                <span className="mono" style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-color)' }}>SPECIMEN_LIFECYCLE_ANALYSIS</span>
            </div>

            <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {/* Background Seasons */}
                    {data.map((d, i) => {
                        const xStart = i === 0 ? padding : getX(i) - (chartWidth / (data.length - 1)) / 2;
                        const xWidth = chartWidth / (data.length - 1);

                        return (
                            <React.Fragment key={i}>
                                {d.is_rain_season && (
                                    <rect
                                        x={xStart} y={padding}
                                        width={xWidth} height={chartHeight}
                                        fill="rgba(0, 242, 255, 0.08)"
                                    />
                                )}
                                {d.is_sun_season && (
                                    <rect
                                        x={xStart} y={padding}
                                        width={xWidth} height={chartHeight}
                                        fill="rgba(255, 183, 0, 0.08)"
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Grid Lines */}
                    {[0, 2, 4, 6, 8, 10].map(v => (
                        <line
                            key={v}
                            x1={padding} y1={getY(v)} x2={width - padding} y2={getY(v)}
                            stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2"
                        />
                    ))}

                    {/* Lines */}
                    {series.map(s => (
                        <motion.path
                            key={s.key}
                            d={generatePath(s.key)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    ))}

                    {/* Interactive Points & Month Labels */}
                    {data.map((d, i) => (
                        <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                            <rect
                                x={getX(i) - 10} y={padding}
                                width={20} height={chartHeight}
                                fill="transparent"
                                style={{ cursor: 'pointer' }}
                            />
                            {hoveredIndex === i && (
                                <line x1={getX(i)} y1={padding} x2={getX(i)} y2={height - padding} stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="4,4" />
                            )}
                            {/* Month Label */}
                            <text
                                x={getX(i)}
                                y={height - 10}
                                textAnchor="middle"
                                className="mono"
                                style={{
                                    fontSize: '0.45rem',
                                    fill: hoveredIndex === i ? 'var(--accent-color)' : 'var(--text-secondary)',
                                    transition: 'fill 0.3s ease'
                                }}
                            >
                                {d.month.substring(0, 3).toUpperCase()}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                position: 'absolute',
                                left: hoveredIndex > 6 ? 'auto' : `${getX(hoveredIndex) + 20}px`,
                                right: hoveredIndex > 6 ? `${width - getX(hoveredIndex) + 20}px` : 'auto',
                                top: '20px',
                                background: 'rgba(5, 12, 16, 0.95)',
                                border: '1px solid var(--accent-color)',
                                padding: '12px',
                                zIndex: 100,
                                backdropFilter: 'blur(10px)',
                                minWidth: '150px',
                                boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)'
                            }}
                        >
                            <div className="mono" style={{ color: 'var(--accent-color)', fontSize: '0.8rem', marginBottom: '8px', borderBottom: '1px solid rgba(0, 242, 255, 0.2)', paddingBottom: '4px' }}>
                                {data[hoveredIndex].month.toUpperCase()}
                            </div>
                            {series.map(s => (
                                <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <s.icon size={10} color={s.color} />
                                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '0.7rem', color: s.color }}>{data[hoveredIndex][s.key]}/10</span>
                                </div>
                            ))}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                {data[hoveredIndex].is_rain_season && <CloudRain size={12} color="#00f2ff" />}
                                {data[hoveredIndex].is_sun_season && <Sun size={12} color="#ffb700" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                {series.map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '2px', background: s.color }}></div>
                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', background: 'rgba(0, 242, 255, 0.2)' }}></div>
                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>RAIN_SEASON</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', background: 'rgba(255, 183, 0, 0.2)' }}></div>
                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>SUN_SEASON</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifecycleChart;
