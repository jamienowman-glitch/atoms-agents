import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// SSE Event Type from Northstar Engine
interface ConsoleEvent {
    type: string;
    payload?: any;
    data?: any; // Legacy
    timestamp: string;
}

// --- IDENTITY TYPES (Phase 7) ---
interface User {
    id: string;
    email: string;
    display_name?: string;
}

interface Tenant {
    id: string;
    name: string;
}

interface ConsoleSurface {
    id: string;
    name: string;
    theme: string;
    surface_id: string;
}

interface ConsoleIdentity {
    user: User;
    tenant: Tenant;
    console: ConsoleSurface;
}

interface ConsoleContextType {
    events: ConsoleEvent[];
    isConnected: boolean;
    lastEvent: ConsoleEvent | null;
    identity: ConsoleIdentity | null;
}

const ConsoleContext = createContext<ConsoleContextType>({
    events: [],
    isConnected: false,
    lastEvent: null,
    identity: null
});

// Mock URL for Wireframe Prep - would be environment var in real app
const SSE_URL = "http://localhost:8000/realtime/sse/timeline";
const BOOTSTRAP_URL = "http://localhost:8000/api/v1/bootstrap";

export const ConsoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<ConsoleEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState<ConsoleEvent | null>(null);
    const [identity, setIdentity] = useState<ConsoleIdentity | null>(null);

    // 1. BOOTSTRAP (Phase 7)
    useEffect(() => {
        const bootstrap = async () => {
            try {
                // In a real app, this ID comes from the Auth Provider (Auth0/Cognito/etc)
                // For Phase 7 Lab/Dev, we hardcode a "seed" user or look for one in localStorage.
                const devUserId = "u_jay_nowman";

                const headers = {
                    "X-User-ID": devUserId,
                    "Content-Type": "application/json"
                };

                const res = await fetch(BOOTSTRAP_URL, { headers });
                if (res.ok) {
                    const data = await res.json();
                    console.log("[Console] Bootstrap Identity:", data);
                    setIdentity(data);
                } else {
                    console.error("[Console] Bootstrap Failed:", res.status);
                }
            } catch (err) {
                console.error("[Console] Bootstrap Error:", err);
            }
        };

        bootstrap();
    }, []);

    // 2. SSE STREAM
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
        <ConsoleContext.Provider value={{ events, isConnected, lastEvent, identity }}>
            {children}
        </ConsoleContext.Provider>
    );
};

export const useConsole = () => useContext(ConsoleContext);
