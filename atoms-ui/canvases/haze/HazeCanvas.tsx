'use client';

import React from 'react';
import { HazeToolHarness } from '@canvases/haze/HazeToolHarness';
import { ConnectedHaze } from '@canvases/haze/blocks/ConnectedHaze';
import { HAZE_TOOL_REGISTRY } from '@canvases/haze/tool-registry';

export function HazeCanvas() {
    return (
        <HazeToolHarness
            scope={{ surfaceId: 'haze', scope: 'global' }}
            registry={HAZE_TOOL_REGISTRY}
        >
            <ConnectedHaze />
        </HazeToolHarness>
    );
}
