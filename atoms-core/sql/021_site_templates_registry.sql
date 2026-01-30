-- 021_site_templates_registry.sql
-- Adds registries for Site Templates, Owned Domains, and Typography Presets

-- 1. Site Templates Registry
-- Defines the available templates for the "Press" engine.
CREATE TABLE IF NOT EXISTS public.site_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    template_path TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Owned Domains Registry
-- Tracks domains purchased/owned by tenants or the platform.
CREATE TABLE IF NOT EXISTS public.owned_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    root_domain TEXT UNIQUE NOT NULL,
    registrar TEXT,
    status TEXT DEFAULT 'active',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Typography Presets Registry
-- Replaces/Extends the font_presets table with a more robust schema.
CREATE TABLE IF NOT EXISTS public.typography_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_name TEXT NOT NULL,
    preset_name TEXT NOT NULL,
    axes JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owned_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typography_presets ENABLE ROW LEVEL SECURITY;

-- Default Policies (Public Read for Templates/Typography, Restricted for Domains)
CREATE POLICY "Public Read Templates" ON public.site_templates FOR SELECT USING (true);
CREATE POLICY "Public Read Typography" ON public.typography_presets FOR SELECT USING (true);
-- Owned domains likely need tenant restriction, but for now we leave it closed (default deny) or add a service role policy if needed.
-- Adding a basic service role policy for all (simulated by using service role key).
