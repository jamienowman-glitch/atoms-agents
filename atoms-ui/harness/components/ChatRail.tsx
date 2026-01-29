import React, { useState, useEffect } from 'react';
import { useToolControl } from '../context/ToolControlContext';
import { ToolPop } from '../../muscles/ToolPop/ToolPop';
import { ToolPill } from '../../muscles/ToolPill/ToolPill';

// Nano -> Micro -> Standard -> Full
export type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

export function ChatRail() {
    const { transport } = useToolControl();
    const [mode, setMode] = useState<ChatMode>('nano');
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    // ToolPop State (Wired)
    const [isToolPopOpen, setIsToolPopOpen] = useState(false);

    // Listen to Stream
    useEffect(() => {
        if (!transport) return;
        const cleanup = transport.onEvent((event) => {
            if ((event.type as string) === 'chat.message') {
                setMessages(prev => [...prev, (event as any).data]);
            }
        });
        return cleanup;
    }, [transport]);

    const handleSend = async () => {
        if (!transport || !inputText.trim()) return;
        await transport.postMessage('thread_1', inputText);
        setInputText('');
    };

    // Layout Calculation
    const getHeight = () => {
        switch (mode) {
            case 'full': return 'h-[92vh]';
            case 'standard': return 'h-[50vh]';
            case 'micro': return 'h-[180px]';
            default: return 'h-[60px]';
        }
    };

    return (
        <>
            {/* ToolPop: Renders ABOVE the rail, strictly wired to appear "from the top of the chat rail" */}
            <div className={`fixed inset-x-0 bottom-0 z-[40] transition-transform duration-300 ease-out`}
                style={{
                    transform: `translateY(${isToolPopOpen ? `-${getHeight() === 'h-[60px]' ? '60px' : '50vh'}` : '100%'})`,
                    height: '300px' // Example height
                }}
            >
                <div className="w-full h-full bg-neutral-900 border-t border-white/10 p-4 rounded-t-2xl shadow-xl">
                    {/* Tool Harness Content Here */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-white font-bold">ToolPop</div>
                        <button onClick={() => setIsToolPopOpen(false)} className="text-neutral-400">Close</button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-xs text-white">Tool 1</div>
                        <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-xs text-white">Tool 2</div>
                    </div>
                </div>
            </div>

            {/* ChatRail Shell */}
            <div className={`fixed bottom-0 inset-x-0 bg-neutral-950 border-t border-white/10 transition-all duration-300 z-[50] rounded-t-2xl shadow-2xl flex flex-col ${getHeight()}`}>

                {/* Header Bar (Nano) */}
                <div
                    className="flex items-center justify-between p-4 h-[60px] cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                    onClick={() => mode === 'nano' ? setMode('micro') : null}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm font-medium text-white/90 tracking-wide">Northstar Agent</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Toggle ToolPop Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsToolPopOpen(!isToolPopOpen); }}
                            className={`p-2 rounded-lg transition-colors ${isToolPopOpen ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10 text-neutral-400'}`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                            </svg>
                        </button>

                        {/* Expand/Collapse */}
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            {mode !== 'nano' && <button onClick={() => setMode(prev => prev === 'full' ? 'standard' : prev === 'standard' ? 'micro' : 'nano')} className="p-1 hover:bg-white/10 rounded">▼</button>}
                            {mode !== 'full' && <button onClick={() => setMode(prev => prev === 'nano' ? 'micro' : prev === 'micro' ? 'standard' : 'full')} className="p-1 hover:bg-white/10 rounded">▲</button>}
                        </div>
                    </div>
                </div>

                {/* Content Area (Micro+) */}
                {mode !== 'nano' && (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-white/10'}`}>
                                    {m.content}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <input
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Message agent..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
