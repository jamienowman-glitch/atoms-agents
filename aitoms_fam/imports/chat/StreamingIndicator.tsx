"use client";

import React from 'react';
import { StreamingState } from './types';

interface StreamingIndicatorProps {
    state: StreamingState;
    label?: string;
    compact?: boolean;
}

const TILES = Array.from({ length: 9 });

export function StreamingIndicator({ state, label = 'Agent', compact = false }: StreamingIndicatorProps) {
    const isActive = state === 'thinking' || state === 'streaming';
    const animationDuration = state === 'streaming' ? '900ms' : '1400ms';
    const tileClass = isActive ? 'animate-pulse' : '';

    return (
        <div
            className={`flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 ${compact ? '' : 'min-w-[160px]'}`}
            data-atom-id="atom-chat-streaming-indicator"
            data-surface-id="surface-chat"
        >
            <div className="grid grid-cols-3 gap-0.5">
                {TILES.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 w-2 rounded-sm bg-neutral-400 dark:bg-neutral-600 ${tileClass}`}
                        style={isActive ? { animationDuration, animationDelay: `${index * 70}ms` } : undefined}
                        aria-hidden="true"
                    />
                ))}
            </div>
            {!compact && (
                <div className="flex flex-col leading-tight">
                    <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Streaming</span>
                    <span className="text-xs font-semibold">
                        {state === 'idle' && `${label} idle`}
                        {state === 'thinking' && `${label} thinking`}
                        {state === 'streaming' && `${label} responding`}
                    </span>
                </div>
            )}
        </div>
    );
}
