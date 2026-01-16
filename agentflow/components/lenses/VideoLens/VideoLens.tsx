import React from 'react';
import { VideoPreview } from './VideoPreview';
import { VideoTimeline } from './VideoTimeline';
import { VideoLensProvider } from './useVideoLensStore';

export const VideoLens = () => {
    return (
        <VideoLensProvider>
            <div className="flex flex-col h-full bg-zinc-900 text-white">
                <div className="flex-1 border-b border-zinc-800 relative">
                    <VideoPreview />
                </div>
                <div className="h-[300px] bg-zinc-950">
                    <VideoTimeline />
                </div>
            </div>
        </VideoLensProvider>
    );
};
