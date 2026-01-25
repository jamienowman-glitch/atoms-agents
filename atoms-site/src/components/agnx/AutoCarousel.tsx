interface CarouselTile {
    id: string | number;
    type: 'image' | 'text';
    src?: string;
    href?: string;
    label?: string; // For text tiles or alt text
    alt?: string;
    // New Fields
    headline?: string;
    description?: string;
    ctaLabel?: string;
}

interface AutoCarouselProps {
    tiles?: CarouselTile[];
}

"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AutoCarousel({ tiles = [] }: AutoCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Default tiles (Fallback)
    const DEFAULT_TILES: CarouselTile[] = [
        { id: 1, type: 'text', label: 'Agent Spec 1', headline: 'Spec 01', description: 'Sample description line.', ctaLabel: 'View Details' },
        { id: 2, type: 'text', label: 'Agent Spec 2', headline: 'Spec 02', description: 'Sample description line.', ctaLabel: 'View Details' },
        { id: 3, type: 'text', label: 'Agent Spec 3', headline: 'Spec 03', description: 'Sample description line.', ctaLabel: 'View Details' },
        { id: 4, type: 'text', label: 'Agent Spec 4', headline: 'Spec 04', description: 'Sample description line.', ctaLabel: 'View Details' },
        { id: 5, type: 'text', label: 'Agent Spec 5', headline: 'Spec 05', description: 'Sample description line.', ctaLabel: 'View Details' },
    ];

    const activeTiles = tiles.length > 0 ? tiles : DEFAULT_TILES;

    // Quadruple items to ensure wide coverage and seamless looping points
    const CAROUSEL_ITEMS = [...activeTiles, ...activeTiles, ...activeTiles, ...activeTiles];

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let animationFrameId: number;
        // Speed: 0.5px per frame approx 30px/sec. 7s for ~200px. 
        // User wanted "7 seconds for one to go from one edge to other". 
        // If screen is 400px, 400/7 = 57px/sec.
        // 60fps -> ~1px per frame.
        const speed = 0.8;

        // Center start roughly
        // We want to start at the beginning of the second set to allow scrolling left
        // But simple loop: Start at 0, scroll right. When hits 1/4 mark, reset to 0.
        // Wait, infinite loop strategy:
        // Render [Set A][Set B][Set C].
        // Scroll from 0 to Width(Set A). 
        // When ScrollLeft >= Width(Set A), reset ScrollLeft to 0. (Instant jump).
        // Since Set A == Set B, the jump is invisible.

        const scrollLoop = () => {
            if (!isPaused && container) {
                container.scrollLeft += speed;

                // Infinite Loop Validation
                const oneSetWidth = container.scrollWidth / 4; // Since we have 4 sets

                if (container.scrollLeft >= oneSetWidth) {
                    container.scrollLeft = 0; // Seamless reset
                }
            }
            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        animationFrameId = requestAnimationFrame(scrollLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, activeTiles]); // Re-run if tiles change

    // Drag to Scroll State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = scrollRef.current;
        if (!container) return;
        setIsPaused(true);
        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
        container.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsPaused(false);
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Resume after small delay
        setTimeout(() => setIsPaused(false), 1000);
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const container = scrollRef.current;
        if (!container) return;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        container.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 overflow-hidden relative group">

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="w-full flex gap-12 overflow-x-auto no-scrollbar py-12 cursor-grab active:cursor-grabbing scroll-pl-6"
                style={{ WebkitOverflowScrolling: 'touch' }}

                /* Mobile Touch */
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}

                /* Desktop Drag */
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {CAROUSEL_ITEMS.map((item, index) => {
                    return (
                        <div key={index} className="flex-none w-[70vw] md:w-[25vw] flex flex-col items-center gap-6 relative select-none group/card">
                            {/* THE TILE */}
                            <div className="w-full aspect-square bg-white border border-gray-100 flex items-center justify-center relative shadow-sm transition-shadow duration-300 group-hover/card:shadow-md">
                                {item.type === 'image' && item.src ? (
                                    <Link
                                        href={item.href || '#'}
                                        className={`relative w-full h-full block ${!item.href ? 'pointer-events-none' : ''}`}
                                        draggable={false}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.alt || item.label || 'Carousel Image'}
                                            fill
                                            className="object-cover pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors" />
                                    </Link>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gray-50">
                                        <span className="text-gray-400 font-mono tracking-widest text-xs uppercase">{item.label || 'AGENT SPEC'}</span>
                                        <div className="absolute bottom-4 left-4 border border-black bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-black">
                                            TILE {item.id.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* THE INFO (Outside Centered) */}
                            <div className="text-center flex flex-col items-center gap-2 px-2">
                                {item.headline && (
                                    <h3 className="text-base md:text-lg font-bold uppercase tracking-tight text-black">
                                        {item.headline}
                                    </h3>
                                )}
                                {item.description && (
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-[280px]">
                                        {item.description}
                                    </p>
                                )}
                                {item.ctaLabel && (
                                    <Link
                                        href={item.href || '#'}
                                        className={`mt-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1 group/link ${!item.href ? 'pointer-events-none opacity-50' : 'text-black hover:text-gray-600'}`}
                                        draggable={false}
                                    >
                                        {item.ctaLabel}
                                        <span className="transform transition-transform group-hover/link:translate-x-1">→</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
