import React from 'react';

interface AddButtonProps {
    onClick?: () => void;
    label?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick, label = "Add New" }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-black p-4 min-h-[160px] cursor-pointer hover:bg-neutral-50 transition-colors group font-sans w-full"
        >
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="text-black font-bold uppercase tracking-wider text-sm">{label}</span>
        </button>
    );
};
