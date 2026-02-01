import React, { useState } from 'react';
import { useChat } from '@harnesses/Mother/harness/ChatContext';

const Icons = {
    Notes: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h10" /><path d="M4 11h10" /><path d="M4 15h7" /><path d="M14 3h5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3" /></svg>,
    Scales: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="M6 7h12" /><path d="M6 7l-3 6h6l-3-6z" /><path d="M18 7l-3 6h6l-3-6z" /></svg>,
    Alarm: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="6" /><path d="M12 10v3l2 2" /><path d="M5 5l2 2" /><path d="M19 5l-2 2" /></svg>,
    Forward: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8" /><path d="M12 8l4 4-4 4" /><path d="M4 4h6a4 4 0 0 1 4 4v1" /></svg>,
    Todo: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="M4 6l1.5 1.5L7 6" /><path d="M4 12l1.5 1.5L7 12" /><path d="M4 18l1.5 1.5L7 18" /></svg>,
    LockOpen: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V8a5 5 0 0 1 9.5-2" /><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M12 15v2" /></svg>,
    LockClosed: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /><path d="M12 15v2" /></svg>,
};

const formatTime = (ts?: string) => {
    if (!ts) return 'now';
    const parsed = new Date(ts);
    if (Number.isNaN(parsed.getTime())) return 'now';
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MessageStream = () => {
    const { messages } = useChat();
    const [locked, setLocked] = useState<Record<string, boolean>>({});
    const visibleMessages = messages.filter(message => message.visibility !== 'internal');
    const hasMessages = visibleMessages.length > 0;

    const renderMessage = (msg: typeof visibleMessages[number]) => (
        <div key={msg.id} className="flex gap-3 w-full max-w-full">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] font-bold shrink-0 border border-neutral-700">
                {msg.actor ? msg.actor.charAt(0).toUpperCase() : 'AI'}
            </div>
            <div className="flex flex-col gap-1 max-w-[calc(100%-48px)] group">
                <div className="bg-neutral-800/50 p-3 rounded-2xl rounded-tl-sm text-neutral-300 text-sm leading-relaxed border border-white/5">
                    <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="uppercase tracking-wide">{msg.type}</span>
                    <span className="text-neutral-500">•</span>
                    <span>{formatTime(msg.ts)}</span>
                </div>
                {msg.type === 'agent' && (
                    <div className="flex items-center gap-2 text-neutral-200/80 transition-opacity px-1 pl-2 border-l border-white/10">
                        <button className="text-white/70 hover:text-white transition-colors" title="Notes">
                            <Icons.Notes />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors" title="Justice Scales">
                            <Icons.Scales />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors" title="Alarm">
                            <Icons.Alarm />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors" title="Forward">
                            <Icons.Forward />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors" title="Todo">
                            <Icons.Todo />
                        </button>
                        <button
                            className={`ml-1 text-white/80 hover:text-white transition-colors ${locked[msg.id] ? 'text-white' : ''}`}
                            title={locked[msg.id] ? 'Locked' : 'Unlocked'}
                            onClick={() => setLocked(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                        >
                            {locked[msg.id] ? <Icons.LockClosed /> : <Icons.LockOpen />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-4 overflow-y-auto w-full max-w-full">
            <div className="flex flex-col gap-3 w-full max-w-full">
                {hasMessages ? visibleMessages.map(renderMessage) : (
                    <div className="flex gap-3 w-full max-w-full">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] font-bold shrink-0 border border-neutral-700">AI</div>
                        <div className="flex flex-col gap-1 max-w-[calc(100%-48px)] group">
                            <div className="bg-neutral-800/50 p-3 rounded-2xl rounded-tl-sm text-neutral-300 text-sm leading-relaxed border border-white/5">
                                <p>I can help you navigate the HAZE memory space. Use the controls below.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
