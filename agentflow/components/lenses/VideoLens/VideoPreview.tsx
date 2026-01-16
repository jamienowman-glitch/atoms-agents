import React, { useRef, useEffect } from 'react';
import { useVideoLensStore } from './useVideoLensStore';

export const VideoPreview = () => {
    const { state } = useVideoLensStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const activeSeq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);

    // TODO: Real composite playback. 
    // For now, we just find the first clip in the first track to show *something*.
    // In Phase 4, this will be wired to a stream or a composite URL from video_render.
    const primaryTrack = activeSeq?.tracks.find(t => t.trackId === 'v1');
    const firstClip = primaryTrack?.clips[0];
    // This is a PLACEHOLDER. Real implementation needs a timeline player logic.
    // We assume assetId might be a blob URL or a path we can resolve.
    const videoSrc = firstClip ? firstClip.assetId : undefined;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {videoSrc ? (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls={false} // Hide native controls, we use custom Playback logic now
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        aspectRatio: '16/9',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                />
            ) : (
                <div style={{ color: '#555', fontSize: '14px' }}>
                    No clips in sequence
                </div>
            )}

            {/* Overlay Info */}
            <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', fontSize: '10px', borderRadius: '4px' }}>
                Preview: {activeSeq?.name || 'None'}
            </div>
        </div>
    );
};
