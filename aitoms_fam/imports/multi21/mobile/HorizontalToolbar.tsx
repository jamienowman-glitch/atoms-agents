import React, { useMemo } from 'react';

type Corner = 'TL' | 'TR' | 'BL' | 'BR';

export interface ToolItem {
    id: string;
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    isActive?: boolean;
}

export interface HorizontalToolbarProps {
    tools: ToolItem[];
    anchorIconRect: DOMRect | null;
    corner: Corner;
    isOpen: boolean;
    onClose: () => void;
}

const MARGIN = 12;

export function HorizontalToolbar({ tools, anchorIconRect, corner, isOpen, onClose }: HorizontalToolbarProps) {
    const style = useMemo(() => {
        if (!anchorIconRect) return { display: 'none' } as React.CSSProperties;
        const screenW = typeof window !== 'undefined' ? window.innerWidth : 0;
        const centerY = anchorIconRect.top + anchorIconRect.height / 2;
        const maxWidth = Math.max(160, screenW - anchorIconRect.width - MARGIN * 3);

        const base: React.CSSProperties = {
            position: 'fixed',
            top: centerY,
            transform: 'translateY(-50%)',
            zIndex: 50,
            maxWidth,
        };

        const fromLeft = corner.endsWith('L');
        if (fromLeft) {
            base.left = anchorIconRect.right + MARGIN;
            base.transformOrigin = 'left center';
        } else {
            base.right = Math.max(0, screenW - anchorIconRect.left) + MARGIN;
            base.transformOrigin = 'right center';
        }

        return base;
    }, [anchorIconRect, corner]);

    return (
        <div
            style={style}
            className={`transition-all duration-200 ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-xl backdrop-blur-sm px-3 py-2 flex items-center gap-2 overflow-x-auto">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={tool.onClick}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${tool.isActive ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-transparent text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                    >
                        {tool.icon}
                        {tool.label && <span className="whitespace-nowrap">{tool.label}</span>}
                    </button>
                ))}
                <button
                    onClick={onClose}
                    aria-label="Close toolbar"
                    className="ml-1 px-2 py-1 rounded-full text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
