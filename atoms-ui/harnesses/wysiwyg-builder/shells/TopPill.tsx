"use client";

import React, { useEffect, useRef, useState } from 'react';

// STUB: useToolControl replacement
// We pass previewMode state from props or context if needed, but for now we'll keep local state for the UI
// Since the harness manages toolState, this component should ideally receive props.
// However, to keep the port clean, we will use a local mock or props.

interface TopPillProps {
    setIsRightPanelOpen?: (isOpen: boolean) => void;
    setIsExportOpen?: (isOpen: boolean) => void;
    logoIcon?: React.ReactNode;
    RightControls?: React.ReactNode;
    // Added for Wysiwyg Harness integration
    previewMode: 'desktop' | 'mobile';
    setPreviewMode: (mode: 'desktop' | 'mobile') => void;
}

export function TopPill({ setIsRightPanelOpen, setIsExportOpen, logoIcon, RightControls, previewMode, setPreviewMode }: TopPillProps) {
    const [state, setState] = useState<'idle' | 'nx' | 'm21'>('idle');
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false);
    const [showPageDrawer, setShowPageDrawer] = useState(false);

    // SEO Form State
    const [selectedProject, setSelectedProject] = useState('project-1');
    const [selectedPage, setSelectedPage] = useState('home');
    const [seoData, setSeoData] = useState({
        metaTitle: '',
        metaDescription: '',
        h1: '',
        ga4Id: '',
        pixelId: ''
    });

    const tempGestureRef = useRef<{ y: number } | null>(null);

    const toggleState = (newState: 'nx' | 'm21') => {
        if (state === newState) {
            setState('idle');
        } else {
            setState(newState);
        }
    };

    useEffect(() => {
        if (isHeaderOpen) {
            setState('idle');
        } else {
            setIsNavOpen(false);
            setIsActionMenuOpen(false);
            setIsChannelMenuOpen(false);
        }
    }, [isHeaderOpen]);

    const handleTempPointerDown = (event: React.PointerEvent) => {
        tempGestureRef.current = { y: event.clientY };
    };

    const handleTempPointerUp = (event: React.PointerEvent) => {
        if (!tempGestureRef.current) return;
        const deltaY = event.clientY - tempGestureRef.current.y;
        tempGestureRef.current = null;

        if (deltaY < -30) {
            setIsHeaderOpen(true);
        } else if (deltaY > 30) {
            setIsHeaderOpen(false);
        }
    };

    if (isHeaderOpen) {
        return (
            <div className="fixed top-0 inset-x-0 z-[70] bg-black text-white border-b border-white/10 font-sans">
                <div className="px-5 pt-[env(safe-area-inset-top)] pb-4">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                        <div className="relative flex items-center">
                            <button
                                type="button"
                                className="flex flex-col gap-1.5 items-center"
                                onClick={() => setIsNavOpen((prev) => !prev)}
                            >
                                <span className="block w-9 h-[2px] bg-white rounded-full" />
                                <span className="block w-9 h-[2px] bg-white rounded-full" />
                                <span className="block w-9 h-[2px] bg-white rounded-full" />
                            </button>

                            {isNavOpen && (
                                <div className="absolute left-0 mt-3 bg-black border border-white/10 rounded-2xl p-3 flex flex-col gap-2 min-w-[190px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                                    {['ATOMS FAM OS', 'AGENTFLOWS', 'STUDIOS', 'STORIES', 'SETTINGS'].map((label) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="text-left text-[10px] tracking-[0.18em] uppercase text-white/80 hover:text-white transition-colors"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="text-3xl font-semibold tracking-tight">
                                N<sup className="text-base -top-3 relative">x</sup>
                            </div>
                            <div className="text-[10px] tracking-[0.3em] uppercase text-white/70 -mt-1">Marketing Agents</div>
                        </div>

                        <button
                            type="button"
                            className="text-3xl font-semibold tracking-tight"
                            onClick={() => setIsHeaderOpen(false)}
                        >
                            72°
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-3">
                        <div className="relative">
                            <button
                                type="button"
                                className="px-4 py-1.5 rounded-full border border-white/60 text-xs font-semibold tracking-wide"
                                onClick={() => setIsActionMenuOpen((prev) => !prev)}
                            >
                                MULTI<sup className="text-[9px] ml-1">21</sup>
                            </button>
                            {isActionMenuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black border border-white/10 rounded-2xl p-3 flex flex-col gap-2 min-w-[200px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                                    <button
                                        type="button"
                                        className="text-[10px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                                        onClick={() => setIsRightPanelOpen?.(true)}
                                    >
                                        Page
                                    </button>
                                    <button
                                        type="button"
                                        className="text-[10px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                                        onClick={() => setIsExportOpen?.(true)}
                                    >
                                        Export
                                    </button>
                                    <button
                                        type="button"
                                        className="text-[10px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                                        onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                                    >
                                        {previewMode === 'desktop' ? 'Mobile' : 'Desktop'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                className="px-4 py-1.5 rounded-full border border-white/40 text-[10px] font-semibold tracking-[0.25em] uppercase"
                                onClick={() => setIsChannelMenuOpen((prev) => !prev)}
                            >
                                Web
                            </button>
                            {isChannelMenuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black border border-white/10 rounded-2xl p-3 flex flex-col gap-2 min-w-[160px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                                    {['DM', 'Email'].map((label) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="text-[10px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const rightControls = RightControls ?? (
        <div className={`flex items-center gap-2 ${state === 'm21' ? 'bg-white text-black border border-black/80 rounded-full px-1 py-0.5' : ''}`}>
            {/* View Mode Segmented Control (Icons) */}
            <div className="flex bg-neutral-100/50 rounded-full p-0.5 border border-neutral-200/50">
                <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-1.5 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    title="Desktop View"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                </button>
                <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-1.5 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    title="Mobile View"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                </button>
            </div>

            {/* Export Icon */}
            <button
                className={`p-2 rounded-full transition-colors ${state === 'm21' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}
                title="Export"
                onClick={() => setIsExportOpen?.(true)}
                type="button"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            </button>

            {/* Page Icon (Settings) */}
            <button
                onClick={() => setShowPageDrawer(true)}
                className={`p-2 rounded-full transition-colors ${state === 'm21' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}
                title="Page Settings"
                type="button"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
            </button>
        </div>
    );

    return (
        <>
            {/* Page Drawer */}
            {showPageDrawer && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] animate-in fade-in duration-300"
                        onClick={() => setShowPageDrawer(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-[90] shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Page Settings</h2>
                                <button
                                    onClick={() => setShowPageDrawer(false)}
                                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Project Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Project</label>
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                >
                                    <option value="project-1">Multi21 (Current)</option>
                                    <option value="project-2">Atoms Fam OS</option>
                                    <option value="project-3">Studios</option>
                                </select>
                            </div>

                            {/* Page Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Page</label>
                                <select
                                    value={selectedPage}
                                    onChange={(e) => setSelectedPage(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                >
                                    <option value="home">Home</option>
                                    <option value="about">About</option>
                                    <option value="features">Features</option>
                                    <option value="pricing">Pricing</option>
                                </select>
                            </div>

                            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mb-6">
                                <h3 className="text-sm font-semibold mb-4">SEO Metadata</h3>

                                {/* Meta Title */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium mb-1.5 text-neutral-600 dark:text-neutral-400">Meta Title</label>
                                    <input
                                        type="text"
                                        value={seoData.metaTitle}
                                        onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
                                        placeholder="e.g., Multi21 | AI Marketing Agents"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* Meta Description */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium mb-1.5 text-neutral-600 dark:text-neutral-400">Meta Description</label>
                                    <textarea
                                        value={seoData.metaDescription}
                                        onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                                        placeholder="Brief description for search engines..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                                    />
                                </div>

                                {/* H1 */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium mb-1.5 text-neutral-600 dark:text-neutral-400">H1 Heading</label>
                                    <input
                                        type="text"
                                        value={seoData.h1}
                                        onChange={(e) => setSeoData({ ...seoData, h1: e.target.value })}
                                        placeholder="Main page heading"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* GA4 ID */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium mb-1.5 text-neutral-600 dark:text-neutral-400">Google Analytics 4 ID</label>
                                    <input
                                        type="text"
                                        value={seoData.ga4Id}
                                        onChange={(e) => setSeoData({ ...seoData, ga4Id: e.target.value })}
                                        placeholder="G-XXXXXXXXXX"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* Meta Pixel ID */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium mb-1.5 text-neutral-600 dark:text-neutral-400">Meta Pixel ID</label>
                                    <input
                                        type="text"
                                        value={seoData.pixelId}
                                        onChange={(e) => setSeoData({ ...seoData, pixelId: e.target.value })}
                                        placeholder="123456789012345"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* View SEO Canvas Button */}
                                <a
                                    href={`/seo-canvas?page=${selectedPage}`}
                                    className="block w-full px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black text-center rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    View SEO Canvas
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center bg-black/90 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.15)] text-white h-12 px-2 transition-all duration-300">

                    {/* --- LEFT EXPANSION (NX) --- */}
                    <div
                        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${state === 'nx' ? 'max-w-[170px] opacity-100 mr-2 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'}`}
                    >
                        <div className={`flex items-center gap-2 ${state === 'nx' ? 'bg-white text-black border border-black/80 rounded-full px-1 py-0.5' : ''}`}>
                            {/* Config Icon */}
                            <button className={`p-2 rounded-full transition-colors ${state === 'nx' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`} title="Config" type="button">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                            {/* Menu Icon */}
                            <button className={`p-2 rounded-full transition-colors ${state === 'nx' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`} title="Menu" type="button">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* --- LEFT TRIGGER (Nˣ) --- */}
                    <button
                        onClick={() => toggleState('nx')}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${state === 'nx' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        <span>N<sup>x</sup></span>
                    </button>

                    {/* --- CENTER --- */}
                    <button
                        type="button"
                        className="px-4 font-sans text-sm tracking-wider text-white/80 select-none"
                        onPointerDown={handleTempPointerDown}
                        onPointerUp={handleTempPointerUp}
                        onDoubleClick={() => setIsHeaderOpen(true)}
                        title="Expand header"
                    >
                        72°
                    </button>

                    {/* --- RIGHT TRIGGER (M²¹) --- */}
                    <button
                        onClick={() => toggleState('m21')}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${state === 'm21' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {logoIcon ?? (<span>M<sup>21</sup></span>)}
                    </button>

                    {/* --- RIGHT EXPANSION (M21) --- */}
                    <div
                        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${state === 'm21' ? 'max-w-[190px] opacity-100 ml-2 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'}`}
                    >
                        {rightControls}
                    </div>

                </div>
            </div>
        </>
    );
}
