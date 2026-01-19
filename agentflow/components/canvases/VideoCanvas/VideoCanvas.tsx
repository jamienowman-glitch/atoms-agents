import React from 'react';
import { CanvasTransport } from '@/lib/gate3/transport';

// PASTE CONTENTS OF ui/apps/studio/src/labs/video-canvas/components/VideoTimeline.tsx HERE
export const VideoCanvas = ({ transport }: { transport?: CanvasTransport | null }) => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-950 text-neutral-400">
            Video Canvas Placeholder
        </div>
    );
};
