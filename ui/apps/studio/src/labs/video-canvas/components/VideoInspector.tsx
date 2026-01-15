import React, { useState } from 'react';
import { useVideoCanvasStore } from '../hooks/useVideoCanvasStore';
import { engineClient } from '../services/engineClient';
import { VideoEffectToken } from '../types/videoCanvasTokens';

export const VideoInspector = () => {
    const { state, dispatch } = useVideoCanvasStore();
    const { activeTool } = state.ui;

    if (!activeTool) return null;

    return (
        <div style={{
            width: '280px',
            background: '#1e1e1e',
            borderLeft: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            color: 'white'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>{activeTool}</h3>
                <button
                    onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', tool: null })}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                    ✕
                </button>
            </div>

            {activeTool === 'stabilize' && <StabilizePanel />}
            {/* Future tools: voice_enhance, color_grade */}
        </div>
    );
};

const StabilizePanel = () => {
    const { state, dispatch } = useVideoCanvasStore();
    const [analyzing, setAnalyzing] = useState(false);

    // Get selected clip
    const seq = state.project.sequences.find(s => s.sequenceId === state.project.activeSequenceId);
    const track = seq?.tracks.find(t => t.trackId === state.selection?.trackId);
    const clip = track?.clips.find(c => c.clipId === state.selection?.clipId);

    if (!clip) return <div style={{ color: '#666' }}>Select a clip to stabilize.</div>;

    // Check existing effect
    const stabilizeEffect = clip.effects?.find(e => e.type === 'stabilize') as Extract<VideoEffectToken, { type: 'stabilize' }> | undefined;
    const isStabilized = !!stabilizeEffect;

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const result = await engineClient.analyzeStabilization(clip.assetId);
            if (result.status === 'complete') {
                // Apply default effect
                const newEffects = [...(clip.effects || [])];
                // Remove existing if any
                const idx = newEffects.findIndex(e => e.type === 'stabilize');
                if (idx !== -1) newEffects.splice(idx, 1);

                newEffects.push({ type: 'stabilize', strength: 0.5 });

                dispatch({
                    type: 'UPDATE_CLIP',
                    clipId: clip.clipId,
                    updates: { effects: newEffects }
                });
            }
        } catch (e) {
            alert("Stabilization failed.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleStrengthChange = (val: number) => {
        const newEffects = [...(clip.effects || [])];
        const idx = newEffects.findIndex(e => e.type === 'stabilize');
        if (idx !== -1) {
            newEffects[idx] = { type: 'stabilize', strength: val };
            dispatch({ type: 'UPDATE_CLIP', clipId: clip.clipId, updates: { effects: newEffects } });
        }
    };

    const handleRemove = () => {
        const newEffects = (clip.effects || []).filter(e => e.type !== 'stabilize');
        dispatch({ type: 'UPDATE_CLIP', clipId: clip.clipId, updates: { effects: newEffects } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isStabilized ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#222', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>👋</div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 16px 0' }}>
                        Fix shaky footage with AI stabilization.
                    </p>
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: analyzing ? '#444' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: analyzing ? 'wait' : 'pointer'
                        }}
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Motion'}
                    </button>
                </div>
            ) : (
                <div style={{ background: '#252525', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#4ade80' }}>✓ Stabilized</span>
                        <button onClick={handleRemove} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Remove</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', color: '#ccc' }}>Smoothness ({(stabilizeEffect.strength * 100).toFixed(0)}%)</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={stabilizeEffect.strength}
                            onChange={(e) => handleStrengthChange(parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
