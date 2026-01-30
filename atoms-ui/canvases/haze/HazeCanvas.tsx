'use client';

import React from 'react';
import { HazeToolHarness } from './HazeToolHarness';
import { ConnectedHaze } from './blocks/ConnectedHaze';
import { HAZE_TOOL_REGISTRY } from './tool-registry';

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
