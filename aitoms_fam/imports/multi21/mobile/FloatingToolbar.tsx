import React, { useMemo } from 'react';
import { Corner } from './FloatingIcon';

interface FloatingToolbarProps {
    anchorIconRect: DOMRect | null;
    corner: Corner;
    isOpen: boolean;
    children: React.ReactNode;
}

export function FloatingToolbar({ anchorIconRect, corner, isOpen, children }: FloatingToolbarProps) {
    const style = useMemo(() => {
        if (!anchorIconRect) return { display: 'none' } as React.CSSProperties;

        const centerX = anchorIconRect.left + anchorIconRect.width / 2;
        const centerY = anchorIconRect.top + anchorIconRect.height / 2;

        // Offset from the center of the icon
        const offset = 32;

        // Determine direction based on corner to always point towards center
        // TL -> Right/Down
        // TR -> Left/Down
        // BL -> Right/Up
        // BR -> Left/Up

        // We'll use fixed positioning relative to the viewport
        const style: React.CSSProperties = {
            position: 'fixed' as const,
            zIndex: 50,
        };

        if (corner === 'TL') {
            style.top = centerY;
            style.left = centerX + offset;
            style.transformOrigin = 'left center';
        } else if (corner === 'TR') {
            style.top = centerY;
            style.right = (window.innerWidth - centerX) + offset;
            style.transformOrigin = 'right center';
        } else if (corner === 'BL') {
            style.bottom = (window.innerHeight - centerY);
            style.left = centerX + offset;
            style.transformOrigin = 'left center';
        } else if (corner === 'BR') {
            style.bottom = (window.innerHeight - centerY);
            style.right = (window.innerWidth - centerX) + offset;
            style.transformOrigin = 'right center';
        }

        return style;
    }, [anchorIconRect, corner]);

    // Pill shape container
    return (
        <div
            style={style}
            className={`transition-all duration-200 ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            data-floating-toolbar
        >
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-full p-2">
                {children}
            </div>
        </div>
    );
}
