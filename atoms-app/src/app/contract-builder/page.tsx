"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ToolControlProvider } from 'atoms-ui/harnesses/Mother/logic/ToolControlContext';

// Dynamic Import to avoid SSR issues with Transport/Window
const ContractBuilderCanvas = dynamic(
    () => import('atoms-ui/canvases/contract_builder/ContractBuilderCanvas'),
    { ssr: false }
);

export default function ContractBuilderPage() {
    return (
        <ToolControlProvider>
            <ContractBuilderCanvas />
        </ToolControlProvider>
    );
}
