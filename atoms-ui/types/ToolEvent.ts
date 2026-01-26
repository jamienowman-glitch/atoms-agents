export type ToolOp = 'setValue' | 'toggle' | 'increment' | 'decrement';

export interface ToolTarget {
    surfaceId: string;   // e.g. "multi21.designer" or "canvas_123"
    scope?: 'global' | 'atom' | 'system';
    entityId?: string;   // e.g. "atom_456"
    toolId: string;      // e.g. "font.size"
}

export interface ToolEvent {
    type: 'tool.update';
    target: ToolTarget;
    op: ToolOp;
    value?: any;
}

export interface ToolDefinition {
    id: string;
    label: string;
    type: 'slider' | 'toggle' | 'select' | 'color';
    defaultValue?: any;
    min?: number;
    max?: number;
    step?: number;
    options?: { label: string; value: any }[];
}
