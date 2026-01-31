import React from 'react';

export const ToolTray = ({ showTools, onToggleTools }: { showTools: boolean, onToggleTools?: () => void }) => {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (onToggleTools) onToggleTools();
            }}
            className={`p-2 rounded-lg transition-all duration-200 pointer-events-auto ${showTools ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            title="Toggle Tools"
        >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        </button>
    );
};
