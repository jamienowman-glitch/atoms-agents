import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    NodeTypes
} from 'reactflow';
import { MaybesNode } from '@canvases/maybes/blocks/atoms/MaybesNode';
import { useMaybesStore } from '@canvases/maybes/logic/store';


// Define node types map
const nodeTypes: NodeTypes = {
    maybes_node: MaybesNode, // We will map specific types inside MaybesNode or separate them later
};

interface MaybesCityProps {
    mode: string;
    transport: any;
}

import { WeatherLayer } from '@canvases/maybes/blocks/molecules/WeatherLayer';

export const MaybesCity: React.FC<MaybesCityProps> = ({ mode, transport }) => {
    const nodes = useMaybesStore((state) => state.nodes);
    const edges = useMaybesStore((state) => state.edges);
    const onNodesChange = useMaybesStore((state) => state.onNodesChange);
    const onEdgesChange = useMaybesStore((state) => state.onEdgesChange);

    // Style token for background (handled by WeatherLayer)
    const backgroundStyle = { backgroundColor: 'transparent' };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <WeatherLayer />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                style={backgroundStyle}
                proOptions={{ hideAttribution: true }} // Optional
            >
                <Background color="#ccc" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
};
