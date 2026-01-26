-- 1. Create Domains Registry (The "Clusters")
CREATE TABLE IF NOT EXISTS public.domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE, -- 'health', 'business', 'finance'
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Initial Domains (The Standard Logic)
INSERT INTO public.domains (key, name, description)
VALUES 
    ('health', 'Health & Vitality', 'Shared context for Training, Diet, and Sleep surfaces.'),
    ('business', 'Brand & Business', 'Marketing, CRM, Style, Ideas, and KPIs.'),
    ('finance', 'Wealth & Assets', 'Shared context for Crypto, Stocks, and Accounting surfaces.')
ON CONFLICT (key) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Remove Social if it exists (Merged into Business)
DELETE FROM public.domains WHERE key = 'social';

-- 3. Update Surfaces to belong to a Domain
ALTER TABLE public.surfaces 
ADD COLUMN IF NOT EXISTS domain_key TEXT REFERENCES public.domains(key) DEFAULT 'business';

-- 4. Enable RLS (Standard)
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.domains;
CREATE POLICY "Enable read access for all users" ON public.domains FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.domains;
CREATE POLICY "Enable insert for authenticated users only" ON public.domains FOR INSERT WITH CHECK (auth.role() = 'authenticated');
