import { useState, useEffect } from 'react';

// MOCK Hook until Transport is fully wired via Context
// This fulfills the "Blind" LoggingLens requirement by providing a stream interface
export function useRealtimeStream() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // In a real implementation, this would subscribe to CanvasTransport
        const interval = setInterval(() => {
            const mockEvents = [
                'System: Connection stabilized (SSE)',
                'Agent: Analyzing viewport...',
                'Safety: Content verified (Pass)',
                'System: Heartbeat (32ms)'
            ];
            const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
            setLogs(prev => [randomEvent, ...prev].slice(0, 50));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return logs;
}
