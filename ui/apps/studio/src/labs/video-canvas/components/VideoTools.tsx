import React, { useRef } from 'react';
import { useVideoCanvasStore } from '../hooks/useVideoCanvasStore';
import { VideoClipToken } from '../types/videoCanvasTokens';

export const VideoTools = () => {
    const { state, dispatch } = useVideoCanvasStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('[VideoTools] handleUpload triggered', e.target.files);
        if (!e.target.files || e.target.files.length === 0) {
            console.warn('[VideoTools] No files selected');
            return;
        }
        const file = e.target.files[0];
        console.log('[VideoTools] File selected:', file.name, file.type, file.size);

        // Mock Asset Logic (In Phase 4, this goes to media_v2)
        const objectUrl = URL.createObjectURL(file);

        // Calculate Start Time (Append logic)
        const seq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);
        if (!seq) console.error('[VideoTools] Active sequence not found!', state.project.activeSequenceId);

        const track = seq?.tracks.find(t => t.trackId === 'v1');
        if (!track) console.error('[VideoTools] Track v1 not found!');

        let startMs = 0;
        if (track && track.clips.length > 0) {
            // Find the end of the last clip
            const lastClip = track.clips.reduce((prev, current) => (prev.endMs > current.endMs) ? prev : current);
            startMs = lastClip.endMs;
            console.log('[VideoTools] Appending clip at', startMs);
        } else {
            console.log('[VideoTools] Adding first clip at 0ms');
        }

        const newClip: VideoClipToken = {
            clipId: `clip_${Date.now()}`,
            assetId: objectUrl,
            trackId: 'v1', // Add to primary track
            startMs: startMs,
            endMs: startMs + 5000, // Mock 5s duration
            trimInMs: 0,
            trimOutMs: 0,
            speed: 1.0
        };

        console.log('[VideoTools] Dispatching ADD_CLIP', newClip);
        dispatch({ type: 'ADD_CLIP', trackId: 'v1', clip: newClip });

        // Reset input
        e.target.value = '';
    };

    const handleDelete = () => {
        if (!state.selection || !state.selection.clipId) return;
        dispatch({ type: 'DELETE_CLIP', clipId: state.selection.clipId });
    };

    const handleSplit = () => {
        const seq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);
        if (!seq) return;

        let targetClip: VideoClipToken | undefined;
        let targetTrackId: string | undefined;

        // 1. Try Explicit Selection
        if (state.selection && state.selection.clipId) {
            const track = seq.tracks.find(t => t.trackId === state.selection!.trackId);
            targetClip = track?.clips.find(c => c.clipId === state.selection!.clipId);
            targetTrackId = state.selection.trackId;
        }

        // 2. Try Contextual (Playhead) if no selection
        if (!targetClip) {
            // Prioritize v1, then others? Or active track concept?
            // CapCut Desktop targets "Main Track" ('v1') by default if nothing selected, 
            // OR the track that is "Auto Selected" (we don't have track auto-select yet).
            // Let's search 'v1' first.
            const splitTime = state.playheadMs;
            const v1 = seq.tracks.find(t => t.trackId === 'v1');
            targetClip = v1?.clips.find(c => splitTime > c.startMs && splitTime < c.endMs); // Exclusive edges to avoid 0-frame clips
            targetTrackId = 'v1';
        }

        if (targetClip && targetTrackId) {
            const splitTime = state.playheadMs;

            // Validation: Split must be within clip bounds
            if (splitTime <= targetClip.startMs || splitTime >= targetClip.endMs) {
                console.warn('[VideoTools] Split time outside clip bounds', splitTime, targetClip);
                return;
            }

            const duration = targetClip.endMs - targetClip.startMs;
            const splitOffset = splitTime - targetClip.startMs;

            // Duration of first part
            const duration1 = splitOffset;

            const clip1: VideoClipToken = {
                ...targetClip,
                clipId: `${targetClip.clipId}_1_${Date.now()}`,
                endMs: splitTime,
                trimOutMs: targetClip.trimInMs + duration1
            };

            const clip2: VideoClipToken = {
                ...targetClip,
                clipId: `${targetClip.clipId}_2_${Date.now()}`,
                startMs: splitTime,
                trimInMs: targetClip.trimInMs + duration1
            };

            dispatch({ type: 'SPLIT_CLIP', originalClipId: targetClip.clipId, newClips: [clip1, clip2] });

            // UX: Enhance - Select the second part after split? 
            // CapCut often selects the second part.
            // dispatch({ type: 'SELECT_ITEM', selection: { ...state.selection, clipId: clip2.clipId } });
        }
    };

    const handleSpeed = (speed: number) => {
        if (!state.selection || !state.selection.clipId) return;
        dispatch({ type: 'UPDATE_CLIP', clipId: state.selection.clipId, updates: { speed } });
    };

    const handleCaptions = async () => {
        if (!state.selection || !state.selection.clipId) return;
        const seq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);
        const track = seq?.tracks.find(t => t.trackId === state.selection!.trackId);
        const clip = track?.clips.find(c => c.clipId === state.selection!.clipId);

        if (!clip) return;

        // 1. Call Engine
        // In a real app, we'd show a loading spinner here
        const { captions } = await import('../services/engineClient').then(m => m.engineClient.generateCaptions(clip.assetId));

        // 2. Add Subtitle Track if needed
        // For this POC, we assume 'v_sub' exists or we just add to 'v1' as overlay text clips?
        // Let's force a 'subtitles' track existence logic in reducer or just append to a new track
        // We'll simply create text clips on 'v2' (broll) for visualization if 'v_sub' logic isn't in reducer yet.
        // ACTUALLY: Let's assume v2 is good for overlays for now.

        captions.forEach((cap, i) => {
            const newClip: VideoClipToken = {
                clipId: `sub_${clip.clipId}_${i}`,
                assetId: cap.text, // abusing assetId for text content for now (VideoPreview needs update to handle this)
                trackId: 'v2',
                startMs: clip.startMs + cap.start_ms,
                endMs: clip.startMs + cap.end_ms,
                trimInMs: 0,
                trimOutMs: 0,
                speed: 1.0
            };
            dispatch({ type: 'ADD_CLIP', trackId: 'v2', clip: newClip });
        });
    };

    return (
        <div style={{ padding: '10px', display: 'flex', gap: '8px', overflowX: 'auto', background: '#222', borderTop: '1px solid #333' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="video/*"
                onChange={handleUpload}
            />

            {/* Playback Controls */}
            <ToolButton onClick={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}>
                {state.isPlaying ? '⏸ Pause' : '▶ Play'}
            </ToolButton>
            <div style={{ width: '1px', background: '#444', margin: '0 4px' }} />

            {/* Main Tools */}
            <ToolButton onClick={() => fileInputRef.current?.click()}>+ Media</ToolButton>
            <ToolButton onClick={handleDelete} disabled={!state.selection}>Delete</ToolButton>
            <ToolButton onClick={handleSplit}>Split</ToolButton>
            <ToolButton onClick={handleCaptions} disabled={!state.selection}>Captions</ToolButton>
            <ToolButton onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', tool: 'stabilize' })} disabled={!state.selection}>Stabilize</ToolButton>

            {/* Speed Context Menu (Simple) */}
            {state.selection && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #444' }}>
                    <span style={{ fontSize: '10px', color: '#888' }}>SPEED:</span>
                    {[0.5, 1.0, 2.0].map(s => (
                        <button
                            key={s}
                            onClick={() => handleSpeed(s)}
                            style={{ background: '#444', border: 'none', color: 'white', fontSize: '10px', padding: '4px', borderRadius: '2px', cursor: 'pointer' }}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            )}

            <div style={{ flex: 1 }} />

            <button style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                EXPORT
            </button>
        </div>
    );
};

const ToolButton = ({ children, onClick, disabled, style }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: disabled ? '#333' : '#444',
            opacity: disabled ? 0.5 : 1,
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: disabled ? 'default' : 'pointer',
            fontSize: '12px',
            ...style
        }}
    >
        {children}
    </button>
);
