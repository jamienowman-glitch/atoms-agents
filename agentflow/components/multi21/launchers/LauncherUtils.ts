import { Edge, FloatingLaunchersLayoutConfig, FloatingLauncherState, LauncherPosition, ViewportSize } from './LauncherTypes';
import React from 'react';

export interface SnapTarget {
    edge: Edge;
    x: number;
    y: number;
}

export const SNAP_MARGIN = 16;
export const DEFAULT_LAYOUT_VERSION = 1;

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function calculateSnapTarget(x: number, y: number, viewport: ViewportSize, margin = SNAP_MARGIN): SnapTarget {
    const distances = {
        left: x,
        right: viewport.width - x,
        top: y,
        bottom: viewport.height - y,
    };
    const closest = Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0] as Edge;

    const clampedX = clamp(x, margin, viewport.width - margin);
    const clampedY = clamp(y, margin, viewport.height - margin);

    switch (closest) {
        case 'left':
            return { edge: 'left', x: margin, y: clampedY };
        case 'right':
            return { edge: 'right', x: viewport.width - margin, y: clampedY };
        case 'top':
            return { edge: 'top', x: clampedX, y: margin };
        case 'bottom':
        default:
            return { edge: 'bottom', x: clampedX, y: viewport.height - margin };
    }
}

export function makeEdgePosition(edge: Edge, index = 0): LauncherPosition {
    return { type: 'edge', edge, index };
}

export function defaultLaunchers(): FloatingLaunchersLayoutConfig {
    const base: Record<string, FloatingLauncherState> = {
        settings: {
            id: 'settings',
            kind: 'settings',
            icon: React.createElement('span', null, 'S'),
            position: makeEdgePosition('right', 0),
            surfaceType: 'panel',
            surfaceId: 'settings-panel',
            isOpen: false,
        },
        tools: {
            id: 'tools',
            kind: 'tools',
            icon: React.createElement('span', null, 'T'),
            position: makeEdgePosition('right', 1),
            surfaceType: 'verticalToolbar',
            surfaceId: 'tools-toolbar',
            isOpen: false,
        },
    };
    return { version: DEFAULT_LAYOUT_VERSION, launchers: base };
}
