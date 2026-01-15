import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DockZone } from './DockZone';
import { Panel } from './Panel';
import { DesktopLayoutConfig, DockSide, PanelState, LAYOUT_STORAGE_KEY, LAYOUT_VERSION } from '../../types/multi21-panels';

interface PanelDefinition {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface DesktopPanelSystemProps {
    panels: PanelDefinition[];
}

const EDGE_THRESHOLD = 120;
const DEFAULT_FLOAT_POSITION = { x: 240, y: 200 };

function createDefaultLayout(defs: PanelDefinition[]): DesktopLayoutConfig {
    const panels: Record<string, PanelState> = {};
    defs.forEach(def => {
        let side: DockSide = 'float';
        if (def.id === 'settings') side = 'right';
        if (def.id === 'tools') side = 'bottom';
        panels[def.id] = {
            id: def.id,
            side,
            order: 0,
            isMinimised: false,
            position: side === 'float' ? DEFAULT_FLOAT_POSITION : undefined,
        };
    });
    return { panels, version: LAYOUT_VERSION };
}

export function DesktopPanelSystem({ panels }: DesktopPanelSystemProps) {
    const [layout, setLayout] = useState<DesktopLayoutConfig>(() => {
        if (typeof window === 'undefined') return createDefaultLayout(panels);
        try {
            const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as DesktopLayoutConfig;
                if (parsed.version === LAYOUT_VERSION) {
                    return parsed;
                }
            }
        } catch {
            /* ignore */
        }
        return createDefaultLayout(panels);
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
        } catch {
            /* ignore */
        }
    }, [layout]);

    useEffect(() => {
        setLayout(prev => {
            const updated = { ...prev, panels: { ...prev.panels } };
            panels.forEach(def => {
                if (!updated.panels[def.id]) {
                    updated.panels[def.id] = createDefaultLayout([def]).panels[def.id];
                }
            });
            return updated;
        });
    }, [panels]);

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const startDrag = (id: string, clientX: number, clientY: number) => {
        setDraggingId(id);
        const panel = layout.panels[id];
        const pos = panel.position || DEFAULT_FLOAT_POSITION;
        dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y };
        // ensure floating while dragging
        setLayout(prev => ({
            ...prev,
            panels: {
                ...prev.panels,
                [id]: { ...prev.panels[id], side: 'float', position: pos },
            },
        }));
    };

    const onPointerMove = (clientX: number, clientY: number) => {
        if (!draggingId) return;
        setLayout(prev => {
            const current = prev.panels[draggingId];
            const nextPos = { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y };
            return {
                ...prev,
                panels: {
                    ...prev.panels,
                    [draggingId]: { ...current, side: 'float', position: nextPos },
                },
            };
        });
    };

    const onPointerUp = () => {
        if (!draggingId) return;
        const id = draggingId;
        setDraggingId(null);
        const panel = layout.panels[id];
        const pos = panel.position || DEFAULT_FLOAT_POSITION;
        const w = typeof window !== 'undefined' ? window.innerWidth : 0;
        const h = typeof window !== 'undefined' ? window.innerHeight : 0;
        let target: DockSide = 'float';
        if (pos.y > h - EDGE_THRESHOLD) target = 'bottom';
        if (pos.x < EDGE_THRESHOLD) target = 'left';
        if (pos.x > w - EDGE_THRESHOLD) target = 'right';

        setLayout(prev => {
            const updatedPanels = { ...prev.panels };
            Object.keys(updatedPanels).forEach(key => {
                const p = updatedPanels[key];
                if (p.side === target && target !== 'float') {
                    // keep existing order; new panel goes to end
                }
            });
            const maxOrder = Math.max(
                -1,
                ...Object.values(updatedPanels)
                    .filter(p => p.side === target)
                    .map(p => p.order)
            );
            updatedPanels[id] = {
                ...updatedPanels[id],
                side: target,
                order: target === 'float' ? 0 : maxOrder + 1,
                position: target === 'float' ? pos : undefined,
            };
            return { ...prev, panels: updatedPanels };
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
        const handleMouseUp = () => onPointerUp();
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        const handleTouchEnd = () => onPointerUp();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    });

    const toggleMinimise = (id: string) => {
        setLayout(prev => ({
            ...prev,
            panels: {
                ...prev.panels,
                [id]: { ...prev.panels[id], isMinimised: !prev.panels[id].isMinimised },
            },
        }));
    };

    const resetLayout = () => setLayout(createDefaultLayout(panels));

    const grouped = useMemo(() => {
        const entries = panels.map(def => ({
            def,
            state: layout.panels[def.id] || createDefaultLayout([def]).panels[def.id],
        }));
        return {
            left: entries.filter(e => e.state.side === 'left').sort((a, b) => a.state.order - b.state.order),
            right: entries.filter(e => e.state.side === 'right').sort((a, b) => a.state.order - b.state.order),
            bottom: entries.filter(e => e.state.side === 'bottom').sort((a, b) => a.state.order - b.state.order),
            floaters: entries.filter(e => e.state.side === 'float'),
        };
    }, [layout, panels]);

    const startDragHandlers = (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startDrag(id, clientX, clientY);
    };

    return (
        <>
            <button
                className="hidden md:block fixed top-4 right-[320px] z-40 text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
                onClick={resetLayout}
            >
                Reset layout
            </button>

            <DockZone side="left">
                {grouped.left.map(({ def, state }) => (
                    <Panel
                        key={def.id}
                        title={def.title}
                        isMinimised={state.isMinimised}
                        onDragStart={startDragHandlers(def.id)}
                        onToggleMinimise={() => toggleMinimise(def.id)}
                    >
                        {def.content}
                    </Panel>
                ))}
            </DockZone>

            <DockZone side="right">
                {grouped.right.map(({ def, state }) => (
                    <Panel
                        key={def.id}
                        title={def.title}
                        isMinimised={state.isMinimised}
                        onDragStart={startDragHandlers(def.id)}
                        onToggleMinimise={() => toggleMinimise(def.id)}
                    >
                        {def.content}
                    </Panel>
                ))}
            </DockZone>

            <DockZone side="bottom">
                {grouped.bottom.map(({ def, state }) => (
                    <Panel
                        key={def.id}
                        title={def.title}
                        isMinimised={state.isMinimised}
                        onDragStart={startDragHandlers(def.id)}
                        onToggleMinimise={() => toggleMinimise(def.id)}
                    >
                        {def.content}
                    </Panel>
                ))}
            </DockZone>

            {grouped.floaters.map(({ def, state }) => (
                <Panel
                    key={def.id}
                    title={def.title}
                    isFloating
                    isMinimised={state.isMinimised}
                    onDragStart={startDragHandlers(def.id)}
                    onToggleMinimise={() => toggleMinimise(def.id)}
                    style={{
                        left: state.position?.x ?? DEFAULT_FLOAT_POSITION.x,
                        top: state.position?.y ?? DEFAULT_FLOAT_POSITION.y,
                    }}
                >
                    {def.content}
                </Panel>
            ))}
        </>
    );
}
