"use client";

import React, { useState } from 'react';
import { usePageControl } from '../../../../context/PageControlContext';
import { ColorRibbon } from '../../../../components/ui/ColorRibbon';

export function PageSettingsPanel() {
    const {
        design, setDesign,
        seo, setSeo,
        tracking, setTracking,
        isSettingsOpen, setSettingsOpen
    } = usePageControl();

    const [activeTab, setActiveTab] = useState<'design' | 'seo' | 'tracking'>('design');

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSettingsOpen(false)}
            />

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-neutral-900 shadow-2xl z-[80] transition-transform duration-300 transform ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-neutral-200 dark:border-neutral-800 flex flex-col`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-lg font-semibold">Page Settings</h2>
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-1 border-b border-neutral-100 dark:border-neutral-800">
                    {(['design', 'seo', 'tracking'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white'
                                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* --- DESIGN TAB --- */}
                    {activeTab === 'design' && (
                        <div className="flex flex-col gap-6 animate-fadeIn">
                            {/* Background Color */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Page Background</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={design.backgroundColor}
                                        onChange={(e) => setDesign({ backgroundColor: e.target.value })}
                                        className="h-10 w-10 rounded-lg border border-neutral-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={design.backgroundColor}
                                        onChange={(e) => setDesign({ backgroundColor: e.target.value })}
                                        className="flex-1 p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            {/* Global Funk (Accent) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Global Accent (Funk)</label>
                                <ColorRibbon
                                    value={design.accentColor}
                                    onChange={(color) => setDesign({ accentColor: color })}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- SEO TAB --- */}
                    {activeTab === 'seo' && (
                        <div className="flex flex-col gap-6 animate-fadeIn">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">Page Title</label>
                                    <input
                                        type="text"
                                        value={seo.title}
                                        onChange={(e) => setSeo({ title: e.target.value })}
                                        className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. My Amazing Brand"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">Slug</label>
                                    <div className="flex items-center bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                        <span className="px-3 text-neutral-400 text-sm">/</span>
                                        <input
                                            type="text"
                                            value={seo.slug}
                                            onChange={(e) => setSeo({ slug: e.target.value })}
                                            className="flex-1 p-3 bg-transparent outline-none"
                                            placeholder="my-page"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                                    <textarea
                                        value={seo.description}
                                        onChange={(e) => setSeo({ description: e.target.value })}
                                        className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Brief description for search results..."
                                        maxLength={160}
                                    />
                                    <div className="text-right text-xs text-neutral-400">{seo.description.length}/160</div>
                                </div>
                            </div>

                            {/* Search Preview Card */}
                            <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px]">G</div>
                                    <div className="text-xs text-neutral-500">example.com › {seo.slug}</div>
                                </div>
                                <div className="text-[#1a0dab] text-lg font-medium hover:underline truncate mb-1">
                                    {seo.title || 'Page Title'}
                                </div>
                                <div className="text-sm text-neutral-600 line-clamp-2">
                                    {seo.description || 'This description will appear in search results...'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TRACKING TAB --- */}
                    {activeTab === 'tracking' && (
                        <div className="flex flex-col gap-6 animate-fadeIn">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">Google Analytics 4 (ID)</label>
                                    <input
                                        type="text"
                                        value={tracking.ga4}
                                        onChange={(e) => setTracking({ ga4: e.target.value })}
                                        className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">Meta Pixel (ID)</label>
                                    <input
                                        type="text"
                                        value={tracking.metaPixel}
                                        onChange={(e) => setTracking({ metaPixel: e.target.value })}
                                        className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="1234567890"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase text-neutral-400">TikTok Pixel (ID)</label>
                                    <input
                                        type="text"
                                        value={tracking.tiktokPixel}
                                        onChange={(e) => setTracking({ tiktokPixel: e.target.value })}
                                        className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="CXXXXXXXXX"
                                    />
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg">
                                Tip: Pixels will fire automatically on page output.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
