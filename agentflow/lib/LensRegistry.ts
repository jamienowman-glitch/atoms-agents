import React from 'react';

export type LensType = 'graph_lens' | 'canvas_lens' | 'video_lens' | 'log_lens';

export interface WorkbenchTool {
    id: LensType;
    label: string;
    component: React.FC<any>;
}

export type NodeType =
    | 'agent_node'
    | 'framework_node'
    | 'blackboard_node'
    | 'task_node'
    | 'artefact_node'
    | 'asset_node'
    | 'router_node'
    | 'header'
    | 'page_node'
    | 'text_node'
    | 'image_node'
    | 'video_node';

export interface GraphNode {
    id: string;
    type: NodeType;
    x: number;
    y: number;
    data: any;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    edge_id?: string; // Deterministic Hash
}

export interface GraphFlow {
    nodes: GraphNode[];
    edges: GraphEdge[];
    lens_registry_refs: string[];
    token_sets: any[];
}

export interface Lens {
    id: string;
    name: string;
    type: string;
}

export const createDefaultNode = (type: NodeType, x: number, y: number): GraphNode => {
    const id = crypto.randomUUID().split('-')[0];
    let data: any = {};

    switch (type) {
        case 'agent_node':
            data = {
                // The 9 Atoms of Northstar
                manifest: { role: 'New Agent', domain: 'general' }, // 1. Identity
                persona: { voice: 'professional' },                 // 2. Voice
                strengths: { cognitive_style: 'balanced' },         // 3. Cognition
                firearms: { enabled: false },                       // 4. Authority
                skills: [],                                         // 5. Muscles
                scope: { memory_window: 10 },                       // 6. Context
                task: { instruction: '' },                          // 7. Objective
                format: { type: 'text' },                           // 8. Artifact
                eval: { criteria: [] }                              // 9. Judge
            };
            break;
        case 'framework_node':
            data = {
                node: {
                    framework: {
                        kind: 'autogen',
                        nested_agents_count: 0,
                        rounds: { min: 3, max: 7 },
                        discussion: { debate_enabled: false, parallelism_enabled: false },
                    }
                },
                name: 'New Squad'
            };
            break;
        case 'blackboard_node':
            data = {
                board: {
                    name: 'Shared Blackboard',
                    description: '',
                    persistence: { enabled: false }
                }
            };
            break;
        case 'task_node':
            data = { task: { ref: 'task:generic_task@1.0.0', assignee: { target_kind: 'agent_node', target_id: '' } } };
            break;
        case 'artefact_node':
            data = { artefact: { name: 'New Artefact', format: 'markdown' } };
            break;
        case 'asset_node':
            data = { asset: { name: 'Final Asset', format: 'doc' } };
            break;
        case 'router_node':
            data = { route: { condition: { enabled: true, expr: 'success == true' }, gating: { mode: 'on_success' } } };
            break;
        case 'header':
            data = { title: 'SECTION', subtitle: '' };
            break;
        case 'page_node':
            data = { page: { title: 'New Page', slug: 'new-page' } };
            break;
        case 'text_node':
            data = { text: { content: 'New Text', style: 'body', align: 'left' } };
            break;
        case 'image_node':
            data = { image: { url: '', alt: 'New Image', width: 640, height: 360, fit: 'cover' } };
            break;
        case 'video_node':
            data = { video: { title: 'New Video', duration: 0 } };
            break;
    }
    return { id, type, x, y, data };
};

export const LensRegistry = {
    loadFlow: async (canvasId: string): Promise<GraphFlow | null> => {
        // Mock return
        return { nodes: [], edges: [], lens_registry_refs: [], token_sets: [] };
    },
    getLenses: async (canvasId: string): Promise<Lens[]> => {
        return [{ id: 'agent_flow', name: 'Agent Flow', type: 'flow' }];
    },
    logOp: async (canvasId: string, op: string, ...args: any[]) => {
        console.log('LensRegistry.logOp', canvasId, op, args);
    },
    exportFlow: (flow: GraphFlow) => JSON.stringify(flow, null, 2),
    importFlow: (json: string): GraphFlow | null => {
        try { return JSON.parse(json); } catch { return null; }
    }
};
