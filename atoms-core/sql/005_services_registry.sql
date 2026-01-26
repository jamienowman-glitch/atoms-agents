-- 1. Create Services Registry (The "Infrastructure Configuration")
CREATE TABLE IF NOT EXISTS public.services (
    key TEXT PRIMARY KEY, -- 'nexus_text', 'nexus_image', 'storage_media'
    provider TEXT NOT NULL, -- 'mistral', 'open_clip', 's3'
    config JSONB DEFAULT '{}'::jsonb, -- Store region, model_id, bucket_name
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

-- 2. Seed Initial Configuration (The "Free Tier" Stack)
INSERT INTO public.services (key, provider, config, description)
VALUES 
    (
        'nexus_text', 
        'mistral', 
        '{"model": "mistral-embed", "api_key_path": "~/northstar-keys/mistral-key.txt"}',
        'Text Embedding Provider for Nexus'
    ),
    (
        'nexus_image', 
        'open_clip', 
        '{"model": "ViT-B-32", "pretrained": "laion2b_s34b_b79k"}',
        'Image Vector Provider (Local CPU)'
    ),
    (
        'storage_media', 
        's3', 
        '{"bucket": "northstar-media-dev", "region": "us-east-1"}',
        'Primary storage for User Uploads'
    ),
    (
        'storage_vectors', 
        's3', 
        '{"bucket": "northstar-vectors-dev", "region": "us-east-1"}',
        'Backing store for LanceDB'
    )
ON CONFLICT (key) DO UPDATE SET 
    provider = EXCLUDED.provider,
    config = EXCLUDED.config;

-- 3. Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
CREATE POLICY "Enable read access for all users" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert/update for authenticated users only" ON public.services;
CREATE POLICY "Enable insert/update for authenticated users only" ON public.services FOR ALL USING (auth.role() = 'authenticated');
