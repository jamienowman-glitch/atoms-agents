"use client";

import React from 'react';
import { useToolControl } from '../../../../context/ToolControlContext';
import { usePageControl } from '../../../../context/PageControlContext';
import { LensType } from '../../../../lib/LensRegistry';

export function TopControls({ showGraphControls = false }: { showGraphControls?: boolean }) {
    const { useToolState } = useToolControl();
    const { setSettingsOpen, setExportOpen } = usePageControl();

    // View State (Global)
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({
        target: { surfaceId: 'multi21.designer', toolId: 'previewMode' },
        defaultValue: 'desktop'
    });

    // Lens State (Global)
    const [activeLens, setActiveLens] = useToolState<LensType>({
        target: { surfaceId: 'multi21.designer', toolId: 'activeLens' },
        defaultValue: 'graph_lens'
    });

    // Registry State (Global)
    const [showRegistry, setShowRegistry] = useToolState<boolean>({
        target: { surfaceId: 'multi21.designer', toolId: 'show_registry' },
        defaultValue: false
    });

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 h-12 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-full px-4 flex items-center gap-2 z-[60] transition-all duration-300">

            {/* View Toggles (Mobile/Desktop) */}
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
                <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'mobile' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                    title="Mobile View"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /></svg>
                </button>
                <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'desktop' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                    title="Desktop View"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                </button>
            </div>

            {showGraphControls && (
                <>
                    <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

                    {/* Lens Toggles / Back Navigation */}
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
                        {activeLens === 'graph_lens' ? (
                            <div className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white">
                                Graph
                            </div>
                        ) : (
                            <button
                                onClick={() => setActiveLens('graph_lens')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Graph
                            </button>
                        )}
                    </div>
                </>
            )}

            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

            {/* Center: Page Settings (The Director) */}
            <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                title="Page Settings"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

            {/* Registry Button */}
            <button
                onClick={() => setShowRegistry(!showRegistry)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${showRegistry ? 'bg-black text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            >
                System
            </button>

            {/* Right: Export/Publish */}
            <button
                onClick={() => setExportOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors"
                type="button"
            >
                <span>Export</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            </button>

        </div>
    );
}
