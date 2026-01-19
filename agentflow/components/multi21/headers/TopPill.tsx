"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useToolControl } from '../../../context/ToolControlContext';

interface TopPillProps {
    setIsRightPanelOpen?: (isOpen: boolean) => void;
    setIsExportOpen?: (isOpen: boolean) => void;
}

export function TopPill({ setIsRightPanelOpen, setIsExportOpen }: TopPillProps) {
    const [state, setState] = useState<'idle' | 'nx' | 'm21'>('idle');
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false);
    const tempGestureRef = useRef<{ y: number } | null>(null);
    const { useToolState } = useToolControl();

    // View State (Global) - wired for the Mobile/Desktop toggle
    const [previewMode, setPreviewMode] = useToolState<'desktop' | 'mobile'>({
        target: { surfaceId: 'multi21.designer', toolId: 'previewMode' },
        defaultValue: 'desktop'
    });

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

    return (
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
                    <span>M<sup>21</sup></span>
                </button>

                {/* --- RIGHT EXPANSION (M21) --- */}
                <div
                    className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${state === 'm21' ? 'max-w-[190px] opacity-100 ml-2 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'}`}
                >
                    <div className={`flex items-center gap-2 ${state === 'm21' ? 'bg-white text-black border border-black/80 rounded-full px-1 py-0.5' : ''}`}>
                        {/* Mobile/Desktop Toggle */}
                        <button
                            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                            className={`p-2 rounded-full transition-colors ${state === 'm21' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}
                            title={previewMode === 'desktop' ? 'Switch to Mobile' : 'Switch to Desktop'}
                            type="button"
                        >
                            {previewMode === 'desktop' ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /></svg>
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                            )}
                        </button>

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
                            onClick={() => setIsRightPanelOpen?.(true)}
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
                </div>

            </div>
        </div>
    );
}
