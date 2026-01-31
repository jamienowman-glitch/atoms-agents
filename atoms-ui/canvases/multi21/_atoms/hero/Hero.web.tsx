"use client";

import React from 'react';

// --- Types ---
export interface HeroProps {
    // Layout (Traits)
    height?: number; // vh
    alignment?: 'left' | 'center' | 'right';
    padding?: number;

    // Style
    overlayOpacity?: number;
    overlayColor?: string;
    textColor?: string;

    // Content (Data)
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    bgImage?: string;
}

export const HeroWeb: React.FC<HeroProps> = ({
    height = 80,
    alignment = 'center',
    padding = 24,
    overlayOpacity = 0.4,
    overlayColor = '#000000',
    textColor = '#FFFFFF',
    title = "New Arrivals",
    subtitle = "Discover the latest collection for the season.",
    ctaLabel = "Shop Now",
    bgImage = "https://picsum.photos/seed/hero/1920/1080"
}) => {

    const alignClass = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right'
    }[alignment];

    return (
        <div
            className="relative w-full overflow-hidden flex flex-col justify-center"
            style={{ height: `${height}vh` }}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
                />
            </div>

            {/* Content */}
            <div
                className={`relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-6 ${alignClass}`}
                style={{ padding: `${padding}px`, color: textColor }}
            >
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-[600px]">
                    {subtitle}
                </p>
                <button
                    className="mt-4 px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors"
                >
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
};
