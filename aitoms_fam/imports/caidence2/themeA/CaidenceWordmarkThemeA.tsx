"use client";

import { useState } from "react";

export const CaidenceWordmarkThemeA = () => {
    const [imgError, setImgError] = useState(false);

    // Try to load SVG, fallback to text if it fails
    // Note: We might want a dark version of the SVG for light mode if it exists, 
    // but for now we'll rely on the text fallback or assume the SVG works on light if it's black.
    // Since I don't have a specific Theme A SVG, I will force the text version for now to ensure it matches the styling brief.

    return (
        <span className="text-2xl tracking-tighter leading-none text-[#050608] select-none font-sans flex items-baseline group cursor-default">
            <span className="font-bold">C</span>
            <span className="font-light text-[#050608]/80">AI</span>
            <span className="font-bold">DENCE</span>
            <sup className="ml-0.5 text-[#FF6829]" style={{ fontSize: "0.6em", fontWeight: 700 }}>²</sup>
        </span>
    );
};
