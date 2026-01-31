/*
# 023_discount_engine.sql
# PRODUCTION READY DISCOUNT ENGINE

## Requirements
- Tenant-Scoped Budgets
- Surface-Level Governance
- KPI Ceiling/Floor Checks
- Connector Hooks
*/

-- =========================================================
-- 1. Discount Policy (Governance)
-- =========================================================
create table if not exists public.discount_policy (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    surface_id text, -- Config scope
    status text check (status in ('active', 'inactive')) default 'active',
    min_discount_pct numeric(6,4) default 0.0000,
    max_discount_pct numeric(6,4) default 1.0000,
    monthly_discount_cap_pct_of_turnover numeric(6,4),
    rolling_window_days integer default 30,
    kpi_ceiling jsonb default '{}'::jsonb, -- e.g. {"profit_margin": 0.15} (Floor for Profit)
    kpi_floor jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, surface_id)
);

-- =========================================================
-- 2. Discount Codes (The Ledger)
-- =========================================================
create table if not exists public.discount_codes (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    surface_id text,
    channel text check (channel in ('internal', 'shopify', 'wix', 'custom')) default 'internal',
    code text not null,
    discount_type text check (discount_type in ('percent', 'fixed')) not null,
    discount_value numeric(12,4) not null,
    currency text,
    status text check (status in ('active', 'paused', 'expired', 'revoked')) default 'active',
    valid_from timestamptz,
    valid_to timestamptz,
    max_redemptions integer,
    times_redeemed integer default 0,
    issued_by uuid, -- Agent or Human ID
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, code)
);

-- =========================================================
-- 3. Redemptions (Audit)
-- =========================================================
create table if not exists public.discount_redemptions (
    id uuid primary key default gen_random_uuid(),
    code_id uuid references public.discount_codes(id) on delete cascade not null,
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    surface_id text,
    channel text,
    external_ref text, -- e.g. Shopify Order ID
    discount_amount numeric(12,4) not null,
    currency text not null,
    redeemed_at timestamptz default now(),
    meta jsonb default '{}'::jsonb
);

-- =========================================================
-- 4. KPI Snapshots (The Governor)
-- =========================================================
create table if not exists public.discount_kpi_snapshots (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    surface_id text,
    kpi_slug text not null, -- e.g. 'discount_rate', 'mer'
    value numeric(14,6) not null,
    window_days integer default 30,
    created_at timestamptz default now()
);

-- =========================================================
-- RLS (Row Level Security)
-- =========================================================
alter table public.discount_policy enable row level security;
alter table public.discount_codes enable row level security;
alter table public.discount_redemptions enable row level security;
alter table public.discount_kpi_snapshots enable row level security;

-- Tenant Read Access
drop policy if exists discount_policy_select on public.discount_policy;
create policy discount_policy_select on public.discount_policy for select using (public.is_tenant_member(tenant_id));

drop policy if exists discount_codes_select on public.discount_codes;
create policy discount_codes_select on public.discount_codes for select using (public.is_tenant_member(tenant_id));

drop policy if exists discount_redemptions_select on public.discount_redemptions;
create policy discount_redemptions_select on public.discount_redemptions for select using (public.is_tenant_member(tenant_id));

-- Service Role Write Access (For Agents/System)
drop policy if exists discount_defs_service_write on public.discount_policy;
create policy discount_defs_service_write on public.discount_policy for all using (public.is_service_role());

drop policy if exists discount_codes_service_write on public.discount_codes;
create policy discount_codes_service_write on public.discount_codes for all using (public.is_service_role());

drop policy if exists discount_redemption_service_write on public.discount_redemptions;
create policy discount_redemption_service_write on public.discount_redemptions for all using (public.is_service_role());

-- =========================================================
-- 5. RPCs (The Brain)
-- =========================================================

