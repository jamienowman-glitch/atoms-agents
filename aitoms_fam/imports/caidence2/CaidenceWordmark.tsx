"use client";

import { useState } from "react";

export const CaidenceWordmark = () => {
    const [imgError, setImgError] = useState(false);

    // Try to load SVG, fallback to text if it fails
    if (!imgError) {
        return (
            <img
                src="/assets/caidence2/caidence-wordmark.svg"
                alt="CAIDENCE²"
                className="h-5 w-auto opacity-90 hover:opacity-100 transition-opacity"
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <span className="text-xl tracking-tight leading-none text-white select-none font-sans flex items-baseline group cursor-default">
            <span className="transition-all duration-300 group-hover:text-white" style={{ fontVariationSettings: '"wght" 700, "slnt" 0' }}>C</span>
            <span className="transition-all duration-300 text-white/80 group-hover:text-white" style={{ fontVariationSettings: '"wght" 200, "slnt" -10' }}>AI</span>
            <span className="transition-all duration-300 group-hover:text-white" style={{ fontVariationSettings: '"wght" 700, "slnt" 0' }}>DENCE</span>
            <sup className="ml-0.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" style={{ fontVariationSettings: '"wght" 700', fontSize: "0.6em" }}>²</sup>
        </span>
    );
};
