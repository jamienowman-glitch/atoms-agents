import React from 'react';
import { BuilderShell } from '../../components/multi21/BuilderShell';
import { Multi21Designer } from '../../components/multi21/Multi21Designer'; // Ensure this path is correct

export default function Multi21Page() {
    // 🛑 EMERGENCY ROUTE: Forces the Multi21Designer to load.
    // Logic checks are bypassed to ensure visibility.
    return (
        <BuilderShell>
            <Multi21Designer />
        </BuilderShell>
    );
}
