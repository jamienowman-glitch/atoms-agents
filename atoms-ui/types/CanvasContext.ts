import { ToolEvent } from './ToolEvent';

export interface ConnectionConfig {
    httpHost: string;
    wsHost: string;
    token?: string;
}

export interface CanvasScope {
    surfaceId: string;
    entityId?: string;
    scope: 'global' | 'atom' | 'system';
}

export interface CanvasContextValue {
    scope: CanvasScope;
    activeAtomId?: string;
    emit: (event: ToolEvent) => void;
    subscribe: (event: string, callback: (data: any) => void) => () => void;
}
