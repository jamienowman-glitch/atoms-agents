import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ChatMessage {
    id: string;
    text: string;
    type: 'user' | 'agent' | 'system' | 'error';
    actor?: string; // 'AI', 'User'
    ts?: string;
    visibility?: 'public' | 'internal';
}

interface ChatContextValue {
    messages: ChatMessage[];
    sendMessage: (text: string) => void;
    isStreaming: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children, initialMessages = [] }: { children: React.ReactNode; initialMessages?: ChatMessage[] }) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isStreaming, setIsStreaming] = useState(false);

    const sendMessage = useCallback((text: string) => {
        // Optimistic update
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text,
            type: 'user',
            actor: 'User',
            ts: new Date().toISOString(),
            visibility: 'public'
        };
        setMessages(prev => [...prev, userMsg]);
        setIsStreaming(true);

        // In a real implementation, this would emit to the socket via the Bridge
        console.log('[ChatContext] Sending:', text);

        // Mock reply for now
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: `Echo: ${text}`,
                type: 'agent',
                actor: 'AI',
                ts: new Date().toISOString(),
                visibility: 'public'
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsStreaming(false);
        }, 1000);
    }, []);

    return (
        <ChatContext.Provider value={{ messages, sendMessage, isStreaming }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used within ChatProvider');
    return ctx;
}
