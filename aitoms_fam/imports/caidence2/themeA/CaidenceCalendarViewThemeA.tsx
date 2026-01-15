"use client";

import React, { useState } from "react";

export const CaidenceCalendarViewThemeA = () => {
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
            aspect-square rounded-md flex flex-col items-center justify-center relative transition-all duration-200 group
            ${isSmall ? "text-[8px]" : "text-xs"}
            ${hasContent
                            ? "bg-black/5 text-[#050608] hover:bg-black/10"
                            : "text-[#050608]/30 hover:text-[#050608]/60 hover:bg-black/5"
                        }
            ${isToday ? "border border-[#FF6829] bg-[#FF6829]/10 text-[#FF6829] font-bold" : ""}
            cursor-pointer
          `}
                >
                    <span className={`font-mono ${isToday ? "font-bold" : ""}`}>{d}</span>

                    {/* Indicators */}
                    {hasContent && !isSmall && (
                        <div className="flex gap-0.5 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-1 h-1 rounded-full bg-[#046E8C]" />
                            {d % 7 === 0 && <div className="w-1 h-1 rounded-full bg-[#FF6829]" />}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F7F5F2]">
            {/* Zoom Toggle - Floating Button Style */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => setZoom(zoom === "Quarter" ? "Month" : "Quarter")}
                    className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black/60 hover:text-black hover:border-black/30 transition-all shadow-sm"
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
            <div className={`flex-1 p-6 flex flex-col transition-all duration-500 ${zoom === "Quarter" ? "max-h-[50%]" : "h-full"}`}>
                <h2 className="text-2xl font-light text-[#050608] mb-6 tracking-tight flex items-baseline gap-2">
                    <span className="font-bold">{months[focusMonthIndex].name}</span>
                    <span className="text-base text-[#050608]/40 font-normal">2025</span>
                </h2>

                <div className="grid grid-cols-7 gap-1 flex-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="text-center text-[#050608]/30 text-[10px] font-bold uppercase tracking-widest py-2">
                            {d}
                        </div>
                    ))}
                    {renderDays(focusMonthIndex)}
                </div>
            </div>

            {/* Secondary Months (Quarter View Only) - Bottom half */}
            {zoom === "Quarter" && (
                <div className="h-[50%] border-t border-black/5 bg-white p-6 grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
                    {months.map((month, idx) => {
                        if (idx === focusMonthIndex) return null;
                        return (
                            <div
                                key={month.name}
                                className="flex flex-col cursor-pointer group relative p-4 rounded-xl hover:bg-black/5 transition-colors border border-transparent hover:border-black/5"
                                onClick={() => setFocusMonthIndex(idx)}
                            >
                                <h3 className="text-sm font-bold text-[#050608]/60 group-hover:text-[#050608] mb-3 transition-colors flex items-center justify-between">
                                    {month.name}
                                </h3>
                                <div className="grid grid-cols-7 gap-0.5 flex-1 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
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
