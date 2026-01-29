import React from 'react';

export function DraftHarnessStage() {
    return (
        <div className="h-full w-full flex items-center justify-center text-neutral-200">
            <div className="text-center space-y-2">
                <div className="text-sm uppercase tracking-[0.3em] text-neutral-500">Draft Harness</div>
                <div className="text-xl font-semibold">Canvas Placeholder</div>
                <div className="text-xs text-neutral-500">Wire your canvas here. Tool surfaces remain stable.</div>
            </div>
        </div>
    );
}
