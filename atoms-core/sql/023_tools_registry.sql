/*
# 023_tools_registry.sql
# TOOL FACTORY REGISTRY (Updated)

## Requirements
- Registry for "Black Tools" (Lightweight Scripts)
- Schema definitions for Agent Consumption
- Categorization
*/

create table if not exists public.tools_registry (
    tool_id uuid primary key default gen_random_uuid(),
    key text not null unique,           -- e.g. 'remove_paragraph'
    name text not null,                 -- e.g. 'Remove Paragraph'
    type text not null,                 -- e.g. 'script', 'agent_tool', 'mcp'
    category text,                      -- e.g. 'text_processing', 'dev_ops'
    entrypoint text not null,           -- Path to script or command
    description text,
    
    -- Agent Contract
    input_schema jsonb default '{}'::jsonb,  -- JSON Schema for arguments
    output_schema jsonb default '{}'::jsonb, -- JSON Schema for return value
    
    status text not null default 'active',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.tools_registry enable row level security;
create policy "Public Read Tools" on public.tools_registry for select using (true);
create policy "Service Write Tools" on public.tools_registry for all using (public.is_service_role());

-- Index for Category Lookup
create index if not exists idx_tools_registry_category on public.tools_registry(category);
