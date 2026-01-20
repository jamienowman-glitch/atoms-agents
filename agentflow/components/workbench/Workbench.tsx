// =============================================================================
// Workbench.tsx
// The new root orchestrator for the AgentFlow visual environment.
// =============================================================================
"use client";

import React, { useEffect } from 'react';
import { BuilderShell } from '../../app/nx-marketing-agents/core/multi21/BuilderShell';
import { useToolControl } from '../../context/ToolControlContext';
import { GraphLens } from '../lenses/GraphLens';
import { CanvasLens } from '../lenses/CanvasLens/CanvasLens';
import { VideoLens } from '../lenses/VideoLens';
import { LensType, GraphNode, NodeType } from '../../lib/LensRegistry';
import { getCanvasTypeForNode, CanvasType } from '../../lib/CanvasRegistry';
import { RegistryManager } from '../registry/RegistryManager';

export function Workbench() {
    // We wrapped Workbench content in BuilderShell at the top level?
    // Wait, BuilderShell PROVIDES the context. So we must use BuilderShell to wrap inner content.
    // But we need access to `useToolState` inside here to manage routing?
    // Yes. So we might need a `WorkbenchInner` component.

    return (
        <BuilderShell showGraphControls={true}>
            <WorkbenchInner />
        </BuilderShell>
    );
}

function WorkbenchInner() {
    const { useToolState } = useToolControl();

    // Lens State
    const [activeLens, setActiveLens] = useToolState<LensType>({
        target: { surfaceId: 'multi21.designer', toolId: 'activeLens' },
        defaultValue: 'graph_lens'
    });

    // Registry State (God Mode)
    const [showRegistry, setShowRegistry] = useToolState<boolean>({
        target: { surfaceId: 'multi21.designer', toolId: 'show_registry' },
        defaultValue: false
    });

    // Node State (Which Node is "Active/Open"?)
    const [activeNode, setActiveNode] = React.useState<GraphNode | null>(null);

    const handleNodeOpen = (node: GraphNode) => {
        console.log('[Workbench] Opening Node:', node.type, node.id);
        const canvasType = getCanvasTypeForNode(node.type);

        if (canvasType) {
            setActiveNode(node);
            setActiveLens('canvas_lens');
        } else {
            console.log('No specific canvas for this node type');
        }
    };

    // Render Active Lens
    const renderLens = () => {
        switch (activeLens) {
            case 'graph_lens':
                return (
                    <GraphLens
                        canvasId="default"
                        onNodeOpen={handleNodeOpen}
                    />
                );
            case 'canvas_lens':
                // Determine which canvas to show based on activeNode
                const canvasType = activeNode ? getCanvasTypeForNode(activeNode.type) : 'page_canvas';

                return <CanvasLens activeCanvas={canvasType || 'page_canvas'} />;

            // Legacy / Other
            case 'video_lens':
                // Redirect video_lens to canvas_lens with video_canvas for now, or keep separate if needed.
                // But Registry says video_node -> video_canvas.
                // If activeLens is manually set to 'video_lens' (e.g. from debug), we might want to support it,
                // or just route it through CanvasLens.
                return <CanvasLens activeCanvas="video_canvas" />;
            case 'log_lens':
                return <div className="p-10 text-center">Log Lens Placeholder</div>;
            default:
                return (
                    <GraphLens
                        canvasId="default"
                        onNodeOpen={handleNodeOpen}
                    />
                );
        }
    };

    return (
        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 relative z-0">
            {renderLens()}
            {showRegistry && <RegistryManager onClose={() => setShowRegistry(false)} />}
        </div>
    );
}
