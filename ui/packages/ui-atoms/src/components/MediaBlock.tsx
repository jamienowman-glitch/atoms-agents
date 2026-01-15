import React from 'react';
import { AtomProps } from '@northstar/builder-registry';

export const MediaBlock: React.FC<AtomProps> = ({ properties, isSelected, onClick }) => {
    const src = properties['src'];
    const brightness = properties['filters.brightness'] ?? 100;
    const autoplay = properties['playback.autoplay'] === true;

    // Simple detection based on extension or missing src
    const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm'));

    const style: React.CSSProperties = {
        filter: `brightness(${brightness}%)`,
        maxWidth: '100%',
        display: 'block',
        borderRadius: '4px'
    };

    return (
        <div
            onClick={onClick}
            style={{
                margin: '16px 0',
                border: isSelected ? '2px solid #005bd3' : '2px solid transparent',
                position: 'relative'
            }}
        >
            {!src ? (
                <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    borderRadius: '4px'
                }}>
                    Select Media
                </div>
            ) : isVideo ? (
                <video
                    src={src}
                    style={style}
                    autoPlay={autoplay}
                    loop={autoplay}
                    muted={autoplay} // Autoplay usually requires muted
                    controls={!autoplay}
                />
            ) : (
                <img src={src} alt="Media Block" style={style} />
            )}
        </div>
    );
};
