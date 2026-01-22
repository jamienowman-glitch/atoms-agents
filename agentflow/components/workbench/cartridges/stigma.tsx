import React from 'react';
import type { CanvasCartridge } from '../types';

const StigmaLogo = (
    <span>
        M<sup>21</sup>
    </span>
);

export const StigmaCartridge: CanvasCartridge = {
    id: 'stigma',
    logoIcon: StigmaLogo,
    ToolMap: [],
    enablePagePanels: false,
};
