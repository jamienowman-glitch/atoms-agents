"use client";

import React, { useCallback, useState } from 'react';
import { ChatMode } from './types';

interface ChatInputProps {
    mode: ChatMode;
    onSend: (text: string) => void;
    onAttach?: () => void;
    onThreeWise?: () => void;
    onFireRefine?: () => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    mode,
    onSend,
    onAttach,
    onThreeWise,
    onFireRefine,
    disabled = false,
    placeholder = 'Type a message...',
}: ChatInputProps) {
    const [value, setValue] = useState('');

    const handleSend = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setValue('');
    }, [onSend, value]);

    return (
        <div
            className={`w-full rounded-xl border border-neutral-200 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900 ${
                mode === 'nano' ? 'p-2' : 'p-3'
            }`}
            data-surface-id="surface-chat"
            data-atom-id="atom-chat-input"
        >
            <div className="flex items-end gap-3">
                <button
                    type="button"
                    onClick={onAttach}
                    disabled={disabled}
                    className="flex h-10 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    aria-label="Attach to Nexus"
                    data-atom-id="atom-chat-attach-nexus"
                >
                    Nexus
                </button>
                <div className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-inner transition focus-within:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900">
                    <textarea
                        className="min-h-[48px] w-full resize-none bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-600"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-label="Chat input"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onThreeWise}
                        disabled={disabled}
                        className="flex h-10 items-center rounded-lg border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                        data-atom-id="atom-chat-3wise-trigger"
                    >
                        3-Wise
                    </button>
                    <button
                        type="button"
                        onClick={onFireRefine}
                        disabled={disabled}
                        className="flex h-10 items-center rounded-lg border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                        data-atom-id="atom-chat-fire-refine"
                    >
                        Fire/Refine
                    </button>
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={disabled}
                        className="flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                        data-atom-id="atom-chat-send"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
