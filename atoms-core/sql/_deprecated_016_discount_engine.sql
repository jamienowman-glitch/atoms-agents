/*
# 016_discount_engine.sql

## Description
Adds discount governance (policy + codes + redemptions + KPI snapshots) with tenant + surface scope.

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.

## Notes
- Requires `public.tenants` from 015_snax_auth_patch.sql.
- `surface_id` is text to avoid hard FK coupling (surface registry may vary by env).
- No PII is stored in discount tables.
*/

create extension if not exists "pgcrypto";

-- =========================================================
-- 1) Discount Policy (per tenant + per surface)
-- =========================================================
create table if not exists public.discount_policy (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    surface_id text,
    status text check (status in ('active', 'inactive')) default 'active',
    min_discount_pct numeric(6,4) default 0.0000,
    max_discount_pct numeric(6,4) default 1.0000,
    monthly_discount_cap_pct_of_turnover numeric(6,4),
    rolling_window_days integer default 30,
    kpi_ceiling jsonb default '{}'::jsonb,
    kpi_floor jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, surface_id)
);

-- =========================================================
-- 2) Discount Codes
-- =========================================================
create table if not exists public.discount_codes (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
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
    issued_by uuid,
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, code)
);

-- =========================================================
-- 3) Discount Redemptions (audit trail)
-- =========================================================
create table if not exists public.discount_redemptions (
    id uuid primary key default gen_random_uuid(),
    code_id uuid references public.discount_codes(id) on delete cascade not null,
    tenant_id text references public.tenants(id) on delete cascade not null,
    surface_id text,
    channel text,
    external_ref text,
    discount_amount numeric(12,4) not null,
    currency text not null,
    redeemed_at timestamptz default now(),
    meta jsonb default '{}'::jsonb
);

-- =========================================================
-- 4) Discount KPI Snapshots (BI stub)
-- =========================================================
create table if not exists public.discount_kpi_snapshots (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    surface_id text,
    kpi_slug text not null,
    value numeric(14,6) not null,
    window_days integer default 30,
    created_at timestamptz default now()
);

-- =========================================================
-- 5) Updated-at triggers
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_updated_at_discount_policy on public.discount_policy;
create trigger set_updated_at_discount_policy
before update on public.discount_policy
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_discount_codes on public.discount_codes;
create trigger set_updated_at_discount_codes
before update on public.discount_codes
for each row execute function public.set_updated_at();

-- =========================================================
-- 6) RLS
-- =========================================================
alter table public.discount_policy enable row level security;
alter table public.discount_codes enable row level security;
alter table public.discount_redemptions enable row level security;
alter table public.discount_kpi_snapshots enable row level security;

-- Tenant read policies
create policy discount_policy_select on public.discount_policy
for select using (public.is_tenant_member(tenant_id));

create policy discount_codes_select on public.discount_codes
for select using (public.is_tenant_member(tenant_id));

create policy discount_redemptions_select on public.discount_redemptions
for select using (public.is_tenant_member(tenant_id));

create policy discount_kpi_snapshots_select on public.discount_kpi_snapshots
for select using (public.is_tenant_member(tenant_id));

-- Service-role write policies
create policy discount_policy_service_write on public.discount_policy
for all using (public.is_service_role()) with check (public.is_service_role());

create policy discount_codes_service_write on public.discount_codes
for all using (public.is_service_role()) with check (public.is_service_role());

create policy discount_redemptions_service_write on public.discount_redemptions
for all using (public.is_service_role()) with check (public.is_service_role());

create policy discount_kpi_snapshots_service_write on public.discount_kpi_snapshots
for all using (public.is_service_role()) with check (public.is_service_role());

-- =========================================================
-- 7) RPCs
-- =========================================================

-- Create discount code
create or replace function public.create_discount_code(
    p_tenant_id text,
    p_surface_id text,
    p_channel text,
    p_code text,
    p_discount_type text,
    p_discount_value numeric,
    p_currency text default null,
    p_valid_from timestamptz default null,
    p_valid_to timestamptz default null,
    p_max_redemptions integer default null,
    p_meta jsonb default '{}'::jsonb,
    p_issued_by uuid default null
) returns uuid
language plpgsql
security definer
as $$
declare
    v_policy public.discount_policy%rowtype;
    v_pct numeric;
    v_code_id uuid;
