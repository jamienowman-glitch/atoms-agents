/*
# 018_connector_scopes.sql

## Description
Every connector scope for every platform is centralized here. Firearm gating is enforced solely through requires_firearm + firearm_type_id; no other danger/risk columns exist.
*/

create table if not exists public.connector_scopes (
    scope_id uuid primary key default gen_random_uuid(),
    provider_id text not null references public.connector_providers(provider_id) on delete cascade,
    scope_name text not null,
    scope_type text,
    description text,
    requires_firearm boolean not null default false,
    firearm_type_id uuid references public.firearm_types(firearm_type_id),
    notes text,
    created_at timestamptz default now(),
    check (not requires_firearm or firearm_type_id is not null)
);
