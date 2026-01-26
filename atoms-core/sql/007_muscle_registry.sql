-- MUSCLE REGISTRY
-- The catalog of "Heavy Lifting" tools available for sale/usage.

CREATE TABLE IF NOT EXISTS public.muscles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description_human TEXT, -- "Extracts frames from video"
    description_tech TEXT, -- "FFmpeg scale=512:-1, 3 keyframes"
    mcp_endpoint TEXT, -- "https://connect.atoms.fam/mcp/video"
    api_endpoint TEXT, -- Internal: "http://atoms-muscle/muscle/video"
    status TEXT DEFAULT 'dev', -- 'ready', 'beta', 'dev'
    version TEXT DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE public.muscles ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (Public Catalog)
CREATE POLICY "Public Read Access" ON public.muscles FOR SELECT USING (true);
-- Allow write access only to Service Role (System)
CREATE POLICY "System Write Access" ON public.muscles FOR ALL USING (auth.role() = 'service_role');

-- SEED DATA (The stuff we built)
INSERT INTO public.muscles (key, name, description_human, description_tech, mcp_endpoint, api_endpoint, status)
VALUES 
    (
        'muscle_video_extract', 
        'Nexus Cutter (FFmpeg)', 
        'Instantly extracts the beginning, middle, and end frames from any video + audio track.', 
        'FFmpeg Process. Input: S3/Local Path. Output: 3x JPG 512px + MP3. Latency: ~2s per min.', 
        'https://connect.atoms.fam/mcp/video-cutter',
        '/muscle/ingest/video',
        'ready'
    ),
    (
        'muscle_audio_whisper', 
        'Nexus Ear (Whisper)', 
        'High-accuracy speech-to-text transcription running on private cloud.', 
        'Faster-Whisper (int8) base model. Supports 100+ languages. Returns plaintext.', 
        'https://connect.atoms.fam/mcp/transcribe',
        '/muscle/audio/transcribe',
        'ready'
    ),
    (
        'muscle_vision_clip', 
        'Nexus Eye (OpenCLIP)', 
        'Converts images into 512-dimension vector embeddings for semantic search.', 
        'OpenCLIP ViT-B-32 (Laion2B). Returns List[float]. Metric: Cosine Similarity.', 
        'https://connect.atoms.fam/mcp/embed-vision',
        '/muscle/vision/embed',
        'ready'
    )
ON CONFLICT (key) DO UPDATE SET 
    name = EXCLUDED.name,
    description_human = EXCLUDED.description_human,
    description_tech = EXCLUDED.description_tech,
    status = EXCLUDED.status;
