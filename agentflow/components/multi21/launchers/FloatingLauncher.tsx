import React, { useEffect, useRef, useState } from 'react';
import { FloatingLauncherState, LauncherPosition, ViewportSize } from './LauncherTypes';
import { calculateSnapTarget, makeEdgePosition, SNAP_MARGIN } from './LauncherUtils';

const STACK_GAP = 72;
const DRAG_THRESHOLD = 5;

interface FloatingLauncherProps {
    launcher: FloatingLauncherState;
    viewport: ViewportSize;
    onUpdate: (next: FloatingLauncherState) => void;
}

export function FloatingLauncher({ launcher, viewport, onUpdate }: FloatingLauncherProps) {
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
    const dragging = useRef(false);
    const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const computeStyle = (): React.CSSProperties => {
        if (dragPos) {
            return { position: 'fixed', left: dragPos.x, top: dragPos.y, zIndex: 60 };
        }

        const base: React.CSSProperties = { position: 'fixed', zIndex: 60 };
        const pos = launcher.position;
        if (pos.type === 'edge') {
            const idxGap = pos.index * STACK_GAP;
            if (pos.edge === 'left') {
                base.left = SNAP_MARGIN;
                base.top = SNAP_MARGIN + idxGap;
            } else if (pos.edge === 'right') {
                base.right = SNAP_MARGIN;
                base.top = SNAP_MARGIN + idxGap;
            } else if (pos.edge === 'top') {
                base.top = SNAP_MARGIN;
                base.left = SNAP_MARGIN + idxGap;
            } else {
                base.bottom = SNAP_MARGIN;
                base.left = SNAP_MARGIN + idxGap;
            }
        } else {
            base.left = pos.x;
            base.top = pos.y;
        }
        return base;
    };

    const handlePointerDown = (clientX: number, clientY: number) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        dragging.current = true;
        startPoint.current = { x: clientX, y: clientY };
        offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!dragging.current) return;
        setDragPos({ x: clientX - offset.current.x, y: clientY - offset.current.y });
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
        if (!dragging.current) return;
        dragging.current = false;
        const moved = Math.hypot(clientX - startPoint.current.x, clientY - startPoint.current.y);
        if (moved < DRAG_THRESHOLD) {
            setDragPos(null);
            onUpdate({ ...launcher, isOpen: !launcher.isOpen });
            return;
        }
        const snap = calculateSnapTarget(clientX, clientY, viewport);
        const nextPos: LauncherPosition = makeEdgePosition(snap.edge, launcher.position.type === 'edge' ? launcher.position.index : 0);
        setDragPos(null);
        onUpdate({ ...launcher, position: nextPos });
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
        const onUp = (e: MouseEvent) => handlePointerUp(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        const onTouchEnd = (e: TouchEvent) => {
            const t = e.changedTouches[0];
            handlePointerUp(t.clientX, t.clientY);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    });

    return (
        <button
            ref={btnRef}
            className={`w-12 h-12 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-lg flex items-center justify-center transition-transform ${launcher.isOpen ? 'scale-105' : 'scale-100'}`}
            style={computeStyle()}
            onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            onTouchStart={e => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            aria-label={`${launcher.kind} launcher`}
        >
            {launcher.icon}
        </button>
    );
}
