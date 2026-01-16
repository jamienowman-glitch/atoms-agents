import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    VideoProjectToken,
    VideoSequenceToken,
    VideoClipToken,
    VideoSelectionToken,
    createEmptyProject
} from '@/lib/tokens/videoTokens';

// --- Actions ---
type Action =
    | { type: 'SET_PROJECT'; project: VideoProjectToken }
    | { type: 'ADD_CLIP'; trackId: string; clip: VideoClipToken }
    | { type: 'UPDATE_CLIP'; clipId: string; updates: Partial<VideoClipToken> }
    | { type: 'SPLIT_CLIP'; originalClipId: string; newClips: [VideoClipToken, VideoClipToken] }
    | { type: 'SELECT_ITEM'; selection: VideoSelectionToken | null }
    | { type: 'SET_ACTIVE_SEQUENCE'; sequenceId: string }
    | { type: 'SET_PLAYHEAD'; ms: number }
    | { type: 'TOGGLE_PLAYBACK' }
    | { type: 'SET_ACTIVE_TOOL'; tool: string | null }
    | { type: 'DELETE_CLIP'; clipId: string }
    | { type: 'TOGGLE_VOICE_ENHANCE'; clipId: string };

// --- State ---
interface VideoLensState {
    project: VideoProjectToken;
    selection: VideoSelectionToken | null;
    playheadMs: number;
    isPlaying: boolean;
    ui: {
        activeTool: string | null;
    };
}

const initialState: VideoLensState = {
    project: createEmptyProject(),
    selection: null,
    playheadMs: 0,
    isPlaying: false,
    ui: {
        activeTool: null
    }
};

// --- Reducer ---
function videoLensReducer(state: VideoLensState, action: Action): VideoLensState {
    switch (action.type) {
        case 'SET_PROJECT':
            return { ...state, project: action.project };

        case 'SELECT_ITEM':
            return { ...state, selection: action.selection };

        case 'SET_ACTIVE_SEQUENCE':
            const newProjectActive = { ...state.project, activeSequenceId: action.sequenceId };
            return { ...state, project: newProjectActive };

        case 'SET_PLAYHEAD':
            return { ...state, playheadMs: Math.max(0, action.ms) };

        case 'TOGGLE_PLAYBACK':
            return { ...state, isPlaying: !state.isPlaying };

        case 'SET_ACTIVE_TOOL':
            return { ...state, ui: { ...state.ui, activeTool: action.tool } };

        case 'ADD_CLIP': {
            // Deep clone to avoid mutation side-effects
            const newProject = JSON.parse(JSON.stringify(state.project)) as VideoProjectToken;
            const seq = newProject.sequences.find(s => s.sequenceId === newProject.activeSequenceId);
            if (!seq) return state;

            const track = seq.tracks.find(t => t.trackId === action.trackId);
            if (track) {
                track.clips.push(action.clip);
                // Sort clips by start time
                track.clips.sort((a, b) => a.startMs - b.startMs);
            } else if (action.trackId === 'v2') {
                // Auto-create v2 if missing (simple POC logic)
                seq.tracks.push({ trackId: 'v2', role: 'broll', clips: [action.clip] });
            }

            return { ...state, project: newProject };
        }

        case 'UPDATE_CLIP': {
            const newProject = JSON.parse(JSON.stringify(state.project)) as VideoProjectToken;
            const seq = newProject.sequences.find(s => s.sequenceId === newProject.activeSequenceId);
            if (!seq) return state;

            for (const track of seq.tracks) {
                const clipIndex = track.clips.findIndex(c => c.clipId === action.clipId);
                if (clipIndex !== -1) {
                    track.clips[clipIndex] = { ...track.clips[clipIndex], ...action.updates };
                    break;
                }
            }
            return { ...state, project: newProject };
        }

        case 'SPLIT_CLIP': {
            const newProject = JSON.parse(JSON.stringify(state.project)) as VideoProjectToken;
            const seq = newProject.sequences.find(s => s.sequenceId === newProject.activeSequenceId);
            if (!seq) return state;

            // Find and replace the original clip with two new ones
            for (const track of seq.tracks) {
                const idx = track.clips.findIndex(c => c.clipId === action.originalClipId);
                if (idx !== -1) {
                    track.clips.splice(idx, 1, ...action.newClips);
                    break;
                }
            }
            return { ...state, project: newProject };
        }

        case 'DELETE_CLIP': {
            const newProject = JSON.parse(JSON.stringify(state.project)) as VideoProjectToken;
            const seq = newProject.sequences.find(s => s.sequenceId === newProject.activeSequenceId);
            if (!seq) return state;

            for (const track of seq.tracks) {
                const idx = track.clips.findIndex(c => c.clipId === action.clipId);
                if (idx !== -1) {
                    const deletedClip = track.clips[idx];
                    const gapDuration = deletedClip.endMs - deletedClip.startMs;

                    // Remove the clip
                    track.clips.splice(idx, 1);

                    // Contextual Logic: Ripple Delete on 'v1' (Main Track)
                    // CapCut Standard: Main track dictates time. Gaps close.
                    if (track.trackId === 'v1') {
                        // Shift all subsequent clips left
                        for (let i = idx; i < track.clips.length; i++) {
                            const c = track.clips[i];
                            c.startMs -= gapDuration;
                            c.endMs -= gapDuration;
                        }
                    }

                    break;
                }
            }

            // If the deleted clip was selected, clear selection
            const newSelection = state.selection?.clipId === action.clipId ? null : state.selection;

            return { ...state, project: newProject, selection: newSelection };
        }

        case 'TOGGLE_VOICE_ENHANCE': {
            const newProject = JSON.parse(JSON.stringify(state.project)) as VideoProjectToken;
            const seq = newProject.sequences.find(s => s.sequenceId === newProject.activeSequenceId);
            if (!seq) return state;

            for (const track of seq.tracks) {
                const clip = track.clips.find(c => c.clipId === action.clipId);
                if (clip) {
                    clip.voiceEnhanced = !clip.voiceEnhanced;
                    // In a real app, we might also reset 'effects' or trigger processing status here
                    break;
                }
            }
            return { ...state, project: newProject };
        }

        default:
            return state;
    }
}

// --- Context ---
const VideoLensContext = createContext<{
    state: VideoLensState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

export const VideoLensProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(videoLensReducer, initialState);
    return (
        <VideoLensContext.Provider value={{ state, dispatch }
        }>
            {children}
        </VideoLensContext.Provider>
    );
};

// --- Hook ---
export const useVideoLensStore = () => {
    const context = useContext(VideoLensContext);
    if (!context) {
        throw new Error("useVideoLensStore must be used within a VideoLensProvider");
    }
    return context;
};
