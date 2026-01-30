/*
# 015_snax_auth_patch.sql

## Description
Adds multi-tenant auth, Snax economy (wallets/ledger), API key management, and pricing.

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.

## Notes
- This patch assumes 'public.muscles' is managed elsewhere (Worker 5).
- All tables have RLS enabled (tenant read, service-role write).
*/

-- Extensions
create extension if not exists "pgcrypto";

-- =========================================================
-- 1) Core Tenant Tables
-- =========================================================
create table if not exists public.tenants (
    id text primary key, -- t_...
    name text not null,
    slug text unique,
    status text check (status in ('active', 'disabled', 'suspended')) default 'active',
    owner_user_id uuid,
    created_by uuid,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.tenant_members (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    user_id uuid not null, -- Supabase Auth User ID
    role text check (role in ('owner', 'admin', 'member', 'viewer')) default 'member',
    status text check (status in ('active', 'pending', 'revoked')) default 'active',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, user_id)
);

-- =========================================================
-- 2) Snax Economy
-- =========================================================
create table if not exists public.snax_wallets (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null unique,
    balance_snax bigint default 0 not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.snax_ledger (
    id uuid primary key default gen_random_uuid(),
    wallet_id uuid references public.snax_wallets(id) on delete cascade not null,
    tenant_id text references public.tenants(id) on delete cascade not null, -- Denormalized for query speed
    delta_snax bigint not null, -- Negative for charge, Positive for deposit
    reason text not null, -- e.g. "usage", "deposit" or tool_key
    reference_id text, -- e.g. run_id, request_id
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.pricing (
    id uuid primary key default gen_random_uuid(),
    tool_key text not null unique, -- e.g. "muscle-video-extract"
    base_price_snax integer not null default 0,
    price_model text default 'per_call', -- 'per_call', 'per_second', 'per_gb'
    active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.crypto_deposits (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    chain text not null, -- e.g. 'solana', 'eth'
    tx_hash text not null unique,
    amount_crypto numeric not null,
    currency text not null, -- 'SOL', 'USDC'
    converted_snax bigint not null,
    status text default 'pending', -- 'pending', 'confirmed', 'failed'
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =========================================================
-- 3) API Keys
-- =========================================================
create table if not exists public.api_keys (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    key_prefix text not null, -- e.g. "sk_live_"
    key_hash text not null unique, -- crypt hash of full key
    name text,
    scopes jsonb default '[]'::jsonb,
    status text check (status in ('active', 'revoked')) default 'active',
    last_used_at timestamptz,
    created_by uuid, -- user_id
    created_at timestamptz default now(),
    expires_at timestamptz
);

-- =========================================================
-- 4) System Config
-- =========================================================
create table if not exists public.system_config (
    key text primary key,
    value jsonb not null,
    description text,
    updated_at timestamptz default now()
);

-- =========================================================
-- 5) Utility Functions + Updated-At Triggers
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

create or replace function public.is_service_role()
returns boolean
language sql
stable
as $$
    select auth.role() = 'service_role';
$$;

create or replace function public.is_tenant_member(p_tenant_id text)
returns boolean
language sql
stable
as $$
    select exists (
        select 1 from public.tenant_members tm
        where tm.tenant_id = p_tenant_id
          and tm.user_id = auth.uid()
    );
$$;

-- Updated_at triggers
drop trigger if exists set_updated_at_tenants on public.tenants;
create trigger set_updated_at_tenants
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_tenant_members on public.tenant_members;
create trigger set_updated_at_tenant_members
before update on public.tenant_members
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_snax_wallets on public.snax_wallets;
create trigger set_updated_at_snax_wallets
before update on public.snax_wallets
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_pricing on public.pricing;
create trigger set_updated_at_pricing
before update on public.pricing
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_crypto_deposits on public.crypto_deposits;
create trigger set_updated_at_crypto_deposits
before update on public.crypto_deposits
for each row execute function public.set_updated_at();

-- =========================================================
-- 6) Auth Trigger (Create tenant + wallet for new user)
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    v_tenant_id text;
    v_name text;
    v_slug text;
begin
    v_tenant_id := coalesce(
        new.raw_user_meta_data->>'tenant_id',
        't_' || replace(new.id::text, '-', '')
    );
    v_name := coalesce(
        new.raw_user_meta_data->>'tenant_name',
        split_part(new.email, '@', 1),
        'New Tenant'
    );
    v_slug := new.raw_user_meta_data->>'tenant_slug';

    insert into public.tenants (id, name, slug, created_by, owner_user_id)
    values (v_tenant_id, v_name, v_slug, new.id, new.id)
    on conflict (id) do nothing;

    insert into public.tenant_members (tenant_id, user_id, role, status)
    values (v_tenant_id, new.id, 'owner', 'active')
    on conflict (tenant_id, user_id) do nothing;

    insert into public.snax_wallets (tenant_id, balance_snax)
    values (v_tenant_id, 0)
    on conflict (tenant_id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- 7) Row Level Security (RLS)
-- =========================================================
alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.snax_wallets enable row level security;
alter table public.snax_ledger enable row level security;
alter table public.pricing enable row level security;
alter table public.crypto_deposits enable row level security;
alter table public.api_keys enable row level security;
alter table public.system_config enable row level security;

