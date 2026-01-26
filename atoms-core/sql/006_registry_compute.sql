-- Register Compute Infrastructure
INSERT INTO public.services (key, provider, config, description)
VALUES 
    (
        'nexus_compute', 
        'google_cloud_run', 
        '{"region": "us-central1", "service": "atoms-core", "tier": "free"}',
        'Serverless Container for Nexus Engine (OpenCLIP/Whisper)'
    )
ON CONFLICT (key) DO UPDATE SET 
    provider = EXCLUDED.provider,
    config = EXCLUDED.config;
