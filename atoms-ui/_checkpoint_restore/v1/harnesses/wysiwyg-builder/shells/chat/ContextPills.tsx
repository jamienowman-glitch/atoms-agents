import React from 'react';

export const ContextPills = ({ mode, collapsedText = "AGENTFAX", expandedText = "AGENTFAX", subText = "I can help you adjust the grid layout..." }: { mode: 'nano' | 'micro' | 'standard' | 'full', collapsedText?: string, expandedText?: string, subText?: string }) => {
    return (
        <div className="flex items-center flex-1 min-w-0 pointer-events-none">
            {mode === 'nano' ? (
                <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-0.5">{collapsedText}</span>
                    <span className="text-sm text-neutral-300 truncate font-light opacity-80">
                        {subText}
                    </span>
                </div>
            ) : (
                <span className="font-semibold text-sm text-neutral-200">{expandedText}</span>
            )}
        </div>
    );
};
