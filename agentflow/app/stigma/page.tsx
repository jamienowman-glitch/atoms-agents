
"use client";

import React from 'react';
import StigmaCanvas from '@/components/canvases/StigmaCanvas';
import { WorkbenchShell } from '@/components/workbench/WorkbenchShell';
import { StigmaCartridge } from '@/components/workbench/cartridges/stigma';

export default function StigmaPage() {
    return (
        <WorkbenchShell cartridge={StigmaCartridge}>
            <StigmaCanvas canvasId="mobile-test-session" />
        </WorkbenchShell>
    );
}
