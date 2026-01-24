"use client";

import React from 'react';
import { WorkbenchShell } from '@/components/workbench/WorkbenchShell';
import { MapperCartridge } from '@/components/workbench/cartridges/mapper';
import { MapperCockpit } from './MapperCockpit';

export default function MapperPage() {
    return (
        <WorkbenchShell cartridge={MapperCartridge}>
            <MapperCockpit />
        </WorkbenchShell>
    );
}
