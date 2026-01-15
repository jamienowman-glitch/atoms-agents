import React, { useEffect, useRef, useState } from 'react';
import { ToolConfig, ToolOption } from '../../../types/multi21-tools';

interface ToolButtonProps {
    tool: ToolConfig;
    activeOptionId?: string;
    onSelectOption: (toolId: string, optionId: string) => void;
    onOpenPopup: (tool: ToolConfig) => void;
}

const LONG_PRESS_MS = 400;

export function ToolButton({ tool, activeOptionId, onSelectOption, onOpenPopup }: ToolButtonProps) {
    const [pressing, setPressing] = useState(false);
    const timer = useRef<number>();

    const options = tool.options || [];
    const currentIndex = options.findIndex(o => o.id === activeOptionId);

    const clear = () => {
        if (timer.current) {
            window.clearTimeout(timer.current);
            timer.current = undefined;
        }
        setPressing(false);
    };

    const handleCycle = () => {
        if (!options.length) return;
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0;
        onSelectOption(tool.id, options[nextIndex].id);
    };

    const handlePressStart = () => {
        setPressing(true);
        timer.current = window.setTimeout(() => {
            handleCycle();
            clear();
        }, LONG_PRESS_MS);
    };

    const handlePressEnd = () => {
        if (pressing && timer.current) {
            // short press: open popup
            onOpenPopup(tool);
        }
        clear();
    };

    useEffect(() => clear, []);

    const label = tool.label || tool.id;
    const activeLabel = activeOptionId ? options.find(o => o.id === activeOptionId)?.label : options.find(o => o.isDefault)?.label;

    return (
        <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-sm"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={clear}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onContextMenu={e => {
                e.preventDefault();
                handleCycle();
            }}
        >
            {tool.icon}
            <span className="font-medium">{label}</span>
            {activeLabel && <span className="text-xs text-neutral-500">{activeLabel}</span>}
        </button>
    );
}
