import React from 'react';
import { CanvasTransport } from '@/lib/gate3/transport';

// FUTURE: Strategy Lock Animation.
export const RecapCanvas = ({ transport }: { transport?: CanvasTransport | null }) => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-950 text-neutral-400">
            Recap Canvas Placeholder
        </div>
    );
};
