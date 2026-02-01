import React, { useState, useRef, useEffect } from 'react';
import { MessageStream } from '@harnesses/wysiwyg-builder/shells/chat/MessageStream';
import { InputController } from '@harnesses/wysiwyg-builder/shells/chat/InputController';

export type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

interface ChatRailShellProps {
    children?: React.ReactNode;
    showTools?: boolean;
    onToggleTools?: () => void;
    showLogic?: boolean;
    onToggleLogic?: () => void;
    mode: ChatMode;
    onModeChange: (mode: ChatMode) => void;
}

export function ChatRailShell({
    children,
    mode = 'nano',
    onToggleTools,
    showTools,
    onToggleLogic,
    showLogic,
    onModeChange
}: ChatRailShellProps) {
    // Height Logic
    const getHeight = () => {
        switch (mode) {
            case 'full': return 'h-[92vh]';
            case 'standard': return 'h-[50vh]';
            case 'micro': return 'h-[180px]';
            default: return 'h-[128px]'; // Nano: Message Visible, No Input.
        }
    };

    const getRadius = () => {
        switch (mode) {
            case 'full': return 'rounded-t-[32px]';
            default: return 'rounded-t-2xl';
        }
    };

    const styles = `${getHeight()} ${getRadius()} bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`;

    // --- RENDER ---
    // --- RENDER ---
    return (
        <div className={`fixed bottom-0 inset-x-0 z-50 flex flex-col pb-safe touch-manipulation ${styles}`}>


            {/* HEAD */}
            <div
                className={`flex items-center justify-between px-3 h-[44px] shrink-0 cursor-pointer relative z-[1000] w-full ${mode !== 'nano' ? 'border-b border-neutral-200 dark:border-white/10' : ''}`}
                onClick={() => {
                    if (mode === 'nano') onModeChange('micro');
                }}
            >
                {/* --- LEFT: LOGIC (BRAIN) --- */}
                <div className="flex items-center gap-2 z-[1002] relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleLogic?.();
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${showLogic
                            ? 'bg-neutral-100 dark:bg-white/10 text-black dark:text-white'
                            : 'text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5'
                            }`}
                    >
                        {/* Brain Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-1.426A4.5 4.5 0 0 1 9 13" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.97-3.284" /><path d="M17.97 14.716A4 4 0 0 1 16 18" /></svg>
                    </button>
                </div>

                {/* --- CENTER: BRANDING (AgentX) --- */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none z-[1001]">
                    <span className="font-mono text-xs font-bold tracking-widest text-neutral-900 dark:text-white uppercase opacity-90">
                        agentfax
                    </span>
                </div>

                {/* --- RIGHT: TOOLS + CHEVRONS --- */}
                <div className="flex items-center gap-1 z-[1002] relative">

                    {/* Tools Toggle (Moved to Right) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleTools?.();
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors mr-1 ${showTools
                            ? 'bg-neutral-100 dark:bg-white/10 text-black dark:text-white'
                            : 'text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                    </button>

                    {/* Minimize (Down) - Left of the pair */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (mode === 'full') onModeChange('standard');
                            else if (mode === 'standard') onModeChange('micro');
                            else if (mode === 'micro') onModeChange('nano');
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors ${mode === 'nano' ? 'opacity-20 pointer-events-none' : ''}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                    </button>

                    {/* Maximize (Up) - Right of the pair */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (mode === 'nano') onModeChange('micro');
                            else if (mode === 'micro') onModeChange('standard');
                            else if (mode === 'standard') onModeChange('full');
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors ${mode === 'full' ? 'opacity-20 pointer-events-none' : ''}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 15l-6-6-6 6" /></svg>
                    </button>
                </div>
            </div>

            {/* BODY: MessageStream (Visible in all modes) + Input (Hidden in Nano) */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-900 pointer-events-auto w-full max-w-full">
                <MessageStream />
                {mode !== 'nano' && <InputController autoFocus={mode !== 'full'} />}
            </div>
        </div>
    );
}
