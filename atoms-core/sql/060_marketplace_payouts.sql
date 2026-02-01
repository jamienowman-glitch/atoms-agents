-- 060_marketplace_payouts.sql
-- Implements the Financial Backend for the Marketplace Pivot.

-- =========================================================
-- 1. Ownership Patch (Who owns the muscle?)
-- =========================================================
ALTER TABLE public.muscles 
ADD COLUMN IF NOT EXISTS owner_tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_muscles_owner ON public.muscles(owner_tenant_id);

-- =========================================================
-- 2. Marketplace Contracts (Terms of Service)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.marketplace_contracts (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    platform_fee_percent NUMERIC DEFAULT 30.0 CHECK (platform_fee_percent BETWEEN 0 AND 100),
    payout_wallet_address TEXT,
    payout_chain TEXT DEFAULT 'solana' CHECK (payout_chain IN ('solana', 'ethereum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.marketplace_contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenants View Own Contract" ON public.marketplace_contracts;
CREATE POLICY "Tenants View Own Contract" ON public.marketplace_contracts 
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.tenant_members WHERE tenant_id = marketplace_contracts.tenant_id));

-- =========================================================
-- 3. Developer Balance (The Earned Ledger)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.developer_balance (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    pending_snax BIGINT DEFAULT 0,
    lifetime_earnings_snax BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.developer_balance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenants View Own Balance" ON public.developer_balance;
CREATE POLICY "Tenants View Own Balance" ON public.developer_balance 
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.tenant_members WHERE tenant_id = developer_balance.tenant_id));

-- =========================================================
-- 4. Payout History (Settlements)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.payout_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    snax_amount BIGINT NOT NULL,
    crypto_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL, -- 'SOL', 'USDC', 'ETH'
    tx_hash TEXT,
    status TEXT DEFAULT 'pending', -- pending, complete, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.payout_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenants View Own Payouts" ON public.payout_history;
CREATE POLICY "Tenants View Own Payouts" ON public.payout_history 
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.tenant_members WHERE tenant_id = payout_history.tenant_id));

-- =========================================================
-- 5. RPC UPDATE: The Ledger Split Logic
-- =========================================================
CREATE OR REPLACE FUNCTION public.snax_charge(
    p_tenant_id uuid, -- The Consumer (Paying User)
    p_tool_key text,
    p_cost_snax bigint,
    p_request_id text,
    p_reason text DEFAULT 'usage'
)
RETURNS TABLE (new_balance bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_balance bigint;
    v_wallet_id uuid;
    v_owner_id uuid;
    v_platform_fee numeric;
    v_dev_share bigint;
BEGIN
    -- 1. Check Permissions (Service Role Only)
    IF NOT (SELECT auth.role() = 'service_role') THEN RAISE EXCEPTION 'forbidden'; END IF;
    IF p_cost_snax IS NULL OR p_cost_snax <= 0 THEN RAISE EXCEPTION 'invalid_cost'; END IF;

    -- 2. Lock User Wallet
    SELECT id, balance_snax INTO v_wallet_id, v_balance
    FROM public.snax_wallets
    WHERE tenant_id = p_tenant_id
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN RAISE EXCEPTION 'wallet_not_found'; END IF;
    IF v_balance < p_cost_snax THEN RAISE EXCEPTION 'insufficient_snax'; END IF;

    -- 3. Deduct User Balance
    UPDATE public.snax_wallets
    SET balance_snax = balance_snax - p_cost_snax, updated_at = now()
    WHERE id = v_wallet_id
    RETURNING balance_snax INTO v_balance;

    -- 4. Log Charge to User Ledger
    INSERT INTO public.snax_ledger (wallet_id, tenant_id, delta_snax, reason, reference_id)
    VALUES (v_wallet_id, p_tenant_id, -p_cost_snax, COALESCE(p_reason, p_tool_key), p_request_id);

    -- 5. THE MARKETPLACE SPLIT
    -- Find Muscle Owner
    SELECT owner_tenant_id INTO v_owner_id FROM public.muscles WHERE key = p_tool_key;

    -- If Owner Exists AND is NOT the Consumer (Self-usage is free? No, self-usage pays but earns back?)
    -- Logic: If Owner is NOT NULL, we calculate split.
    IF v_owner_id IS NOT NULL THEN
        -- Get Fee % (Default 30)
        SELECT platform_fee_percent INTO v_platform_fee 
        FROM public.marketplace_contracts 
        WHERE tenant_id = v_owner_id;

        IF v_platform_fee IS NULL THEN v_platform_fee := 30.0; END IF;

        -- Calculate Dev Share (cost * (1 - fee))
        -- e.g. 10 snax * (1 - 0.3) = 7 snax
        v_dev_share := FLOOR(p_cost_snax * (1 - (v_platform_fee / 100.0)));

        -- Credit Developer Ledger (Securely)
        INSERT INTO public.developer_balance (tenant_id, pending_snax, lifetime_earnings_snax)
        VALUES (v_owner_id, v_dev_share, v_dev_share)
        ON CONFLICT (tenant_id) DO UPDATE SET
            pending_snax = developer_balance.pending_snax + EXCLUDED.pending_snax,
            lifetime_earnings_snax = developer_balance.lifetime_earnings_snax + EXCLUDED.lifetime_earnings_snax,
            updated_at = now();
    END IF;

    RETURN QUERY SELECT v_balance AS new_balance;
END;
$$;
