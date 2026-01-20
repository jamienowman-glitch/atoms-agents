import React from 'react';

export type Edge = 'top' | 'bottom' | 'left' | 'right';

export type SurfaceType = 'verticalToolbar' | 'horizontalToolbar' | 'panel' | 'centralPopup';

export interface EdgePosition {
    type: 'edge';
    edge: Edge;
    index: number; // order within a stack on that edge
}

export interface FloatPosition {
    type: 'float';
    x: number;
    y: number;
}

export type LauncherPosition = EdgePosition | FloatPosition;

export interface FloatingLauncherState {
    id: string; // e.g. 'settings', 'tools'
    kind: string; // label/role
    icon: React.ReactNode;
    position: LauncherPosition;
    surfaceType: SurfaceType;
    surfaceId: string;
    isOpen: boolean;
}

export interface FloatingLaunchersLayoutConfig {
    version: number;
    launchers: Record<string, FloatingLauncherState>;
}

export interface ViewportSize {
    width: number;
    height: number;
}
