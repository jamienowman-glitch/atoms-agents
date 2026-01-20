import React from 'react';

interface PanelProps {
    title: string;
    isFloating?: boolean;
    isMinimised?: boolean;
    onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
    onToggleMinimise?: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export function Panel({
    title,
    isFloating = false,
    isMinimised = false,
    onDragStart,
    onToggleMinimise,
    children,
    style,
}: PanelProps) {
    return (
        <div
            className={`bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-lg rounded-lg overflow-hidden ${isFloating ? 'absolute' : 'relative'} ${isMinimised ? 'max-w-[320px]' : ''}`}
            style={style}
        >
            <div
                className="flex items-center justify-between px-3 py-2 cursor-move bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 select-none"
                onMouseDown={onDragStart as any}
                onTouchStart={onDragStart as any}
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{title}</span>
                </div>
                <button
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100"
                    onClick={onToggleMinimise}
                    aria-label="Minimise"
                >
                    {isMinimised ? '▢' : '–'}
                </button>
            </div>
            {!isMinimised && (
                <div className="p-3 overflow-auto max-h-[70vh]">
                    {children}
                </div>
            )}
        </div>
    );
}
