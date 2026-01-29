"use client";

import React from 'react';

// Simplified TopPill for the Harness
export function TopPill() {
    return (
        <div className="fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 pointer-events-none z-50">
            {/* Left: Branding/Back */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full px-4 py-2 pointer-events-auto shadow-sm">
                <span className="font-bold text-sm">Wysiwyg</span>
            </div>

            {/* Center: Temperature Badge (Requested) */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full px-3 py-1.5 pointer-events-auto shadow-sm flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500">TEMP</span>
                <span className="text-xs font-bold text-orange-500">0.7</span>
            </div>

            {/* Right: Actions */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full px-4 py-2 pointer-events-auto shadow-sm">
                <button className="text-sm font-medium hover:text-blue-500 transition-colors">Export</button>
            </div>
        </div>
    );
}
