-- 1. Create Spaces Registry (The "Clusters")
CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE, -- 'health', 'business', 'finance'
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Initial Spaces (The Contexts)
INSERT INTO public.spaces (key, name, description)
VALUES 
    ('health', 'Health & Vitality', 'Shared context for Training, Diet, and Sleep surfaces.'),
    ('marketing', 'Marketing & Growth', 'Shared context for Leads, Campaigns, and Brand.'),
    ('quantum', 'Quantum & Logic', 'Shared context for Computing, Logic, and Reasoning.'),
    ('tuning', 'Tuning & Optimization', 'Shared context for System Performance and Weighing.')
ON CONFLICT (key) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Remove Legacy if it exists
DELETE FROM public.spaces WHERE key NOT IN ('health', 'marketing', 'quantum', 'tuning');

-- 3. Update Surfaces to belong to a Space
ALTER TABLE public.surfaces 
ADD COLUMN IF NOT EXISTS space_key TEXT REFERENCES public.spaces(key) DEFAULT 'business';

-- 4. Enable RLS (Standard)
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.spaces;
CREATE POLICY "Enable read access for all users" ON public.spaces FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.spaces;
CREATE POLICY "Enable insert for authenticated users only" ON public.spaces FOR INSERT WITH CHECK (auth.role() = 'authenticated');

