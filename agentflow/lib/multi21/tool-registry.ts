export type ToolKind = 'slider' | 'toggle' | 'enum' | 'action' | 'text';
export type ValueType = 'int' | 'float' | 'boolean' | 'string' | 'void';

export interface ToolDefinition {
    toolId: string;
    label: string;
    surfaceId: string;
    kind: ToolKind;
    valueType: ValueType;
    allowedOps: string[];
    options?: string[];
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
    'grid.cols_desktop': {
        toolId: 'grid.cols_desktop',
        label: 'Desktop Columns',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'grid.cols_mobile': {
        toolId: 'grid.cols_mobile',
        label: 'Mobile Columns',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'grid.gap_x_desktop': {
        toolId: 'grid.gap_x_desktop',
        label: 'Desktop Gap',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'grid.gap_x_mobile': {
        toolId: 'grid.gap_x_mobile',
        label: 'Mobile Gap',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'grid.tile_radius_desktop': {
        toolId: 'grid.tile_radius_desktop',
        label: 'Desktop Radius',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'grid.tile_radius_mobile': {
        toolId: 'grid.tile_radius_mobile',
        label: 'Mobile Radius',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'feed.query.limit_desktop': {
        toolId: 'feed.query.limit_desktop',
        label: 'Desktop Items',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'feed.query.limit_mobile': {
        toolId: 'feed.query.limit_mobile',
        label: 'Mobile Items',
        surfaceId: 'multi21.designer',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    previewMode: {
        toolId: 'previewMode',
        label: 'Preview Mode',
        surfaceId: 'multi21.designer',
        kind: 'enum',
        valueType: 'string',
        allowedOps: ['setValue', 'selectOption'],
        options: ['desktop', 'mobile'],
    },
    align: {
        toolId: 'align',
        label: 'Align',
        surfaceId: 'multi21.designer',
        kind: 'enum',
        valueType: 'string',
        allowedOps: ['setValue', 'selectOption'],
        options: ['left', 'center', 'right'],
    },
    aspectRatio: {
        toolId: 'aspectRatio',
        label: 'Aspect Ratio',
        surfaceId: 'multi21.designer',
        kind: 'enum',
        valueType: 'string',
        allowedOps: ['setValue', 'selectOption'],
        options: ['square', 'portrait', 'landscape'],
    },
    tileVariant: {
        toolId: 'tileVariant',
        label: 'Tile Variant',
        surfaceId: 'multi21.designer',
        kind: 'enum',
        valueType: 'string',
        allowedOps: ['setValue', 'selectOption'],
        options: ['generic', 'product', 'kpi', 'text'],
    },
    showTitle: {
        toolId: 'showTitle',
        label: 'Show Title',
        surfaceId: 'multi21.designer',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    showMeta: {
        toolId: 'showMeta',
        label: 'Show Meta',
        surfaceId: 'multi21.designer',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    showBadge: {
        toolId: 'showBadge',
        label: 'Show Badge',
        surfaceId: 'multi21.designer',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    showCtaLabel: {
        toolId: 'showCtaLabel',
        label: 'Show CTA Label',
        surfaceId: 'multi21.designer',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    showCtaArrow: {
        toolId: 'showCtaArrow',
        label: 'Show CTA Arrow',
        surfaceId: 'multi21.designer',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    'tile.toggleLock': {
        toolId: 'tile.toggleLock',
        label: 'Tile Lock',
        surfaceId: 'multi21.tile',
        kind: 'toggle',
        valueType: 'boolean',
        allowedOps: ['setValue', 'toggle'],
    },
    'block.setSpanDesktop': {
        toolId: 'block.setSpanDesktop',
        label: 'Block Span Desktop',
        surfaceId: 'multi21.block',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'block.setSpanMobile': {
        toolId: 'block.setSpanMobile',
        label: 'Block Span Mobile',
        surfaceId: 'multi21.block',
        kind: 'slider',
        valueType: 'int',
        allowedOps: ['setValue', 'increment', 'decrement'],
    },
    'block.setTileVariant': {
        toolId: 'block.setTileVariant',
        label: 'Block Tile Variant',
        surfaceId: 'multi21.block',
        kind: 'enum',
        valueType: 'string',
        allowedOps: ['setValue', 'selectOption'],
        options: ['generic', 'product', 'kpi', 'text'],
    },
};

export function getToolDefinition(toolId: string): ToolDefinition | undefined {
    return TOOL_REGISTRY[toolId];
}
