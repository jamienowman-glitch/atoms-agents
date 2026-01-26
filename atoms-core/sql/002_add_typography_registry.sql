-- 002_add_typography_registry.sql
-- Adds the Typography Registry for Agentflow/Atoms-View

CREATE TABLE IF NOT EXISTS public.font_families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. "Roboto Flex"
    type TEXT NOT NULL, -- "Variable", "Static"
    source TEXT NOT NULL, -- "Google Fonts", "Local", "System"
    weights TEXT, -- "100-900"
    variable_name TEXT, -- "--font-roboto-flex"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.font_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.font_families(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- "Thin", "Bold Italic"
    axes JSONB NOT NULL, -- { "wght": 100, "slnt": 0, ... }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.font_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.font_presets ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for rendering)
CREATE POLICY "Public Read Access Families" ON public.font_families FOR SELECT USING (true);
CREATE POLICY "Public Read Access Presets" ON public.font_presets FOR SELECT USING (true);
