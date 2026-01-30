/*
# 015_snax_auth_patch_uuid.sql (ADAPTED FOR UUID DB)
*/

create extension if not exists "pgcrypto";

-- =========================================================
-- 1) Align Existing Tables (Tenants, Pricing)
-- =========================================================
alter table public.tenants add column if not exists slug text unique;
alter table public.tenants add column if not exists created_by uuid; -- user_id

alter table public.pricing add column if not exists price_model text default 'per_call';
alter table public.pricing add column if not exists active boolean default true;

-- Migrate is_active to active if exists
do $$
begin
    if exists(select 1 from information_schema.columns where table_name='pricing' and column_name='is_active') then
        update public.pricing set active = is_active;
    end if;
end $$;

-- =========================================================
-- 2) Snax Economy (UUID tenant_id)
-- =========================================================
create table if not exists public.snax_wallets (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null unique,
    balance_snax bigint default 0 not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.snax_ledger (
    id uuid primary key default gen_random_uuid(),
    wallet_id uuid references public.snax_wallets(id) on delete cascade not null,
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    delta_snax bigint not null,
    reason text not null,
    reference_id text,
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.crypto_deposits (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    chain text not null,
    tx_hash text not null unique,
    amount_crypto numeric not null,
    currency text not null,
    converted_snax bigint not null,
    status text default 'pending',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =========================================================
-- 3) API Keys (UUID tenant_id)
-- =========================================================
create table if not exists public.api_keys (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    key_prefix text not null,
    key_hash text not null unique,
    name text,
    scopes jsonb default '[]'::jsonb,
    status text check (status in ('active', 'revoked')) default 'active',
    last_used_at timestamptz,
    created_by uuid,
    created_at timestamptz default now(),
    expires_at timestamptz
);

-- =========================================================
-- 4) System Config (No change)
-- =========================================================
create table if not exists public.system_config (
    key text primary key,
    value jsonb not null,
    description text,
    updated_at timestamptz default now()
);

-- =========================================================
-- 5) Functions & RLS
-- =========================================================
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.is_service_role() returns boolean language sql stable as $$
    select auth.role() = 'service_role';
$$;

create or replace function public.is_tenant_member(p_tenant_id uuid) -- UUID!
returns boolean language sql stable as $$
    select exists (
        select 1 from public.tenant_members tm
        where tm.tenant_id = p_tenant_id
          and tm.user_id = auth.uid()
    );
$$;

-- RLS
alter table public.snax_wallets enable row level security;
alter table public.snax_ledger enable row level security;
alter table public.api_keys enable row level security;
alter table public.system_config enable row level security;

-- Policies (UUID)
drop policy if exists snax_wallets_select on public.snax_wallets;
create policy snax_wallets_select on public.snax_wallets for select using (public.is_tenant_member(tenant_id));

drop policy if exists snax_ledger_select on public.snax_ledger;
create policy snax_ledger_select on public.snax_ledger for select using (public.is_tenant_member(tenant_id));

drop policy if exists api_keys_select on public.api_keys;
create policy api_keys_select on public.api_keys for select using (public.is_tenant_member(tenant_id));

drop policy if exists system_config_select on public.system_config;
create policy system_config_select on public.system_config for select using (public.is_service_role());

-- =========================================================
-- 6) RPC: snax_charge (UUID)
-- =========================================================
drop function if exists public.snax_charge(uuid, text, bigint, text, text);

create or replace function public.snax_charge(
    p_tenant_id uuid, -- UUID
    p_tool_key text,
    p_cost_snax bigint,
    p_request_id text,
    p_reason text default 'usage'
)
returns table (new_balance bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_balance bigint;
    v_wallet_id uuid;
begin
    if not public.is_service_role() then raise exception 'forbidden'; end if;
    if p_cost_snax is null or p_cost_snax <= 0 then raise exception 'invalid_cost'; end if;

    select id, balance_snax into v_wallet_id, v_balance
    from public.snax_wallets
    where tenant_id = p_tenant_id
    for update;

    if v_wallet_id is null then raise exception 'wallet_not_found'; end if;
    if v_balance < p_cost_snax then raise exception 'insufficient_snax'; end if;

    update public.snax_wallets
    set balance_snax = balance_snax - p_cost_snax, updated_at = now()
    where id = v_wallet_id
    returning balance_snax into v_balance;

    insert into public.snax_ledger (wallet_id, tenant_id, delta_snax, reason, reference_id)
    values (v_wallet_id, p_tenant_id, -p_cost_snax, coalesce(p_reason, p_tool_key), p_request_id);

    return query select v_balance as new_balance;
end;
$$;
