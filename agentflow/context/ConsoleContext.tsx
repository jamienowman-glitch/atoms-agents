import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// SSE Event Type from Northstar Engine
interface ConsoleEvent {
    type: string;
    payload?: any;
    data?: any; // Legacy
    timestamp: string;
}

interface ConsoleContextType {
    events: ConsoleEvent[];
    isConnected: boolean;
    lastEvent: ConsoleEvent | null;
}

const ConsoleContext = createContext<ConsoleContextType>({
    events: [],
    isConnected: false,
    lastEvent: null
});

// Mock URL for Wireframe Prep - would be environment var in real app
const SSE_URL = "http://localhost:8000/realtime/sse/timeline";

export const ConsoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<ConsoleEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState<ConsoleEvent | null>(null);

    useEffect(() => {
        let eventSource: EventSource | null = null;

        try {
            // Check if EventSource is available (browser env)
            if (typeof window !== 'undefined' && 'EventSource' in window) {
                eventSource = new EventSource(SSE_URL);

                eventSource.onopen = () => {
                    setIsConnected(true);
                    console.log("Console Connected to Northstar Engine");
                };

                eventSource.onmessage = (e) => {
                    if (e.data === "[DONE]") return;
                    try {
                        const event = JSON.parse(e.data);
                        setLastEvent(event);
                        setEvents(prev => [...prev, event]);
                    } catch (err) {
                        console.error("SSE Parse Error", err);
                    }
                };

                eventSource.onerror = () => {
                    setIsConnected(false);
                    eventSource?.close();
                };
            }
        } catch (e) {
            console.error("Console Connection Failed", e);
        }

        return () => {
            eventSource?.close();
        };
    }, []);

    return (
        <ConsoleContext.Provider value={{ events, isConnected, lastEvent }}>
            {children}
        </ConsoleContext.Provider>
    );
};

export const useConsole = () => useContext(ConsoleContext);
