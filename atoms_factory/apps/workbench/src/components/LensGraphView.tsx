import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LensRegistry, GraphFlow, GraphNode, NodeType, GraphEdge, Lens } from '../logic/LensRegistry';
import { NodeViewRegistry } from '../logic/NodeViewRegistry';
import { GraphTokenEditor } from './GraphTokenEditor';
import { CanvasApi, TokenApi, TokenCatalogItem } from '../client/api';

interface LensGraphViewProps {
    deviceMode?: 'desktop' | 'mobile';
    canvasId?: string;
}

const createDefaultNode = (type: NodeType, x: number, y: number): GraphNode => {
    const id = crypto.randomUUID().split('-')[0];
    let data: any = {};
    // Wireframe AgentFlow Token Catalog v0 Defaults
    switch (type) {
        case 'agent_node':
            data = {
                node: {
                    agent: {
                        card_ref: 'agent:default_worker@1.0.0',
                        name_override: 'New Agent',
                        model: { provider_id: 'openai', model_id: 'gpt-4o' },
                        capabilities: { enabled: [] }
                    },
                    exec: { timeout_ms: 60000, retries: { max: 1, backoff_ms: 1000 }, concurrency: 1 }
                }
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
                        // Blackboard separated per user request
                    }
                },
                name: 'New Squad' // Legacy/Display compatibility
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
            data = {
                task: {
                    ref: 'task:generic_task@1.0.0',
                    assignee: { target_kind: 'agent_node', target_id: '' }
                }
            };
            break;
        case 'artefact_node':
            data = {
                artefact: {
                    name: 'New Artefact',
                    format: 'markdown'
                }
            };
            break;
        case 'asset_node':
            data = {
                asset: {
                    name: 'Final Asset',
                    format: 'doc'
                }
            };
            break;
        case 'router_node':
            data = {
                route: {
                    condition: { enabled: true, expr: 'success == true' },
                    gating: { mode: 'on_success' }
                }
            };
            break;
        case 'header':
            data = { title: 'SECTION', subtitle: '' };
            break;
    }
    return { id, type, x, y, data };
};

