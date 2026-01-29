/*
# 016_firearm_types.sql

## Description
Simple registry for firearm categories referenced by connector scopes. There is no additional logic or gating metadata here—only the canonical list of firearm_type_id + human label.
*/

create table if not exists public.firearm_types (
    firearm_type_id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    created_at timestamptz default now()
);
