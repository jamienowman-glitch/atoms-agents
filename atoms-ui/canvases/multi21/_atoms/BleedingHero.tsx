import React from 'react';
import { useVarioEngine } from '@/hooks/useVarioEngine';

// Contract-defined props (mapped from Harness sliders)
interface BleedingHeroProps {
    imageBleed: number; // Slider 1
    textWidth: number;  // Slider 2
    content?: {
        imageSrc: string;
        headline: string;
        body: string;
    };
}

export const BleedingHero: React.FC<BleedingHeroProps> = ({
    imageBleed = -30,
    textWidth = 70,
    content = {
        imageSrc: '/assets/AGENT_STREETWEAR_BLACK.png', // Placeholder
        headline: 'THE BLEEDING EDGE.',
        body: 'This layout breaks the grid. The image bleeds off the screen to create dynamic tension.'
    }
}) => {
    // Typography: Connect to the Vario Engine (Harness Global State)
    // This automatically listens to the Weight/Slant sliders in the ToolPop
    const fontStyle = useVarioEngine();

    // Layout Logic
    // Image Width is the inverse of Text Width, plus the bleed
    const imageWidth = 100 - textWidth;

    return (
        <div className="w-full flex flex-row overflow-hidden relative border-b border-black">

            {/* LEFT: Bleeding Image */}
            <div
                style={{
                    width: `${imageWidth}%`,
                    marginLeft: `${imageBleed}px`, // The Bleed
                    transition: 'all 0.2s ease-out'
                }}
                className="h-[600px] bg-gray-200 relative shrink-0"
            >
                <img
                    src={content.imageSrc}
                    alt="Hero"
                    className="w-full h-full object-cover grayscale contrast-125"
                />
            </div>

            {/* RIGHT: Text Block */}
            <div
                style={{ width: `${textWidth}%` }}
                className="flex flex-col justify-center px-12 shrink-0"
            >
                <h1
                    style={fontStyle} // Applies var(--font-weight), var(--font-slant)
                    className="text-8xl leading-[0.85] uppercase mb-6 tracking-tighter"
                >
                    {content.headline}
                </h1>
                <p className="text-xl max-w-md font-mono text-gray-500">
                    {content.body}
                </p>
            </div>

        </div>
    );
};
