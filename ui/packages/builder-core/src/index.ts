import { useState, useRef, useEffect } from 'react';
import { CanvasKernel, CanvasState, initialState } from '@northstar/canvas-kernel';
import {
    CanvasTransport,
    SafetyDecisionSummary,
    SafetyResponseError,
} from '@northstar/transport';
import { CanvasOp } from '@northstar/contracts';
import { SCHEMAS } from '@northstar/builder-registry';

const CANVAS_ID = 'shopify-parity-demo';
const ACTOR_ID = 'user-' + Math.random().toString(36).substr(2, 9);

export const useBuilder = () => {
    // Top-Level State
    const [state, setState] = useState<CanvasState>(initialState);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [status, setStatus] = useState('disconnected');
    const [lastSafetyDecision, setLastSafetyDecision] = useState<SafetyDecisionSummary | null>(null);
    const [lastSafetyError, setLastSafetyError] = useState<{ status: number; payload: unknown } | null>(null);

    // Refs
    const kernelRef = useRef<CanvasKernel>(new CanvasKernel());
    const transportRef = useRef<CanvasTransport | null>(null);

    // Init Persistence & Transport
    useEffect(() => {
        // Load LocalStorage
        const saved = localStorage.getItem(CANVAS_ID);
        if (saved) {
            try {
                const loadedState = JSON.parse(saved);
                kernelRef.current = new CanvasKernel(loadedState);
                setState(loadedState);
            } catch (e) {
                console.error("Failed to load save", e);
            }
        }

        // Subscribe to Kernel
        const unsub = kernelRef.current.subscribe(newState => {
            setState({ ...newState });
            localStorage.setItem(CANVAS_ID, JSON.stringify(newState));
        });

        // Transport
        transportRef.current = new CanvasTransport({
            httpHost: '/api',
            wsHost: 'ws://localhost:3000/api', // Proxy handles WS too
            token: 'BUILDER_TOKEN',
            context: {
                tenant_id: 'demo-tenant',
                mode: 'lab',
                project_id: 'demo-project',
                request_id: 'req-' + Math.random().toString(36).substr(2, 9),
                user_id: 'user-' + Math.random().toString(36).substr(2, 9),
            },
            // Gate3 Contract Flags
            wsAuthMode: 'hello_handshake', // Ready for Gate3
            useFetchSSE: true // Default to Contract Mode (Fetch)
        });

        transportRef.current.connect(CANVAS_ID);

        transportRef.current.onEvent(event => {
            if (event.type === 'op_committed') {
                if (event.data.actor_id === ACTOR_ID) {
                    kernelRef.current.ackLocal(event.data.ops.length);
                }
                kernelRef.current.applyRemote(event.data.ops, event.data.rev);
            } else if (event.type === 'system') {
                setStatus(event.data.code);
            } else if (event.type === 'safety_decision') {
                const streamId = event.routing?.canvas_id || event.routing?.thread_id;
                if (!streamId) return;
                setLastSafetyDecision({
                    streamId,
                    action: event.data.action,
                    result: event.data.result,
                    reason: event.data.reason,
                    gate: event.data.gate,
                });
            }
        });

        return () => {
            unsub();
            transportRef.current?.disconnect();
        };
    }, []);

    // --- Actions ---

    const handleOp = async (op: CanvasOp) => {
        kernelRef.current.applyLocal(op);
        setLastSafetyError(null);

        try {
            await transportRef.current?.sendCommand(CANVAS_ID, {
                base_rev: state.revision,
                ops: [op],
                actor_id: ACTOR_ID,
                correlation_id: Math.random().toString(36)
            });
        } catch (e) {
            console.error("Sync failed", e);
            if (e instanceof SafetyResponseError) {
                setLastSafetyError({ status: e.status, payload: e.payload });
            }
        }
    };

    const handleAddSection = (type: string) => {
        const id = 'section-' + Math.random().toString(36).substr(2, 6);
        const schema = SCHEMAS[type];

        const op: CanvasOp = {
            kind: 'add',
            actor_id: ACTOR_ID,
            index: state.rootAtomIds.length,
            parent_id: null,
            atom: {
                id,
                type: type,
                parent_id: null,
                properties: {},
                children: []
            }
        };
        handleOp(op);
        setSelectedId(id);
    };

    const handleAddBlock = (sectionId: string, type: string) => {
        const blockId = 'block-' + Math.random().toString(36).substr(2, 6);
        const section = state.atoms[sectionId];
        if (!section) return;

        const defaultProps: any = {};
        if (type === 'headline-block') defaultProps.text = 'New Heading';
        if (type === 'text-block') defaultProps.text = 'New text block content...';

        const op: CanvasOp = {
            kind: 'add',
            actor_id: ACTOR_ID,
            index: section.children ? section.children.length : 0,
            parent_id: sectionId,
            atom: {
                id: blockId,
                type: type,
                parent_id: sectionId,
                properties: defaultProps,
                children: []
            }
        };
        handleOp(op);
        setSelectedId(blockId);
    };

    const handleDelete = (id: string) => {
        handleOp({ kind: 'remove', actor_id: ACTOR_ID, atom_id: id });
        if (selectedId === id) setSelectedId(null);
    };

    const handleUpdateProperty = (atomId: string, prop: string, value: any) => {
        handleOp({
            kind: 'update',
            actor_id: ACTOR_ID,
            atom_id: atomId,
            properties: { [prop]: value }
        });
    };

    const handleReorder = (newOrderIds: string[]) => {
        newOrderIds.forEach((id, index) => {
            const currentAtom = state.atoms[id];
            const currentIndex = state.rootAtomIds.indexOf(id);

            if (currentIndex !== index) {
                handleOp({
                    kind: 'move',
                    actor_id: ACTOR_ID,
                    atom_id: id,
                    new_parent_id: null,
                    new_index: index
                });
            }
        });
    };

    return {
        state,
        selectedId,
        setSelectedId,
        deviceMode,
        setDeviceMode,
        status,
        handleOp,
        handleAddSection,
        handleAddBlock,
        handleDelete,
        handleUpdateProperty,
        handleReorder,
        lastSafetyDecision,
        lastSafetyError,
    };
};
