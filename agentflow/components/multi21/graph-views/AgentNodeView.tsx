import React from 'react';

interface AgentNodeProps {
    data: any;
    onClick?: () => void;
}

export const AgentNodeView: React.FC<AgentNodeProps> = ({ data, onClick }) => {
    // Circle Shape
    // w-80px h-80px
    const role = data?.manifest?.role || 'Agent';
    return (
        <div
            className="w-[80px] h-[80px] rounded-full bg-white border border-neutral-300 flex items-center justify-center shadow-sm hover:border-blue-500 transition-colors relative overflow-hidden"
            onClick={onClick}
        >
            <div className="text-center p-2">
                <div className="text-[10px] font-bold leading-tight line-clamp-2">{role}</div>
            </div>
        </div>
    );
};
