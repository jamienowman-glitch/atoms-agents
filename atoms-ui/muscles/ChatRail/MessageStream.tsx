import { useChat } from '../../harness/ChatContext';

const Icons = {
    Copy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    Regenerate: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    BadResponse: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>,
};

const formatTime = (ts?: string) => {
    if (!ts) return 'now';
    const parsed = new Date(ts);
    if (Number.isNaN(parsed.getTime())) return 'now';
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MessageStream = () => {
    const { messages } = useChat();
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
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                    <button className="text-neutral-500 hover:text-white transition-colors" title="Copy">
                        <Icons.Copy />
                    </button>
                    <button className="text-neutral-500 hover:text-white transition-colors" title="Retry">
                        <Icons.Regenerate />
                    </button>
                    <button className="text-neutral-500 hover:text-red-400 transition-colors" title="Bad Response">
                        <Icons.BadResponse />
                    </button>
                </div>
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
