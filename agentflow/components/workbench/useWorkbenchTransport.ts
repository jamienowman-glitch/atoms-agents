import { useRef, useEffect } from 'react';
import { CanvasTransport } from '@/lib/gate3/transport';

export function useWorkbenchTransport(canvasId: string, context: any) {
    const transport = useRef<CanvasTransport | null>(null);

    useEffect(() => {
        if (!transport.current) {
            transport.current = new CanvasTransport({
                httpHost: '/api', // Proxied
                wsHost: 'ws://localhost:8000/api', // Proxied
                token: 'stub-token', // TODO: Auth
                context,
                useFetchSSE: true
            });
        }
        transport.current.connect(canvasId);
        return () => transport.current?.disconnect();
    }, [canvasId, context]);

    return transport.current;
}
