import { get, set } from 'idb-keyval';
import { Node, Edge } from 'reactflow';
import { useMaybesStore } from '@canvases/maybes/logic/store';

const DB_KEY = 'maybes_nodes_v1';

export const saveLocal = async (nodes: Node[], edges: Edge[]) => {
    try {
        await set(DB_KEY, { nodes, edges, timestamp: Date.now() });
        console.debug('[Persistence] Saved locally');
    } catch (err) {
        console.error('[Persistence] Save failed', err);
    }
};

export const loadLocal = async () => {
    try {
        const data = await get(DB_KEY);
        if (data && data.nodes) {
            useMaybesStore.getState().setNodes(data.nodes);
            // edges...
            console.debug('[Persistence] Loaded locally', data.nodes.length, 'nodes');
        }
    } catch (err) {
        console.error('[Persistence] Load failed', err);
    }
};

// In a real implementation, we would also sync with `transport` here
// e.g. send patches to server
