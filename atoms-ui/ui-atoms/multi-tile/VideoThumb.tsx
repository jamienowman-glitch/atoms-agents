import React from 'react';

export const VideoThumb = ({ videoUrl, alt }: { videoUrl?: string; alt?: string }) => {
    return (
        <div className="w-full h-full bg-black flex items-center justify-center text-white">
            <span className="text-xs">Video Thumb</span>
        </div>
    );
};
