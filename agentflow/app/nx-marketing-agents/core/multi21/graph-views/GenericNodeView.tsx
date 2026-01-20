import React from 'react';

interface GenericNodeProps {
    data: any;
    label?: string;
    onClick?: () => void;
}

export const GenericNodeView: React.FC<GenericNodeProps> = ({ data, label, onClick }) => {
    // Simple Box
    return (
        <div
            className="w-[120px] h-[60px] bg-white border border-neutral-200 rounded flex items-center justify-center p-2 shadow-sm text-xs font-medium text-center"
            onClick={onClick}
        >
            {label || JSON.stringify(data).slice(0, 10)}
        </div>
    );
};
