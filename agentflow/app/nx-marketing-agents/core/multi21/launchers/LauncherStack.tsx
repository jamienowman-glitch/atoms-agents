import React from 'react';
import { Edge, FloatingLauncherState, LauncherPosition, ViewportSize } from './LauncherTypes';
import { FloatingLauncher } from './FloatingLauncher';
import { makeEdgePosition } from './LauncherUtils';

interface LauncherStackProps {
    edge: Edge;
    launchers: FloatingLauncherState[];
    viewport: ViewportSize;
    onUpdate: (id: string, next: FloatingLauncherState) => void;
}

export function LauncherStack({ edge, launchers, viewport, onUpdate }: LauncherStackProps) {
    const ordered = [...launchers].sort((a, b) => {
        const ia = a.position.type === 'edge' ? a.position.index : 0;
        const ib = b.position.type === 'edge' ? b.position.index : 0;
        return ia - ib;
    }).map((launcher, idx) => {
        const pos: LauncherPosition = launcher.position.type === 'edge' ? makeEdgePosition(edge, idx) : launcher.position;
        return { ...launcher, position: pos };
    });

    const layoutClass = edge === 'top' || edge === 'bottom' ? 'flex-row' : 'flex-col';

    return (
        <div className="fixed inset-0 pointer-events-none">
            {ordered.map(l => (
                <FloatingLauncher
                    key={l.id}
                    launcher={l}
                    viewport={viewport}
                    onUpdate={next => onUpdate(l.id, next)}
                />
            ))}
        </div>
    );
}
