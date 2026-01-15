import { ToolDefinition, TOOL_REGISTRY } from './tool-registry';

export interface ToolTarget {
    surfaceId: string;
    scope?: 'global' | 'block' | 'tile';
    entityId?: string;
    toolId: string;
    optionId?: string;
}

export type ToolOp = 'setValue' | 'increment' | 'decrement' | 'selectOption' | 'toggle' | 'invoke';

export interface ToolUpdate {
    target: ToolTarget;
    op: ToolOp;
    value?: any;
}

export interface ToolUpdateEvent {
    type: 'tool.update';
    target: ToolTarget;
    op: ToolOp;
    value?: any;
}

export interface ToolBatchUpdateEvent {
    type: 'tool.batchUpdate';
    updates: ToolUpdate[];
}

export type ToolEvent = ToolUpdateEvent | ToolBatchUpdateEvent;

export interface ValidationResult {
    ok: boolean;
    errors?: string[];
}

function validateUpdate(update: ToolUpdate, registry: Record<string, ToolDefinition>): ValidationResult {
    const errors: string[] = [];
    const def = registry[update.target.toolId];
    if (!def) {
        errors.push(`Unknown toolId: ${update.target.toolId}`);
        return { ok: false, errors };
    }
    if (def.allowedOps && !def.allowedOps.includes(update.op)) {
        errors.push(`Op ${update.op} not allowed for ${def.toolId}`);
    }
    if (def.options && update.op === 'selectOption') {
        if (!update.value || !def.options.includes(update.value)) {
            errors.push(`Option ${update.value} not allowed for ${def.toolId}`);
        }
    }
    return { ok: errors.length === 0, errors: errors.length ? errors : undefined };
}

export function validateEvent(event: ToolEvent, registry: Record<string, ToolDefinition> = TOOL_REGISTRY): ValidationResult {
    if (event.type === 'tool.update') {
        return validateUpdate({ target: event.target, op: event.op, value: event.value }, registry);
    }
    if (event.type === 'tool.batchUpdate') {
        const errors: string[] = [];
        event.updates.forEach(update => {
            const res = validateUpdate(update, registry);
            if (!res.ok && res.errors) errors.push(...res.errors);
        });
        return { ok: errors.length === 0, errors: errors.length ? errors : undefined };
    }
    return { ok: false, errors: ['Unknown event type'] };
}
