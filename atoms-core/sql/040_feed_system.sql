-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE public.feed_type AS ENUM ('RSS', 'YOUTUBE_CHANNEL', 'SHOPIFY_WEBHOOK', 'CALENDAR', 'SYSTEM_INJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.feed_status AS ENUM ('ACTIVE', 'PAUSED', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Feeds Config (The Channels)
CREATE TABLE IF NOT EXISTS public.feeds_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_key TEXT NOT NULL REFERENCES public.spaces(key),
    tenant_id UUID, -- NULL = Global, UUID = Private Override
    type public.feed_type NOT NULL,
    source_url TEXT NOT NULL,
    refresh_rate INTERVAL DEFAULT '1 hour',
    meta_config JSONB DEFAULT '{}'::jsonb,
    status public.feed_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Feed Items (The Content)
CREATE TABLE IF NOT EXISTS public.feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID NOT NULL REFERENCES public.feeds_config(id) ON DELETE CASCADE,
    space_key TEXT NOT NULL, -- Denormalized for query speed
    tenant_id UUID, -- Denormalized for RLS speed
    external_id TEXT NOT NULL, -- Unique ID from source
    content_payload JSONB NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(feed_id, external_id)
);

-- 4. Enable RLS
ALTER TABLE public.feeds_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

-- 5. Policies

-- Feeds Config
DROP POLICY IF EXISTS "Read Global or Own Feeds" ON public.feeds_config;
CREATE POLICY "Read Global or Own Feeds" ON public.feeds_config
    FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());

DROP POLICY IF EXISTS "Manage Own Feeds" ON public.feeds_config;
CREATE POLICY "Manage Own Feeds" ON public.feeds_config
    FOR ALL USING (tenant_id = auth.uid());

-- Feed Items
DROP POLICY IF EXISTS "Read Global or Own Feed Items" ON public.feed_items;
CREATE POLICY "Read Global or Own Feed Items" ON public.feed_items
    FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());

DROP POLICY IF EXISTS "Manage Own Feed Items" ON public.feed_items;
CREATE POLICY "Manage Own Feed Items" ON public.feed_items
    FOR ALL USING (tenant_id = auth.uid());
