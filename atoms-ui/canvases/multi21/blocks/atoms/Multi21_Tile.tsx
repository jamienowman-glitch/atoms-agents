import React, { useState } from 'react';
import { Multi21Item } from '../../types';

export interface Multi21TileProps {
    item: Multi21Item;
    // Toggles
    showTitle?: boolean;
    showMeta?: boolean;
    showBadge?: boolean;
    showCtaLabel?: boolean;
    showCtaArrow?: boolean;
    // Styling
    aspectClass?: string;
    // Handlers
    onPlay?: () => void;
}

// Sub-Component: YouTube Facade
const YouTubeTile = ({ videoId, title, aspectClass }: { videoId: string, title: string, aspectClass: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <div className={`relative ${aspectClass} bg-black overflow-hidden group/yt z-0`}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1`}
                    className="absolute inset-0 w-full h-full pointer-events-auto"
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div onClick={() => setIsPlaying(true)} className={`relative ${aspectClass} bg-black overflow-hidden group/yt z-0 cursor-pointer`}>
            <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/yt:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover/yt:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 flex items-center justify-center opacity-90 group-hover/yt:scale-110 transition-transform drop-shadow-md">
                    <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
            </div>
        </div>
    );
};

export function Multi21_Tile({
    item,
    showTitle = true,
    showMeta = true,
    showBadge = true,
    showCtaLabel = true,
    showCtaArrow = true,
    aspectClass = 'aspect-video'
}: Multi21TileProps) {

    const effectiveVariant = item.variant || 'generic';
    const isProduct = effectiveVariant === 'product';
    const isYoutube = effectiveVariant === 'youtube' && Boolean(item.videoUrl?.includes('youtube'));
    const hasCta = Boolean((showCtaLabel || showCtaArrow) && item.secondaryLink);

    // --- Render Logic (Lifted from Multi21.tsx) ---
    // (Simplified for brevity, logic maintained)

    return (
        <div key={item.id} className={`flex flex-col group relative multi21-item multi21-typo-target multi21-card overflow-hidden shrink-0 ${isYoutube ? '' : aspectClass}`}>

            {/* 1. Body Logic */}
            <div className="multi21-card-body relative w-full h-full">

                {/* 1A. Image/Media Layer */}
                {!['kpi', 'events', 'text'].includes(effectiveVariant) && !isYoutube && (
                    <div className={`relative w-full bg-neutral-100 overflow-hidden multi21-card-image multi21-card-image--fill group/image ${isProduct ? 'multi21-card-image--product' : ''}`}>
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No Image</div>
                        )}
                        {showBadge && item.badge && !isProduct && (
                            <span className="absolute top-2 right-2 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-medium tracking-wide backdrop-blur-sm bg-black/70">
                                {item.badge}
                            </span>
                        )}
                    </div>
                )}

                {/* 1B. YouTube Layer */}
                {isYoutube && (
                    <YouTubeTile videoId={item.videoUrl?.split('v=')[1]?.split('&')[0] || ''} title={item.title} aspectClass={`w-full ${aspectClass} multi21-card-image`} />
                )}

                {/* 1C. KPI/Overlay Layer */}
                {effectiveVariant === 'kpi' && (
                    <div className="relative w-full h-full bg-neutral-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                        {item.imageUrl && (
                            <>
                                <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                            </>
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                            {showBadge && item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white mb-2">{item.badge}</span>}
                            {showTitle && <div className="font-bold text-white text-4xl tracking-tight">{item.title}</div>}
                            {showMeta && item.meta && <div className="text-xs text-neutral-400 font-medium uppercase tracking-widest mt-1">{item.meta}</div>}
                        </div>
                    </div>
                )}

                {/* 2. Content Layer (Text below image) */}
                {/* Only render if NOT KPI/Text (which have overlay content) */}
                {!['kpi', 'text'].includes(effectiveVariant) && (
                    <div className={`flex flex-col gap-0.5 multi21-content ${isProduct ? 'multi21-content--product' : ''}`}>
                        {/* Title */}
                        {showTitle && (
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:underline decoration-1 underline-offset-2">
                                {item.title}
                            </h3>
                        )}
                        {/* Meta / Price / CTA Row */}
                        {(showMeta || showBadge || hasCta || isProduct) && (
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 justify-between">
                                {showMeta && item.meta && <p className="text-[11px] line-clamp-1 text-neutral-500">{item.meta}</p>}
                                {isProduct && item.price && <p className="text-[11px] font-extralight italic text-neutral-500">{item.price}</p>}
                                {hasCta && (
                                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-neutral-700 cursor-pointer">
                                        {showCtaLabel ? (item.secondaryLink?.label || 'More') : ''} {showCtaArrow && '→'}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
