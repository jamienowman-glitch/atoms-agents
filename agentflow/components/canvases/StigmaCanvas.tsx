import React, { useState, useEffect, useRef } from 'react';

// Reticle Cursor Component
// Renders a non-snapping crosshair/bracket at mouse position
const ReticleCursor: React.FC<{ parentRef: React.RefObject<HTMLDivElement> }> = ({ parentRef }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const parent = parentRef.current;
        if (!parent) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate relative position within the container
            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPos({ x, y });
        };

        const handleMouseEnter = () => setVisible(true);
        const handleMouseLeave = () => setVisible(false);

        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseenter', handleMouseEnter);
        parent.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseenter', handleMouseEnter);
            parent.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [parentRef]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                pointerEvents: 'none',
                zIndex: 100
            }}
        >
            {/* Reticle Graphic: Square Brackets */}
            <div className="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-80">
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></div>
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500"></div>
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500"></div>
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></div>

                {/* Coord Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] items-center space-x-1 flex text-red-500 font-mono">
                    <span>x:{Math.round(pos.x)}</span>
                    <span>y:{Math.round(pos.y)}</span>
                </div>
            </div>
        </div>
    );
};

// Editorial Grid Component
// 12-column layout overlay
const EditorialGrid: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 flex px-4 md:px-12 space-x-4 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 bg-red-400 h-full border-x border-red-500/20"></div>
            ))}
        </div>
    );
};

// Main Stigma Canvas Container
const StigmaCanvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#FAFAFA] overflow-hidden cursor-none">
            {/* Background Grid (Optional Detail) */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Editorial Grid Layer */}
            {showGrid && <EditorialGrid />}

            {/* Reticle Cursor (Tracks Mouse) */}
            <ReticleCursor parentRef={containerRef} />

            {/* Toolbar / Toggle Stub (For demo purposes) */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="px-3 py-1 bg-white border border-gray-200 text-xs font-mono uppercase tracking-wider hover:bg-gray-50 rounded shadow-sm"
                >
                    {showGrid ? 'Hide Grid' : 'Show Grid'}
                </button>
            </div>

            {/* Zero State Messaging */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
                <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">Stigma</h1>
                <p className="text-sm font-mono text-gray-500">Freeform Surface // Awaiting Atoms</p>
            </div>
        </div>
    );
};

export default StigmaCanvas;
