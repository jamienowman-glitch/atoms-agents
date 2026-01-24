import React from 'react';
import type { CanvasCartridge } from '../types';
import { TOOL_REGISTRY } from '../../../lib/multi21/tool-registry';

const Multi21Logo = (
    <span>
        M<sup>21</sup>
    </span>
);

export const Multi21Cartridge: CanvasCartridge = {
    id: 'multi21.designer',
    logoIcon: Multi21Logo,
    ToolMap: Object.values(TOOL_REGISTRY),
    enablePagePanels: true,
};
