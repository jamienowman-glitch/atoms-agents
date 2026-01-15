"use client";

import React, { useState } from "react";

export const CaidenceFileExplorerViewThemeA = () => {
    const [activeBucket, setActiveBucket] = useState("Brand Story");

    const buckets = ["Brand Story", "Features & Benefits", "Launch Content", "Evergreen"];

    // Mock items for the active bucket
    const items = [
        { id: 1, title: "Hero Image", type: "IMG", color: "bg-purple-500" },
        { id: 2, title: "Campaign Video", type: "VID", color: "bg-blue-500" },
        { id: 3, title: "Copy Deck", type: "DOC", color: "bg-orange-500" },
        { id: 4, title: "Social Assets", type: "ZIP", color: "bg-green-500" },
        { id: 5, title: "Logo Pack", type: "SVG", color: "bg-pink-500" },
    ];

    const handleDragStart = (e: React.DragEvent, item: any) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(item));
        e.currentTarget.classList.add("opacity-50");
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("opacity-50");
    };

    return (
        <div className="flex-1 flex flex-col h-full p-8 overflow-hidden bg-[#F7F5F2]">
            {/* Bucket Selector */}
            <div className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
                {buckets.map((bucket) => (
                    <button
                        key={bucket}
                        onClick={() => setActiveBucket(bucket)}
                        className={`
              px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border
              ${activeBucket === bucket
                                ? "bg-[#050608] text-white border-[#050608] shadow-md scale-105"
                                : "bg-white text-[#050608]/60 border-black/5 hover:bg-black/5 hover:text-[#050608] hover:border-black/10"
                            }
            `}
                    >
                        {bucket}
                    </button>
                ))}
            </div>

            {/* Stacked Tiles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 overflow-y-auto pb-24 custom-scrollbar pr-2">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        className="group relative cursor-grab active:cursor-grabbing perspective-1000"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        {/* Stack Effect Layers */}
                        <div className="absolute inset-0 bg-black/5 rounded-xl rotate-6 scale-90 translate-y-4 transition-transform duration-500 group-hover:rotate-12 group-hover:translate-y-6 group-hover:bg-black/10" />
                        <div className="absolute inset-0 bg-black/5 rounded-xl -rotate-3 scale-95 translate-y-2 transition-transform duration-500 group-hover:-rotate-6 group-hover:translate-y-4 group-hover:bg-black/10" />

                        {/* Main Card */}
                        <div className="relative bg-white border border-black/10 rounded-xl aspect-[4/3] p-5 flex flex-col justify-between shadow-sm group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300 overflow-hidden">

                            {/* Thumbnail Placeholder */}
                            <div className={`w-full h-2/3 rounded-lg ${item.color} bg-opacity-10 border border-black/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                                <span className={`text-2xl font-bold ${item.color.replace('bg-', 'text-')} opacity-80`}>{item.type}</span>
                            </div>

                            {/* Info */}
                            <div className="flex items-center justify-between mt-3 relative z-10">
                                <span className="text-sm font-medium text-[#050608] truncate group-hover:text-[#FF6829] transition-colors">{item.title}</span>
                                <span className="text-[10px] text-[#050608]/40 bg-black/5 px-2 py-1 rounded-md uppercase tracking-wider font-bold border border-black/5">
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upload Placeholder */}
                <div className="relative aspect-[4/3] border-2 border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center gap-3 text-[#050608]/30 hover:text-[#050608]/80 hover:border-[#FF6829]/50 hover:bg-[#FF6829]/5 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-[#FF6829] group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                        <span className="text-2xl leading-none mb-1">+</span>
                    </div>
                    <span className="text-xs font-medium tracking-wide uppercase">Upload New</span>
                </div>
            </div>
        </div>
    );
};
