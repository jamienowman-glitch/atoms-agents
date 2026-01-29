/*
# 015_snax_auth_patch.sql

## Description
Adds multi-tenant auth, Snax economy (wallets/ledger), and API key management.

## How to Apply
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.

## Notes
- This patch assumes 'public.muscles' is managed elsewhere (Worker 5).
- All tables have RLS enabled.
*/

-- 1. Tenants & Members
create table if not exists public.tenants (
    id text primary key, -- t_...
    name text not null,
    slug text unique,
    status text check (status in ('active', 'disabled', 'suspended')) default 'active',
    created_by text, -- user_id (optional if system created)
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

-- 2. Snax Economy
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
    reason text not null, -- e.g. "muscle_usage", "deposit" or tool_key
    reference_id text, -- e.g. run_id, request_id
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.pricing (
    id uuid primary key default gen_random_uuid(),
    resource_type text not null, -- e.g. "muscle", "storage"
    resource_key text not null unique, -- e.g. "muscle-video-extract"
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

-- 3. API Keys
create table if not exists public.api_keys (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,
    key_hash text not null unique, -- SHA-256 of the sk_...
    name text,
    status text check (status in ('active', 'revoked')) default 'active',
    last_used_at timestamptz,
    created_by uuid, -- user_id
    created_at timestamptz default now(),
    expires_at timestamptz
);

-- 4. System Config
create table if not exists public.system_config (
    key text primary key,
    value jsonb not null,
    description text,
    updated_at timestamptz default now()
);

-- RLS Policies
alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.snax_wallets enable row level security;
alter table public.snax_ledger enable row level security;
alter table public.pricing enable row level security;
alter table public.crypto_deposits enable row level security;
alter table public.api_keys enable row level security;
alter table public.system_config enable row level security;

-- Tenant Read Policy (Simple version: Members can read their tenant data)
create policy "Users can read their own tenant memberships" on public.tenant_members
    for select using (auth.uid() = user_id);

create policy "Members can read their tenants" on public.tenants
    for select using (
        exists (
            select 1 from public.tenant_members
            where tenant_members.tenant_id = tenants.id
            and tenant_members.user_id = auth.uid()
        )
    );

create policy "Members can read their wallet" on public.snax_wallets
    for select using (
        exists (
            select 1 from public.tenant_members
            where tenant_members.tenant_id = snax_wallets.tenant_id
            and tenant_members.user_id = auth.uid()
        )
    );

create policy "Members can read ledger" on public.snax_ledger
    for select using (
        exists (
            select 1 from public.tenant_members
            where tenant_members.tenant_id = snax_ledger.tenant_id
            and tenant_members.user_id = auth.uid()
        )
    );

-- Pricing is public read
create policy "Pricing is public read" on public.pricing for select using (true);

-- System Config is service_role only (or admin)
-- No public policy.

-- RPC: snax_charge
create or replace function public.snax_charge(
    p_tenant_id text,
    p_tool_key text,
    p_cost_snax bigint,
    p_request_id text
)
returns bigint
language plpgsql
security definer
as $$
declare
    v_balance bigint;
    v_wallet_id uuid;
begin
    -- Lock the wallet row
    select id, balance_snax into v_wallet_id, v_balance
    from public.snax_wallets
    where tenant_id = p_tenant_id
    for update;

    if v_wallet_id is null then
        raise exception 'Wallet not found for tenant %', p_tenant_id;
    end if;

    if v_balance < p_cost_snax then
        raise exception 'Payment Required: Insufficient Snax Balance (Current: %, Required: %)', v_balance, p_cost_snax;
    end if;

    -- Update balance
    update public.snax_wallets
    set balance_snax = balance_snax - p_cost_snax,
        updated_at = now()
    where id = v_wallet_id
    returning balance_snax into v_balance;

    -- Insert ledger entry
    insert into public.snax_ledger (wallet_id, tenant_id, delta_snax, reason, reference_id)
    values (v_wallet_id, p_tenant_id, -p_cost_snax, p_tool_key, p_request_id);

    return v_balance;
end;
$$;

-- RPC: validate_api_key
create or replace function public.validate_api_key(
    p_key_hash text
)
returns text -- returns tenant_id or null
language plpgsql
security definer
as $$
declare
    v_tenant_id text;
begin
    select tenant_id into v_tenant_id
    from public.api_keys
    where key_hash = p_key_hash
    and status = 'active'
    and (expires_at is null or expires_at > now());

    -- Update last_used_at
    if v_tenant_id is not null then
        update public.api_keys set last_used_at = now() where key_hash = p_key_hash;
    end if;

    return v_tenant_id;
end;
$$;
