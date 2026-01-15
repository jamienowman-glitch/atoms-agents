import React, { useState, useRef, useEffect } from 'react';

export interface SubTool {
    id: string;
    icon: React.ReactNode;
    label: string;
}

export interface ToolPillProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    subTools?: SubTool[];
    isActive?: boolean; // Is the main tool active?
    activeSubToolId?: string; // Which sub-tool is selected?
    onSelect?: (toolId: string) => void;
    onSubToolSelect?: (subToolId: string) => void;
    onLongPress?: () => void;
}

const LONG_PRESS_MS = 500;

export const ToolPill: React.FC<ToolPillProps> = ({
    id,
    icon,
    label,
    subTools = [],
    isActive,
    activeSubToolId,
    onSelect,
    onSubToolSelect,
    onLongPress
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle outside click to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePressStart = () => {
        setIsPressing(true);
        timerRef.current = setTimeout(() => {
            if (onLongPress) {
                onLongPress();
                setIsPressing(false); // consume press
            }
        }, LONG_PRESS_MS);
    };

    const handlePressEnd = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (isPressing) {
            // Short tap logic
            if (subTools.length > 0) {
                if (!isExpanded) {
                    setIsExpanded(true);
                    // If we open it, and it's not active, maybe select it? 
                    // Or just showing subtools implies selection.
                    if (onSelect) onSelect(id);
                } else {
                    // Tapping main icon while expanded usually closes it or re-selects main
                    setIsExpanded(false);
                }
            } else {
                if (onSelect) onSelect(id);
            }
        }
        setIsPressing(false);
    };

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative flex flex-col items-center justify-end">
            {/* Expanded Content (The Sausage Body) */}
            {/* We render this *behind* or *morphing* the main button. 
                For simplest CSS implementation: 
                The container grows upwards. */}

            <div className={`
                flex flex-col items-center
                transition-all duration-300 ease-spring
                bg-white dark:bg-neutral-900 
                border-neutral-200 dark:border-neutral-800
                ${isExpanded ? 'shadow-xl border' : 'border-transparent bg-transparent'}
                rounded-full
                absolute bottom-0
                z-10
                overflow-hidden
            `}
                style={{
                    height: isExpanded ? `${(subTools.length + 1) * 48 + 8}px` : '48px', // Approx height calc
                    width: '48px',
                    paddingBottom: isExpanded ? '4px' : '0',
                }}
            >
                {/* Sub Tools List (rendered in reverse order to stack up) */}
                <div className={`flex flex-col-reverse gap-2 mb-12 w-full items-center transition-opacity duration-200 ${isExpanded ? 'opacity-100 delay-100' : 'opacity-0'}`}>
                    {subTools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSubToolSelect) onSubToolSelect(tool.id);
                                // Keep open? Or close? Usually user wants to do one thing.
                                // Let's keep it open for multiple adjustments or close for single shot.
                                // User request "drop down into a shape... where within it you will have different icons". 
                            }}
                            className={`
                                w-8 h-8 flex items-center justify-center rounded-full
                                transition-colors
                                ${activeSubToolId === tool.id
                                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}
                            `}
                            title={tool.label}
                        >
                            {tool.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Trigger Button (Always visible at bottom) */}
            <button
                className={`
                    relative z-20
                    w-12 h-12 flex items-center justify-center rounded-full
                    transition-colors
                    ${isActive && !isExpanded ? 'bg-neutral-100 dark:bg-neutral-800' : ''}
                    ${isExpanded ? 'text-black dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}
                `}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onMouseLeave={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setIsPressing(false);
                }}
            >
                {icon}
            </button>
        </div>
    );
};
