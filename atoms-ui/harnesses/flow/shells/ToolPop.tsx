"use client";

import React from 'react';

interface ToolPopProps {
    isOpen?: boolean;
    children?: React.ReactNode;
}

// Implements the "Magnifier Pattern" (Left Col: Categories, Right Col: Sliders)
// This container expects the `children` to provide the actual split content if needed, 
// or it just acts as the container for the `WysiwygToolbar` which we will strip down.
export function ToolPop({ isOpen = true, children }: ToolPopProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 flex justify-center pointer-events-none">
            {/* The Floating Island */}
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                {/* Content Container */}
                <div className="p-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
