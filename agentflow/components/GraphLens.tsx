import React from 'react';

// Simplified Node for Wireframe Prep
export interface GraphNode {
    id: string;
    position: { x: number, y: number };
    data: any;
    type: string;
}

interface GraphLensProps {
    nodes: GraphNode[];
    deviceMode: 'mobile' | 'desktop';
}

export const GraphLens: React.FC<GraphLensProps> = ({ nodes, deviceMode }) => {
    // GEOMETRY ENGINE: Axis Flip
    // Desktop: Horizontal Canvas (flex-row, overflow-auto or pan-zoom area)
    // Mobile: Vertical Stack (flex-col, touch scrolling)

    const containerClass = deviceMode === 'desktop'
        ? "flex flex-row w-full h-full overflow-auto p-10 gap-8 bg-gray-950"
        : "flex flex-col w-full h-full overflow-y-auto p-4 gap-4 bg-gray-950";

    const nodeClass = deviceMode === 'desktop'
        ? "min-w-[200px] h-[150px] bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg hover:border-blue-500 transition-colors"
        : "w-full min-h-[100px] bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm active:scale-[0.98] transition-transform";

    return (
        <div className={containerClass} id="graph-lens-viewport">
            {nodes.map(node => (
                <div key={node.id} className={nodeClass}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-blue-400 uppercase">{node.type}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow" />
                    </div>
                    <h3 className="text-gray-200 font-bold">{node.data?.label || node.id}</h3>
                    {deviceMode === 'desktop' && (
                        <div className="mt-2 text-xs text-gray-500">
                           x: {node.position.x}, y: {node.position.y}
                        </div>
                    )}
                </div>
            ))}

            {/* Infinite Canvas Placeholder (Desktop) */}
            {deviceMode === 'desktop' && (
                 <div className="min-w-[400px] h-full flex items-center justify-center text-gray-700 border-2 border-dashed border-gray-800 rounded-xl">
                    Double Click to Add Atom
                 </div>
            )}

            {/* "Add" Pill (Mobile) */}
             {deviceMode === 'mobile' && (
                 <button className="w-full py-4 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 font-mono text-sm uppercase">
                    + Add Atom
                 </button>
            )}
        </div>
    );
};
