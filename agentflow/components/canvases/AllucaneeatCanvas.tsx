import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
    BackgroundVariant,
    SelectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CanvasTransport } from '@/lib/gate3/transport';
import { useToolControl } from '../../context/ToolControlContext';
import { DualMagnifier, MagnetItem } from '../workbench/DualMagnifier';
import { ToolPop } from '@/app/nx-marketing-agents/core/multi21/ToolPop';

// --- Types ---
export interface AllucaneeatCanvasProps {
    transport: CanvasTransport | null;
}

// --- Universal Slider (Local Implementation) ---
interface UniversalSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}
const UniversalSlider: React.FC<UniversalSliderProps> = ({ value, min, max, step = 1, onChange }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e && e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        const rawValue = min + percentage * (max - min);
        let stepped = Math.round(rawValue / step) * step;
        stepped = Math.max(min, Math.min(max, stepped));
        onChange(stepped);
    };
    return (
        <div
            ref={trackRef}
            onClick={handleInteract}
            onTouchMove={handleInteract}
            onTouchStart={handleInteract}
            className="relative w-full h-8 flex items-center group cursor-pointer touch-none select-none"
        >
            <div className="absolute w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-600 rounded-full" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
            </div>
            <div
                className="absolute w-4 h-4 bg-white rounded-full shadow-sm transform -translate-x-1/2 pointer-events-none transition-transform duration-75"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
            />
        </div>
    );
};

// --- Mock Data ---
const initialNodes: Node[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Atoms.Fam' }, style: { background: '#fff', color: '#000', border: '1px solid #333', width: 150, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' } },
    { id: '2', position: { x: -100, y: 100 }, data: { label: '=MC²' }, style: { background: '#fff', color: '#000', border: '1px solid #333', width: 150, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' } },
    { id: '3', position: { x: 100, y: 100 }, data: { label: 'AGNˣ' }, style: { background: '#fff', color: '#000', border: '1px solid #333', width: 150, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' } },
];
const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#444' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#444' } },
];

function AllucaneeatCanvasInner({ transport }: AllucaneeatCanvasProps) {
    const { useToolState, updateTool } = useToolControl();
    const reactFlowInstance = useReactFlow();

    // -- State --
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Tools
    const [layoutMode, setLayoutMode] = useToolState<string>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'magnifier.layout' }, defaultValue: 'grid' });
    const [zoomLevel, setZoomLevel] = useToolState<number>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'magnifier.zoom' }, defaultValue: 1 });
    const [activeEntityId, setActiveEntityId] = useToolState<string | null>({ target: { surfaceId: 'allucaneeat.designer', toolId: 'activeEntityId' }, defaultValue: null });

    // Node Dimensions (from selection)
    const [nodeWidth, setNodeWidth] = useState(150);
    const [nodeHeight, setNodeHeight] = useState(50);

    // -- Effects --

    // Update Zoom when tool changes
    useEffect(() => {
        reactFlowInstance.zoomTo(zoomLevel);
    }, [zoomLevel, reactFlowInstance]);

    // Selection Sync
    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setActiveEntityId(node.id);
        const w = parseInt(node.style?.width as string) || 150;
        const h = parseInt(node.style?.height as string) || 50;
        setNodeWidth(w);
        setNodeHeight(h);
    }, [setActiveEntityId]);

    const onPaneClick = useCallback(() => {
        setActiveEntityId(null);
    }, [setActiveEntityId]);

    // Handle Node Resize via Sliders
    const updateNodeDimensions = (w: number, h: number) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === activeEntityId) {
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            width: w,
                            height: h,
                        },
                    };
                }
                return node;
            })
        );
        // Emitting spatial update
        if (activeEntityId && transport) {
            transport.sendSpatialUpdate({
                atom_id: activeEntityId,
                bounds: { x: 0, y: 0, w: w, h: h, z: 0 },
                atom_metadata: { canvas_id: 'allucaneeat', canvas_type: 'org_chart' },
                media_payload: { sidecars: [] }
            });
        }
    };

    // Tool Maps
    const layoutOptions: MagnetItem[] = [
        { id: 'grid', label: 'Grid', icon: <span className="font-bold text-[10px]">GRID</span> },
        { id: 'dots', label: 'Dots', icon: <span className="font-bold text-[10px]">DOTS</span> },
    ];

    const zoomOptions: MagnetItem[] = [
        { id: '0.5', label: '50%', icon: <span className="font-bold text-[10px]">50%</span> },
        { id: '1', label: '100%', icon: <span className="font-bold text-[10px]">100%</span> },
        { id: '1.5', label: '150%', icon: <span className="font-bold text-[10px]">150%</span> },
        { id: '2', label: '200%', icon: <span className="font-bold text-[10px]">200%</span> },
    ];

    return (
        <div className="w-full h-full bg-neutral-950 text-white relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
                className="bg-neutral-950"
                proOptions={{ hideAttribution: true }}
                selectionMode={SelectionMode.Partial}
            >
                <Background
                    variant={layoutMode === 'dots' ? BackgroundVariant.Dots : BackgroundVariant.Lines}
                    color="#222"
                    gap={20}
                />
            </ReactFlow>

            {/* Permanent Bottom Controls (Mimicking ToolPop Logic for Surface) */}
            <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40">
                <DualMagnifier
                    activeMode={layoutMode}
                    onModeSelect={setLayoutMode}
                    activeTool={zoomLevel.toString()}
                    onToolSelect={(val) => setZoomLevel(parseFloat(val))}
                    toolOptions={zoomOptions}
                    modeOptions={layoutOptions}
                />
            </div>

            {/* Contextual Tool Pop (Shared Component) */}
            {activeEntityId && (
                <div className="fixed bottom-48 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 w-80">
                    <ToolPop
                        atomId={activeEntityId}
                        initialWidth={nodeWidth}
                        initialHeight={nodeHeight}
                        initialOpacity={100}
                        transport={transport}
                        onValuesChange={({ width, height }) => {
                            setNodeWidth(width);
                            setNodeHeight(height);
                            updateNodeDimensions(width, height);
                        }}
                    />
                </div>
            )}

        </div>
    );
}

export const AllucaneeatCanvas = (props: AllucaneeatCanvasProps) => (
    <ReactFlowProvider>
        <AllucaneeatCanvasInner {...props} />
    </ReactFlowProvider>
);
