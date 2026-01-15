"use client";

import React, { useState } from "react";

type ZoomLevel = "Year" | "Quarter" | "Month" | "Week" | "Day";

export const CaidenceLaneView = () => {
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
            color: "bg-pink-500",
            glow: "shadow-[0_0_15px_rgba(236,72,153,0.3)]",
            cards: [
                { id: "c1", title: "Manifesto Video", tag: "Video · 2m" },
                { id: "c2", title: "Core Values Deck", tag: "Slides · 10p" },
            ],
        },
        {
            id: 2,
            label: "Features & Benefits",
            color: "bg-cyan-500",
            glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
            cards: [
                { id: "c3", title: "Feature Breakdown", tag: "Blog · 1k words" },
                { id: "c4", title: "Demo Clip", tag: "Video · 30s" },
                { id: "c5", title: "Pricing Page", tag: "Web" },
            ],
        },
        {
            id: 3,
            label: "Platform: YouTube",
            color: "bg-red-500",
            glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
            cards: [
                { id: "c6", title: "Short: Hero clip", tag: "Short · YouTube" },
                { id: "c7", title: "Tutorial Series", tag: "Playlist" },
            ],
        },
        {
            id: 4,
            label: "Email Cadence",
            color: "bg-emerald-500",
            glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
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
        <div className="flex-1 flex flex-col h-full relative">
            {/* Lanes Container - Slimmer padding and spacing */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 pb-24 custom-scrollbar">
                {lanes.map((lane) => (
                    <div key={lane.id} className="flex flex-col gap-2 group">
                        {/* Lane Header - Compact */}
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-full ${lane.color} ${lane.glow}`} />
                            <span className="text-xs font-bold text-white/80 tracking-wide">{lane.label}</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        {/* Lane Track - Slimmer height */}
                        <div className="relative flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pl-1">
                            {/* Timeline Line (Visual) */}
                            <div className="absolute left-0 right-0 h-[1px] bg-white/5 -z-10 translate-y-0" />

                            {lane.cards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`
                    ${cardWidthClass} shrink-0 bg-[#1a1a20]/60 backdrop-blur-md border border-white/10 rounded-lg p-2
                    hover:border-white/30 hover:bg-[#252530]/80 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer
                    flex flex-col justify-between h-20 group/card relative overflow-hidden
                  `}
                                    onClick={() => console.log(`Clicked card: ${card.title}`)}
                                >
                                    <div className={`absolute top-0 left-0 w-full h-0.5 ${lane.color} opacity-50`} />
                                    <div className="text-xs font-medium text-white/90 line-clamp-2 leading-tight group-hover/card:text-white transition-colors">
                                        {card.title}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1 h-1 rounded-full ${lane.color} shadow-[0_0_5px_currentColor]`} />
                                        <div className="text-[9px] text-white/40 uppercase tracking-wider truncate font-medium">
                                            {card.tag}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty slots filler */}
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={`empty-${i}`}
                                    className={`${cardWidthClass} shrink-0 h-20 border border-dashed border-white/5 rounded-lg flex items-center justify-center text-white/5 text-lg hover:text-white/20 hover:border-white/10 transition-colors cursor-pointer`}
                                >
                                    +
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Zoom Control (Bottom Right) - Smaller */}
            <div className="absolute bottom-4 right-4 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-3 shadow-xl z-10 hover:border-white/20 transition-colors">
                <span className="text-[10px] text-white/60 font-mono w-10 text-right tracking-wider uppercase">{zoom}</span>
                <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={zoomIndex}
                    onChange={handleZoomChange}
                    className="w-24 accent-indigo-500 cursor-pointer hover:accent-indigo-400 transition-all"
                />
            </div>
        </div>
    );
};
