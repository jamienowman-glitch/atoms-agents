-- Create the 'registries' meta-table
create table if not exists public.registries (
    id text primary key,
    label text not null,
    description text,
    path text not null,
    category text default 'system', -- 'infra', 'system', 'agent'
    is_active boolean default true,
    display_order integer default 0,
    created_at timestamptz default now()
);

-- Turn on RLS
alter table public.registries enable row level security;

-- Allow read access to authenticated users
create policy "Allow read access to authenticated users"
on public.registries for select
to authenticated
using (true);

-- Seed Initial Data (So the dashboard isn't empty on first load)
insert into public.registries (id, label, description, path, category, display_order)
values
    ('registries', 'REGISTRIES', 'Database Schemas • Tables • Truth', '/dashboard/infra/registries', 'infra', 10),
    ('free-tiers', 'FREE TIER REGISTRY', 'Google Cloud Limits • Risk Register', '/dashboard/infra/free-tiers', 'infra', 20),
    ('live-cost', 'LIVE COST & USAGE', 'Shadow Billing • Unit Economics', '/dashboard/infra/cost', 'infra', 30),
    ('storage', 'STORAGE', 'Buckets • CDN • Multi-Cloud Assets', '/dashboard/infra/storage', 'infra', 40),
    ('routing', 'ROUTING ENGINE', 'Traffic Rules • Tenant Allocation', '/dashboard/infra/routing', 'infra', 90),
    ('compute', 'COMPUTE / GPU', 'Model Inference • Training', '/dashboard/infra/compute', 'infra', 99)
on conflict (id) do update set
    label = excluded.label,
    description = excluded.description,
    path = excluded.path,
    category = excluded.category;
