-- 1. Create Whiteboards Table (Persistent Flow State)
CREATE TABLE IF NOT EXISTS public.whiteboards (
    run_id TEXT PRIMARY KEY,    -- The Agent Flow Run ID
    data JSONB DEFAULT '{}',    -- The Brain Dump (State)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.whiteboards ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Service Role (God Mode) gets full access (Agents use Service Key usually)
-- For user-facing debug, allow owner access if run_id implies ownership (complex, simplified for now)
CREATE POLICY "Enable all for authenticated" ON public.whiteboards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for service_role" ON public.whiteboards FOR ALL USING (true);
