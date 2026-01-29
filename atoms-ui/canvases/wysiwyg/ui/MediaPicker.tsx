"use client";

import React, { useState } from 'react';

export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    title: string;
    duration?: string; // for video
}

interface MediaPickerProps {
    type: 'image' | 'video';
    items: MediaItem[];
    onSelect: (id: string) => void;
    onUpload: () => void;
    onGenerate: () => void;
}

export function MediaPicker({ type, items, onSelect, onUpload, onGenerate }: MediaPickerProps) {
    const [search, setSearch] = useState('');

    const filtered = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Minimalist Actions Row */}
            <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    <input
                        type="text"
                        placeholder={`Search ${type}s...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm outline-none focus:ring-2 ring-black/5 dark:ring-white/10"
                    />
                </div>

                {/* Upload Button */}
                <button
                    onClick={onUpload}
                    className="h-9 px-3 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span>Upload</span>
                </button>

                {/* Generate Button (Images Only) */}
                {type === 'image' && (
                    <button
                        onClick={onGenerate}
                        className="h-9 px-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
                        <span>Gen</span>
                    </button>
                )}
            </div>

            {/* Status Text (Optional) */}
            <div className="text-[10px] text-neutral-400 px-1 truncate">
                {filtered.length} {type}s available in library
            </div>

        </div>
    );
}
