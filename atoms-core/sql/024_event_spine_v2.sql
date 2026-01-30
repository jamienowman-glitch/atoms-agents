/*
# 024_event_spine_v2.sql

## Description
Implements the Event Spine V2 schema for append-only, PII-safe event logging.
Contract: 2026-01-29_event-spine-v2-contract.md

## Tables
- event_spine_v2_events: Core event metadata (normalized).
- event_spine_v2_payloads: Large data payloads (linked 1:1 or 1:N).
- event_spine_v2_pii_tokens: Redacted PII tokens.
- event_spine_v2_artifacts: References to external blobs (S3).
- event_spine_v2_visibility_rules: Configuration for visibility tiers.

## Notes
- Append-only enforced via RLS (Service Role only writes).
- No updates allowed on events.
*/

-- =========================================================
-- 1) Core Event Table
-- =========================================================
create table if not exists public.event_spine_v2_events (
    id uuid primary key default gen_random_uuid(),

    -- Routing Keys
    tenant_id text not null,
    mode text not null, -- 'saas', 'enterprise', 'system', 'lab'
    project_id text not null,
    surface_id text,
    space_id text,
    run_id text, -- Critical for grouping
    canvas_id text,
    node_id text,
    agent_id text,

    -- Event Metadata
    event_type text not null, -- e.g., 'AGENT_ACTION', 'TOKEN_USAGE'
    display_name text not null, -- Tenant-facing name
    raw_name text not null, -- System-facing name

    -- Timestamps
    created_at timestamptz not null default now(),
    client_timestamp timestamptz, -- Optional client-reported time

    -- Search Vector (optional, for basic text search)
    tags text[] -- Array of tags for filtering
);

-- Indexes for frequent query patterns
create index if not exists idx_event_spine_tenant_run on public.event_spine_v2_events(tenant_id, run_id);
create index if not exists idx_event_spine_created_at on public.event_spine_v2_events(created_at desc);
create index if not exists idx_event_spine_type on public.event_spine_v2_events(event_type);

-- =========================================================
-- 2) Payloads Table (for larger JSON bodies)
-- =========================================================
create table if not exists public.event_spine_v2_payloads (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references public.event_spine_v2_events(id) on delete cascade not null,

    payload_type text not null, -- 'state_patch', 'token_usage', 'trace'
    data jsonb not null default '{}'::jsonb, -- REDACTED data only

    created_at timestamptz not null default now()
);

-- =========================================================
-- 3) PII Tokens (Secure Store)
-- =========================================================
create table if not exists public.event_spine_v2_pii_tokens (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references public.event_spine_v2_events(id) on delete cascade not null,

    token_key text not null, -- The placeholder used in payload e.g., 'pii_email_123'
    raw_value text not null, -- The actual PII (Encrypted at rest by Supabase usually, but here just raw in restricted table)

    category text, -- 'email', 'phone', 'name'
    created_at timestamptz not null default now()
);

-- Index for rehydration lookups
create index if not exists idx_pii_tokens_event on public.event_spine_v2_pii_tokens(event_id);

-- =========================================================
-- 4) Artifacts (External references)
-- =========================================================
create table if not exists public.event_spine_v2_artifacts (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references public.event_spine_v2_events(id) on delete cascade not null,

    artifact_type text not null, -- 'image', 'audio', 'document'
    uri text not null, -- s3://... or https://...
    metadata jsonb default '{}'::jsonb,

    created_at timestamptz not null default now()
);

-- =========================================================
-- 5) Visibility Rules
-- =========================================================
create table if not exists public.event_spine_v2_visibility_rules (
    id uuid primary key default gen_random_uuid(),
    tenant_id text references public.tenants(id) on delete cascade not null,

    rule_type text not null, -- 'framework_visibility', 'rehydration_enabled'
    is_enabled boolean default false,

    updated_at timestamptz default now()
);

-- =========================================================
-- 6) RLS Policies
-- =========================================================

-- Enable RLS
alter table public.event_spine_v2_events enable row level security;
alter table public.event_spine_v2_payloads enable row level security;
alter table public.event_spine_v2_pii_tokens enable row level security;
alter table public.event_spine_v2_artifacts enable row level security;
alter table public.event_spine_v2_visibility_rules enable row level security;

-- EVENTS: Read (Tenant members), Write (Service Role only)
create policy events_select_policy on public.event_spine_v2_events
    for select using (
        public.is_service_role() or
        (auth.role() = 'authenticated' and tenant_id in (
            select tenant_id from public.tenant_members where user_id = auth.uid()
        ))
    );

create policy events_insert_policy on public.event_spine_v2_events
    for insert with check (public.is_service_role());

-- PAYLOADS: Inherit from Events
create policy payloads_select_policy on public.event_spine_v2_payloads
    for select using (
        exists (
            select 1 from public.event_spine_v2_events e
            where e.id = event_spine_v2_payloads.event_id
            and (public.is_service_role() or
                 (auth.role() = 'authenticated' and e.tenant_id in (
                     select tenant_id from public.tenant_members where user_id = auth.uid()
                 )))
        )
    );

create policy payloads_insert_policy on public.event_spine_v2_payloads
    for insert with check (public.is_service_role());

-- PII TOKENS: STRICTER! Service Role OR Owner only?
-- Contract says: "Rehydration is default ON for tenant UI."
-- So tenant members need read access to rehydrate.
create policy pii_select_policy on public.event_spine_v2_pii_tokens
    for select using (
        exists (
            select 1 from public.event_spine_v2_events e
            where e.id = event_spine_v2_pii_tokens.event_id
            and (public.is_service_role() or
                 (auth.role() = 'authenticated' and e.tenant_id in (
                     select tenant_id from public.tenant_members where user_id = auth.uid()
                 )))
        )
    );

create policy pii_insert_policy on public.event_spine_v2_pii_tokens
    for insert with check (public.is_service_role());

-- ARTIFACTS: Inherit from Events
create policy artifacts_select_policy on public.event_spine_v2_artifacts
    for select using (
        exists (
            select 1 from public.event_spine_v2_events e
            where e.id = event_spine_v2_artifacts.event_id
            and (public.is_service_role() or
                 (auth.role() = 'authenticated' and e.tenant_id in (
                     select tenant_id from public.tenant_members where user_id = auth.uid()
                 )))
        )
    );

create policy artifacts_insert_policy on public.event_spine_v2_artifacts
    for insert with check (public.is_service_role());

-- VISIBILITY RULES
create policy visibility_select_policy on public.event_spine_v2_visibility_rules
    for select using (public.is_tenant_member(tenant_id));

create policy visibility_write_policy on public.event_spine_v2_visibility_rules
    for all using (public.is_service_role());
