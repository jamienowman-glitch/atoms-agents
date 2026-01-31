"use client";

import React from 'react';
import { ToolControlProvider } from 'atoms-ui/harness/context/ToolControlContext';
import { HazeCanvas } from 'atoms-ui/canvases/haze';

export default function SurfacePage({ params }: { params: { slug: string } }) {
    return (
        <ToolControlProvider>
            <HazeCanvas />
        </ToolControlProvider>
    );
}
