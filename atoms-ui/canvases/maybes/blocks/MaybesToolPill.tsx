import React, { useState } from 'react';
import { useToolControl } from '../../../harness/ToolControlProvider';

type MaybesMode = 'TEXT' | 'VOICE' | 'CAMERA';

export function MaybesToolPill() {
    const { updateTool } = useToolControl();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleModeClick = (mode: MaybesMode) => {
        if (mode === 'CAMERA') {
            // Show disabled tooltip
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
            return;
        }

        // Emit canvas_mode to trigger node creation
        updateTool('canvas_mode', 'setValue', mode);
    };

    const buttonClass = "w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95";
    const enabledClass = "bg-white/90 hover:bg-white text-neutral-900 shadow-lg";
    const disabledClass = "bg-neutral-700/50 text-neutral-500 cursor-not-allowed";

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            {/* Vertical Lozenge Container */}
            <div className="flex flex-col gap-2 bg-neutral-900/80 backdrop-blur-sm rounded-full p-2 shadow-2xl border border-white/10">

                {/* TEXT Button */}
                <button
                    onClick={() => handleModeClick('TEXT')}
                    className={`${buttonClass} ${enabledClass}`}
                    aria-label="Add Text Note"
                    title="Add Text Note"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>

                {/* VOICE Button */}
                <button
                    onClick={() => handleModeClick('VOICE')}
                    className={`${buttonClass} ${enabledClass}`}
                    aria-label="Add Voice Note"
                    title="Add Voice Note"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>

                {/* CAMERA Button (Disabled) */}
                <div className="relative">
                    <button
                        onClick={() => handleModeClick('CAMERA')}
                        className={`${buttonClass} ${disabledClass}`}
                        aria-label="Camera (Coming Soon)"
                        title="Camera (Coming Soon)"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
                            Coming Soon
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
