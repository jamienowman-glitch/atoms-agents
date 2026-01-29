"use client";

import React, { useState } from 'react';

export interface ContentPickerItem {
    id: string;
    title: string;
    subtitle?: string;
    badge?: string;
    icon?: React.ReactNode;
}

interface ContentPickerProps {
    type: string; // 'playlist', 'feed', 'collection', etc.
    label: string; // 'Select Playlist', 'Select Feed'
    items: ContentPickerItem[];
    selectedValue?: string;
    onSelect: (id: string) => void;
    onCreate: () => void;
}

export function ContentPicker({ type, label, items, selectedValue, onSelect, onCreate }: ContentPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedItem = items.find(i => i.id === selectedValue);

    return (
        <div className="flex flex-col gap-2 relative z-50">
            {/* Trigger & Create Button Row */}
            <div className="flex gap-2 w-full">

                {/* Dropdown Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all
                        ${isOpen
                            ? 'bg-neutral-50 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600 shadow-sm'
                            : 'bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }
                    `}
                >
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider leading-tight">{label}</span>
                        <div className="flex items-center gap-2">
                            {selectedItem ? (
                                <>
                                    <span className="text-xs font-semibold truncate text-neutral-900 dark:text-white">{selectedItem.title}</span>
                                    {selectedItem.badge && (
                                        <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                                            {selectedItem.badge}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-xs text-neutral-400 italic">No selection</span>
                            )}
                        </div>
                    </div>
                    {/* Chevron */}
                    <svg className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>

                {/* Plus Button */}
                <button
                    onClick={onCreate}
                    className="w-10 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                    title={`Create New ${type}`}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-[110%] left-0 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-[70] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">

                    {/* Search Bar */}
                    <div className="p-1.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                        <div className="relative">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                            <input
                                autoFocus
                                type="text"
                                placeholder={`Search...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs outline-none focus:border-neutral-300 dark:focus:border-neutral-700"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[160px] overflow-y-auto scrollbar-hide py-1">
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors border-b border-transparent ${selectedValue === item.id ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`}
                                >
                                    {/* Optional Item Icon */}
                                    {item.icon ? (
                                        <div className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                                            <span className="text-[10px] font-bold">{item.title.charAt(0)}</span>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-xs font-semibold truncate ${selectedValue === item.id ? 'text-black dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                                {item.title}
                                            </span>
                                            {item.badge && <span className="text-[8px] px-1 py-px bg-neutral-100 dark:bg-neutral-700 rounded text-neutral-500 tracking-tight">{item.badge}</span>}
                                        </div>
                                        {item.subtitle && <p className="text-[10px] text-neutral-400 truncate">{item.subtitle}</p>}
                                    </div>

                                    {selectedValue === item.id && (
                                        <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12" /></svg>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-neutral-400">
                                No matches found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
