/*
# 019_platform_metrics.sql

## Description
Stores provider-specific and generic KPI metadata plus optional mappings. Also tracks the reusable UTM templates referenced by the UTM engine (Phase 2).
*/

create table if not exists public.platform_metrics (
    metric_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    metric_name text not null,
    description text,
    data_source text,
    created_at timestamptz default now(),
    unique(provider_id, metric_name)
);

create table if not exists public.generic_metrics (
    generic_metric_id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    category text,
    created_at timestamptz default now()
);

create table if not exists public.metric_mappings (
    mapping_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    metric_id uuid references public.platform_metrics(metric_id) on delete cascade,
    generic_metric_id uuid references public.generic_metrics(generic_metric_id) on delete cascade,
    created_at timestamptz default now(),
    unique(provider_id, metric_id, generic_metric_id)
);

create table if not exists public.utm_templates (
    template_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    first_touch_template text,
    last_touch_template text,
    content_type_template text,
    custom_rules jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
