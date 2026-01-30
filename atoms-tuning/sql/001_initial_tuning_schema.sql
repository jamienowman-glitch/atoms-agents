/*
# 001_initial_tuning_schema.sql

## Description
Initial schema for the Atoms Tuning Pipeline.
Handles Opt-Ins, Ingestion State, Tuning Sessions, KPI Outcomes, RL Feedback, and Adapters.

## Tables
- tuning_opt_ins
- tuning_ingest_state
- tuning_sessions
- kpi_outcomes
- rl_feedback
- adapters
*/

-- =========================================================
-- 1) Opt-Ins
-- =========================================================
create table if not exists public.tuning_opt_ins (
    tenant_id text primary key, -- Use 'system' for global default
    is_enabled boolean not null default false,
    updated_at timestamptz not null default now()
);

-- =========================================================
-- 2) Ingestion State
-- =========================================================
create table if not exists public.tuning_ingest_state (
    consumer_id text primary key, -- e.g. 'default_worker'
    last_event_id uuid, -- Reference to event_spine_v2_events.id
    last_event_created_at timestamptz,
    updated_at timestamptz not null default now()
);

-- =========================================================
-- 3) Tuning Sessions
-- =========================================================
create table if not exists public.tuning_sessions (
    id uuid primary key default gen_random_uuid(),

    -- Linking Keys
    run_id text not null,
    tenant_id text not null,
    agent_id text,

    -- Tuning Context
    model_id text,
    reasoning_profile_id text,
    provider_id text,
    framework_id text,
    framework_mode_id text,

    started_at timestamptz not null default now(),
    ended_at timestamptz
);

create index if not exists idx_tuning_sessions_run on public.tuning_sessions(run_id);
create index if not exists idx_tuning_sessions_tenant on public.tuning_sessions(tenant_id);

-- =========================================================
-- 4) KPI Outcomes
-- =========================================================
create table if not exists public.kpi_outcomes (
    id uuid primary key default gen_random_uuid(),

    session_id uuid references public.tuning_sessions(id) on delete cascade,
    run_id text not null, -- Denormalized

    outcome_data jsonb not null default '{}'::jsonb,
    score float, -- Optional numeric score

    created_at timestamptz not null default now()
);

create index if not exists idx_kpi_outcomes_run on public.kpi_outcomes(run_id);

-- =========================================================
-- 5) RL / RLHA Feedback
-- =========================================================
create table if not exists public.rl_feedback (
    id uuid primary key default gen_random_uuid(),

    session_id uuid references public.tuning_sessions(id) on delete cascade,
    run_id text not null,

    feedback_type text not null, -- 'RL', 'RLHA'
    feedback_data jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists idx_rl_feedback_run on public.rl_feedback(run_id);

-- =========================================================
-- 6) Adapters Registry
-- =========================================================
create table if not exists public.adapters (
    id uuid primary key default gen_random_uuid(),

    adapter_id text unique not null,
    adapter_uri text not null, -- s3://...

    base_model_id text not null,
    created_by text, -- user_id or agent_id

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz not null default now()
);

-- =========================================================
-- 7) RLS Policies (Standard)
-- =========================================================

-- Enable RLS
alter table public.tuning_opt_ins enable row level security;
alter table public.tuning_ingest_state enable row level security;
alter table public.tuning_sessions enable row level security;
alter table public.kpi_outcomes enable row level security;
alter table public.rl_feedback enable row level security;
alter table public.adapters enable row level security;

-- Policies (Service Role has full access)
-- For now, we assume this is a backend-only system, but we add basic RLS.

create policy tuning_opt_ins_read on public.tuning_opt_ins
    for select using (true); -- Public read to check opt-in? Or restrict? Safer to restrict later.

create policy tuning_opt_ins_write on public.tuning_opt_ins
    for all using (public.is_service_role());

-- Ingest State: Service Role only
create policy ingest_state_all on public.tuning_ingest_state
    for all using (public.is_service_role());

-- Sessions/Outcomes/Feedback: Read by tenant, Write by Service Role
create policy sessions_select on public.tuning_sessions
    for select using (
        public.is_service_role() or
        tenant_id in (select tenant_id from public.tenant_members where user_id = auth.uid())
    );

create policy sessions_write on public.tuning_sessions
    for all using (public.is_service_role());

create policy kpi_select on public.kpi_outcomes
    for select using (
        exists (select 1 from public.tuning_sessions s where s.id = kpi_outcomes.session_id and (
            public.is_service_role() or s.tenant_id in (select tenant_id from public.tenant_members where user_id = auth.uid())
        ))
    );
create policy kpi_write on public.kpi_outcomes for all using (public.is_service_role());

create policy rl_select on public.rl_feedback
    for select using (
        exists (select 1 from public.tuning_sessions s where s.id = rl_feedback.session_id and (
            public.is_service_role() or s.tenant_id in (select tenant_id from public.tenant_members where user_id = auth.uid())
        ))
    );
create policy rl_write on public.rl_feedback for all using (public.is_service_role());

create policy adapters_select on public.adapters for select using (true); -- Public registry? Or tenant scoped? Prompt didn't specify tenant for adapters, assuming shared or system managed.
create policy adapters_write on public.adapters for all using (public.is_service_role());
