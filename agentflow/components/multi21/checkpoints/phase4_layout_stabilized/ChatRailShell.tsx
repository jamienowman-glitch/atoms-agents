"use client";

import React, { useRef, useEffect } from 'react';

type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

interface ChatRailShellProps {
    showTools?: boolean;
    onToggleTools?: () => void;
    mode: ChatMode;
    onModeChange: (mode: ChatMode) => void;
}

export function ChatRailShell({ showTools = false, onToggleTools, mode, onModeChange }: ChatRailShellProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus Logic
    useEffect(() => {
        if (mode !== 'nano' && mode !== 'full') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [mode]);

    // Height Logic
    const getHeight = () => {
        switch (mode) {
            case 'full': return 'h-[92vh]';
            case 'standard': return 'h-[50vh]';
            case 'micro': return 'h-[180px]';
            default: return 'h-[60px]';
        }
    };

    const styles = getHeight();

    // --- ICONS (16px / w-4 h-4) ---

    const ChevronUp = ({ onClick, disabled }: { onClick?: () => void, disabled?: boolean }) => (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!disabled) onClick?.();
            }}
            className={`p-2 hover:bg-white/20 rounded-full transition-all duration-200 ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer pointer-events-auto active:bg-white/30'}`}
        >
            <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
    );

    const ChevronDown = ({ onClick, disabled }: { onClick?: () => void, disabled?: boolean }) => (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!disabled) onClick?.();
            }}
            className={`p-2 hover:bg-white/20 rounded-full transition-all duration-200 ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer pointer-events-auto active:bg-white/30'}`}
        >
            <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
    );

    const ToggleTools = () => (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (onToggleTools) onToggleTools();
            }}
            className={`p-2 rounded-lg transition-all duration-200 pointer-events-auto ${showTools ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            title="Toggle Tools"
        >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        </button>
    );

    // --- NAVIGATION LOGIC ---
    const handleUp = () => {
        if (mode === 'nano') onModeChange('micro');
        else if (mode === 'micro') onModeChange('standard');
        else if (mode === 'standard') onModeChange('full');
    }

    const handleDown = () => {
        if (mode === 'full') onModeChange('standard');
        else if (mode === 'standard') onModeChange('micro');
        else if (mode === 'micro') onModeChange('nano');
    }

    const canGoUp = mode !== 'full';
    const canGoDown = mode !== 'nano';

    return (
        <div
            // z-50: Ensures THIS stays on top of BottomControls (z-40)
            className={`fixed bottom-0 inset-x-0 max-w-full overflow-hidden box-border bg-neutral-900 border-t border-white/10 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.3)] text-white transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 flex flex-col pb-safe touch-manipulation ${styles}`}
        >
            <div
                className={`flex items-center justify-between px-4 h-[60px] shrink-0 cursor-pointer relative z-[1000] w-full ${mode !== 'nano' ? 'border-b border-white/10' : ''}`}
                onClick={() => {
                    if (mode === 'nano') onModeChange('micro');
                }}
            >
                <div className="flex items-center flex-1 min-w-0 pointer-events-none">
                    {mode === 'nano' ? (
                        <div className="flex flex-col min-w-0 overflow-hidden">
                            <span className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-0.5">Agent</span>
                            <span className="text-sm text-neutral-300 truncate font-light opacity-80">
                                I can help you adjust the grid layout...
                            </span>
                        </div>
                    ) : (
                        <span className="font-semibold text-sm text-neutral-200">Chat with Agent</span>
                    )}
                </div>

                {/* Right Controls (MUSCLE MEMORY LAYOUT) */}
                <div className="flex items-center gap-1 pointer-events-auto relative z-[1001] shrink-0">

                    <ToggleTools />
                    <div className="w-px h-3 bg-white/20 mx-1" />

                    <div className="flex items-center gap-0.5">
                        <ChevronDown onClick={handleDown} disabled={!canGoDown} />
                        <ChevronUp onClick={handleUp} disabled={!canGoUp} />
                    </div>

                </div>
            </div>

            {mode !== 'nano' && (
                <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 pointer-events-auto w-full max-w-full">
                    <div className="flex-1 p-4 overflow-y-auto w-full max-w-full">
                        <div className="flex gap-3 w-full max-w-full">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] font-bold shrink-0 border border-neutral-700">AI</div>
                            <div className="bg-neutral-800/50 p-3 rounded-2xl rounded-tl-sm text-neutral-300 text-sm leading-relaxed max-w-[calc(100%-48px)] border border-white/5">
                                <p>I can help you adjust the grid layout or add new tiles. Just type below.</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-3 border-t border-white/10 bg-neutral-900 pb-safe w-full max-w-full">
                        <div className="flex items-center gap-2 bg-neutral-950 border border-white/10 rounded-full px-4 py-2 focus-within:border-neutral-500 transition-colors w-full max-w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Message agent..."
                                className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-neutral-500 h-8 min-w-0"
                            />
                            <button className="p-1.5 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