export const LensGraphView: React.FC<LensGraphViewProps> = ({ deviceMode = 'desktop', canvasId = 'default' }) => {
    const [currentLensId, setCurrentLensId] = useState<string>('agent_flow');
    const [flow, setFlow] = useState<GraphFlow | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedFramework, setSelectedFramework] = useState<GraphNode | null>(null);
    const [lenses, setLenses] = useState<Lens[]>([]);
    const [catalog, setCatalog] = useState<TokenCatalogItem[]>([]);

    // Interaction State
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

    // Connection State (Port based)
    const [connectingStart, setConnectingStart] = useState<{ nodeId: string, portType: 'in' | 'out', x: number, y: number } | null>(null);
    const [connectingMouse, setConnectingMouse] = useState<{ x: number, y: number } | null>(null);

    // Refs for drag/pan math
    const lastPoint = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const [dragType, setDragType] = useState<NodeType | null>(null);

    // Initial Load & SSE
    useEffect(() => {
        const load = async () => {
            const [loadedFlow, loadedLenses, loadedCatalog] = await Promise.all([
                LensRegistry.loadFlow(canvasId),
                LensRegistry.getLenses(canvasId),
                TokenApi.getCatalog(canvasId)
            ]);

            if (loadedFlow) {
                setFlow(loadedFlow);
            } else {
                // Fallback for missing backend/endpoint
                setFlow({ nodes: [], edges: [], lens_registry_refs: [], token_sets: [] });
            }

            if (loadedLenses) setLenses(loadedLenses);
            if (loadedCatalog) setCatalog(loadedCatalog);
        };
        load();

        // SSE Subscription
        const sseUrl = CanvasApi.getSSEUrl(canvasId);
        const evtSource = new EventSource(sseUrl);
        evtSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'snapshot') {
                    setFlow(data.payload);
                } else if (data.type === 'patch') {
                    // TODO: Apply patch? For now just re-fetch or if snapshot is sent, use it.
                    // Assuming snapshot update for simplicity as per requirement "Canvas loads from snapshot and updates from SSE"
                    if (data.snapshot) setFlow(data.snapshot);
                }
            } catch (err) {
                console.error("SSE Error", err);
            }
        };

        return () => evtSource.close();
    }, [canvasId]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;
                deleteNode(selectedNodeId);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, flow]);

    const deleteNode = async (id: string) => {
        if (!flow) return;
        // Optimistic update? Or wait for command?
        // Let's do optimistic for responsiveness, but revert if fail.
        const prevFlow = flow;
        setFlow(prev => {
            if (!prev) return null;
            return {
                ...prev,
                nodes: prev.nodes.filter(n => n.id !== id),
                edges: prev.edges.filter(e => e.source !== id && e.target !== id)
            };
        });
        setSelectedNodeId(null);

        try {
            await LensRegistry.logOp(canvasId, 'delete_node', id);
        } catch (e) {
            console.error("Delete failed, reverting", e);
            setFlow(prevFlow); // Revert
        }
    };

    // --- Global Event Listeners for Reliable Dragging ---
    useEffect(() => {
        const handleGlobalMove = (e: PointerEvent) => {
            if (!flow) return;

            // Pan Logic
            if (isPanning) {
                const dx = e.clientX - lastPoint.current.x;
                const dy = e.clientY - lastPoint.current.y;
                setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
                lastPoint.current = { x: e.clientX, y: e.clientY };
                return;
            }

            // Node Drag Logic - Local UI Only (Sync only on drop)
            if (draggingNodeId) {
                const dx = (e.clientX - lastPoint.current.x) / transform.k;
                const dy = (e.clientY - lastPoint.current.y) / transform.k;
                setFlow(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        nodes: prev.nodes.map(n => {
                            if (n.id === draggingNodeId) {
                                return { ...n, x: n.x + dx, y: n.y + dy };
                            }
                            return n;
                        })
                    };
                });
                lastPoint.current = { x: e.clientX, y: e.clientY };
            }

            // Connection Line Logic
            if (connectingStart) {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    const rawX = e.clientX - rect.left;
                    const rawY = e.clientY - rect.top;
                    const graphX = (rawX - transform.x) / transform.k;
                    const graphY = (rawY - transform.y) / transform.k;
                    setConnectingMouse({ x: graphX, y: graphY });
                }
            }
        };

        const handleGlobalUp = async (e: PointerEvent) => {
            if (draggingNodeId) {
                // Find node to get final pos
                const node = flow?.nodes.find(n => n.id === draggingNodeId);
                if (node) {
                    try {
                        await LensRegistry.logOp(canvasId, 'move_node', draggingNodeId, { x: node.x, y: node.y });
                    } catch (e) {
                        // TODO: Revert move?
                        console.error("Move failed", e);
                    }
                }
                setDraggingNodeId(null);
            }
            if (isPanning) {
                setIsPanning(false);
            }
            if (connectingStart) {
                setConnectingStart(null);
                setConnectingMouse(null);
            }
        };

        if (isPanning || draggingNodeId || connectingStart) {
            window.addEventListener('pointermove', handleGlobalMove);
            window.addEventListener('pointerup', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('pointermove', handleGlobalMove);
            window.removeEventListener('pointerup', handleGlobalUp);
        };
    }, [isPanning, draggingNodeId, connectingStart, transform, flow, canvasId]);


    // --- Interaction Starters ---

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const delta = -e.deltaY * zoomSensitivity;
            const newScale = Math.min(Math.max(0.1, transform.k + delta), 4);
            setTransform(prev => ({ ...prev, k: newScale }));
        } else {
            setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    }, [transform]);

    const handleBgPointerDown = (e: React.PointerEvent) => {
        if (!e.isPrimary) return;
        const target = e.target as HTMLElement;
        const isBg = target.className.includes('canvas-bg') || target.className.includes('canvas-layer');
        const isMiddleClick = e.button === 1;
        const isSpacePan = e.button === 0 && e.shiftKey;
        const isTouchPan = e.pointerType === 'touch' && isBg;

        if (isMiddleClick || isSpacePan || isTouchPan || (e.button === 0 && isBg)) {
            setIsPanning(true);
            lastPoint.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
        e.stopPropagation();
        if (!e.isPrimary || e.button !== 0) return;

        setSelectedNodeId(nodeId);
        setDraggingNodeId(nodeId);
        lastPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handlePortPointerDown = (e: React.PointerEvent, nodeId: string, type: 'in' | 'out', x: number, y: number) => {
        e.stopPropagation();
        if (!e.isPrimary || e.button !== 0) return;

        setConnectingStart({ nodeId, portType: type, x, y });
        setConnectingMouse({ x, y });
    };

    const handlePortPointerUp = async (e: React.PointerEvent, nodeId: string, type: 'in' | 'out') => {
        e.stopPropagation();
        if (connectingStart) {
            if (connectingStart.nodeId !== nodeId) {
                const newEdge: GraphEdge = {
                    id: `e-${crypto.randomUUID().split('-')[0]}`,
                    source: connectingStart.nodeId,
                    target: nodeId
                };

                // Optimistic
                setFlow(prev => prev ? { ...prev, edges: [...prev.edges, newEdge] } : null);

                try {
                    // Assuming create_edge op
                    await LensRegistry.logOp(canvasId, 'update_node' as any, 'edge', { type: 'create_edge', edge: newEdge });
                    // Note: OpType was restricted in Registry, might need to fix typings there or cast.
                    // The contract says: POST /canvas/{id}/commands.
                    // I'll stick to what logOp accepts if possible, or update it.
                    // logOp takes: 'create_node' | 'move_node' | 'update_node' | 'delete_node'
                    // Edges are part of the graph... maybe 'update_node' on the source node? Or is there a 'create_edge'?
                    // For now I will cast or just send 'update_node' with payload.
                } catch (e) { console.error(e); }
            }
            setConnectingStart(null);
            setConnectingMouse(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        if (!dragType || !flow) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;
        const graphX = (rawX - transform.x) / transform.k;
        const graphY = (rawY - transform.y) / transform.k;
        const newNode = createDefaultNode(dragType, graphX, graphY);

        // Optimistic
        setFlow({ ...flow, nodes: [...flow.nodes, newNode] });

        try {
            await LensRegistry.logOp(canvasId, 'create_node', newNode.id, newNode);
        } catch (e) { console.error(e); }

        setDragType(null);
    };

    // TokenEditor handles updates directly via API.
    // Flow/Graph updates will arrive via SSE.
    const handleTokenChange = async (path: string[], value: any) => {
        if (!flow || !selectedNodeId) return;

        // Optimistic
        const updatedNodes = flow.nodes.map(node => {
            if (node.id === selectedNodeId) {
                // Deep update logic?
                // Simple path update for now. 
                // Note: 'path' from TokenEditor is array of keys.
                // We need to clone deep or use structuredClone (if available) or helper.
                // For now, assuming shallow-ish or using lodash set-like logic would be better.
                // Let's implement a simple deep set.
                const newData = JSON.parse(JSON.stringify(node.data));
                let current = newData;
                for (let i = 0; i < path.length - 1; i++) {
                    if (!current[path[i]]) current[path[i]] = {};
                    current = current[path[i]];
                }
                current[path[path.length - 1]] = value;
                return { ...node, data: newData };
            }
            return node;
        });
        setFlow({ ...flow, nodes: updatedNodes });

        // Persist
        // We log 'update_node' with the full replacement data OR a patch?
        // LensRegistry.logOp uses 'update_node'. Payload convention is usually the delta or the new state.
        // Let's send the specific path update as payload so backend can handle partials if smart, 
        // or just the whole data if simple.
        try {
            await LensRegistry.logOp(canvasId, 'update_node', selectedNodeId, { path, value });
        } catch (e) { console.error(e); }
    };

    const handleLensChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setCurrentLensId(e.target.value); };
    const zoomIn = () => setTransform(prev => ({ ...prev, k: Math.min(prev.k + 0.1, 4) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, k: Math.max(prev.k - 0.1, 0.1) }));

    if (!flow) return <div>Loading Flow...</div>;
    const selectedNode = flow.nodes.find(n => n.id === selectedNodeId);
    const worldNodes = flow.nodes.filter(n => n.type !== 'header');
    const headerNodes = flow.nodes.filter(n => n.type === 'header');

    // Helper to calc port pos relative to node
    const getPortPos = (node: GraphNode, type: 'in' | 'out') => {
        let w = 120; let h = 60; // Default matches GenericNodeView minWidth
        if (node.type === 'framework_node') { w = 200; h = 180; }
        if (node.type === 'agent_node') { w = 80; h = 80; } // Restored 80px
        if (node.type === 'blackboard_node') { w = 220; h = 100; }
        if (node.type === 'header') { w = 300; h = 50; }

        const y = node.y + h / 2;
        const x = type === 'in' ? node.x : node.x + w;
        return { x, y };
    };

    // Construct metadata for TokenEditor from catalog
    // We assume catalogTokenKey matches selectedNode properties somehow?
    // TokenEditor expects `metadata` as Record<token_key, { ... }>`
    const currentMetadata = {}; // Transformation logic regarding catalog would go here.
    // For now, passing raw catalog-derived metadata if keys match.
    // We assume 'data' keys are the token keys.
    if (selectedNode) {
        // Filter catalog for this node type?
        catalog.forEach(c => {
            // Basic mapping
            (currentMetadata as any)[c.token_key] = c;
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', touchAction: 'none' }}>
            <div style={{ height: '60px', padding: '0 20px', borderBottom: '1px solid #000', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Lens Graph</h3>
                    <select value={currentLensId} onChange={handleLensChange} style={{ background: 'black', color: 'white', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>
                        {lenses.length > 0 ? lenses.map(l => <option key={l.id} value={l.id}>{l.name}</option>) : <option>Loading...</option>}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ border: '1px solid #000', background: 'white', padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }} onClick={() => {
                        const json = LensRegistry.exportFlow(flow);
                        navigator.clipboard.writeText(json).then(() => alert("Copied!"));
                    }}>EXPORT</button>
                    <button style={{ border: '1px solid #000', background: 'white', padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }} onClick={() => {
                        const json = prompt("Paste Flow JSON:");
                        if (json && LensRegistry.importFlow(json)) {
                            // Import logic warning
                        }
                    }}>IMPORT</button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                {/* Toolbar */}
                <div style={{ width: '60px', borderRight: '1px solid #000', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '20px', zIndex: 10 }}>
                    <ToolbarItem type="agent_node" label="Agent" onDragStart={() => setDragType('agent_node')} />
                    <ToolbarItem type="framework_node" label="Frame" onDragStart={() => setDragType('framework_node')} />
                    <ToolbarItem type="blackboard_node" label="Board" onDragStart={() => setDragType('blackboard_node')} />
                    <ToolbarItem type="task_node" label="Task" onDragStart={() => setDragType('task_node')} />
                    <ToolbarItem type="artefact_node" label="Artf" onDragStart={() => setDragType('artefact_node')} />
                    <ToolbarItem type="asset_node" label="Asset" onDragStart={() => setDragType('asset_node')} />
                    <ToolbarItem type="router_node" label="Route" onDragStart={() => setDragType('router_node')} />
                    <ToolbarItem type="header" label="Head" onDragStart={() => setDragType('header')} />
                </div>

                <div
                    ref={containerRef}
                    className="canvas-bg"
                    style={{
                        flex: 1, position: 'relative', overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'grab',
                        background: '#f9f9f9', backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px', touchAction: 'none'
                    }}
                    onWheel={handleWheel} onPointerDown={handleBgPointerDown} onDragOver={handleDragOver} onDrop={handleDrop}
                >
                    {/* Headers Layer */}
                    <div className="headers-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                        {headerNodes.map(node => (
                            <div key={node.id} style={{ position: 'absolute', top: node.y, left: 20, pointerEvents: 'auto', background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '300px' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}>
                                {renderNodeInstance(node, setSelectedFramework)}
                            </div>
                        ))}
                    </div>

                    {/* World Layer */}
                    <div className="world-layer" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none' }}>

                        {/* Wires Layer */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                            {flow.edges.map(edge => {
                                const source = flow.nodes.find(n => n.id === edge.source);
                                const target = flow.nodes.find(n => n.id === edge.target);
                                if (!source || !target) return null;
                                const s = getPortPos(source, 'out');
                                const t = getPortPos(target, 'in');
                                return <path key={edge.id} d={`M ${s.x} ${s.y} C ${s.x + 50} ${s.y}, ${t.x - 50} ${t.y}, ${t.x} ${t.y}`} stroke="#999" strokeWidth="2" fill="none" />;
                            })}
                            {/* Draft Connection Line */}
                            {connectingStart && connectingMouse && (() => {
                                const s = { x: connectingStart.x, y: connectingStart.y };
                                const t = connectingMouse;
                                return <path d={`M ${s.x} ${s.y} L ${t.x} ${t.y}`} stroke="#2196F3" strokeWidth="2" strokeDasharray="5,5" />;
                            })()}
                        </svg>

                        {worldNodes.map(node => {
                            const inPort = getPortPos(node, 'in');
                            const outPort = getPortPos(node, 'out');
                            const isSelected = selectedNodeId === node.id;
                            return (
                                <div key={node.id}
                                    style={{
                                        position: 'absolute', left: node.x, top: node.y, pointerEvents: 'none',
                                        zIndex: draggingNodeId === node.id ? 100 : 1, touchAction: 'none'
                                    }}
                                >
                                    {/* Node Content */}
                                    <div
                                        onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                                        style={{
                                            pointerEvents: 'auto',
                                            // No simpler selection border needed as Agent/Blackboard have internal styling? 
                                            // Actually let's keep it for visual feedback
                                            outline: isSelected ? '2px solid #2196F3' : 'none',
                                            outlineOffset: '2px',
                                            borderRadius: '12px',
                                            cursor: 'grab'
                                        }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                    >
                                        {renderNodeInstance(node, setSelectedFramework)}
                                    </div>

                                    {/* Ports (Overlays) */}
                                    <div
                                        className="port-in"
                                        onPointerDown={(e) => handlePortPointerDown(e, node.id, 'in', inPort.x, inPort.y)}
                                        onPointerUp={(e) => handlePortPointerUp(e, node.id, 'in')}
                                        style={{
                                            position: 'absolute', left: -6, top: '50%', marginTop: -6,
                                            width: 12, height: 12, borderRadius: '50%', background: '#666', border: '1px solid #fff',
                                            cursor: 'crosshair', pointerEvents: 'auto', zIndex: 101,
                                            visibility: node.type === 'header' ? 'hidden' : 'visible'
                                        }}
                                    />
                                    <div
                                        className="port-out"
                                        onPointerDown={(e) => handlePortPointerDown(e, node.id, 'out', outPort.x, outPort.y)}
                                        onPointerUp={(e) => handlePortPointerUp(e, node.id, 'out')}
                                        style={{
                                            position: 'absolute', right: -6, top: '50%', marginTop: -6,
                                            width: 12, height: 12, borderRadius: '50%', background: '#666', border: '1px solid #fff',
                                            cursor: 'crosshair', pointerEvents: 'auto', zIndex: 101,
                                            visibility: node.type === 'header' ? 'hidden' : 'visible'
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pop-up Inspector (Floating) */}
                {/* Pop-up Inspector (Floating Card) */}
                {selectedNode && (() => {
                    // Position relative to node in screen space
                    const nodeScreenX = selectedNode.x * transform.k + transform.x;
                    const nodeScreenY = selectedNode.y * transform.k + transform.y;
                    // Offset roughly by node width (avg 150 scaled) + padding
                    const leftPos = nodeScreenX + (120 * transform.k) + 20;

                    return (
                        <div style={{
                            position: 'absolute',
                            top: deviceMode === 'mobile' ? 'auto' : nodeScreenY,
                            bottom: deviceMode === 'mobile' ? '0' : 'auto',
                            left: deviceMode === 'mobile' ? '0' : leftPos,
                            right: deviceMode === 'mobile' ? '0' : 'auto',
                            width: deviceMode === 'mobile' ? '100%' : '320px',
                            maxHeight: deviceMode === 'mobile' ? '50vh' : '60vh',
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #ddd'
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
                                <span>Inspector: {selectedNode.type.split('_')[0].toUpperCase()}</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => deleteNode(selectedNode.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', cursor: 'pointer', borderRadius: 4, padding: '4px 8px', fontSize: 10, fontWeight: 600 }}>DELETE</button>
                                    <button onClick={() => setSelectedNodeId(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}>×</button>
                                </div>
                            </div>
                            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                                <GraphTokenEditor tokens={selectedNode.data} onChange={handleTokenChange} metadata={currentMetadata} />
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Zoom Controls */}
            <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <button onClick={zoomIn} style={{ width: 40, height: 40, background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '20px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>+</button>
                <button onClick={zoomOut} style={{ width: 40, height: 40, background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '20px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>-</button>
            </div>

            {/* Nested Agents Drawer - Keeping as Sidebar for now, or should it float too? 
               User only mentioned Inspector. Let's keep frameworks sidebar for now, but handle mobile.
            */}
            {selectedFramework && (
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: deviceMode === 'mobile' ? '100%' : '350px', background: 'white', borderLeft: '1px solid #000', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', zIndex: 30, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Nested Agents</h3>
                        <button onClick={() => setSelectedFramework(null)} style={{ border: '1px solid #ddd', background: 'white', padding: '5px 10px', cursor: 'pointer' }}>Close</button>
                    </div>
                    <div style={{ padding: '20px', overflow: 'auto' }}>
                        <p style={{ marginBottom: '20px', color: '#666' }}>Framework: <strong>{selectedFramework.data.name}</strong></p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[1, 2, 3, 4, 5].map(i => (<li key={i} style={{ padding: '12px', border: '1px solid #eee', marginBottom: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}> <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }}></div> <span>Agent {i}</span> </li>))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const ToolbarItem: React.FC<{ type: NodeType, label: string, onDragStart: () => void }> = ({ type, label, onDragStart }) => (
    <div draggable onDragStart={onDragStart} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, cursor: 'grab', userSelect: 'none', background: '#fff' }} title={`Drag ${label}`}>
        {label.substring(0, 2).toUpperCase()}
    </div>
);

const renderNodeInstance = (node: GraphNode, onFrameworkClick: (n: GraphNode) => void) => {
    const props = { ...node.data };
    const ViewComponent = NodeViewRegistry[node.type];

    if (!ViewComponent) {
        return <div>Unknown Node</div>;
    }

    // Special case props injection
    if (node.type === 'framework_node') {
        return <ViewComponent {...props} onNestedAgentsClick={() => onFrameworkClick(node)} />;
    }

    if (node.type === 'header') {
        return <div style={{ width: '400px' }}> <ViewComponent {...props} /> </div>;
    }

    return <ViewComponent {...props} />;
};
