"use client";

import React from 'react';

interface ChatRailProps {
    mode?: 'collapsed' | 'open';
}

export function ChatRail({ mode = 'collapsed' }: ChatRailProps) {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-end gap-2">

            {/* The Launcher (Requested) */}
            <button className="w-10 h-10 bg-black text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            </button>

            {/* Chat Input Placeholder */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 w-[300px] flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Ask Agent..."
                    className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                />
            </div>
        </div>
    );
}
