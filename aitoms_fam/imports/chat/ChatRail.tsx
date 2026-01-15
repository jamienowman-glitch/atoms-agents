"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ChatAction, ChatMessage, ChatMode, StreamingState } from './types';
import { ChatLayout } from './ChatLayout';
import { ChatInput } from './ChatInput';
import { StreamingIndicator } from './StreamingIndicator';
import { useTracking } from '../../hooks/useTracking';

interface ChatRailProps {
    messages?: ChatMessage[];
    mode?: ChatMode;
    streamingState?: StreamingState;
    strategyState?: string;
    onSend?: (text: string) => void;
    onAction?: (message: ChatMessage, action: ChatAction) => void;
    onModeChange?: (mode: ChatMode) => void;
    onAttach?: () => void;
    onThreeWise?: () => void;
    onFireRefine?: () => void;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
    { id: '1', role: 'agent', content: 'Hey! I pulled your latest campaign numbers. CTR is up 3.1% WoW.', timestamp: '09:20' },
    { id: '2', role: 'human', content: 'Nice. Can we push to TikTok next?', timestamp: '09:22' },
    { id: '3', role: 'agent', content: 'Sure. I will prep a plan, run 3-Wise, then request Strategy Lock before publishing.', timestamp: '09:23' },
];

const MODES: { id: ChatMode; label: string }[] = [
    { id: 'nano', label: 'Nano' },
    { id: 'micro', label: 'Micro' },
    { id: 'standard', label: 'Standard' },
    { id: 'full', label: 'Full' },
];

export function ChatRail({
    messages,
    mode,
    streamingState = 'idle',
    strategyState = 'Planning',
    onSend,
    onAction,
    onModeChange,
    onAttach,
    onThreeWise,
    onFireRefine,
}: ChatRailProps) {
    const { trackEvent } = useTracking({ surfaceId: 'surface-chat' });
    const [internalMode, setInternalMode] = useState<ChatMode>(mode || 'standard');
    const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(messages || DEFAULT_MESSAGES);

    useEffect(() => {
        if (mode) {
            setInternalMode(mode);
        }
    }, [mode]);

    useEffect(() => {
        if (messages) {
            setInternalMessages(messages);
        }
    }, [messages]);

    const resolvedMode = mode || internalMode;
    const sourceMessages = messages || internalMessages;

    const visibleMessages = useMemo(() => {
        if (resolvedMode === 'nano') {
            const lastAgent = [...sourceMessages].reverse().find(msg => msg.role === 'agent');
            return lastAgent ? [lastAgent] : sourceMessages.slice(-1);
        }
        if (resolvedMode === 'micro') {
            return sourceMessages.slice(-1);
        }
        return sourceMessages;
    }, [resolvedMode, sourceMessages]);

    const handleModeChange = (next: ChatMode) => {
        if (!mode) {
            setInternalMode(next);
        }
        onModeChange?.(next);
        trackEvent({
            surfaceId: 'surface-chat',
            eventName: 'chat_mode_changed',
            props: { atomId: 'atom-chat-rail', mode: next },
        });
    };

    const handleSend = (text: string) => {
        onSend?.(text);
        if (!messages) {
            setInternalMessages(prev => [...prev, { id: `local-${Date.now()}`, role: 'human', content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
        trackEvent({
            surfaceId: 'surface-chat',
            eventName: 'message_sent',
            props: { atomId: 'atom-chat-send', length: text.length },
        });
    };

    const handleAction = (message: ChatMessage, action: ChatAction) => {
        onAction?.(message, action);
        trackEvent({
            surfaceId: 'surface-chat',
            eventName: 'chat_action',
            props: { atomId: `atom-chat-action-${action}`, role: message.role },
        });
    };

    const showHeaderIndicator = resolvedMode === 'nano' || resolvedMode === 'micro';

    return (
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900" data-atom-id="atom-chat-rail" data-surface-id="surface-chat">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Strategy</span>
                    <span
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                        data-atom-id="atom-chat-strategy-state"
                    >
                        {strategyState}
                    </span>
                    {showHeaderIndicator && <StreamingIndicator state={streamingState} compact />}
                </div>
                <div className="flex items-center gap-1" data-atom-id="atom-chat-mode-switcher">
                    {MODES.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleModeChange(item.id)}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                resolvedMode === item.id
                                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                            data-atom-id={`atom-chat-mode-${item.id}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <ChatLayout mode={resolvedMode} messages={visibleMessages} onAction={handleAction} />

            <div className="flex flex-col gap-3">
                {!showHeaderIndicator && <StreamingIndicator state={streamingState} />}
                {resolvedMode !== 'nano' && (
                    <ChatInput
                        mode={resolvedMode}
                        onSend={handleSend}
                        onAttach={() => {
                            onAttach?.();
                            trackEvent({ surfaceId: 'surface-chat', eventName: 'chat_action', props: { atomId: 'atom-chat-attach-nexus' } });
                        }}
                        onThreeWise={() => {
                            onThreeWise?.();
                            trackEvent({ surfaceId: 'surface-chat', eventName: 'chat_action', props: { atomId: 'atom-chat-3wise-trigger' } });
                        }}
                        onFireRefine={() => {
                            onFireRefine?.();
                            trackEvent({ surfaceId: 'surface-chat', eventName: 'chat_action', props: { atomId: 'atom-chat-fire-refine' } });
                        }}
                    />
                )}
            </div>
        </div>
    );
}
