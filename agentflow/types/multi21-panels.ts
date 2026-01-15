export type DockSide = 'left' | 'right' | 'bottom' | 'float';

export interface PanelState {
    id: string;
    side: DockSide;
    order: number;
    isMinimised: boolean;
    position?: { x: number; y: number };
}

export interface DesktopLayoutConfig {
    panels: Record<string, PanelState>;
    version: number;
}

export const LAYOUT_STORAGE_KEY = 'multi21_desktop_layout';
export const LAYOUT_VERSION = 1;
