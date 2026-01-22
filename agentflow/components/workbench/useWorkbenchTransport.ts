import { useEffect, useMemo, useRef } from 'react';
import { CanvasTransport } from '@/lib/gate3/transport';
import type { RequestContext } from '@/lib/gate3/transport';
import { useConsoleContext } from './ConsoleContext';

export function useWorkbenchTransport(canvasId: string, contextOverrides?: Partial<RequestContext>) {
    const transport = useRef<CanvasTransport | null>(null);
    const { baseContext, transportConfig, setConnectionStatus } = useConsoleContext();

    const context = useMemo<RequestContext>(() => {
        const requestId = contextOverrides?.request_id
            || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

        return {
            ...baseContext,
            ...contextOverrides,
            request_id: requestId,
            surface_id: contextOverrides?.surface_id ?? baseContext.surface_id ?? canvasId,
        } as RequestContext;
    }, [baseContext, contextOverrides, canvasId]);

    useEffect(() => {
        if (!transport.current) {
            transport.current = new CanvasTransport({
                ...transportConfig,
                context,
            });
        }
        transport.current.connect(canvasId);
        setConnectionStatus(transport.current.getStatus());
        const statusTimer = setInterval(() => {
            if (transport.current) setConnectionStatus(transport.current.getStatus());
        }, 1000);

        return () => {
            clearInterval(statusTimer);
            transport.current?.disconnect();
            setConnectionStatus({ sse: 'disconnected', ws: 'disconnected' });
        };
    }, [canvasId, context, transportConfig, setConnectionStatus]);

    return transport.current;
}
