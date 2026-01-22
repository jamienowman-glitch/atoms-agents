import React from 'react';
import { Multi21Designer } from '@/app/nx-marketing-agents/core/multi21/Multi21Designer';
import { WorkbenchShell } from '@/components/workbench/WorkbenchShell';
import { Multi21Cartridge } from '@/components/workbench/cartridges/multi21';

export default function Multi21Page() {
    // 🛑 EMERGENCY ROUTE: Forces the Multi21Designer to load.
    // Logic checks are bypassed to ensure visibility.
    return (
        <WorkbenchShell cartridge={Multi21Cartridge}>
            <Multi21Designer />
        </WorkbenchShell>
    );
}
