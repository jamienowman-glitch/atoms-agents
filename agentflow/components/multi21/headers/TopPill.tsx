"use client";

import React, { useState } from 'react';
import { useToolControl } from '../../../context/ToolControlContext';

interface TopPillProps {
    setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export function TopPill({ setIsRightPanelOpen }: TopPillProps) {
    const [state, setState] = useState<'idle' | 'nx' | 'm21'>('idle');
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

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center bg-black/90 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.15)] text-white h-12 px-2 transition-all duration-300">

                {/* --- LEFT EXPANSION (NX) --- */}
                <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${state === 'nx' ? 'w-auto max-w-[150px] opacity-100 pr-2' : 'max-w-0 opacity-0'}`}>
                    {/* Config Icon */}
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Config">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                     {/* Menu Icon */}
                     <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Menu">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* --- LEFT TRIGGER (Nˣ) --- */}
                <button
                    onClick={() => toggleState('nx')}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${state === 'nx' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                >
                    <span>N<sup>x</sup></span>
                </button>

                {/* --- CENTER --- */}
                <div className="px-4 font-mono text-sm tracking-wider text-white/80 select-none">
                    72°
                </div>

                 {/* --- RIGHT TRIGGER (M²¹) --- */}
                 <button
                    onClick={() => toggleState('m21')}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${state === 'm21' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                >
                    <span>M<sup>21</sup></span>
                </button>

                {/* --- RIGHT EXPANSION (M21) --- */}
                <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${state === 'm21' ? 'w-auto max-w-[150px] opacity-100 pl-2' : 'max-w-0 opacity-0'}`}>
                    {/* Mobile/Desktop Toggle */}
                    <button
                        onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title={previewMode === 'desktop' ? 'Switch to Mobile' : 'Switch to Desktop'}
                    >
                         {previewMode === 'desktop' ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /></svg>
                         ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                         )}
                    </button>

                    {/* Export Icon */}
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Export">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    </button>

                    {/* Page Icon (Settings) */}
                    <button
                        onClick={() => setIsRightPanelOpen?.(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Page Settings"
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
    );
}
