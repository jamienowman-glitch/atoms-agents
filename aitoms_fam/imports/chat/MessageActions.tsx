"use client";

import React from 'react';
import { ChatAction } from './types';

interface MessageActionsProps {
    onAction: (action: ChatAction) => void;
    disabled?: boolean;
}

const ACTIONS: { id: ChatAction; label: string; glyph: string; atomId: string }[] = [
    { id: 'strategy-lock', label: 'Strategy Lock', glyph: 'SL', atomId: 'atom-chat-strategy-lock' },
    { id: 'save', label: 'Save', glyph: 'SV', atomId: 'atom-chat-save' },
    { id: '3-wise', label: '3-Wise', glyph: '3W', atomId: 'atom-chat-3wise' },
    { id: 'remind', label: 'Remind', glyph: 'RM', atomId: 'atom-chat-remind' },
    { id: 'undo', label: 'Undo', glyph: 'UN', atomId: 'atom-chat-undo' },
    { id: 'todo', label: 'To-Do', glyph: 'TD', atomId: 'atom-chat-todo' },
];

export function MessageActions({ onAction, disabled = false }: MessageActionsProps) {
    return (
        <div className="mt-2 flex flex-wrap gap-2" data-atom-id="atom-chat-message-actions" data-surface-id="surface-chat">
            {ACTIONS.map(action => (
                <button
                    key={action.id}
                    type="button"
                    onClick={() => onAction(action.id)}
                    disabled={disabled}
                    data-atom-id={action.atomId}
                    className="flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-800"
                >
                    <span aria-hidden="true">{action.glyph}</span>
                    {action.label}
                </button>
            ))}
        </div>
    );
}
