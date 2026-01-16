"use client";

import React, { useState, useRef, useEffect } from 'react';

export function FloatingAction({ onClick }: { onClick?: () => void }) {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Offset from initial
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    // Initial position will be fixed via CSS (bottom-24 right-4), 
    // but translate transform handles the drag offset.

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        initialPos.current = { ...position };
        setHasMoved(false);

        // Capture pointer to track even if mouse leaves element
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        // Threshold to distinguish click vs drag
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            setHasMoved(true);
        }

        setPosition({
            x: initialPos.current.x + dx,
            y: initialPos.current.y + dy
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (!hasMoved) {
            console.log("Floating Action Clicked");
            onClick?.();
        }
    };

    return (
        <button
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                touchAction: 'none' // Critical for dragging on touch
            }}
            // Compact Size: w-10 h-10
            className="fixed bottom-32 right-4 w-10 h-10 bg-white text-black rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center z-60 active:scale-95 transition-transform duration-100 cursor-grab active:cursor-grabbing"
            aria-label="Add Item"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </button>
    );
}
