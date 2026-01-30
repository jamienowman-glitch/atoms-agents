'use client';

import React from 'react';
import { ToolHarness } from '../../harness/ToolHarness';
import { HazeCanvas } from './HazeCanvas';
import { HAZE_TOOL_REGISTRY } from './tool-registry';
import { MagnetItem } from '../../components/workbench/DualMagnifier';

// HAZE-specific magnifier configuration
const HAZE_NAV_MODES: MagnetItem[] = [
    {
        id: 'explore',
        label: 'Explore',
        icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
        id: 'search',
        label: 'Search',
        icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
    },
];

const HAZE_NAV_TOOLS: MagnetItem[] = [
    {
        id: 'nav.forward',
        label: 'Forward',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    },
    {
        id: 'nav.turn',
        label: 'Turn',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
    },
];

export function HazeHarness() {
    return (
        <ToolHarness
            scope={{ surfaceId: 'haze', scope: 'global' }}
            registry={HAZE_TOOL_REGISTRY}
            showTopPill={true}
            showToolPill={false} // HAZE uses custom magnifiers in ToolPop
            showChatRail={true}
            showToolPop={true}
        >
            <HazeCanvas />
        </ToolHarness>
    );
}
