/*
# 023_tools_registry.sql

## Description
Registry of internal tools/scripts exposed to agents (deterministic automation layer).
*/

create table if not exists public.tools_registry (
    tool_id uuid primary key default gen_random_uuid(),
    key text not null unique,
    name text not null,
    type text not null, -- e.g., 'script', 'agent_tool', 'mcp'
    entrypoint text not null,
    description text,
    status text not null default 'active',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
