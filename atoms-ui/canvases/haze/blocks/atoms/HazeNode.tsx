import React from 'react';

interface HazeNodeProps {
    label: string;
}

export const HazeNode: React.FC<HazeNodeProps> = ({ label }) => {
    return (
        <div className="w-32 h-40 bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-lg p-3 flex flex-col gap-2 shadow-2xl hover:border-blue-500/50 transition-colors group">
            <div className="w-full h-20 bg-neutral-800/50 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Node</div>
            <div className="text-sm font-bold text-neutral-200">{label}</div>
        </div>
    );
};
