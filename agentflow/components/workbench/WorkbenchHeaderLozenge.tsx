import React, { useState, useRef } from 'react';
import { useConsole } from '../../context/ConsoleContext';

interface WorkbenchHeaderLozengeProps {
    previewMode: 'desktop' | 'mobile';
    setPreviewMode: (mode: 'desktop' | 'mobile') => void;
}

export const WorkbenchHeaderLozenge: React.FC<WorkbenchHeaderLozengeProps> = ({ previewMode, setPreviewMode }) => {
    const { identity } = useConsole();
    const [isExpanded, setIsExpanded] = useState(false);
    const [positionX, setPositionX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Drag Refs
    const dragStartRef = useRef<{ x: number, initialX: number } | null>(null);
    const lozengeRef = useRef<HTMLDivElement>(null);

    // Auto-Collapse Timer
    const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(false);
        dragStartRef.current = {
            x: e.clientX,
            initialX: positionX
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragStartRef.current) return;

        const deltaX = e.clientX - dragStartRef.current.x;

        // Threshold check to confirm intent to drag vs click
        if (Math.abs(deltaX) > 5) {
            setIsDragging(true);
            setPositionX(dragStartRef.current.initialX + deltaX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        dragStartRef.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);

        // If it was just a click (not a drag), toggle expand
        if (!isDragging) {
            toggleExpand();
        } else {
            // Snap logic (optional - keep it free form for now)
            setTimeout(() => setIsDragging(false), 50); // Small delay to prevent click firing
        }
    };

    const toggleExpand = () => {
        // Clear any pending collapse
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        setIsExpanded(!isExpanded);
    };

    const handleModeSelect = (mode: 'desktop' | 'mobile', e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling
        setPreviewMode(mode);

        // Auto-Collapse after selection
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 600);
    };


    // Icons
    const MobileIcon = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /></svg>
    );
    const DesktopIcon = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
    );
    const ExportIcon = () => (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
    );


    return (
        <div
            ref={lozengeRef}
            className="fixed top-6 left-1/2 z-[60] touch-none select-none"
            style={{
                transform: `translateX(calc(-50% + ${positionX}px))`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className={`
                bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-full 
                transition-all duration-300 ease-out flex items-center overflow-hidden
                ${isExpanded ? 'px-2 py-2 gap-3 h-12' : 'px-3 py-2 h-10 min-w-[2.5rem] justify-center gap-2'}
            `}>

                {/* --- COLLAPSED STATE: Identity + Icon --- */}
                {!isExpanded && (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-white animate-in fade-in duration-200">
                        {previewMode === 'mobile' ? <MobileIcon /> : <DesktopIcon />}

                        {identity && (
                            <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                                {identity.console.name}
                            </span>
                        )}
                    </div>
                )}


                {/* --- EXPANDED STATE: Full Controls --- */}
                {isExpanded && (
                    <>
                        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-full p-1 animate-in fade-in zoom-in-95 duration-200 origin-center">
                            <button
                                onClick={(e) => handleModeSelect('mobile', e)}
                                className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'mobile' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                                title="Mobile View"
                            >
                                <MobileIcon />
                            </button>
                            <button
                                onClick={(e) => handleModeSelect('desktop', e)}
                                className={`p-2 rounded-full transition-all duration-200 ${previewMode === 'desktop' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                                title="Desktop View"
                            >
                                <DesktopIcon />
                            </button>
                        </div>

                        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 shrink-0" />

                        <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors whitespace-nowrap"
                            onPointerUp={(e) => e.stopPropagation()} // Allow click through
                        >
                            <span>Export</span>
                            <ExportIcon />
                        </button>
                    </>
                )}

            </div>
        </div>
    );
};
