/*
# 067_infrastructure_registry.sql

## Description
Simple reference table for tracking "what services are we using for what".
This is a MEMORY LAYER, not for API keys. Keys go through Connectors.

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.
*/

-- Infrastructure Registry (Memory Layer)
-- Tracks what services are used for what purpose
create table if not exists public.infrastructure_registry (
    id uuid primary key default gen_random_uuid(),
    service_name text not null,          -- e.g., "Cloudflare Pages"
    purpose text not null,                -- e.g., "Hosting websites"
    tier text default 'Free',             -- Free, Paid, Trial, Enterprise
    notes text,                           -- Optional notes
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Index for quick lookup
create index if not exists idx_infrastructure_service on public.infrastructure_registry(service_name);
create index if not exists idx_infrastructure_tier on public.infrastructure_registry(tier);

-- RLS
alter table public.infrastructure_registry enable row level security;

-- Allow authenticated users to manage
create policy "Authenticated can manage infrastructure"
    on public.infrastructure_registry for all
    using (auth.role() = 'authenticated');

comment on table public.infrastructure_registry is 'Memory layer for tracking what infrastructure services are used for what purpose. NOT for API keys.';
