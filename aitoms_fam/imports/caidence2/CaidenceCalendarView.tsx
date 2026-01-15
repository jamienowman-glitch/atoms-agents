"use client";

import React, { useState } from "react";

export const CaidenceCalendarView = () => {
    const [focusMonthIndex, setFocusMonthIndex] = useState(0); // 0, 1, 2
    const [zoom, setZoom] = useState<"Quarter" | "Month">("Quarter");

    const months = [
        { name: "January", days: 31, startDay: 3 }, // Wed
        { name: "February", days: 29, startDay: 6 }, // Sat
        { name: "March", days: 31, startDay: 0 }, // Sun
    ];

    // Helper to generate days
    const renderDays = (monthIndex: number, isSmall = false) => {
        const month = months[monthIndex];
        const days = [];

        // Empty slots for start day
        for (let i = 0; i < month.startDay; i++) {
            days.push(<div key={`empty-${i}`} />);
        }

        // Days
        for (let d = 1; d <= month.days; d++) {
            const hasContent = d % 3 === 0 || d % 7 === 0; // Mock content
            const isToday = monthIndex === 0 && d === 15; // Mock today

            days.push(
                <div
                    key={d}
                    className={`
            aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 group
            ${isSmall ? "text-[8px]" : "text-xs"}
            ${hasContent
                            ? "bg-white/5 text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            : "text-white/30 hover:text-white/60 hover:bg-white/5"
                        }
            ${isToday ? "border border-indigo-500/50 bg-indigo-500/10 text-indigo-200" : ""}
            cursor-pointer
          `}
                >
                    <span className={`font-mono ${isToday ? "font-bold" : ""}`}>{d}</span>

                    {/* Indicators */}
                    {hasContent && !isSmall && (
                        <div className="flex gap-0.5 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-0.5 h-0.5 rounded-full bg-indigo-400 shadow-[0_0_4px_currentColor]" />
                            {d % 7 === 0 && <div className="w-0.5 h-0.5 rounded-full bg-pink-400 shadow-[0_0_4px_currentColor]" />}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Zoom Toggle - Floating Button Style */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => setZoom(zoom === "Quarter" ? "Month" : "Quarter")}
                    className="w-8 h-8 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all shadow-lg"
                    title="Toggle Zoom"
                >
                    {zoom === "Quarter" ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                    )}
                </button>
            </div>

            {/* Main Focus Month - Takes up top half in Quarter view, full in Month view */}
            <div className={`flex-1 p-4 flex flex-col transition-all duration-500 ${zoom === "Quarter" ? "max-h-[50%]" : "h-full"}`}>
                <h2 className="text-xl font-light text-white mb-4 tracking-tight flex items-baseline gap-2">
                    <span className="font-bold">{months[focusMonthIndex].name}</span>
                    <span className="text-sm text-white/20 font-light">2025</span>
                </h2>

                <div className="grid grid-cols-7 gap-1 flex-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="text-center text-white/20 text-[9px] font-bold uppercase tracking-widest py-1">
                            {d}
                        </div>
                    ))}
                    {renderDays(focusMonthIndex)}
                </div>
            </div>

            {/* Secondary Months (Quarter View Only) - Bottom half */}
            {zoom === "Quarter" && (
                <div className="h-[50%] border-t border-white/5 bg-[#0a0a0f]/30 backdrop-blur-sm p-4 grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
                    {months.map((month, idx) => {
                        if (idx === focusMonthIndex) return null;
                        return (
                            <div
                                key={month.name}
                                className="flex flex-col cursor-pointer group relative p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                onClick={() => setFocusMonthIndex(idx)}
                            >
                                <h3 className="text-xs font-medium text-white/40 group-hover:text-white mb-2 transition-colors flex items-center justify-between">
                                    {month.name}
                                </h3>
                                <div className="grid grid-cols-7 gap-0.5 flex-1 opacity-30 group-hover:opacity-80 transition-opacity pointer-events-none grayscale group-hover:grayscale-0">
                                    {renderDays(idx, true)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
