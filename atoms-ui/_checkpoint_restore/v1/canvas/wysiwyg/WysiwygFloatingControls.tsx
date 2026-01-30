"use client";

import React, { useEffect, useRef, useState } from 'react';

type PreviewMode = 'desktop' | 'mobile';
type Align = 'left' | 'center' | 'right';
type Aspect = 'square' | 'portrait' | 'landscape';
type Variant = 'generic' | 'product' | 'kpi' | 'text' | 'video' | 'youtube';

interface WysiwygFloatingControlsProps {
    previewMode: PreviewMode;
    setPreviewMode: (v: PreviewMode) => void;
    // We will pass partial state or just simplify for verification
    toolState: Record<string, any>;
    onToolUpdate: (key: string, val: any) => void;
}

type DockPosition = { x: number; y: number };

const DOCK_SIZE = 56;
const STORAGE_KEY = 'multi21_controls_dock_position';

const Segmented = <T extends string>({ options, value, onSelect }: { options: readonly T[]; value: T; onSelect: (v: T) => void }) => (
    <div className="flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
        {options.map(opt => (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`px-2 py-1 rounded text-xs capitalize transition-colors ${value === opt ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

export function WysiwygFloatingControls({ previewMode, setPreviewMode, toolState, onToolUpdate }: WysiwygFloatingControlsProps) {
    const [position, setPosition] = useState<DockPosition>({ x: 0, y: 0 });
    const [expanded, setExpanded] = useState(false);
    const [viewport, setViewport] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const dragging = useRef(false);
    const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setViewport({ w, h });
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as DockPosition;
                setPosition(parsed);
                return;
            } catch { /* ignore */ }
        }
        setPosition({ x: w - DOCK_SIZE - 16, y: h * 0.4 - DOCK_SIZE / 2 }); // Default higher up
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setViewport({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getAnchors = () => {
        const margin = 16;
        const w = viewport.w || window.innerWidth;
        const h = viewport.h || window.innerHeight;
        const xLeft = margin;
        const xRight = Math.max(margin, w - DOCK_SIZE - margin);
        const yTop = margin + 60; // Avoid Header
        const yMid = Math.max(margin, h * 0.3);
        const yBottom = Math.max(margin, h * 0.7 - DOCK_SIZE);
        return [
            { x: xRight, y: yMid }, // Prefer right middle
            { x: xLeft, y: yTop },
            { x: xRight, y: yTop },
            { x: xLeft, y: yMid },
            { x: xLeft, y: yBottom },
            { x: xRight, y: yBottom },
        ];
    };

    const snapToNearest = (pos: DockPosition) => {
        const anchors = getAnchors();
        let nearest = anchors[0];
        let best = Number.MAX_VALUE;
        anchors.forEach(a => {
            const dist = Math.hypot(a.x - pos.x, a.y - pos.y);
            if (dist < best) {
                best = dist;
                nearest = a;
            }
        });
        setPosition(nearest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nearest));
    };

    const handlePointerDown = (clientX: number, clientY: number) => {
        dragging.current = true;
        offset.current = { x: clientX - position.x, y: clientY - position.y };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
        if (!dragging.current) return;
        const w = viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 1000);
        const h = viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 800);
        const x = Math.min(Math.max(0, clientX - offset.current.x), w - DOCK_SIZE);
        const y = Math.min(Math.max(0, clientY - offset.current.y), h - DOCK_SIZE);
        setPosition({ x, y });
    };

    const handlePointerUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
        snapToNearest(position);
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
        const onMouseUp = () => handlePointerUp();
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        const onTouchEnd = () => handlePointerUp();
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    });

    const expandUp = (position.y + DOCK_SIZE / 2) > (viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 800)) * 0.6;
    const openLeft = (position.x + DOCK_SIZE / 2) > (viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 1000)) / 2;
    const panelStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 100, // Above everything
        left: openLeft ? undefined : position.x + DOCK_SIZE + 12,
        right: openLeft ? (viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 1000)) - position.x + 12 : undefined,
        top: expandUp ? undefined : position.y + DOCK_SIZE + 12,
        bottom: expandUp ? (viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 800)) - position.y + 12 : undefined,
        maxHeight: '70vh',
        width: '260px',
    };

    const labelClass = 'font-semibold text-xs uppercase tracking-wider text-neutral-500';

    // Helper to get from toolState
    const getVal = (key: string, def: any) => toolState[key] ?? def;

    const content = (
        <div className="flex flex-col gap-4 text-neutral-900 dark:text-neutral-100">
            <div className="flex flex-col gap-2">
                <span className={labelClass}>View</span>
                <Segmented options={['desktop', 'mobile'] as const} value={previewMode} onSelect={setPreviewMode} />
            </div>
            {/*
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Layout</span>
                <Segmented options={['left', 'center', 'right'] as const} value={getVal('grid.align', 'center')} onSelect={(v) => onToolUpdate('grid.align', v)} />
            </div>
             */}
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Variant</span>
                <Segmented options={['generic', 'product', 'kpi', 'media', 'text'] as const} value={getVal('tile.variant', 'generic')} onSelect={(v) => onToolUpdate('tile.variant', v)} />
            </div>
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Grid Cols</span>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-2 flex flex-col gap-2">
                    <div className="flex justify-between text-xs"><span>Desktop</span> <span>{getVal('grid.cols_desktop', 6)}</span></div>
                    <input type="range" min={1} max={12} value={getVal('grid.cols_desktop', 6)} onChange={(e) => onToolUpdate('grid.cols_desktop', parseInt(e.target.value))} />

                    <div className="flex justify-between text-xs"><span>Mobile</span> <span>{getVal('grid.cols_mobile', 2)}</span></div>
                    <input type="range" min={1} max={6} value={getVal('grid.cols_mobile', 2)} onChange={(e) => onToolUpdate('grid.cols_mobile', parseInt(e.target.value))} />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                className="fixed z-[100]"
                style={{ left: position.x, top: position.y, width: DOCK_SIZE, height: DOCK_SIZE }}
            >
                <div className="relative w-full h-full group">
                    {/* Label on hover */}
                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Floating Controls
                    </div>

                    <button
                        className="w-full h-full rounded-full bg-neutral-900 text-white shadow-xl flex items-center justify-center dark:bg-white dark:text-neutral-900 border border-white/20 dark:border-black/10 cursor-move active:scale-95 transition-transform"
                        onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
                        onTouchStart={e => {
                            const touch = e.touches[0];
                            handlePointerDown(touch.clientX, touch.clientY);
                        }}
                        onClick={() => !dragging.current && setExpanded(!expanded)}
                        aria-label="Controls"
                    >
                        <svg className={`w-6 h-6 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                    </button>
                </div>
            </div>

            {expanded && (
                <div style={panelStyle} className="hidden md:block animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-4 overflow-y-auto max-h-[70vh] backdrop-blur-xl">
                        {content}
                    </div>
                </div>
            )}

            {expanded && (
                <div className="md:hidden fixed inset-0 z-[101] bg-black/30 backdrop-blur-[2px]" onClick={() => setExpanded(false)}>
                    <div
                        className="absolute right-4 left-4 bottom-32 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-5 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                            <span className="text-sm font-bold uppercase tracking-wider">Canvas Controls</span>
                            <button onClick={() => setExpanded(false)} className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}

