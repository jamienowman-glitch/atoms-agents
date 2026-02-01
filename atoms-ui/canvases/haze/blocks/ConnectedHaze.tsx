'use client';

import React from 'react';
import { useToolControl } from '../../../harness/ToolControlProvider';
import { HazeWorld } from '@canvases/haze/blocks/molecules/HazeWorld';

export function ConnectedHaze() {
    const { useToolState } = useToolControl();

    // Navigation State (Forward/Backward and Left/Right)
    const [forward] = useToolState('nav.forward', 0);
    const [turn] = useToolState('nav.turn', 0);

    // Pass to Molecule
    return (
        <HazeWorld
            deltaForward={forward}
            deltaTurn={turn}
        />
    );
}
