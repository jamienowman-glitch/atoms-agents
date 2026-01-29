/*
# 022_connector_factory_patch.sql

## Description
Adds missing Connector Factory tables and aligns schemas to locked contracts.
*/

-- Scope categories
create table if not exists public.connector_scope_categories (
    category_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    name text not null,
    created_at timestamptz default now(),
    unique(provider_id, name)
);

alter table public.connector_scopes
    add column if not exists category_id uuid references public.connector_scope_categories(category_id);

-- Dev account config
create table if not exists public.connector_dev_accounts (
    provider_id text primary key references public.connector_providers(provider_id) on delete cascade,
    system_dev_username text,
    vault_key_hint text,
    tenant_owned_keys jsonb default '[]'::jsonb,
    secondary_information jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- OAuth / marketplace requirements
create table if not exists public.connector_oauth_requirements (
    provider_id text primary key references public.connector_providers(provider_id) on delete cascade,
    free_testing_limit text,
    authorization_links jsonb default '[]'::jsonb,
    functional_summary text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Auth modes (BYOK / OAuth)
create table if not exists public.connector_auth_modes (
    provider_id text primary key references public.connector_providers(provider_id) on delete cascade,
    oauth_only boolean default false,
    byok_only boolean default false,
    oauth_and_byok boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- KPI mappings to core KPIs
create table if not exists public.kpi_mappings (
    mapping_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    metric_id uuid references public.platform_metrics(metric_id) on delete cascade,
    core_kpi_id uuid references public.core_kpis(core_kpi_id) on delete cascade,
    is_approved boolean default false,
    created_at timestamptz default now()
);

-- Budget metrics + mappings
create table if not exists public.budget_metrics (
    budget_metric_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    name text not null,
    description text,
    created_at timestamptz default now(),
    unique(provider_id, name)
);

create table if not exists public.budget_mappings (
    mapping_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    budget_metric_id uuid references public.budget_metrics(budget_metric_id) on delete cascade,
    generic_metric_id uuid references public.generic_metrics(generic_metric_id) on delete cascade,
    core_kpi_id uuid references public.core_kpis(core_kpi_id) on delete cascade,
    aggregation_method text,
    is_approved boolean default false,
    created_at timestamptz default now()
);

-- Align metric_mappings to locked schema (add columns, keep existing for now)
alter table public.metric_mappings
    add column if not exists provider_slug text,
    add column if not exists raw_metric_name text,
    add column if not exists standard_metric_slug text,
    add column if not exists aggregation_method text,
    add column if not exists is_approved boolean default false;

-- Align utm_templates to locked schema (add columns, keep existing for now)
alter table public.utm_templates
    add column if not exists provider_slug text,
    add column if not exists content_type_slug text,
    add column if not exists static_params jsonb default '{}'::jsonb,
    add column if not exists allowed_variables jsonb default '[]'::jsonb,
    add column if not exists pattern_structure text,
    add column if not exists is_approved boolean default false;

-- Core KPIs metadata
alter table public.core_kpis
    add column if not exists metadata jsonb default '{}'::jsonb,
    add column if not exists format text,
    add column if not exists calculation_logic text;
