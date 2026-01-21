
"use client";

import React from 'react';
import StigmaCanvas from '@/components/canvases/StigmaCanvas';
import { ToolControlProvider } from '@/context/ToolControlContext';

export default function StigmaPage() {
    return (
        <ToolControlProvider>
            <div className="w-screen h-screen">
                <StigmaCanvas canvasId="mobile-test-session" />
            </div>
        </ToolControlProvider>
    );
}
