-- 1. Create Domains Registry (The URLs)
-- A "Domain" is strictly a DNS entry or URL mapping to a Surface.
CREATE TABLE public.domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL UNIQUE,      -- e.g. "marketing.atoms.fam" or "agnx.northstar.app"
    surface_key TEXT NOT NULL REFERENCES public.surfaces(key), -- Which Surface loads here?
    tenant_id UUID,                -- Optional: If a tenant owns a custom domain
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(url, tenant_id)
);

-- 2. Seed Standard Domains
INSERT INTO public.domains (url, surface_key)
VALUES
    ('console.atoms.fam', 'atoms_app'), -- The God Console (if it exists as a surface key)
    ('marketing.atoms.fam', 'agnx'),
    ('health.atoms.fam', 'mc2'),
    ('voice.atoms.fam', 'vous2'),
    ('3d.atoms.fam', 'x3')
ON CONFLICT (url) DO NOTHING;

-- 3. RLS
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read Public Domains" ON public.domains FOR SELECT USING (true);
