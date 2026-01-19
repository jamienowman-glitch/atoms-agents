import React, { useEffect, useRef, useState } from 'react';

type PreviewMode = 'desktop' | 'mobile';
type Align = 'left' | 'center' | 'right';
type Aspect = 'square' | 'portrait' | 'landscape';
type Variant = 'generic' | 'product' | 'kpi' | 'text';

interface FloatingControlsDockProps {
    previewMode: PreviewMode;
    setPreviewMode: (v: PreviewMode) => void;
    align: Align;
    setAlign: (v: Align) => void;
    aspectRatio: Aspect;
    setAspectRatio: (v: Aspect) => void;
    tileVariant: Variant;
    setTileVariant: (v: Variant) => void;
    showTitle: boolean;
    setShowTitle: (v: boolean) => void;
    showMeta: boolean;
    setShowMeta: (v: boolean) => void;
    showBadge: boolean;
    setShowBadge: (v: boolean) => void;
    showCtaLabel: boolean;
    setShowCtaLabel: (v: boolean) => void;
    showCtaArrow: boolean;
    setShowCtaArrow: (v: boolean) => void;
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
                className={`px-2 py-1 rounded text-xs capitalize ${value === opt ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

export function FloatingControlsDock(props: FloatingControlsDockProps) {
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
        setPosition({ x: w - DOCK_SIZE - 16, y: h * 0.5 - DOCK_SIZE / 2 });
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
        const yTop = margin;
        const yMid = Math.max(margin, h * 0.3);
        const yBottom = Math.max(margin, h * 0.7 - DOCK_SIZE);
        return [
            { x: xLeft, y: yTop },
            { x: xRight, y: yTop },
            { x: xLeft, y: yMid },
            { x: xRight, y: yMid },
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
        const w = viewport.w || window.innerWidth;
        const h = viewport.h || window.innerHeight;
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

    const expandUp = (position.y + DOCK_SIZE / 2) > (viewport.h || window.innerHeight) * 0.6;
    const openLeft = (position.x + DOCK_SIZE / 2) > (viewport.w || window.innerWidth) / 2;
    const panelStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
        left: openLeft ? undefined : position.x + DOCK_SIZE + 12,
        right: openLeft ? (viewport.w || window.innerWidth) - position.x + 12 : undefined,
        top: expandUp ? undefined : position.y + DOCK_SIZE + 12,
        bottom: expandUp ? (viewport.h || window.innerHeight) - position.y + 12 : undefined,
        maxHeight: '70vh',
        width: '260px',
    };

    const labelClass = 'font-semibold text-xs uppercase tracking-wider text-neutral-500';

    const content = (
        <div className="flex flex-col gap-4 text-neutral-900 dark:text-neutral-100">
            <div className="flex flex-col gap-2">
                <span className={labelClass}>View</span>
                <Segmented options={['desktop', 'mobile'] as const} value={props.previewMode} onSelect={props.setPreviewMode} />
            </div>
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Layout</span>
                <Segmented options={['left', 'center', 'right'] as const} value={props.align} onSelect={props.setAlign} />
                <Segmented options={['square', 'portrait', 'landscape'] as const} value={props.aspectRatio} onSelect={props.setAspectRatio} />
            </div>
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Content</span>
                <Segmented options={['generic', 'product', 'kpi', 'text'] as const} value={props.tileVariant} onSelect={props.setTileVariant} />
            </div>
            <div className="flex flex-col gap-2">
                <span className={labelClass}>Visibility</span>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={props.showTitle} onChange={e => props.setShowTitle(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Title</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={props.showMeta} onChange={e => props.setShowMeta(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Meta</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={props.showBadge} onChange={e => props.setShowBadge(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">Badge</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={props.showCtaLabel} onChange={e => props.setShowCtaLabel(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">CTA Label</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={props.showCtaArrow} onChange={e => props.setShowCtaArrow(e.target.checked)} className="rounded border-gray-300" />
                        <span className="text-sm">CTA Arrow</span>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                className="fixed z-50"
                style={{ left: position.x, top: position.y, width: DOCK_SIZE, height: DOCK_SIZE }}
            >
                <button
                    className="w-full h-full rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center dark:bg-neutral-100 dark:text-neutral-900"
                    onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
                    onTouchStart={e => {
                        const touch = e.touches[0];
                        handlePointerDown(touch.clientX, touch.clientY);
                    }}
                    onClick={() => setExpanded(!expanded)}
                    aria-label="Controls"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.15.48.5.87.97 1.08H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                    </svg>
                </button>
            </div>

            {expanded && (
                <div style={panelStyle} className="hidden md:block">
                    <div className="bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-4 overflow-y-auto max-h-[70vh]">
                        {content}
                    </div>
                </div>
            )}

            {expanded && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={() => setExpanded(false)}>
                    <div
                        className="absolute right-4 left-4 bottom-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-4 max-h-[60vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold">Controls</span>
                            <button onClick={() => setExpanded(false)} className="text-sm text-neutral-600 dark:text-neutral-300">Close</button>
                        </div>
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}