-- Tenant read policies
drop policy if exists tenant_members_select on public.tenant_members;
create policy tenant_members_select on public.tenant_members
    for select using (auth.uid() = user_id);

drop policy if exists tenants_select on public.tenants;
create policy tenants_select on public.tenants
    for select using (public.is_tenant_member(id));

drop policy if exists snax_wallets_select on public.snax_wallets;
create policy snax_wallets_select on public.snax_wallets
    for select using (public.is_tenant_member(tenant_id));

drop policy if exists snax_ledger_select on public.snax_ledger;
create policy snax_ledger_select on public.snax_ledger
    for select using (public.is_tenant_member(tenant_id));

drop policy if exists api_keys_select on public.api_keys;
create policy api_keys_select on public.api_keys
    for select using (public.is_tenant_member(tenant_id));

drop policy if exists crypto_deposits_select on public.crypto_deposits;
create policy crypto_deposits_select on public.crypto_deposits
    for select using (public.is_tenant_member(tenant_id));

-- Pricing is public read
drop policy if exists pricing_select on public.pricing;
create policy pricing_select on public.pricing
    for select using (true);

-- System config is service-role only
drop policy if exists system_config_select on public.system_config;
create policy system_config_select on public.system_config
    for select using (public.is_service_role());

-- Service-role write policies (all tables)
-- Tenants
drop policy if exists tenants_service_write on public.tenants;
create policy tenants_service_write on public.tenants
    for all using (public.is_service_role()) with check (public.is_service_role());

-- Tenant members
drop policy if exists tenant_members_service_write on public.tenant_members;
create policy tenant_members_service_write on public.tenant_members
    for all using (public.is_service_role()) with check (public.is_service_role());

-- Snax wallets
drop policy if exists snax_wallets_service_write on public.snax_wallets;
create policy snax_wallets_service_write on public.snax_wallets
    for all using (public.is_service_role()) with check (public.is_service_role());

-- Snax ledger
drop policy if exists snax_ledger_service_write on public.snax_ledger;
create policy snax_ledger_service_write on public.snax_ledger
    for all using (public.is_service_role()) with check (public.is_service_role());

-- Pricing
drop policy if exists pricing_service_write on public.pricing;
create policy pricing_service_write on public.pricing
    for all using (public.is_service_role()) with check (public.is_service_role());

-- Crypto deposits
drop policy if exists crypto_deposits_service_write on public.crypto_deposits;
create policy crypto_deposits_service_write on public.crypto_deposits
    for all using (public.is_service_role()) with check (public.is_service_role());

-- API keys
drop policy if exists api_keys_service_write on public.api_keys;
create policy api_keys_service_write on public.api_keys
    for all using (public.is_service_role()) with check (public.is_service_role());

-- System config
drop policy if exists system_config_service_write on public.system_config;
create policy system_config_service_write on public.system_config
    for all using (public.is_service_role()) with check (public.is_service_role());

-- =========================================================
-- 8) RPCs
-- =========================================================
create or replace function public.snax_charge(
    p_tenant_id text,
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
    if not public.is_service_role() then
        raise exception 'forbidden';
    end if;

    if p_cost_snax is null or p_cost_snax <= 0 then
        raise exception 'invalid_cost';
    end if;

    -- Lock the wallet row
    select id, balance_snax into v_wallet_id, v_balance
    from public.snax_wallets
    where tenant_id = p_tenant_id
    for update;

    if v_wallet_id is null then
        raise exception 'wallet_not_found';
    end if;

    if v_balance < p_cost_snax then
        raise exception 'insufficient_snax';
    end if;

    -- Update balance
    update public.snax_wallets
    set balance_snax = balance_snax - p_cost_snax,
        updated_at = now()
    where id = v_wallet_id
    returning balance_snax into v_balance;

    -- Insert ledger entry
    insert into public.snax_ledger (wallet_id, tenant_id, delta_snax, reason, reference_id)
    values (v_wallet_id, p_tenant_id, -p_cost_snax, coalesce(p_reason, p_tool_key), p_request_id);

    return query select v_balance as new_balance;
end;
$$;

create or replace function public.validate_api_key(
    p_api_key text
)
returns table (
    is_valid boolean,
    tenant_id text,
    api_key_id uuid,
    scopes jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_key_id uuid;
    v_tenant_id text;
    v_scopes jsonb;
    v_prefix text;
begin
    if p_api_key is null or length(p_api_key) < 8 then
        return query select false, null::text, null::uuid, '[]'::jsonb;
        return;
    end if;

    v_prefix := left(p_api_key, 8);

    select ak.id, ak.tenant_id, ak.scopes
    into v_key_id, v_tenant_id, v_scopes
    from public.api_keys ak
    where ak.key_prefix = v_prefix
      and ak.status = 'active'
      and (ak.expires_at is null or ak.expires_at > now())
      and ak.key_hash = crypt(p_api_key, ak.key_hash)
    limit 1;

    if v_key_id is null then
        return query select false, null::text, null::uuid, '[]'::jsonb;
        return;
    end if;

    update public.api_keys
    set last_used_at = now()
    where id = v_key_id;

    return query select true, v_tenant_id, v_key_id, coalesce(v_scopes, '[]'::jsonb);
end;
$$;
