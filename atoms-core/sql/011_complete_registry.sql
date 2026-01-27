-- 12. Tiers (COGS / Pricing Model)
CREATE TABLE public.tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,     -- 'free', 'pro', 'enterprise'
    name TEXT NOT NULL,           -- 'Free Tier'
    price_cents INTEGER DEFAULT 0,
    credits_monthly INTEGER DEFAULT 100,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Infrastructure (Resource Tracking)
CREATE TABLE public.infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,     -- 'aws_s3_media', 'gcp_cloud_run'
    name TEXT NOT NULL,
    type TEXT NOT NULL,           -- 'storage', 'compute', 'db'
    status TEXT DEFAULT 'active', -- 'active', 'maintenance'
    config JSONB DEFAULT '{}',    -- Region, Bucket Name, Limits
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. UI Atoms (Design System Registry)
CREATE TABLE public.ui_atoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,     -- 'button', 'card', 'input'
    name TEXT NOT NULL,
    category TEXT NOT NULL,       -- 'layout', 'form', 'typography'
    props_schema JSONB DEFAULT '{}', -- Expected React Props
    status TEXT DEFAULT 'live',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_atoms ENABLE ROW LEVEL SECURITY;

-- Read-Only for Users (Public Info)
CREATE POLICY "Public Read Tiers" ON public.tiers FOR SELECT USING (true);
CREATE POLICY "Public Read Infra" ON public.infrastructure FOR SELECT USING (true); -- Maybe restrict? Leaving open for dashboard for now.
CREATE POLICY "Public Read UI Atoms" ON public.ui_atoms FOR SELECT USING (true);
