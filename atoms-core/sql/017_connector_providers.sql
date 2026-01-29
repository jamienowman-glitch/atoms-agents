/*
# 017_connector_providers.sql

## Description
Connectors register a provider_id, canonical platform slug, and the naming_rule that drives the naming engine (Phase 2).
*/

create table if not exists public.connector_providers (
    provider_id text primary key,
    platform_slug text not null unique,
    display_name text,
    naming_rule text not null,
    created_at timestamptz default now()
);
