import React from 'react';
import { VideoCanvasProvider, useVideoCanvasStore } from './hooks/useVideoCanvasStore';
// Placeholders/Stubs for surfaces - will be implemented in next step
import { VideoPreview } from './components/VideoPreview';
import { VideoTimeline } from './components/VideoTimeline';
import { VideoTools } from './components/VideoTools';

import { VideoInspector } from './components/VideoInspector';

const VideoCanvasLayout = () => {
    const { state, dispatch } = useVideoCanvasStore();

    // Global Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete Key
            if ((e.key === 'Backspace' || e.key === 'Delete') && state.selection?.clipId) {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                dispatch({ type: 'DELETE_CLIP', clipId: state.selection.clipId });
            }

            // Spacebar: Toggle Playback
            if (e.code === 'Space') {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault(); // Prevent scrolling
                dispatch({ type: 'TOGGLE_PLAYBACK' });
            }

            // CapCut Standard Shortcuts
            // 1. Arrow Keys: Frame Stepping
            if (e.key === 'ArrowLeft') {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                const step = e.shiftKey ? -330 : -33; // 10 frames vs 1 frame (assuming 30fps = 33ms)
                dispatch({ type: 'SET_PLAYHEAD', ms: state.playheadMs + step });
            }
            if (e.key === 'ArrowRight') {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                const step = e.shiftKey ? 330 : 33;
                dispatch({ type: 'SET_PLAYHEAD', ms: state.playheadMs + step });
            }

            // 2. Cmd+B: Split (Trigger Split Tool Logic - which needs to be dispatched or accessible)
            // Ideally we dispatch a generic 'REQUEST_SPLIT' action that the store handles, 
            // OR we rely on the Button in VideoTools. 
            // For now, let's keep logic centralized. If we need Cmd+B global, we should move split logic to reducer/thunk or generic action.
            // Let's implement a 'SPLIT_CONTEXTUAL' action in the reducer that mirrors the VideoTools logic?
            // Actually, for this Sprint, let's just make sure space/delete/arrows work perfectly.
            // Cmd+B requires logic migration. I will add a placeholder dispatch or try to trigger button click?
            // Let's implement 'SPLIT_AT_PLAYHEAD' in reducer next step. For now, arrow keys.
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.selection, dispatch]);

    // Playback Loop
    React.useEffect(() => {
        let lastTime = performance.now();
        let animationFrameId: number;

        const loop = (currentTime: number) => {
            if (state.isPlaying) {
                const delta = currentTime - lastTime;
                // Update playhead
                // Note: We dispatch directly. In a real React app with high frequency, 
                // we might want a ref-based approach or less frequent dispatches if header is heavy.
                // For this version (POC), direct dispatch is acceptable but verify performance (VideoTimeline calls render).
                // Actually, let's just increment by Real Time.
                dispatch({ type: 'SET_PLAYHEAD', ms: state.playheadMs + delta });
            }
            lastTime = currentTime;
            animationFrameId = requestAnimationFrame(loop);
        };

        if (state.isPlaying) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(loop);
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [state.isPlaying, state.playheadMs, dispatch]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row', // Main row
            height: '100vh',
            background: '#0f0f0f',
            color: '#fff',
            overflow: 'hidden'
        }}>
            {/* Main Content Column */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0
            }}>
                {/* Preview Area */}
                <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                    <VideoPreview />
                </div>

                {/* Timeline & Tools */}
                <div style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <VideoTimeline />
                    <VideoTools />
                </div>
            </div>

            {/* Inspector Panel */}
            <VideoInspector />
        </div>
    );
};

export const VideoCanvasPage = () => {
    return (
        <VideoCanvasProvider>
            <VideoCanvasLayout />
        </VideoCanvasProvider>
    );
};
