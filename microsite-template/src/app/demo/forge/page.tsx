"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ToolControlProvider } from '../../../../../../atoms-ui/harness/context/ToolControlContext';

// Dynamic Import to avoid SSR issues with Transport/Window
const ForgeCanvas = dynamic(
    () => import('../../../../../../atoms-ui/canvases/forge/ForgeCanvas'),
    { ssr: false }
);

export default function ForgeDemoPage() {
    return (
        <ToolControlProvider>
            <ForgeCanvas />
        </ToolControlProvider>
    );
}
