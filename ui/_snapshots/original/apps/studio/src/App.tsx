import React, { useEffect, useState, useRef } from 'react';
import { CanvasKernel, CanvasState, initialState } from '@northstar/canvas-kernel';
import { CanvasTransport } from '@northstar/transport';
import { CanvasView } from '@northstar/projections';
import { CanvasOp, Atom } from '@northstar/contracts';
import { runScriptedAgent, AgentPlan } from '@northstar/agent-driver';
import { SCHEMAS } from '@northstar/ui-atoms/src/schemas';
import { Sidebar } from './components/Sidebar';
import { Inspector } from './components/Inspector';
import { CanvasFrame } from './components/CanvasFrame';

// --- Constants ---

const CANVAS_ID = 'shopify-parity-demo';
const ACTOR_ID = 'user-' + Math.random().toString(36).substr(2, 9);

// --- App Shell ---

export const App = () => {
    // Top-Level State
    const [state, setState] = useState<CanvasState>(initialState);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [status, setStatus] = useState('disconnected');

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
                // Reset kernel to this state
                kernelRef.current = new CanvasKernel(loadedState);
                setState(loadedState);
            } catch (e) {
                console.error("Failed to load save", e);
            }
        }

        // Subscribe to Kernel
        const unsub = kernelRef.current.subscribe(newState => {
            setState({ ...newState });
            // Autosave
            localStorage.setItem(CANVAS_ID, JSON.stringify(newState));
        });

        // Transport
        transportRef.current = new CanvasTransport({
            httpHost: 'http://localhost:8000',
            wsHost: 'ws://localhost:8000',
            token: 'BUILDER_TOKEN'
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

        // Send to server (Fire & Forget for MVP UI responsiveness, but logic handles errors)
        try {
            await transportRef.current?.sendCommand(CANVAS_ID, {
                base_rev: state.revision,
                ops: [op],
                actor_id: ACTOR_ID,
                correlation_id: Math.random().toString(36)
            });
        } catch (e) {
            console.error("Sync failed", e);
        }
    };

    const handleAddSection = (type: string) => {
        const id = 'section-' + Math.random().toString(36).substr(2, 6);
        const schema = SCHEMAS[type];

        // Add Section
        const op: CanvasOp = {
            kind: 'add',
            actor_id: ACTOR_ID,
            index: state.rootAtomIds.length,
            parent_id: null,
            atom: {
                id,
                type: type,
                parent_id: null,
                properties: {}, // Defaults handled by Schema
                children: []
            }
        };
        handleOp(op);

        // If schema has default blocks, add them?
        // For MVP, just add the empty section.
        setSelectedId(id);
    };

    const handleAddBlock = (sectionId: string, type: string) => {
        const blockId = 'block-' + Math.random().toString(36).substr(2, 6);
        const section = state.atoms[sectionId];
        if (!section) return;

        // Add propery defaults if needed?
        // Basic defaults are handled by renderer fallback, but let's be cleaner.
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
        // Framer Motion Reorder gives us the new list of items.
        // We need to match this to `move` ops.
        // Simple strategy: Iterate new list, if item.index != newIndex, move it.

        newOrderIds.forEach((id, index) => {
            const currentAtom = state.atoms[id];
            // Find current index in root list (since sidebar only shows roots)
            const currentIndex = state.rootAtomIds.indexOf(id);

            if (currentIndex !== index) {
                // Emit Move Op
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

    // --- Derived State ---

    // Sections only for sidebar
    const sections = state.rootAtomIds.map(id => state.atoms[id]).filter(Boolean);

    const selectedAtom = selectedId ? state.atoms[selectedId] : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Top Bar */}
            <header style={{ height: '50px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', background: '#fff', zIndex: 10 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Northstar Builder</div>

                {/* Device Toggles */}
                <div style={{ display: 'flex', background: '#f1f1f1', borderRadius: '4px', padding: '2px' }}>
                    {(['desktop', 'tablet', 'mobile'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setDeviceMode(mode)}
                            style={{
                                border: 'none',
                                background: deviceMode === mode ? '#fff' : 'transparent',
                                boxShadow: deviceMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textTransform: 'capitalize'
                            }}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <div style={{ fontSize: '12px', color: status === 'disconnected' ? 'red' : 'green' }}>
                    {status === 'disconnected' ? '• Offline' : '• Live'}
                </div>
            </header>

            {/* Main Workspace */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar */}
                <Sidebar
                    sections={sections}
                    atoms={state.atoms}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onAddSection={handleAddSection}
                    onAddBlock={handleAddBlock}
                    onDelete={handleDelete}
                    onReorder={handleReorder}
                />

                {/* Canvas Preview */}
                <CanvasFrame deviceMode={deviceMode}>
                    <CanvasView
                        state={state}
                        selectedAtomIds={selectedId ? [selectedId] : []}
                        onSelectAtom={setSelectedId}
                        onUpdate={handleUpdateProperty}
                        cursors={{}} // No cursors for builder MVP
                    />
                </CanvasFrame>

                {/* Right Inspector */}
                <Inspector
                    atomId={selectedId}
                    type={selectedAtom?.type || null}
                    properties={selectedAtom?.properties || {}}
                    onChange={handleUpdateProperty}
                    onUpload={async (files) => {
                        const file = files[0];
                        return URL.createObjectURL(file);
                    }}
                    onSimulateAgent={async (id, prop, text) => {
                        // 1. Clear existing text
                        handleUpdateProperty(id, prop, "");

                        // 2. Type new text
                        const plan: AgentPlan = [
                            { kind: 'wait', durationMs: 300 },
                            { kind: 'type', atomId: id, text: text, delayMs: 50 }
                        ];

                        await runScriptedAgent(
                            plan,
                            (op) => handleOp({ ...op, actor_id: 'agent-writer' }),
                            () => state
                        );
                    }}
                />
            </div>
        </div>
    );
};
