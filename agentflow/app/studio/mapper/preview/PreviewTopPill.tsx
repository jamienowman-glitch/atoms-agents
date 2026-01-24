"use client";

import React from 'react';

/* PREVIEW VERSION OF WORKBENCH HEADER (TOP PILL) */

export function PreviewTopPill() {
    return (
        <div className="w-[400px] bg-black text-white rounded-full px-5 py-2 flex items-center justify-between shadow-xl">
            {/* Left: Nav Toggle */}
            <div className="flex gap-1.5 flex-col items-center cursor-pointer opacity-80 hover:opacity-100">
                <div className="w-6 h-0.5 bg-white rounded-full"></div>
                <div className="w-6 h-0.5 bg-white rounded-full"></div>
            </div>

            {/* Center: Brand */}
            <div className="text-center">
                <div className="text-xl font-bold tracking-tight leading-none">N<sup className="text-[10px]">x</sup></div>
                <div className="text-[8px] tracking-[0.2em] uppercase text-neutral-400">Marketing Agents</div>
            </div>

            {/* Right: Temp */}
            <div className="text-xl font-bold tracking-tight">72°</div>
        </div>
    );
}
