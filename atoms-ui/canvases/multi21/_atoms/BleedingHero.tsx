import React from 'react';
import { useVarioEngine } from '@tool-areas/ui/hooks/useVarioEngine'; // Making assumption purely based on previous patterns, may need fix

interface BleedingHeroProps {
    // Content
    title?: string;
    subtitle?: string;
    imageUrl?: string;

    // Contract Props (Layout)
    imageOffset?: number; // -100 to 50
    textColumnWidth?: number; // 20 to 100

    // Contract Props (Typography)
    axisWeight?: number;
    axisSlant?: number;
}

export const BleedingHero: React.FC<BleedingHeroProps> = ({
    title = "The Bleeding Edge",
    subtitle = "This layout breaks the grid to create dynamic tension.",
    imageUrl = "https://picsum.photos/seed/bleed/800/1200",
    imageOffset = -30,
    textColumnWidth = 70,
    axisWeight = 400,
    axisSlant = 0
}) => {
    // Vario Engine Hook (Mock implementation if real one missing)
    // In real implementation: const fontStyle = useVarioEngine({ weight: axisWeight, slant: axisSlant });
    // For now, manual style:
    const fontStyle = {
        fontWeight: axisWeight,
        fontStyle: axisSlant < 0 ? 'italic' : 'normal',
        fontVariationSettings: `'wght' ${axisWeight}, 'slnt' ${axisSlant}`
    };

    return (
        <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 min-h-[600px] flex items-center">

            {/* 1. Bleeding Image Container */}
            <div
                className="absolute left-0 top-0 bottom-0 h-full transition-all duration-300 ease-out"
                style={{
                    width: '40%', // Base width
                    transform: `translateX(${imageOffset}%)` // The "Bleed" Logic
                }}
            >
                <img
                    src={imageUrl}
                    alt="Bleeding Hero"
                    className="w-full h-full object-cover shadow-2xl"
                />
            </div>

            {/* 2. Text Column */}
            <div
                className="relative z-10 ml-auto flex flex-col justify-center px-12 transition-all duration-300"
                style={{
                    width: `${textColumnWidth}%` // Controlled by slider
                }}
            >
                <h1
                    className="text-6xl md:text-8xl leading-tight text-neutral-900 dark:text-white"
                    style={fontStyle}
                >
                    {title}
                </h1>
                <p
                    className="mt-6 text-xl text-neutral-600 dark:text-neutral-400 max-w-lg"
                    style={{ fontWeight: 300 }} // Contrast
                >
                    {subtitle}
                </p>
            </div>
        </div>
    );
};
