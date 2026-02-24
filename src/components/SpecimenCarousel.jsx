import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SpecimenCarousel = ({ images, name }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    if (!images || images.length === 0) return null;

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = images.length - 1;
            if (nextIndex >= images.length) nextIndex = 0;
            return nextIndex;
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: 'fit-content' }}>
            <div className="hud-border" style={{
                padding: '4px',
                background: 'var(--accent-color)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '2px'
            }}>
                {/* HUD Overlay Info */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div className="mono" style={{
                        fontSize: '0.6rem',
                        color: 'var(--accent-color)',
                        background: 'rgba(5, 12, 16, 0.7)',
                        padding: '2px 6px',
                        borderLeft: '2px solid var(--accent-color)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        SPECIMEN_IMAGE: {String(currentIndex + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    zIndex: 10,
                    opacity: 0.7
                }}>
                    <Camera size={16} color="var(--accent-color)" />
                </div>

                {/* Main Image Container */}
                <div style={{
                    position: 'relative',
                    height: '400px',
                    background: '#050c10',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'grayscale(0.1) contrast(1.1)',
                                position: 'absolute'
                            }}
                            alt={`${name} specimen ${currentIndex + 1}`}
                        />
                    </AnimatePresence>

                    {/* Scanning Line Effect */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'rgba(0, 242, 255, 0.3)',
                            boxShadow: '0 0 10px rgba(0, 242, 255, 0.5)',
                            zIndex: 5,
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                {/* Navigation Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => paginate(-1)}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(5, 12, 16, 0.4)',
                                border: '1px solid rgba(0, 242, 255, 0.2)',
                                color: 'var(--accent-color)',
                                padding: '10px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            className="carousel-btn"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(5, 12, 16, 0.4)',
                                border: '1px solid rgba(0, 242, 255, 0.2)',
                                color: 'var(--accent-color)',
                                padding: '10px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            className="carousel-btn"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails / Indicators */}
            {images.length > 1 && (
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginTop: '8px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    scrollbarWidth: 'none'
                }}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            style={{
                                width: '40px',
                                height: '4px',
                                background: idx === currentIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .carousel-btn:hover {
                    background: rgba(0, 242, 255, 0.1) !important;
                    border-color: var(--accent-color) !important;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </div>
    );
};

export default SpecimenCarousel;
