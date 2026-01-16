export type AtelierType = 'canvas' | 'atom' | 'surface' | 'token_set';

export interface AtelierManifest {
    id: string;           // e.g. "video_canvas_v1"
    name: string;         // e.g. "Video Editor"
    type: AtelierType;    // "canvas" (NOT node)
    description: string;
    capabilities: string[]; // e.g. ["timeline_scrub", "layer_composite"]
    acceptedTokens: string[]; // e.g. ["video_clip", "audio_track"]
}