begin
    select * into v_policy from public.discount_policy
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and status = 'active'
    limit 1;

    if v_policy.id is null then
        raise exception 'policy_missing';
    end if;

    if p_discount_type = 'percent' then
        v_pct := p_discount_value;
        if v_pct < coalesce(v_policy.min_discount_pct, 0) then
            raise exception 'discount_below_floor';
        end if;
        if v_pct > coalesce(v_policy.max_discount_pct, 1) then
            raise exception 'discount_above_ceiling';
        end if;
    end if;

    insert into public.discount_codes (
        tenant_id, surface_id, channel, code, discount_type, discount_value,
        currency, valid_from, valid_to, max_redemptions, issued_by, meta
    ) values (
        p_tenant_id, p_surface_id, p_channel, p_code, p_discount_type, p_discount_value,
        p_currency, p_valid_from, p_valid_to, p_max_redemptions, p_issued_by, p_meta
    ) returning id into v_code_id;

    return v_code_id;
end;
$$;

-- Validate discount code
create or replace function public.validate_discount_code(
    p_tenant_id text,
    p_surface_id text,
    p_code text,
    p_channel text,
    p_order_amount numeric,
    p_currency text default null
) returns table(
    valid boolean,
    discount_type text,
    discount_value numeric,
    currency text,
    reason text,
    projected_discount_pct numeric
)
language plpgsql
security definer
as $$
declare
    v_code public.discount_codes%rowtype;
    v_policy public.discount_policy%rowtype;
    v_pct numeric;
    v_ceiling numeric;
    v_floor numeric;
    v_current_rate numeric;
begin
    select * into v_code from public.discount_codes
    where tenant_id = p_tenant_id
      and code = p_code
    limit 1;

    if v_code.id is null then
        return query select false, null, null, null, 'code_not_found', null;
        return;
    end if;

    if v_code.status <> 'active' then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'code_inactive', null;
        return;
    end if;

    if v_code.valid_from is not null and v_code.valid_from > now() then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'not_started', null;
        return;
    end if;

    if v_code.valid_to is not null and v_code.valid_to < now() then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'expired', null;
        return;
    end if;

    if v_code.max_redemptions is not null and v_code.times_redeemed >= v_code.max_redemptions then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'max_redemptions_reached', null;
        return;
    end if;

    select * into v_policy from public.discount_policy
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and status = 'active'
    limit 1;

    if v_policy.id is null then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'policy_missing', null;
        return;
    end if;

    if v_code.discount_type = 'percent' then
        v_pct := v_code.discount_value;
    else
        if p_order_amount is null or p_order_amount <= 0 then
            return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'order_amount_required', null;
            return;
        end if;
        v_pct := v_code.discount_value / p_order_amount;
    end if;

    v_floor := nullif((v_policy.kpi_floor->>'discount_rate')::numeric, null);
    v_ceiling := nullif((v_policy.kpi_ceiling->>'discount_rate')::numeric, null);

    if v_policy.min_discount_pct is not null and v_pct < v_policy.min_discount_pct then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'discount_below_floor', v_pct;
        return;
    end if;
    if v_policy.max_discount_pct is not null and v_pct > v_policy.max_discount_pct then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'discount_above_ceiling', v_pct;
        return;
    end if;

    if v_floor is not null and v_pct < v_floor then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'kpi_floor_not_met', v_pct;
        return;
    end if;

    select value into v_current_rate from public.discount_kpi_snapshots
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and kpi_slug = 'discount_rate'
      and created_at > (now() - make_interval(days => coalesce(v_policy.rolling_window_days, 30)))
    order by created_at desc
    limit 1;

    if v_ceiling is not null and v_current_rate is not null and v_current_rate >= v_ceiling then
        return query select false, v_code.discount_type, v_code.discount_value, v_code.currency, 'kpi_ceiling_exceeded', v_pct;
        return;
    end if;

    return query select true, v_code.discount_type, v_code.discount_value, v_code.currency, null, v_pct;
end;
$$;

-- Redeem discount code
create or replace function public.redeem_discount_code(
    p_tenant_id text,
    p_surface_id text,
    p_code text,
    p_channel text,
    p_order_amount numeric,
    p_currency text,
    p_external_ref text default null,
    p_meta jsonb default '{}'::jsonb
) returns table(
    redemption_id uuid,
    discount_amount numeric,
    currency text,
    times_redeemed integer
)
language plpgsql
security definer
as $$
declare
    v_code public.discount_codes%rowtype;
    v_policy public.discount_policy%rowtype;
    v_pct numeric;
    v_discount_amount numeric;
    v_ceiling numeric;
    v_floor numeric;
    v_current_rate numeric;
    v_redemption_id uuid;
