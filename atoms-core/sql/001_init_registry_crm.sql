-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- A. SYSTEM REGISTRY (Configuration)
-- ==========================================

-- 2. Surfaces (The Apps: Marketing, Health, etc.)
CREATE TABLE public.surfaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,          -- e.g. 'agnx', 'mc2'
    name TEXT NOT NULL,         -- e.g. 'AGNˣ Marketing'
    description TEXT,
    config JSONB DEFAULT '{}',  -- Default configuration
    tenant_id UUID,             -- NULL = Global, UUID = Private Override
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, tenant_id)      -- Unique key per tenant (or global)
);

-- 3. Canvases (The UI Templates: Gantt, Whiteboard)
CREATE TABLE public.canvases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    structure JSONB NOT NULL,   -- The "Contract" (Atom/Molecule/Tools)
    tenant_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, tenant_id)
);

-- 4. Muscles (The Backend Tools: Video, Audio)
CREATE TABLE public.muscles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    spec JSONB NOT NULL,        -- MCP Scope Definition
    tenant_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, tenant_id)
);

-- 5. Agents (The Personas)
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    persona JSONB NOT NULL,     -- Voice, Style, Model config
    tenant_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, tenant_id)
);

-- ==========================================
-- B. USER DATA (Projects & CRM)
-- ==========================================

-- 6. Projects (Nested Workspace)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,    -- Owner
    parent_id UUID REFERENCES public.projects(id), -- Nesting
    name TEXT NOT NULL,
    type TEXT NOT NULL,         -- 'website', 'marketing_campaign', etc.
    state JSONB DEFAULT '{}',   -- The "Save File"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Leads (The "Klaviyo Killer" CRM)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,    -- The Business Owner
    email TEXT NOT NULL,
    surface_key TEXT NOT NULL,  -- Context: 'agnx', 'mc2'
    utm_source TEXT,
    utm_campaign TEXT,
    persona_data JSONB,         -- AI Vibe Analysis
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email, surface_key)
);

-- 8. Tenant Configs (Per-Surface Settings)
CREATE TABLE public.tenant_configs (
    tenant_id UUID NOT NULL,
    surface_key TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, surface_key)
);

-- ==========================================
-- C. SECURITY (Row Level Security)
-- ==========================================

ALTER TABLE public.surfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_configs ENABLE ROW LEVEL SECURITY;

-- Policy: System Tables (Read Global, Read Own Private)
CREATE POLICY "Read Global Surfaces" ON public.surfaces FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());
CREATE POLICY "Read Global Canvases" ON public.canvases FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());
CREATE POLICY "Read Global Muscles" ON public.muscles FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());
CREATE POLICY "Read Global Agents" ON public.agents FOR SELECT USING (tenant_id IS NULL OR tenant_id = auth.uid());

-- Policy: User Tables (Isolation)
CREATE POLICY "Projects Isolation" ON public.projects USING (tenant_id = auth.uid());
CREATE POLICY "Leads Isolation" ON public.leads USING (tenant_id = auth.uid());
CREATE POLICY "Config Isolation" ON public.tenant_configs USING (tenant_id = auth.uid());

-- Policy: God Mode Write (Temporary: Allow Service Role full access, or check for specific claim)
-- For now, we assume Dashboard uses Service Role for Admin tasks or the User is the owner.
CREATE POLICY "Write Own Surfaces" ON public.surfaces FOR ALL USING (tenant_id = auth.uid());
CREATE POLICY "Write Own Canvases" ON public.canvases FOR ALL USING (tenant_id = auth.uid());
-- (Note: 'Global' writes require Service Role or Super Admin check, which bypasses RLS if configured correctly in client)
