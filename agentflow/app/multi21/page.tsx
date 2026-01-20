import React from 'react';
import { BuilderShell } from '@/app/nx-marketing-agents/core/multi21/BuilderShell';
import { Multi21Designer } from '@/app/nx-marketing-agents/core/multi21/Multi21Designer';

export default function Multi21Page() {
    // 🛑 EMERGENCY ROUTE: Forces the Multi21Designer to load.
    // Logic checks are bypassed to ensure visibility.
    return (
        <BuilderShell>
            <Multi21Designer />
        </BuilderShell>
    );
}
