import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ToolEvent, ToolTarget, ToolOp } from '../types/ToolEvent';
import { CanvasScope } from '../types/CanvasContext';

// We rely on the consumer injecting a registry, or we use a default
export interface ToolDefinition {
    id: string;
    label: string;
    type: 'slider' | 'toggle' | 'select' | 'color';
    defaultValue?: any;
}

export type ToolControlState = Record<string, any>;

interface ToolControlContextValue {
    state: ToolControlState;
    registry: Record<string, ToolDefinition>;
    scope: CanvasScope;
    updateTool: (toolId: string, op: ToolOp, value?: any) => void;
    useToolState: <T>(toolId: string, defaultValue: T) => [T, (next: T) => void];
}

const ToolControlContext = createContext<ToolControlContextValue | undefined>(undefined);

function keyOf(scope: CanvasScope, toolId: string) {
    // Format: "multi21:atom:node_123:font.size"
    return `${scope.surfaceId}:${scope.scope}:${scope.entityId || 'global'}:${toolId}`;
}

export function ToolControlProvider({
    children,
    scope,
    initialState = {},
    registry = {},
    onUpdateTool
}: {
    children: React.ReactNode;
    scope: CanvasScope;
    initialState?: ToolControlState;
    registry?: Record<string, ToolDefinition>;
    onUpdateTool?: (target: ToolTarget, op: ToolOp, value?: any) => void;
}) {
    const [state, setState] = useState<ToolControlState>(initialState);

    const updateTool = useCallback(
        (toolId: string, op: ToolOp, value?: any) => {
            const target: ToolTarget = {
                surfaceId: scope.surfaceId,
                scope: scope.scope,
                entityId: scope.entityId,
                toolId
            };

            // In a real harness, we might dispatch this event to the RealtimeBridge too
            console.debug('[ToolControl] Update', target, op, value);
            onUpdateTool?.(target, op, value);

            const key = keyOf(scope, toolId);
            setState(prev => {
                const current = prev[key];
                let nextVal = value;
                // Basic reducer logic
                if (op === 'increment') nextVal = (current ?? 0) + (typeof value === 'number' ? value : 1);
                if (op === 'decrement') nextVal = (current ?? 0) - (typeof value === 'number' ? value : 1);
                if (op === 'toggle') nextVal = !current;

                return { ...prev, [key]: nextVal };
            });
        },
        [scope],
    );

    const useToolStateHook = useCallback(
        <T,>(toolId: string, defaultValue: T): [T, (next: T) => void] => {
            const ctx = useContext(ToolControlContext);
            if (!ctx) throw new Error('useToolState must be used within ToolControlProvider');

            const k = keyOf(ctx.scope, toolId);
            const val = (ctx.state[k] ?? defaultValue) as T;

            const setter = useMemo(() => {
                return (next: T) => ctx.updateTool(toolId, 'setValue', next);
            }, [toolId, ctx.updateTool]); // scope is implicit in updateTool closure

            return [val, setter];
        },
        [],
    );

    const value: ToolControlContextValue = {
        state,
        registry,
        scope,
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

export function useToolState<T>(toolId: string, defaultValue: T) {
    const ctx = useToolControl();
    return ctx.useToolState(toolId, defaultValue);
}
