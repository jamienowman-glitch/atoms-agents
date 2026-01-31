
import React, { createContext, useContext, ReactNode } from 'react';

interface ChatContextType {
    // defined minimal basic types to prevent crashes
    messages: any[];
    sendMessage: (msg: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ChatContext.Provider value={{ messages: [], sendMessage: () => { } }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
