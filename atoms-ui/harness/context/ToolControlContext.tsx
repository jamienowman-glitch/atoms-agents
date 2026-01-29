import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { ToolDefinition } from '../../types/ToolEvent'; // Moved to types? Or just define locally for now
// import { TOOL_REGISTRY } from '../lib/multi21/tool-registry'; // Removed dependency
import { ToolTarget, ToolOp } from '../../types/ToolEvent';
import { CanvasTransport } from '../transport';

// Config - In real app, derived from Env
const TRANSPORT_CONFIG = {
    httpHost: 'http://localhost:8000',
    wsHost: 'ws://localhost:8000',
    token: 'mock_token',
    threadId: 'default_thread',
    context: {
        tenant_id: 't_system',
        mode: 'saas' as const,
        project_id: 'p_default',
        request_id: 'req_init',
        user_id: 'u_me'
    }
};

export type ToolControlState = Record<string, any>;

interface ToolControlContextValue {
    state: ToolControlState;
    registry: Record<string, ToolDefinition>;
    updateTool: (target: ToolTarget, op: ToolOp, value?: any) => void;
    useToolState: <T>(params: { target: ToolTarget; defaultValue: T }) => [T, (next: T) => void];
    transport: CanvasTransport | null;
}

const ToolControlContext = createContext<ToolControlContextValue | undefined>(undefined);

function keyOf(target: ToolTarget) {
    const scope = target.scope || 'global';
    const entity = target.entityId || 'global';
    return `${target.surfaceId}:${scope}:${entity}:${target.toolId}`;
}

export function ToolControlProvider({ children, initialState = {} }: { children: React.ReactNode; initialState?: ToolControlState }) {
    const [state, setState] = useState<ToolControlState>(initialState);
    const registry = useMemo(() => ({}), []);

    // Transport Instance
    const transportRef = useRef<CanvasTransport | null>(null);

    // Initialize Transport
    useEffect(() => {
        transportRef.current = new CanvasTransport(TRANSPORT_CONFIG);
        transportRef.current.connect('canvas_1');

        const cleanup = transportRef.current.onEvent((event) => {
            // Handle events...
        });

        return () => {
            cleanup();
            transportRef.current?.disconnect();
        };
    }, []);

    const updateTool = useCallback(
        (target: ToolTarget, op: ToolOp, value?: any) => {
            const key = keyOf(target);
            setState(prev => {
                const current = prev[key];
                let nextVal = value;
                if (op === 'increment') nextVal = (current ?? 0) + (typeof value === 'number' ? value : 1);
                if (op === 'decrement') nextVal = (current ?? 0) - (typeof value === 'number' ? value : 1);
                if (op === 'toggle') nextVal = !current;

                return { ...prev, [key]: nextVal };
            });

            // Send to backend
            transportRef.current?.sendCommand('canvas_1', {
                base_rev: 0,
                ops: [],
                actor_id: 'u_me',
                correlation_id: crypto.randomUUID(),
                type: 'command',
                command: 'update_tool',
                payload: { target, op, value }
            });
        },
        [registry],
    );

    const useToolStateHook = useCallback(
        <T,>({ target, defaultValue }: { target: ToolTarget; defaultValue: T }): [T, (next: T) => void] => {
            const ctx = useContext(ToolControlContext);
            if (!ctx) throw new Error('useToolState must be used within ToolControlProvider');
            const k = keyOf(target);
            const val = (ctx.state[k] ?? defaultValue) as T;
            const setter = useMemo(() => {
                return (next: T) => ctx.updateTool(target, 'setValue', next);
            }, [k, ctx.updateTool]);
            return [val, setter];
        },
        [],
    );

    const value: ToolControlContextValue = {
        state,
        registry,
        updateTool,
        useToolState: useToolStateHook,
        transport: transportRef.current
    };

    return <ToolControlContext.Provider value={value}>{children}</ToolControlContext.Provider>;
}

export function useToolControl() {
    const ctx = useContext(ToolControlContext);
    if (!ctx) throw new Error('useToolControl must be used within ToolControlProvider');
    return ctx;
}
