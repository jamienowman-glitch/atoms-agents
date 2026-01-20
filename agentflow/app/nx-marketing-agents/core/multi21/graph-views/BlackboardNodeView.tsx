import React from 'react';

interface BlackboardNodeProps {
    data: any;
    onClick?: () => void;
}

export const BlackboardNodeView: React.FC<BlackboardNodeProps> = ({ data, onClick }) => {
    // Dark Rect
    // w-220px h-100px
    const name = data?.board?.name || 'Blackboard';
    return (
        <div
            className="w-[220px] h-[100px] bg-neutral-900 text-white rounded-lg flex flex-col p-3 shadow-lg hover:bg-neutral-800 transition-colors"
            onClick={onClick}
        >
            <div className="text-xs font-bold uppercase text-neutral-400">Memory Board</div>
            <div className="mt-1 font-serif text-lg">{name}</div>
        </div>
    );
};
