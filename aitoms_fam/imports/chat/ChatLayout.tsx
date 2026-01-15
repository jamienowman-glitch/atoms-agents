"use client";

import React from 'react';
import { ChatAction, ChatMessage, ChatMode } from './types';
import { MessageActions } from './MessageActions';

interface ChatLayoutProps {
    mode: ChatMode;
    messages: ChatMessage[];
    onAction?: (message: ChatMessage, action: ChatAction) => void;
}

const HEIGHT_BY_MODE: Record<ChatMode, string> = {
    nano: 'max-h-[180px]',
    micro: 'max-h-[260px]',
    standard: 'min-h-[320px] max-h-[60vh]',
    full: 'min-h-[80vh] max-h-[calc(100vh-120px)]',
};

export function ChatLayout({ mode, messages, onAction }: ChatLayoutProps) {
    return (
        <div
            className={`flex w-full flex-col gap-3 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 transition-all dark:border-neutral-800 dark:bg-neutral-950 ${HEIGHT_BY_MODE[mode]}`}
            data-surface-id="surface-chat"
            data-atom-id="atom-chat-thread"
        >
            {messages.map(message => {
                const isHuman = message.role === 'human';
                const alignment = isHuman ? 'items-end text-right' : 'items-start';
                const bubbleStyle = isHuman
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-800';

                return (
                    <div
                        key={message.id}
                        className={`flex flex-col gap-1 ${alignment}`}
                        data-atom-id={`atom-chat-message-${message.role}`}
                    >
                        <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            {isHuman ? 'You' : 'Agent'}
                            {message.timestamp ? ` - ${message.timestamp}` : ''}
                        </div>
                        <div className={`w-fit max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${bubbleStyle}`}>
                            {message.content}
                        </div>
                        {!isHuman && onAction && (
                            <MessageActions onAction={action => onAction(message, action)} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
