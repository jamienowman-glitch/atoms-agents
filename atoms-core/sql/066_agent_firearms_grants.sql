/*
# 066_agent_firearms_grants.sql

## Description
Tracks short-lived Firearms License grants to agents. Each grant is validated
via TOTP and represented as a signed JWT ticket.

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.
*/

-- Agent Firearms Grants (Short-Lived Tickets)
create table if not exists public.agent_firearms_grants (
    grant_id uuid primary key default gen_random_uuid(),
    agent_id text not null,
    license_key text not null references public.firearms_licenses(license_key) on delete restrict,
    granted_by uuid not null references auth.users(id) on delete restrict,
    granted_at timestamptz default now(),
    expires_at timestamptz not null,  -- Short-lived: typically 15 minutes
    ticket_jwt text not null,         -- Signed JWT for verification
    used_count integer default 0,
    max_uses integer default 10,      -- Optional: limit uses per grant
    revoked_at timestamptz,
    revoke_reason text,
    scope_context jsonb default '{}'::jsonb,  -- e.g., { "provider": "meta", "scope": "ads.create" }
    merkle_hash text,                 -- SHA-256 hash for Merkle Man audit
    created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_firearms_grants_agent on public.agent_firearms_grants(agent_id);
create index if not exists idx_firearms_grants_active on public.agent_firearms_grants(agent_id, license_key) 
    where revoked_at is null and expires_at > now();
create index if not exists idx_firearms_grants_audit on public.agent_firearms_grants(granted_by, granted_at);

-- RLS
alter table public.agent_firearms_grants enable row level security;

-- Policy: Users can view grants they issued
create policy "Users can view their issued grants"
    on public.agent_firearms_grants for select
    using (auth.uid() = granted_by);

-- Policy: Service role can insert (API creates grants)
create policy "Service can create grants"
    on public.agent_firearms_grants for insert
    with check (true);

-- Audit Log View (for Merkle Man)
create or replace view public.firearms_grants_audit as
select 
    grant_id,
    agent_id,
    license_key,
    granted_by,
    granted_at,
    expires_at,
    used_count,
    revoked_at
from public.agent_firearms_grants
order by granted_at desc;

comment on table public.agent_firearms_grants is 'Short-lived Firearms License grants to agents. Validated via TOTP, represented as signed JWT tickets.';

-- Merkle Roots for Firearms Audit (Blockchain Anchor)
create table if not exists public.firearms_audit_merkle_roots (
    root_id uuid primary key default gen_random_uuid(),
    merkle_root text not null,
    period_start timestamptz not null,
    period_end timestamptz not null,
    transaction_count integer,
    solana_signature text,
    anchored_at timestamptz,
    created_at timestamptz default now()
);

create index if not exists idx_firearms_merkle_period on public.firearms_audit_merkle_roots(period_start, period_end);

comment on table public.firearms_audit_merkle_roots is 'Merkle roots for Firearms audit logs. Anchored to Solana for immutable proof.';
