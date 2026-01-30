import React, { useRef, useEffect } from 'react';
import { MessageStream } from './chat/MessageStream';
import { InputController } from './chat/InputController';
import { ToolTray } from './chat/ToolTray';
import { ContextPills } from './chat/ContextPills';

export type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

interface ChatRailShellProps {
    showTools?: boolean;
    onToggleTools?: () => void;
    mode: ChatMode;
    onModeChange: (mode: ChatMode) => void;
}

export function ChatRailShell({ showTools = false, onToggleTools, mode, onModeChange }: ChatRailShellProps) {
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
                <ContextPills mode={mode} />

                {/* Right Controls (MUSCLE MEMORY LAYOUT) */}
                <div className="flex items-center gap-1 pointer-events-auto relative z-[1001] shrink-0">

                    <ToolTray showTools={showTools} onToggleTools={onToggleTools} />
                    <div className="w-px h-3 bg-white/20 mx-1" />

                    <div className="flex items-center gap-0.5">
                        <ChevronDown onClick={handleDown} disabled={!canGoDown} />
                        <ChevronUp onClick={handleUp} disabled={!canGoUp} />
                    </div>

                </div>
            </div>

            {mode !== 'nano' && (
                <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 pointer-events-auto w-full max-w-full">
                    <MessageStream />
                    <InputController autoFocus={mode !== 'full'} />
                </div>
            )}
        </div>
    );
}
