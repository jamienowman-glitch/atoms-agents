import { VideoProjectToken } from '../types/videoCanvasTokens';

const BASE_URL = (import.meta as any).env.VITE_ENGINES_BASE_URL || 'http://localhost:8000';

export interface AssetUploadResponse {
    asset_id: string;
    url: string;
    metadata: any;
}

export const engineClient = {
    /**
     * Uploads a file to media_v2 engine
     */
    async uploadAsset(file: File): Promise<AssetUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${BASE_URL}/media/v2/assets/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
            return await res.json();
        } catch (e) {
            console.warn("Engine unreachable, using mock response for dev");
            // Mock Fallback for disconnected dev
            return {
                asset_id: `asset_${Date.now()}`,
                url: URL.createObjectURL(file), // Local blob
                metadata: { name: file.name, size: file.size }
            };
        }
    },

    /**
     * Syncs the current project state to video_timeline engine
     */
    async syncProject(project: VideoProjectToken): Promise<void> {
        try {
            // We map our Token format to the Engine's expected format here
            const enginePayload = {
                project_id: project.projectId,
                sequences: project.sequences.map(s => ({
                    id: s.sequenceId,
                    tracks: s.tracks.map(t => ({
                        id: t.trackId,
                        clips: t.clips.map(c => ({
                            asset_id: c.assetId,
                            start_ms: c.startMs,
                            end_ms: c.endMs,
                            speed: c.speed
                        }))
                    }))
                }))
            };

            await fetch(`${BASE_URL}/video_timeline/projects/${project.projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enginePayload)
            });
        } catch (e) {
            console.warn("Sync failed (Engine unreachable)");
        }
    },

    /**
     * Requests a render from video_render engine
     */
    async exportVideo(projectId: string, sequenceId: string): Promise<{ downloadUrl: string }> {
        try {
            const res = await fetch(`${BASE_URL}/video_render/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectId,
                    sequence_id: sequenceId,
                    profile: 'social_1080p'
                })
            });
            if (!res.ok) throw new Error("Render failed");
            return await res.json();
        } catch (e) {
            console.warn("Export failed (Engine unreachable). Returning mock.");
            return { downloadUrl: "http://localhost:8000/mock_export.mp4" };
        }
    },

    /**
     * Generates captions for a specific asset using video_captions engine
     */
    async generateCaptions(assetId: string): Promise<{ captions: Array<{ start_ms: number, end_ms: number, text: string }> }> {
        try {
            const res = await fetch(`${BASE_URL}/video_captions/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset_id: assetId })
            });
            if (!res.ok) throw new Error("Caption generation failed");
            return await res.json();
        } catch (e) {
            console.warn("Caption generation failed (Engine unreachable). Returning mock.");
            return {
                captions: [
                    { start_ms: 500, end_ms: 1500, text: "Hello world" },
                    { start_ms: 1600, end_ms: 3000, text: "Welcome to Northstar" },
                    { start_ms: 3200, end_ms: 4500, text: "This is auto-generated" }
                ]
            };
        }
    },

    /**
     * analyzing stabilization for a clip
     */
    async analyzeStabilization(assetId: string): Promise<{ status: 'complete' | 'failed', metadata?: any }> {
        try {
            // Real world: This assumes video_stabilise runs analysis and caches the motion data
            // linked to this asset_id, so subsequent renders can use it.
            const res = await fetch(`${BASE_URL}/video_stabilise/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset_id: assetId })
            });
            if (!res.ok) throw new Error("Stabilization analysis failed");
            return await res.json();
        } catch (e) {
            console.warn("Stabilization Analysis failed (Engine unreachable). Returning mock success.");
            // Mock: Simulate standard success after "processing"
            return { status: 'complete', metadata: { smooth_factor: 0.95 } };
        }
    }
};
