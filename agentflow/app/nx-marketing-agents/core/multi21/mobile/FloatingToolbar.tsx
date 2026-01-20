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
        const offset = 14;
        const xPercent = corner.endsWith('L') ? '0%' : '-100%';
        const yPercent = corner.startsWith('T') ? '0%' : '-100%';
        // Directional offset: away from the corner
        const xOffset = corner.endsWith('L') ? offset : -offset;
        const yOffset = corner.startsWith('T') ? offset : -offset;

        return {
            position: 'fixed' as const,
            left: centerX,
            top: centerY,
            transform: `translate(calc(${xPercent} + ${xOffset}px), calc(${yPercent} + ${yOffset}px))`,
            transformOrigin: `${corner.endsWith('L') ? 'left' : 'right'} ${corner.startsWith('T') ? 'top' : 'bottom'}`,
            zIndex: 70,
        };
    }, [anchorIconRect, corner]);

    const orientationClass =
        corner === 'BL' || corner === 'BR'
            ? 'flex flex-col-reverse gap-2'
            : 'flex flex-col gap-2';
    const alignmentClass =
        corner.endsWith('L') ? 'items-start' : 'items-end';

    return (
        <div
            style={style}
            className={`transition-all duration-200 ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            data-floating-toolbar
        >
            <div className={`${orientationClass} ${alignmentClass} bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-3 min-w-[180px] max-w-[260px]`}>
                {children}
            </div>
        </div>
    );
}
