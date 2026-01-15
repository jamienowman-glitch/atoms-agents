import React, { useEffect, useMemo, useState } from 'react';
import { LauncherStack } from './LauncherStack';
import { useLauncherContext, LauncherProvider } from './LauncherContext';
import { Edge, FloatingLauncherState, ViewportSize } from './LauncherTypes';

const SURFACE_OFFSET = 80;

function LauncherManagerInner() {
    const { layout, updateLauncher } = useLauncherContext();
    const [viewport, setViewport] = useState<ViewportSize>({ width: 0, height: 0 });

    useEffect(() => {
        const sync = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        sync();
        window.addEventListener('resize', sync);
        return () => window.removeEventListener('resize', sync);
    }, []);

    const byEdge = useMemo(() => {
        const map: Record<Edge, FloatingLauncherState[]> = { top: [], bottom: [], left: [], right: [] };
        Object.values(layout.launchers).forEach(l => {
            if (l.position.type === 'edge') {
                map[l.position.edge].push(l);
            }
        });
        return map;
    }, [layout.launchers]);

    const openLaunchers = useMemo(
        () => Object.values(layout.launchers).filter(l => l.isOpen),
        [layout.launchers],
    );

    const handleUpdate = (id: string, next: FloatingLauncherState) => {
        updateLauncher(id, () => next);
    };

    const renderSurface = (launcher: FloatingLauncherState) => {
        if (!launcher.isOpen) return null;
        if (launcher.position.type !== 'edge') return null;
        const edge = launcher.position.edge;
        const base: React.CSSProperties = { position: 'fixed', zIndex: 70 };
        if (edge === 'left') {
            base.left = SURFACE_OFFSET;
            base.top = SURFACE_OFFSET;
        } else if (edge === 'right') {
            base.right = SURFACE_OFFSET;
            base.top = SURFACE_OFFSET;
        } else if (edge === 'top') {
            base.top = SURFACE_OFFSET;
            base.left = SURFACE_OFFSET;
        } else {
            base.bottom = SURFACE_OFFSET;
            base.left = SURFACE_OFFSET;
        }
        return (
            <div key={`surface-${launcher.id}`} style={base}>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-lg p-3 min-w-[180px] max-w-[280px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold capitalize">{launcher.kind}</span>
                        <button
                            className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
                            onClick={() => handleUpdate(launcher.id, { ...launcher, isOpen: false })}
                        >
                            Close
                        </button>
                    </div>
                    <div className="text-sm text-neutral-700 dark:text-neutral-200">
                        {edge === 'top' || edge === 'bottom'
                            ? 'Vertical toolbar placeholder'
                            : 'Inward panel placeholder'}
                    </div>
                </div>
            </div>
        );
    };

    if (!viewport.width || !viewport.height) return null;

    return (
        <>
            {(Object.keys(byEdge) as Edge[]).map(edge => (
                <LauncherStack
                    key={edge}
                    edge={edge}
                    launchers={byEdge[edge]}
                    viewport={viewport}
                    onUpdate={handleUpdate}
                />
            ))}
            {openLaunchers.map(renderSurface)}
        </>
    );
}

export function LauncherManager() {
    return (
        <LauncherProvider>
            <LauncherManagerInner />
        </LauncherProvider>
    );
}
