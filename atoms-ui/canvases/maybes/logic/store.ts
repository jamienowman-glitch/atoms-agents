import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export interface MaybesState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    addNode: (type: string, position: { x: number, y: number }) => void;
    setNodes: (nodes: Node[]) => void;
}

export const useMaybesStore = create<MaybesState>((set, get) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    addNode: (type, position) => {
        const newNode: Node = {
            id: uuidv4(),
            type: `building_${type.toLowerCase()}`, // Maps to building_text, building_audio
            position,
            data: {
                type: `building_${type.toLowerCase()}`,
                content: '',
                timestamp: Date.now()
            },
        };
        set({ nodes: [...get().nodes, newNode] });
    },
    setNodes: (nodes) => set({ nodes }),
}));
