export interface Lens {
    id: string;
    name: string;
    order: number;
    description: string;
    nodes: NodeType[];
}

export type NodeType = 'agent_node' | 'framework_node' | 'blackboard_node' | 'task_node' | 'artefact_node' | 'asset_node' | 'router_node' | 'header'; // 'header' kept for existing view compatibility if needed, or replace with logic


export interface TokenSet {
    lens_id: string;
    node_type: NodeType;
    tokens: Record<string, any>; // Token overrides
}

export interface GraphFlow {
    nodes: GraphNode[];
    edges: GraphEdge[];
    lens_registry_refs: string[];
    token_sets: TokenSet[];
}

export interface GraphNode {
    id: string;
    type: NodeType;
    x: number;
    y: number;
    data: any; // Props
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
}

// Local storage keys and mock data removed.


export interface OpRecord {
    op_id: string;
    timestamp: number;
    op_type: 'create_node' | 'move_node' | 'update_node' | 'delete_node';
    entity_id: string;
    payload?: any;
}

const OP_LOG_KEY = 'lens_graph_ops';

import { CanvasApi } from '../client/api';

export class LensRegistry {
    static async getLenses(canvasId: string): Promise<Lens[]> {
        // Assuming lenses are part of the snapshot or a separate endpoint.
        // For now, let's assume they come from the snapshot or we fetch them.
        // Current requirement: "Lenses list comes from Engines (not hardcoded)"
        // If it's part of snapshot, we might need to fetch snapshot first.
        // Let's assume we can get them from snapshot.
        try {
            const snapshot = await CanvasApi.getSnapshot(canvasId);
            // If lenses are in snapshot, return them. Else fallback or specific endpoint?
            // "UI-02 Wire LensGraphView to GET /canvas/{id}/snapshot"
            // "UI-01 Wire LensRegistry to Engines"
            // Let's assume the snapshot contains a 'lenses' field or similar, OR we add a specific call.
            // Since I don't see a specific /lenses endpoint in the recon, I'll bet on the snapshot.
            if (snapshot.lenses) return snapshot.lenses;
            return [];
        } catch (e) {
            console.error("Failed to load lenses", e);
            return [];
        }
    }

    static async loadFlow(canvasId: string): Promise<GraphFlow | null> {
        try {
            return await CanvasApi.getSnapshot(canvasId);
        } catch (e) {
            console.error("Failed to load flow", e);
            return null;
        }
    }

    // saveFlow is REMOVED as per plan (mutations via commands)

    static async logOp(canvasId: string, op_type: OpRecord['op_type'], entity_id: string, payload?: any) {
        // Send command to Engines
        const command = {
            op_type,
            entity_id,
            payload,
            timestamp: Date.now(),
            op_id: crypto.randomUUID()
        };
        try {
            return await CanvasApi.sendCommand(canvasId, command);
        } catch (e) {
            console.error("Command failed", e);
            throw e; // Re-throw to handle in UI (e.g. rollback)
        }
    }

    static exportFlow(flow: GraphFlow): string {
        return JSON.stringify(flow, null, 2);
    }

    static importFlow(json: string): boolean {
        // Import might need to send a "bulk replace" command or similar.
        // For now, just logging warning as wired to engines means "client doesn't just overwrite state arbitrarily"
        console.warn("Import flow not fully wired to Engines bulk update yet");
        return false;
    }
}