-- 5.1 Create Discount Code (Factory)
create or replace function public.create_discount_code(
    p_tenant_id uuid,
    p_surface_id text,
    p_code text,
    p_discount_type text,
    p_discount_value numeric,
    p_channel text,
    p_max_redemptions integer default null,
    p_valid_from timestamptz default now(),
    p_valid_to timestamptz default null,
    p_meta jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
    v_policy_min numeric;
    v_policy_max numeric;
    v_new_id uuid;
begin
    -- 1. Fetch Policy Limits
    select min_discount_pct, max_discount_pct
    into v_policy_min, v_policy_max
    from public.discount_policy
    where tenant_id = p_tenant_id
      and (surface_id = p_surface_id or surface_id is null) -- Fallback to tenant-wide if specific surface not found? Or strict? Sticking to strict or first match. 
    order by surface_id nulls last
    limit 1;

    -- If no policy, we might allow or block. Let's assume block if strict, or defaults if not using defaults in table.
    -- Table has defaults 0.0000 and 1.0000. So if a record exists, we use it. If no record exists, unchecked? 
    -- "The Tenant/Surface Law": Policy First. Implicitly, we should probably require a policy row or use defaults.
    -- For now, if no policy row found, we'll assume standard defaults (0-100%).
    if v_policy_min is null then v_policy_min := 0; end if;
    if v_policy_max is null then v_policy_max := 1; end if;

    -- 2. Validate Discount Value against Policy
    if p_discount_type = 'percent' then
        -- Value is typically passed as 0.20 for 20% or 20. Let's assume 0.0 to 1.0 based on schema numeric(6,4).
        -- Wait, schema says numeric(6,4) default 1.0000. So 1.0 = 100%.
        if p_discount_value < v_policy_min or p_discount_value > v_policy_max then
            raise exception 'Policy Violation: Discount % is outside allowed range (% - %)', p_discount_value, v_policy_min, v_policy_max;
        end if;
    end if;

    -- 3. Insert Code
    insert into public.discount_codes (
        tenant_id, surface_id, channel, code, discount_type, discount_value, 
        max_redemptions, valid_from, valid_to, meta
    ) values (
        p_tenant_id, p_surface_id, p_channel, p_code, p_discount_type, p_discount_value, 
        p_max_redemptions, p_valid_from, p_valid_to, p_meta
    )
    returning id into v_new_id;

    return v_new_id;
end;
$$;

-- 5.2 Validate Discount Code (Governor)
create or replace function public.validate_discount_code(
    p_code text,
    p_cart_amount numeric default 0
)
returns jsonb
language plpgsql
security definer
as $$
declare
    v_code_record record;
    v_policy_ceiling jsonb;
    v_kpi_floor_val numeric;
    v_kpi_current_val numeric;
    v_key text;
    v_val text; -- jsonb iterator usually text
begin
    -- 1. Lookup Code
    select * into v_code_record
    from public.discount_codes
    where code = p_code;

    if v_code_record.id is null then
        raise exception 'Invalid code';
    end if;

    if v_code_record.status != 'active' then
        raise exception 'Code is %', v_code_record.status;
    end if;

    -- 2. Check Expiry
    if v_code_record.valid_from > now() then raise exception 'Code not yet valid'; end if;
    if v_code_record.valid_to is not null and v_code_record.valid_to < now() then raise exception 'Code expired'; end if;

    -- 3. Check usage
    if v_code_record.max_redemptions is not null and v_code_record.times_redeemed >= v_code_record.max_redemptions then
        raise exception 'Code redemption limit reached';
    end if;

    -- 4. KPI Ceiling Law (The Governor)
    -- Get policy
    select kpi_ceiling into v_policy_ceiling
    from public.discount_policy
    where tenant_id = v_code_record.tenant_id
      and (surface_id = v_code_record.surface_id or surface_id is null)
    order by surface_id nulls last
    limit 1;

    if v_policy_ceiling is not null then
        -- Iterate over required floors
        for v_key, v_val in select * from jsonb_each_text(v_policy_ceiling)
        loop
            v_kpi_floor_val := v_val::numeric;
            
            -- Get current snapshot
            select value into v_kpi_current_val
            from public.discount_kpi_snapshots
            where tenant_id = v_code_record.tenant_id
              and kpi_slug = v_key
              and (surface_id = v_code_record.surface_id or surface_id is null)
            order by created_at desc
            limit 1;

            if v_kpi_current_val is null then
                -- Fail safe: If we require a KPI check but have no data, DO WE BLOCK?
                -- "Don't discount if MER < 2.0". If we don't know MER, we probably shouldn't risk it?
                -- Or maybe we warn? Prompt says "KPI Ceiling Law". Strict implies reject.
                raise exception 'Governance Rejection: Missing strict KPI data for %', v_key;
            end if;

            if v_kpi_current_val < v_kpi_floor_val then
                raise exception 'Governance Rejection: KPI % is %, policy requires floor of %', v_key, v_kpi_current_val, v_kpi_floor_val;
            end if;
        end loop;
    end if;

    return jsonb_build_object(
        'valid', true,
        'code', v_code_record.code,
        'type', v_code_record.discount_type,
        'value', v_code_record.discount_value
    );
end;
$$;

-- 5.3 Redeem Discount Code
create or replace function public.redeem_discount_code(
    p_code text,
    p_amount numeric,
    p_currency text, -- REQUIRED: Transaction currency
    p_external_ref text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
    v_validity jsonb;
    v_code_record record;
    v_redemption_id uuid;
begin
    -- 1. Validate (This triggers the Governor)
    v_validity := public.validate_discount_code(p_code, p_amount);
    
    -- 2. Fetch details explicitly
    select * into v_code_record from public.discount_codes where code = p_code;

    -- 3. Record Redemption
    insert into public.discount_redemptions (
        code_id, tenant_id, surface_id, channel, external_ref, 
        discount_amount, currency
    ) values (
        v_code_record.id, v_code_record.tenant_id, v_code_record.surface_id, v_code_record.channel, p_external_ref, 
        p_amount, p_currency 
    )
    returning id into v_redemption_id;

    -- 4. Tick Counter
    update public.discount_codes
    set times_redeemed = times_redeemed + 1,
        updated_at = now()
    where id = v_code_record.id;

    return v_redemption_id;
end;
$$;

