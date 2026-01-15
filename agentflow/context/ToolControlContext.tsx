import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ToolDefinition, TOOL_REGISTRY } from '../lib/multi21/tool-registry';
import { ToolTarget, ToolOp, validateEvent, ToolEvent } from '../lib/multi21/sse-handler';

export type ToolControlState = Record<string, any>;

interface ToolControlContextValue {
    state: ToolControlState;
    registry: Record<string, ToolDefinition>;
    updateTool: (target: ToolTarget, op: ToolOp, value?: any) => void;
    useToolState: <T>(params: { target: ToolTarget; defaultValue: T }) => [T, (next: T) => void];
}

const ToolControlContext = createContext<ToolControlContextValue | undefined>(undefined);

function keyOf(target: ToolTarget) {
    const scope = target.scope || 'global';
    const entity = target.entityId || 'global';
    return `${target.surfaceId}:${scope}:${entity}:${target.toolId}`;
}

export function ToolControlProvider({ children, initialState = {} }: { children: React.ReactNode; initialState?: ToolControlState }) {
    const [state, setState] = useState<ToolControlState>(initialState);
    const registry = useMemo(() => TOOL_REGISTRY, []);

    const updateTool = useCallback(
        (target: ToolTarget, op: ToolOp, value?: any) => {
            const event: ToolEvent = { type: 'tool.update', target, op, value };
            const valid = validateEvent(event, registry);
            if (!valid.ok) {
                console.warn('Invalid tool update', valid.errors);
                return;
            }
            const key = keyOf(target);
            setState(prev => {
                const current = prev[key];
                let nextVal = value;
                if (op === 'increment') nextVal = (current ?? 0) + (typeof value === 'number' ? value : 1);
                if (op === 'decrement') nextVal = (current ?? 0) - (typeof value === 'number' ? value : 1);
                if (op === 'toggle') nextVal = !current;
                return { ...prev, [key]: nextVal };
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
            const setter = (next: T) => ctx.updateTool(target, 'setValue', next);
            return [val, setter];
        },
        [],
    );

    const value: ToolControlContextValue = {
        state,
        registry,
        updateTool,
        useToolState: useToolStateHook,
    };

    return <ToolControlContext.Provider value={value}>{children}</ToolControlContext.Provider>;
}

export function useToolControl() {
    const ctx = useContext(ToolControlContext);
    if (!ctx) throw new Error('useToolControl must be used within ToolControlProvider');
    return ctx;
}
