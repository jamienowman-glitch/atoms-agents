import React, { useState, useRef, useEffect } from 'react';
import { TokenEditor } from './TokenEditor';

interface FloatingInspectorProps {
    canvasId: string;
    elementId: string;
}

export const FloatingInspector: React.FC<FloatingInspectorProps> = ({ canvasId, elementId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 80 }); // Default bottom-leftish

    // Drag state
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);

    // Handle Drag
    const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        // Allow drag if minimized, OR if expanded and touching the Header
        if (isExpanded) {
            const target = e.target as HTMLElement;
            // Only allow drag if clicking 'mobile-inspector-header' or its children (but not buttons)
            if (!target.closest('.mobile-inspector-header')) {
                return;
            }
        }

        isDragging.current = true;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        dragOffset.current = {
            x: clientX - position.x,
            y: clientY - position.y
        };
    };

    const onTouchMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault(); // Prevent scroll while dragging pill

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

        setPosition({
            x: clientX - dragOffset.current.x,
            y: clientY - dragOffset.current.y
        });
    };

    const onTouchEnd = () => {
        isDragging.current = false;
        // Snap to nearest edge? User said "float anywhere", keeping free for now.
    };

    useEffect(() => {
        const handleMove = (e: any) => onTouchMove(e);
        const handleUp = () => onTouchEnd();

        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);

        return () => {
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, []);

    // Smart Expand Logic
    // "Always open into the center of the screen"
    const getExpandOrigin = () => {
        const { innerWidth, innerHeight } = window;
        // Determine layout based on quadrant (only for initial expand direction or anchor?)
        // If we simply use top/left based on position, it works naturally.

        const style: React.CSSProperties = {
            position: 'fixed',
            zIndex: 10000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 24,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            transition: isDragging.current ? 'none' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', // Disable spring during drag
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        };

        // Anchor
        if (isExpanded) {
            // Sausage Shape
            style.width = '320px';
            style.maxWidth = '90vw';
            style.maxHeight = '250px';
            style.height = 'auto';

            // Allow free movement using position state
            // Centering logic removed to allow "move it about"
            // We center the panel on the handle (position.x)
            style.left = position.x;
            style.top = position.y;
            style.transform = 'translate(-50%, -20px)'; // Center horizontally on touch point, shift up slightly?

            // Adjust styles
            style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
            style.border = '1px solid rgba(0,0,0,0.05)';
        } else {
            // Minimized Token
            style.left = position.x;
            style.top = position.y;
            // Center element on coordinate
            style.transform = 'translate(-50%, -50%)';
            style.width = 48;
            style.height = 48;
            style.borderRadius = 24;
            style.cursor = 'grab';
            style.justifyContent = 'center';
            style.alignItems = 'center';
            style.background = '#000';
            style.color = '#fff';
            style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }

        return style;
    };

    return (
        <div
            ref={buttonRef}
            style={getExpandOrigin()}
            onMouseDown={onTouchStart}
            onTouchStart={onTouchStart}
            onClick={(e) => {
                if (!isDragging.current && !isExpanded) setIsExpanded(true);
            }}
        >
            {isExpanded ? (
                <>
                    <div className="mobile-inspector-header" style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 600,
                        cursor: 'grab' // Indicate draggable
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, opacity: 0.5 }}>:::</span>
                            <span>Properties</span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            style={{ background: 'none', border: 'none', fontSize: 20, padding: 0 }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 10 }} onMouseDown={e => e.stopPropagation()}>
                        <TokenEditor canvasId={canvasId} elementId={elementId} />
                    </div>
                </>
            ) : (
                <div style={{ fontSize: 24, pointerEvents: 'none' }}>⚙️</div>
            )}
        </div>
    );
};
