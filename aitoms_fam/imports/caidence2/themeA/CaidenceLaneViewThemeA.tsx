"use client";

import React, { useState } from "react";

type ZoomLevel = "Year" | "Quarter" | "Month" | "Week" | "Day";

export const CaidenceLaneViewThemeA = () => {
    const [zoom, setZoom] = useState<ZoomLevel>("Month");

    const zoomLevels: ZoomLevel[] = ["Year", "Quarter", "Month", "Week", "Day"];
    const zoomIndex = zoomLevels.indexOf(zoom);

    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZoom(zoomLevels[parseInt(e.target.value)]);
    };

    // Mock data
    const lanes = [
        {
            id: 1,
            label: "Brand Story",
            color: "bg-[#FF6829]", // Primary Orange
            cards: [
                { id: "c1", title: "Manifesto Video", tag: "Video · 2m" },
                { id: "c2", title: "Core Values Deck", tag: "Slides · 10p" },
            ],
        },
        {
            id: 2,
            label: "Features & Benefits",
            color: "bg-[#046E8C]", // Secondary Teal
            cards: [
                { id: "c3", title: "Feature Breakdown", tag: "Blog · 1k words" },
                { id: "c4", title: "Demo Clip", tag: "Video · 30s" },
                { id: "c5", title: "Pricing Page", tag: "Web" },
            ],
        },
        {
            id: 3,
            label: "Platform: YouTube",
            color: "bg-[#D93025]", // Red-ish for YouTube
            cards: [
                { id: "c6", title: "Short: Hero clip", tag: "Short · YouTube" },
                { id: "c7", title: "Tutorial Series", tag: "Playlist" },
            ],
        },
        {
            id: 4,
            label: "Email Cadence",
            color: "bg-[#188038]", // Green-ish for Email
            cards: [
                { id: "c8", title: "Welcome Sequence", tag: "Email · 5 parts" },
                { id: "c9", title: "Nurture Drip", tag: "Email · Weekly" },
            ],
        },
    ];

    // Dynamic styles based on zoom
    const getCardWidth = () => {
        switch (zoom) {
            case "Year": return "w-10";
            case "Quarter": return "w-20";
            case "Month": return "w-32";
            case "Week": return "w-48";
            case "Day": return "w-64";
            default: return "w-32";
        }
    };

    const cardWidthClass = getCardWidth();

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F7F5F2]">
            {/* Lanes Container - Slimmer padding and spacing */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8 pb-24 custom-scrollbar">
                {lanes.map((lane) => (
                    <div key={lane.id} className="flex flex-col gap-3 group">
                        {/* Lane Header - Compact */}
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-sm ${lane.color}`} />
                            <span className="text-sm font-bold text-[#050608] tracking-tight uppercase">{lane.label}</span>
                            <div className="h-[1px] flex-1 bg-black/5" />
                        </div>

                        {/* Lane Track - Slimmer height */}
                        <div className="relative flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pl-1">
                            {/* Timeline Line (Visual) */}
                            <div className="absolute left-0 right-0 h-[1px] bg-black/5 -z-10 translate-y-0" />

                            {lane.cards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`
                    ${cardWidthClass} shrink-0 bg-white border border-black/10 rounded-md p-3
                    hover:border-black/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer
                    flex flex-col justify-between h-24 group/card relative overflow-hidden
                  `}
                                    onClick={() => console.log(`Clicked card: ${card.title}`)}
                                >
                                    {/* Top Stripe */}
                                    <div className={`absolute top-0 left-0 w-full h-1 ${lane.color}`} />

                                    <div className="text-sm font-medium text-[#050608] line-clamp-2 leading-snug mt-1">
                                        {card.title}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="text-[10px] text-[#050608]/50 uppercase tracking-wider truncate font-medium">
                                            {card.tag}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty slots filler */}
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={`empty-${i}`}
                                    className={`${cardWidthClass} shrink-0 h-24 border border-dashed border-black/5 rounded-md flex items-center justify-center text-black/10 text-lg hover:text-black/30 hover:border-black/20 transition-colors cursor-pointer bg-white/30`}
                                >
                                    +
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Zoom Control (Bottom Right) - Smaller */}
            <div className="absolute bottom-4 right-4 bg-white border border-black/10 rounded-full px-3 py-1.5 flex items-center gap-3 shadow-md z-10">
                <span className="text-[10px] text-[#050608]/60 font-mono w-10 text-right tracking-wider uppercase">{zoom}</span>
                <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={zoomIndex}
                    onChange={handleZoomChange}
                    className="w-24 accent-[#FF6829] cursor-pointer hover:accent-[#FF6829]/80 transition-all"
                />
            </div>
        </div>
    );
};
