import React from 'react';
import type { CanvasCartridge } from '../types';

const MapperLogo = (
    <span className="font-mono tracking-tighter font-bold text-blue-400">
        MAP
    </span>
);

export const MapperCartridge: CanvasCartridge = {
    id: 'sys.mapper',
    logoIcon: MapperLogo,
    ToolMap: [], // Mapper handles its own tools for now
    enablePagePanels: false, // Custom UI
};
