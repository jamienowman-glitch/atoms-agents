"use client";

import React from 'react';
// Relative import because we haven't set up workspace aliases yet
import { ToolHarness } from '../../packages/atoms-ui/harness/ToolHarness';
import { Multi21Canvas } from '../../packages/atoms-ui/canvases/multi21';

export default function HarnessDemoPage() {
    // Mock Feeds for Verification
    const mockFeeds = {
        news: [
            { id: '1', title: 'Harness Test 1', subtitle: 'Live from Atoms-UI', image: '' },
            { id: '2', title: 'Behavior Check', subtitle: 'Tools Preserved', image: '' },
        ],
        youtube: [
            { id: 'yt1', title: 'Demo Stream', subtitle: '10:00 • Now', image: '' },
        ]
    };

    return (
        <ToolHarness
            scope={{ surfaceId: 'demo', scope: 'global' }}
            feeds={mockFeeds}
            showTopPill={true}
            showToolPill={true}
            showToolPop={true}
            showChatRail={true}
        >
            <Multi21Canvas />
        </ToolHarness>
    );
}
