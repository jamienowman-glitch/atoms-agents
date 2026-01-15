import React, { useEffect, useRef, useState } from 'react';

interface VideoThumbProps {
    src: string;
    aspectRatio: 'square' | 'portrait' | 'landscape';
}

const aspectClassMap: Record<VideoThumbProps['aspectRatio'], string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
};

/**
 * VideoThumb renders a canvas-derived thumbnail from a video source.
 * It captures the first frame client-side and uses it as a background image.
 */
export function VideoThumb({ src, aspectRatio }: VideoThumbProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [thumbUrl, setThumbUrl] = useState<string | null>(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        let isCaptured = false;

        const handleCapture = () => {
            if (isCaptured) return;
            if (!videoEl.videoWidth || !videoEl.videoHeight) return;

            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setThumbUrl(dataUrl);
            videoEl.pause();
            isCaptured = true;
        };

        videoEl.addEventListener('loadeddata', handleCapture, { once: false });
        videoEl.addEventListener('loadedmetadata', handleCapture, { once: false });

        return () => {
            videoEl.removeEventListener('loadeddata', handleCapture);
            videoEl.removeEventListener('loadedmetadata', handleCapture);
        };
    }, [src]);

    return (
        <div className={`relative w-full ${aspectClassMap[aspectRatio]}`}>
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full absolute inset-0 opacity-0 pointer-events-none"
                muted
                playsInline
                preload="metadata"
                controls={false}
                autoPlay={false}
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: '#111827',
                    backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
                        <path d="M5 3l12 9-12 9V3z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
