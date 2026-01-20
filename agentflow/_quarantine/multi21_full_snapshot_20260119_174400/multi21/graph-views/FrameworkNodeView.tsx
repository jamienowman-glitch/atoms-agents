import React from 'react';
import { GraphNode } from '../../../lib/LensRegistry';

interface FrameworkNodeProps {
    data: any;
    onNestedAgentsClick?: () => void;
    onClick?: () => void;
}

export const FrameworkNodeView: React.FC<FrameworkNodeProps> = ({ data, onNestedAgentsClick, onClick }) => {
    // Pentagon Shape
    // w-200px h-180px in LensGraphView logic
    return (
        <div
            className="w-[200px] h-[180px] bg-white border-2 border-neutral-900 flex flex-col items-center justify-center relative shadow-sm hover:shadow-md transition-shadow group"
            style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
            onClick={onClick}
        >
            <div className="font-bold text-sm uppercase tracking-wider mt-4">{data.name || 'SQUAD'}</div>
            <div className="text-[10px] text-neutral-500">{data?.node?.framework?.kind || 'Auto'}</div>

            {/* Action to show nested agents */}
            <button
                onClick={(e) => { e.stopPropagation(); onNestedAgentsClick?.(); }}
                className="mt-2 px-2 py-0.5 bg-neutral-100 rounded text-[9px] hover:bg-neutral-200 pointer-events-auto"
            >
                View Agents
            </button>
        </div>
    );
};
