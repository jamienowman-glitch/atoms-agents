import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../../harness/ChatContext';

export const InputController = ({ autoFocus = false }: { autoFocus?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState('');
    const { sendMessage } = useChat();

    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [autoFocus]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(text);
        setText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="px-3 py-3 border-t border-white/10 bg-neutral-900 pb-safe w-full max-w-full">
            <div className="flex items-center gap-2 bg-neutral-950 border border-white/10 rounded-full px-4 py-2 focus-within:border-neutral-500 transition-colors w-full max-w-full">
                <img src="/assets/AGENT_STREETWEAR_BLACK.png" alt="Agent Streetwear" className="h-6 w-6 object-contain" />
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message agent..."
                    className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-neutral-500 h-8 min-w-0"
                />
                <button
                    onClick={handleSend}
                    className="p-1.5 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors shrink-0"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
            </div>
        </div>
    );
};
