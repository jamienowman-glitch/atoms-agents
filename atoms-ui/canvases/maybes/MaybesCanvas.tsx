import React from 'react';
import { ToolHarness } from '../../harness/ToolHarness';
import { CanvasTransport } from '../../harness/transport';
import { ConnectedMaybes } from './blocks/ConnectedMaybes';
import 'reactflow/dist/style.css';

// Import scoped styles for this canvas if needed, or rely on global + inline styles
// We import reactflow styles here to ensure they are available for the canvas

export const MaybesCanvas = () => {
    // We instantiate the harness, which provides the ToolControlContext and CanvasTransport
    // The ConnectedMaybes block will consume these contexts.
    // We hide the global ToolPill and render our canvas-scoped MaybesToolPill instead

    return (
        <ToolHarness showToolPill={false}>
            <ConnectedMaybes />
        </ToolHarness>
    );
};
