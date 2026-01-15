/**
 * Video Canvas Token Contract
 * 
 * Defines the serializable state shape for the Video Canvas.
 * These tokens are the "Assembly Language" for the UI and future Agents.
 */

export interface VideoProjectToken {
    projectId: string;
    sequences: VideoSequenceToken[];
    activeSequenceId: string;
    // Future: metadata, linked audio project, etc.
}

export interface VideoSequenceToken {
    sequenceId: string;
    name: string;
    durationMs: number;
    tracks: VideoTrackToken[];
}

export interface VideoTrackToken {
    trackId: string; // "v1", "v2", etc.
    role: "primary" | "broll" | "overlay" | "subtitles";
    clips: VideoClipToken[];
}

export interface VideoClipToken {
    clipId: string;
    assetId: string;        // media_v2 asset_id
    startMs: number;        // start in sequence
    endMs: number;          // end in sequence (calculated derived usually, but helpful to cache)
    trimInMs: number;       // in-clip trim start
    trimOutMs: number;      // in-clip trim end (0 means end of asset)
    speed: number;          // 0.25–2.0
    trackId: string;        // redundancy helpful for selection context

    effects?: VideoEffectToken[];
}

export type VideoEffectToken =
    | { type: 'stabilize'; strength: number } // 0.0 - 1.0
    | { type: 'voice_enhance'; mix: number }  // 0.0 - 1.0
    | { type: 'color_grade'; lut: string };


// Selection envelope for collab/agents
export interface VideoSelectionToken {
    surface: "video_timeline";
    projectId: string;
    sequenceId: string;
    trackId: string;
    clipId?: string;
    atMs?: number; // Cursor position or specific point of interest
}

// Initial Empty State Factory
export const createEmptyProject = (): VideoProjectToken => ({
    projectId: `proj_${Date.now()}`,
    sequences: [{
        sequenceId: `seq_${Date.now()}`,
        name: "Main Sequence",
        durationMs: 0,
        tracks: [
            { trackId: "v1", role: "primary", clips: [] },
            { trackId: "v2", role: "broll", clips: [] }
        ]
    }],
    activeSequenceId: `seq_${Date.now()}` // matches above
});
