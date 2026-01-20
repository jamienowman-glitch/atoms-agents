// =============================================================================
// GraphLens.tsx
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LensRegistry, GraphFlow, GraphNode, NodeType, GraphEdge, Lens, createDefaultNode } from '../../lib/LensRegistry';
import { NodeViewRegistry } from '../../lib/multi21/NodeViewRegistry';
import { GraphTokenEditor } from '../../app/nx-marketing-agents/core/multi21/lenses/GraphTokenEditor'; // Keeping original path for now

// Mocks for missing APIs
const CanvasApi = { getSSEUrl: (id: string) => '' };
const TokenApi = { getCatalog: async (id: string) => [] };

interface GraphLensProps {
    deviceMode?: 'desktop' | 'mobile';
    canvasId?: string;
    onNodeSelect?: (nodeId: string | null) => void;
    onNodeOpen?: (node: GraphNode) => void;
}

export const GraphLens: React.FC<GraphLensProps> = ({ deviceMode = 'desktop', canvasId = 'default', onNodeSelect, onNodeOpen }) => {
    const [currentLensId, setCurrentLensId] = useState('agent_flow');
    const [flow, setFlow] = useState<GraphFlow | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedFramework, setSelectedFramework] = useState<GraphNode | null>(null);
    const [lenses, setLenses] = useState<Lens[]>([]);
    const [catalog, setCatalog] = useState<any[]>([]);

    // Interaction State
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [connectingStart, setConnectingStart] = useState<{ nodeId: string, portType: 'in' | 'out', x: number, y: number } | null>(null);
    const [connectingMouse, setConnectingMouse] = useState<{ x: number, y: number } | null>(null);
    const [dragType, setDragType] = useState<NodeType | null>(null);

    const lastPoint = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync Selection
    useEffect(() => {
        if (onNodeSelect) {
            onNodeSelect(selectedNodeId);
        }
    }, [selectedNodeId, onNodeSelect]);

    // Initial Load
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
                setFlow({ nodes: [], edges: [], lens_registry_refs: [], token_sets: [] });
            }

            if (loadedLenses) setLenses(loadedLenses);
            if (loadedCatalog) setCatalog(loadedCatalog);
        };
        load();
    }, [canvasId]);

    // Shortcuts
    useEffect(() => {
        if (deviceMode === 'mobile') return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;
                deleteNode(selectedNodeId);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, flow, deviceMode]);

    const deleteNode = async (id: string) => {
        if (!flow) return;
        setFlow(prev => {
            if (!prev) return null;
            return {
                ...prev,
                nodes: prev.nodes.filter(n => n.id !== id),
                edges: prev.edges.filter(e => e.source !== id && e.target !== id)
            };
        });
        setSelectedNodeId(null);
    };

    // --- Global Event Listeners ---
    useEffect(() => {
        if (deviceMode === 'mobile') return;

        const handleGlobalMove = (e: PointerEvent) => {
            if (!flow) return;

            if (isPanning) {
                const dx = e.clientX - lastPoint.current.x;
                const dy = e.clientY - lastPoint.current.y;
                setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
                lastPoint.current = { x: e.clientX, y: e.clientY };
                return;
            }

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
                setDraggingNodeId(null);
            }
            if (isPanning) setIsPanning(false);
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
    }, [isPanning, draggingNodeId, connectingStart, transform, flow, canvasId, deviceMode]);

    // --- Interaction ---
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (deviceMode === 'mobile') return;
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const delta = -e.deltaY * zoomSensitivity;
            const newScale = Math.min(Math.max(0.1, transform.k + delta), 4);
            setTransform(prev => ({ ...prev, k: newScale }));
        } else {
            setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    }, [transform, deviceMode]);

    const handleBgPointerDown = (e: React.PointerEvent) => {
        if (deviceMode === 'mobile') return;
        if (!e.isPrimary) return;
        const target = e.target as HTMLElement;
        const isBg = target.className.includes('canvas-bg');
        if (isBg) {
            setIsPanning(true);
            lastPoint.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
        if (deviceMode === 'mobile') return;
        e.stopPropagation();
        if (!e.isPrimary || e.button !== 0) return;
        setSelectedNodeId(nodeId);
        setDraggingNodeId(nodeId);
        lastPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handleNodeDoubleClick = (e: React.MouseEvent, node: GraphNode) => {
        e.stopPropagation();
        if (onNodeOpen) {
            onNodeOpen(node);
        }
    };

    const handlePortPointerDown = (e: React.PointerEvent, nodeId: string, type: 'in' | 'out', x: number, y: number) => {
        if (deviceMode === 'mobile') return;
        e.stopPropagation();
        if (!e.isPrimary || e.button !== 0) return;
        setConnectingStart({ nodeId, portType: type, x, y });
        setConnectingMouse({ x, y });
    };

    const handlePortPointerUp = async (e: React.PointerEvent, nodeId: string, type: 'in' | 'out') => {
        if (deviceMode === 'mobile') return;
        e.stopPropagation();
        if (connectingStart && connectingStart.nodeId !== nodeId) {
            const newEdge: GraphEdge = {
                id: "e-" + crypto.randomUUID().split('-')[0],
                source: connectingStart.nodeId,
                target: nodeId
            };
            setFlow(prev => prev ? { ...prev, edges: [...prev.edges, newEdge] } : null);
        }
        setConnectingStart(null);
        setConnectingMouse(null);
    };

    const handleDrop = async (e: React.DragEvent) => {
        if (deviceMode === 'mobile') return;
        e.preventDefault();
        if (!dragType || !flow || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;
        const graphX = (rawX - transform.x) / transform.k;
        const graphY = (rawY - transform.y) / transform.k;
        const newNode = createDefaultNode(dragType, graphX, graphY);
        setFlow({ ...flow, nodes: [...flow.nodes, newNode] });
        setDragType(null);
    };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };

    // Layout Rendering Helpers
    const getPortPos = (node: GraphNode, type: 'in' | 'out') => {
        let w = 120; let h = 60;
        if (node.type === 'framework_node') { w = 200; h = 180; }
        if (node.type === 'agent_node') { w = 80; h = 80; }
        if (node.type === 'blackboard_node') { w = 220; h = 100; }
        if (node.type === 'header') { w = 300; h = 50; }

        const y = node.y + h / 2;
        const x = type === 'in' ? node.x : node.x + w;
        return { x, y };
    };

    const renderNodeInstance = (node: GraphNode) => {
        const props = { ...node.data, data: node.data };
        const ViewComponent = NodeViewRegistry[node.type];
        if (!ViewComponent) return <div className="p-2 border border-red-500 bg-red-100 text-xs">Unknown: {node.type}</div>;

        if (node.type === 'framework_node') {
            return <ViewComponent {...props} onNestedAgentsClick={() => setSelectedFramework(node)} />;
        }
        return <ViewComponent {...props} />;
    };

    if (!flow) return <div className="p-4 text-center text-neutral-500">Loading Flow...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', touchAction: 'none' }}>
            {/* Header / Toolbar */}
            <div style={{ padding: '8px 20px', borderBottom: '1px solid #eee', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', fontSize: '14px' }}>Graph Lens</h3>
                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">{deviceMode.toUpperCase()}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Desktop Toolbar */}
                {deviceMode === 'desktop' && (
                    <div style={{ width: '60px', borderRight: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '16px', zIndex: 10 }}>
                        {['agent_node', 'framework_node', 'blackboard_node', 'task_node', 'header'].map(t => (
                            <ToolbarItem key={t} type={t as NodeType} onDragStart={() => setDragType(t as NodeType)} />
                        ))}
                    </div>
                )}

                {/* Main Canvas Area */}
                <div
                    ref={containerRef}
                    className="canvas-bg"
                    style={{
                        flex: 1, position: 'relative', overflow: deviceMode === 'mobile' ? 'auto' : 'hidden',
                        cursor: deviceMode === 'desktop' && isPanning ? 'grabbing' : (deviceMode === 'desktop' ? 'grab' : 'default'),
                        background: '#f9f9f9',
                        backgroundImage: deviceMode === 'desktop' ? 'radial-gradient(#ccc 1px, transparent 1px)' : 'none',
                        backgroundSize: '20px 20px'
                    }}
                    onWheel={handleWheel}
                    onPointerDown={handleBgPointerDown}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {/* --- MOBILE VIEW: VERTICAL STACK --- */}
                    {deviceMode === 'mobile' && (
                        <div className="flex flex-col gap-4 p-4 pb-32">
                            {flow.nodes.map(node => (
                                <div key={node.id} onClick={() => setSelectedNodeId(node.id)}>
                                    {renderNodeInstance(node)}
                                </div>
                            ))}
                            {flow.nodes.length === 0 && <div className="text-center text-neutral-400 py-10">No nodes in graph. Switch to desktop to add.</div>}
                        </div>
                    )}


                    {/* --- DESKTOP VIEW: PAN/ZOOM GRAPH --- */}
                    {deviceMode === 'desktop' && (
                        <div className="world-layer" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute' }}>

                            {/* Wires */}
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                                {flow.edges.map(edge => {
                                    const source = flow.nodes.find(n => n.id === edge.source);
                                    const target = flow.nodes.find(n => n.id === edge.target);
                                    if (!source || !target) return null;
                                    const s = getPortPos(source, 'out');
                                    const t = getPortPos(target, 'in');
                                    return <path key={edge.id} d={`M ${s.x} ${s.y} C ${s.x + 50} ${s.y}, ${t.x - 50} ${t.y}, ${t.x} ${t.y}`} stroke="#999" strokeWidth="2" fill="none" />;
                                })}
                                {connectingStart && connectingMouse && (
                                    <path d={`M ${connectingStart.x} ${connectingStart.y} L ${connectingMouse.x} ${connectingMouse.y}`} stroke="#2196F3" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                            </svg>

                            {/* Nodes */}
                            {flow.nodes.map(node => {
                                const inPort = getPortPos(node, 'in');
                                const outPort = getPortPos(node, 'out');
                                const isSelected = selectedNodeId === node.id;
                                return (
                                    <div key={node.id}
                                        style={{ position: 'absolute', left: node.x, top: node.y, zIndex: 1 }}
                                    >
                                        <div
                                            onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                                            onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                            onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
                                            style={{ outline: isSelected ? '2px solid #2196F3' : 'none', cursor: 'grab' }}
                                        >
                                            {renderNodeInstance(node)}
                                        </div>
                                        {/* Ports */}
                                        <div className="w-3 h-3 bg-neutral-500 rounded-full border border-white absolute -left-1.5 top-1/2 -translate-y-1/2 cursor-crosshair"
                                            onPointerDown={(e) => handlePortPointerDown(e, node.id, 'in', inPort.x, inPort.y)}
                                            onPointerUp={(e) => handlePortPointerUp(e, node.id, 'in')}
                                        />
                                        <div className="w-3 h-3 bg-neutral-500 rounded-full border border-white absolute -right-1.5 top-1/2 -translate-y-1/2 cursor-crosshair"
                                            onPointerDown={(e) => handlePortPointerDown(e, node.id, 'out', outPort.x, outPort.y)}
                                            onPointerUp={(e) => handlePortPointerUp(e, node.id, 'out')}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Inspector - Shared */}
                {selectedNodeId && deviceMode === 'desktop' && (
                    <div style={{ width: '300px', borderLeft: '1px solid #eee', background: 'white', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h4 className="font-bold text-sm">Inspector</h4>
                            <button onClick={() => setSelectedNodeId(null)}>×</button>
                        </div>
                        <GraphTokenEditor tokens={flow.nodes.find(n => n.id === selectedNodeId)?.data} />
                    </div>
                )}
            </div>

            {/* Zoom Controls (Desktop) */}
            {deviceMode === 'desktop' && (
                <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <button onClick={() => setTransform(p => ({ ...p, k: p.k + 0.1 }))} style={{ width: 30, height: 30, background: 'white', border: '1px solid #ccc' }}>+</button>
                    <button onClick={() => setTransform(p => ({ ...p, k: p.k - 0.1 }))} style={{ width: 30, height: 30, background: 'white', border: '1px solid #ccc' }}>-</button>
                </div>
            )}
        </div>
    );
};

const ToolbarItem: React.FC<{ type: NodeType, onDragStart: () => void }> = ({ type, onDragStart }) => (
    <div draggable onDragStart={onDragStart} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, cursor: 'grab', background: '#fff' }}>
        {type.substring(0, 2).toUpperCase()}
    </div>
);
