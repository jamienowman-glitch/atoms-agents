import React from 'react';
import { DockSide } from '../../../../types/multi21-panels';

interface DockZoneProps {
    side: Exclude<DockSide, 'float'>;
    children: React.ReactNode;
}

export function DockZone({ side, children }: DockZoneProps) {
    const orientation = side === 'bottom' ? 'flex-row' : 'flex-col';
    const alignment = side === 'bottom' ? 'items-end' : 'items-stretch';
    const borderSide = side === 'left' ? 'border-r' : side === 'right' ? 'border-l' : 'border-t';

    return (
        <div
            className={`pointer-events-none ${side === 'bottom' ? 'fixed left-0 right-0 bottom-0 px-3 pb-3' : `fixed top-16 bottom-3 ${side === 'left' ? 'left-3 pr-3' : 'right-3 pl-3'}`}`}
        >
            <div className={`flex ${orientation} ${alignment} gap-2 pointer-events-auto ${borderSide} border-neutral-200 dark:border-neutral-800`}>
                {children}
            </div>
        </div>
    );
}
