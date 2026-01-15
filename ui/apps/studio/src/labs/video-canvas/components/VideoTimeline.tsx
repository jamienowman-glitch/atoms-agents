import React from 'react';
import { useVideoCanvasStore } from '../hooks/useVideoCanvasStore';
import { VideoClipToken } from '../types/videoCanvasTokens';

const PIXELS_PER_SECOND = 50;

const Clip = ({ clip, trackId, variant = 'video' }: { clip: VideoClipToken; trackId: string; variant?: 'video' | 'subtitle' }) => {
    const { state, dispatch } = useVideoCanvasStore();
    const duration = clip.endMs - clip.startMs;
    const width = (duration / 1000) * PIXELS_PER_SECOND;
    const left = (clip.startMs / 1000) * PIXELS_PER_SECOND;

    const isSelected = state.selection?.clipId === clip.clipId;

    if (variant === 'subtitle') {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                        type: 'SELECT_ITEM',
                        selection: {
                            surface: 'video_timeline',
                            projectId: state.project.projectId,
                            sequenceId: state.project.activeSequenceId,
                            trackId,
                            clipId: clip.clipId
                        }
                    });
                }}
                style={{
                    position: 'absolute',
                    left: `${left}px`,
                    width: `${width}px`,
                    top: '10px',
                    height: '24px',
                    background: isSelected ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    border: isSelected ? '1px solid white' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '0 8px',
                    fontSize: '10px',
                    color: 'white',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* For subtitles, assetId holds the text content in our POC */}
                "{clip.assetId}"
            </div>
        );
    }

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                dispatch({
                    type: 'SELECT_ITEM',
                    selection: {
                        surface: 'video_timeline',
                        projectId: state.project.projectId,
                        sequenceId: state.project.activeSequenceId,
                        trackId,
                        clipId: clip.clipId
                    }
                });
            }}
            style={{
                position: 'absolute',
                left: `${left}px`,
                width: `${width}px`,
                height: '100%',
                background: isSelected ? '#3b82f6' : '#4b5563',
                border: isSelected ? '2px solid white' : '1px solid #1f2937',
                borderRadius: '4px',
                padding: '4px',
                fontSize: '11px',
                color: 'white',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                boxSizing: 'border-box'
            }}
        >
            {clip.assetId} ({(clip.speed || 1).toFixed(1)}x)
        </div>
    );
};

export const VideoTimeline = () => {
    const { state, dispatch } = useVideoCanvasStore();
    const activeSeq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);

    if (!activeSeq) return <div>No active sequence</div>;

    const maxDuration = activeSeq.durationMs || 10000; // Default 10s canvas if empty
    const totalWidth = (maxDuration / 1000) * PIXELS_PER_SECOND + 200; // Extra space
    const playheadX = (state.playheadMs / 1000) * PIXELS_PER_SECOND;

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        // Adjust for padding or scroll if needed, but here assuming relative to scroll container content
        // Actually, if we click on the container, e.mouseEvent is relative to viewport. 
        // We need X relative to the SCROLL CONTENT div.
        // Let's attach the click to the inner container
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                position: 'relative',
                background: '#1a1a1a'
            }}
            // Clicking background deselects items
            onClick={() => dispatch({ type: 'SELECT_ITEM', selection: null })}
        >
            <div
                style={{ width: `${totalWidth}px`, height: '100%', position: 'relative', padding: '10px' }}
                onClick={(e) => {
                    e.stopPropagation();
                    // Calculate seek position
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left - 10; // -10 for padding
                    const ms = (offsetX / PIXELS_PER_SECOND) * 1000;
                    dispatch({ type: 'SET_PLAYHEAD', ms: Math.max(0, ms) });
                    // Also clear selection? Maybe user preference. Let's keep selection.
                }}
            >
                {/* Ruler / Time-strip (Simple) */}
                <div style={{ height: '20px', borderBottom: '1px solid #444', marginBottom: '4px', fontSize: '10px', color: '#666', display: 'flex' }}>
                    {Array.from({ length: Math.ceil(maxDuration / 1000) }).map((_, sec) => (
                        <div key={sec} style={{ position: 'absolute', left: (sec * PIXELS_PER_SECOND) + 10, borderLeft: '1px solid #333', height: '10px', paddingLeft: '2px' }}>
                            {sec}s
                        </div>
                    ))}
                </div>

                {activeSeq.tracks.map((track, i) => (
                    <div
                        key={track.trackId}
                        style={{
                            height: track.role === 'subtitles' ? '40px' : '60px',
                            marginBottom: '4px',
                            position: 'relative',
                            background: track.role === 'subtitles' ? '#111' : '#262626',
                            borderBottom: '1px solid #333'
                        }}
                    >
                        {/* Track Label */}
                        <div style={{ position: 'sticky', left: 0, color: '#555', fontSize: '9px', padding: '2px', zIndex: 5, pointerEvents: 'none' }}>
                            {track.trackId.toUpperCase()}
                        </div>

                        {track.clips.map(clip => (
                            <Clip
                                key={clip.clipId}
                                clip={clip}
                                trackId={track.trackId}
                                variant={track.role === 'subtitles' ? 'subtitle' : 'video'}
                            />
                        ))}
                    </div>
                ))}

                {/* Playhead Line */}
                <div style={{
                    position: 'absolute',
                    left: `${playheadX + 10}px`, // +10 padding
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'red',
                    zIndex: 20,
                    pointerEvents: 'none',
                    boxShadow: '0 0 4px rgba(255, 0, 0, 0.5)'
                }}>
                    {/* Head */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-4px', // Center on line
                        width: '10px',
                        height: '10px',
                        background: 'red',
                        transform: 'rotate(45deg)',
                        marginTop: '-5px'
                    }} />
                </div>

                {/* Chat Rail Placeholder */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    borderTop: '1px dashed #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#444',
                    fontSize: '11px'
                }}>
                    Chat Rail Area
                </div>
            </div>
        </div>
    );
};
