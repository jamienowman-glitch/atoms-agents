-- 061_merkle_roots.sql
-- The "Seals of Truth" for the Snax Economy.

CREATE TABLE IF NOT EXISTS public.snax_merkle_roots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Time Window Covered
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- The Fingerprint
    merkle_root TEXT NOT NULL,
    total_transactions INTEGER NOT NULL,
    
    -- The Anchor (Proof)
    chain TEXT DEFAULT 'solana', -- solana, ethereum
    tx_signature TEXT UNIQUE, -- The transaction hash on the blockchain
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, anchoring, anchored, failed
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Public Read (Transparency), Service Write
ALTER TABLE public.snax_merkle_roots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Transparency" ON public.snax_merkle_roots
    FOR SELECT USING (true);

CREATE POLICY "System Anchor Write" ON public.snax_merkle_roots
    FOR ALL USING (auth.role() = 'service_role');
