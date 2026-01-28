'use client';

import React, { useMemo } from 'react';
import { useToolState } from '../../../harness/ToolControlProvider';
import { HazeWorld } from './molecules/HazeWorld';

export function ConnectedHaze() {
    // 1. Hydrate from Harness (Safety Clamping)
    const [baseSpeed] = useToolState('haze:nav.speed', 1);
    const [rawZoom] = useToolState('haze:nav.zoom', 1);

    // Clamp for Mobile Safety
    const speed = Math.max(0.1, Math.min(baseSpeed, 5));
    const zoom = Math.max(0.1, Math.min(rawZoom, 10));

    // 2. Navigation State
    const [forward] = useToolState('haze:nav.forward', 0);
    const [turn] = useToolState('haze:nav.turn', 0);

    // 3. Pass Pure Data to Molecule
    return (
        <HazeWorld
            speed={speed}
            zoom={zoom}
            deltaForward={forward}
            deltaTurn={turn}
        />
    );
}
