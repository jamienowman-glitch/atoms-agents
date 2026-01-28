create table if not exists public.temperature_floors (
    id uuid primary key default gen_random_uuid(),
    tenant_id text not null,
    env text not null,
    space_id text not null,
    surface_ids text[] null,
    performance_floors jsonb default '{}'::jsonb,
    cadence_floors jsonb default '{}'::jsonb,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (tenant_id, env, space_id)
);

create table if not exists public.temperature_ceilings (
    id uuid primary key default gen_random_uuid(),
    tenant_id text not null,
    env text not null,
    space_id text not null,
    surface_ids text[] null,
    ceilings jsonb default '{}'::jsonb,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (tenant_id, env, space_id)
);

create table if not exists public.temperature_weights (
    id uuid primary key default gen_random_uuid(),
    tenant_id text not null,
    env text not null,
    space_id text not null,
    surface_ids text[] null,
    weights jsonb default '{}'::jsonb,
    source text default 'system_default',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (tenant_id, env, space_id)
);

create table if not exists public.temperature_snapshots (
    id uuid primary key default gen_random_uuid(),
    tenant_id text not null,
    env text not null,
    space_id text not null,
    surface_ids text[] null,
    value numeric not null,
    window_start timestamptz not null,
    window_end timestamptz not null,
    floors_breached text[] default '{}'::text[],
    ceilings_breached text[] default '{}'::text[],
    raw_metrics jsonb default '{}'::jsonb,
    source text default 'unknown',
    usage_window_days integer default 7,
    kpi_corridors_used text[] default '{}'::text[],
    created_at timestamptz default now()
);

create index if not exists temperature_snapshots_space_idx
    on public.temperature_snapshots (tenant_id, space_id, created_at desc);
