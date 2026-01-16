import React from 'react';

// Placeholder for future FloatingControlsDock in Workbench
// This component is intended to replace or augment the multi21 dock eventually.
export const FloatingControlsDock = () => {
    return (
        <div style={{ display: 'none' }}>
            {/* Future Dock UI */}
        </div>
    );
};

/*
// ============================================================================
//  EXTRACTED VIDEO TOOLS LOGIC (Surface Mapping)
//  Source: ui/apps/studio/src/labs/video-canvas/components/VideoTools.tsx
// ============================================================================

// --- HANDLERS ---

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
        }
    };

    const handleSpeed = (speed: number) => {
        if (!state.selection || !state.selection.clipId) return;
        dispatch({ type: 'UPDATE_CLIP', clipId: state.selection.clipId, updates: { speed } });
    };

    // --- UI ELEMENTS (To be integrated into Dock) ---
    /*
        <ToolButton onClick={handleDelete} disabled={!state.selection}>Delete</ToolButton>
        <ToolButton onClick={handleSplit}>Split</ToolButton>
        
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
    */
*/
