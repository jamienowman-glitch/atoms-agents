-- 1. Register Memory Services (Whiteboard & Blackboard)
-- clarifying the "Just use RAM" default configuration.

INSERT INTO public.services (key, provider, config, description)
VALUES 
    (
        'memory_whiteboard', 
        'supabase', 
        '{"table": "whiteboards", "key_col": "run_id", "val_col": "data"}',
        'Flow State Memory (Shared). Persistent (Postgres).'
    ),
    (
        'memory_blackboard', 
        'direct', 
        '{"type": "json-packet", "size_limit_kb": 1024}',
        'Node State Memory (Ephemeral). JSON Payload.'
    )
ON CONFLICT (key) DO UPDATE SET 
    provider = EXCLUDED.provider,
    config = EXCLUDED.config,
    description = EXCLUDED.description;
