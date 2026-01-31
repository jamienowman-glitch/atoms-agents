"use client";

import React, { useState, useRef } from 'react';

export function ToolPill({ onClick, isOpen, children }: { onClick?: () => void, isOpen?: boolean, children?: React.ReactNode | ((props: { anchor: 'top' | 'bottom' }) => React.ReactNode) }) {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Offset from initial
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        initialPos.current = { ...position };
        setHasMoved(false);
        // CRITICAL FIX: Capture on the container (currentTarget), NOT the target (which might be SVG)
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setHasMoved(true);
        setPosition({ x: initialPos.current.x + dx, y: initialPos.current.y + dy });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
        if (!hasMoved) onClick?.();
    };


    // Smart Direction Logic
    const [anchor, setAnchor] = useState<'top' | 'bottom'>('bottom');
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const mid = window.innerHeight / 2;
            setAnchor(rect.top > mid ? 'bottom' : 'top');
        }
    }, [isOpen, position]);

    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                touchAction: 'none'
            }}
            className="fixed bottom-32 right-4 z-[95] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        >
            {/* Menu Layer - Rendered based on Anchor */}
            {isOpen && (
                <div className={`absolute ${anchor === 'bottom' ? 'bottom-full mb-4' : 'top-full mt-4'} flex flex-col items-center pointer-events-none`}>
                    <div
                        className="pointer-events-auto"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {typeof children === 'function' ? children({ anchor }) : children}
                    </div>
                </div>
            )}

            {/* The Trigger Button */}
            <button
                className="w-12 h-12 bg-white text-black rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-95 transition-transform duration-100 pointer-events-none"
                aria-label="Add Item"
            >
                <svg className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}
