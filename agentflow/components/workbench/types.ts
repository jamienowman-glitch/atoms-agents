import type { ComponentType, ReactNode } from 'react';
import type { ToolDefinition } from '../../lib/multi21/tool-registry';

export interface CanvasCartridge {
    id: string;
    logoIcon: ReactNode;
    TopControls?: ComponentType;
    ToolMap: ToolDefinition[];
    enablePagePanels?: boolean;
}