begin
    select * into v_code from public.discount_codes
    where tenant_id = p_tenant_id
      and code = p_code
    for update;

    if v_code.id is null then
        raise exception 'code_not_found';
    end if;

    if v_code.status <> 'active' then
        raise exception 'code_inactive';
    end if;

    if v_code.valid_from is not null and v_code.valid_from > now() then
        raise exception 'not_started';
    end if;

    if v_code.valid_to is not null and v_code.valid_to < now() then
        raise exception 'expired';
    end if;

    if v_code.max_redemptions is not null and v_code.times_redeemed >= v_code.max_redemptions then
        raise exception 'max_redemptions_reached';
    end if;

    select * into v_policy from public.discount_policy
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and status = 'active'
    limit 1;

    if v_policy.id is null then
        raise exception 'policy_missing';
    end if;

    if v_code.discount_type = 'percent' then
        v_pct := v_code.discount_value;
    else
        if p_order_amount is null or p_order_amount <= 0 then
            raise exception 'order_amount_required';
        end if;
        v_pct := v_code.discount_value / p_order_amount;
    end if;

    v_floor := nullif((v_policy.kpi_floor->>'discount_rate')::numeric, null);
    v_ceiling := nullif((v_policy.kpi_ceiling->>'discount_rate')::numeric, null);

    if v_policy.min_discount_pct is not null and v_pct < v_policy.min_discount_pct then
        raise exception 'discount_below_floor';
    end if;
    if v_policy.max_discount_pct is not null and v_pct > v_policy.max_discount_pct then
        raise exception 'discount_above_ceiling';
    end if;

    if v_floor is not null and v_pct < v_floor then
        raise exception 'kpi_floor_not_met';
    end if;

    select value into v_current_rate from public.discount_kpi_snapshots
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and kpi_slug = 'discount_rate'
      and created_at > (now() - make_interval(days => coalesce(v_policy.rolling_window_days, 30)))
    order by created_at desc
    limit 1;

    if v_ceiling is not null and v_current_rate is not null and v_current_rate >= v_ceiling then
        raise exception 'kpi_ceiling_exceeded';
    end if;

    if v_code.discount_type = 'percent' then
        v_discount_amount := p_order_amount * v_code.discount_value;
    else
        v_discount_amount := v_code.discount_value;
    end if;

    insert into public.discount_redemptions (
        code_id, tenant_id, surface_id, channel, external_ref,
        discount_amount, currency, meta
    ) values (
        v_code.id, p_tenant_id, p_surface_id, p_channel, p_external_ref,
        v_discount_amount, p_currency, p_meta
    ) returning id into v_redemption_id;

    update public.discount_codes
    set times_redeemed = times_redeemed + 1
    where id = v_code.id
    returning times_redeemed into times_redeemed;

    return query select v_redemption_id, v_discount_amount, p_currency, times_redeemed;
end;
$$;

-- Eligibility check (policy + KPI ceiling)
create or replace function public.compute_discount_eligibility(
    p_tenant_id text,
    p_surface_id text,
    p_proposed_discount_pct numeric
) returns table(
    allowed boolean,
    reason text,
    headroom_pct numeric
)
language plpgsql
security definer
as $$
declare
    v_policy public.discount_policy%rowtype;
    v_ceiling numeric;
    v_floor numeric;
    v_current_rate numeric;
begin
    select * into v_policy from public.discount_policy
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and status = 'active'
    limit 1;

    if v_policy.id is null then
        return query select false, 'policy_missing', null;
        return;
    end if;

    v_floor := nullif((v_policy.kpi_floor->>'discount_rate')::numeric, null);
    v_ceiling := nullif((v_policy.kpi_ceiling->>'discount_rate')::numeric, null);

    if v_policy.min_discount_pct is not null and p_proposed_discount_pct < v_policy.min_discount_pct then
        return query select false, 'discount_below_floor', null;
        return;
    end if;

    if v_policy.max_discount_pct is not null and p_proposed_discount_pct > v_policy.max_discount_pct then
        return query select false, 'discount_above_ceiling', null;
        return;
    end if;

    if v_floor is not null and p_proposed_discount_pct < v_floor then
        return query select false, 'kpi_floor_not_met', null;
        return;
    end if;

    select value into v_current_rate from public.discount_kpi_snapshots
    where tenant_id = p_tenant_id
      and (surface_id is not distinct from p_surface_id)
      and kpi_slug = 'discount_rate'
      and created_at > (now() - make_interval(days => coalesce(v_policy.rolling_window_days, 30)))
    order by created_at desc
    limit 1;

    if v_ceiling is not null and v_current_rate is not null and v_current_rate >= v_ceiling then
        return query select false, 'kpi_ceiling_exceeded', 0;
        return;
    end if;

    return query select true, null, v_ceiling;
end;
$$;

