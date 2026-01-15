import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Corner = 'TL' | 'TR' | 'BL' | 'BR';

interface FloatingIconProps {
    id: string;
    icon: React.ReactNode;
    corner: Corner;
    offset?: { x: number; y: number };
    isToolbarOpen: boolean;
    onTap: () => void;
    onCornerChange: (next: Corner) => void;
    onRectChange?: (rect: DOMRect) => void;
}

const INSET = 24;
const DRAG_THRESHOLD = 6;

export function FloatingIcon({
    icon,
    corner,
    offset = { x: 0, y: 0 },
    isToolbarOpen,
    onTap,
    onCornerChange,
    onRectChange,
}: FloatingIconProps) {
    const ref = useRef<HTMLButtonElement | null>(null);
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const dragging = useRef(false);

    const computeCornerStyle = useMemo(() => {
        if (dragPos) {
            return { left: dragPos.x, top: dragPos.y };
        }
        const base = INSET;
        const style: React.CSSProperties = {};
        if (corner === 'TL') {
            style.top = base + offset.y;
            style.left = base + offset.x;
        } else if (corner === 'TR') {
            style.top = base + offset.y;
            style.right = base - offset.x;
        } else if (corner === 'BL') {
            style.bottom = base - offset.y;
            style.left = base + offset.x;
        } else if (corner === 'BR') {
            style.bottom = base - offset.y;
            style.right = base - offset.x;
        }
        return style;
    }, [corner, offset, dragPos]);

    useEffect(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        onRectChange?.(rect);
    }, [corner, offset, isToolbarOpen, onRectChange]);

    const handlePointerDown = (clientX: number, clientY: number) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        dragging.current = true;
        startPoint.current = { x: clientX, y: clientY };
        dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!dragging.current) return;
        setDragPos({
            x: clientX - dragOffset.current.x,
            y: clientY - dragOffset.current.y,
        });
    };

    const snapCorner = (x: number, y: number): Corner => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 0;
        const h = typeof window !== 'undefined' ? window.innerHeight : 0;
        const left = x < w / 2;
        const top = y < h / 2;
        if (top && left) return 'TL';
        if (top && !left) return 'TR';
        if (!top && left) return 'BL';
        return 'BR';
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
        if (!dragging.current) return;
        dragging.current = false;
        const moved = Math.hypot(clientX - startPoint.current.x, clientY - startPoint.current.y);
        if (moved < DRAG_THRESHOLD) {
            setDragPos(null);
            onTap();
            return;
        }
        const nextCorner = snapCorner(clientX, clientY);
        setDragPos(null);
        onCornerChange(nextCorner);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handlePointerDown(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => handlePointerUp(e.clientX, e.clientY);

    const onTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        handlePointerDown(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0];
        handlePointerMove(t.clientX, t.clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
        const t = e.changedTouches[0];
        handlePointerUp(t.clientX, t.clientY);
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    });

    return (
        <button
            ref={ref}
            className={`fixed z-[60] w-14 h-14 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-lg flex items-center justify-center transition-transform duration-200 ${isToolbarOpen ? 'scale-105' : 'scale-100'}`}
            style={computeCornerStyle}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            data-floating-icon
            aria-label="Floating icon"
        >
            {icon}
        </button>
    );
}
