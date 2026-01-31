/*
# 030_architecture_v2_1.sql
# DEEP RECON ARCHITECTURE v2.1
# "The Data Nervous System"

## Hierarchy
- TENANT (Wallet) -> Owns Spaces
- SPACE (Context) -> The Data Boundary (Nexus + Feeds)
- SURFACE (Domain) -> The Brand/Demographic Wrapper
- MAPPING -> Dynamic Configuration (Surface <-> Space)

## Feed Contract
- Feeds live in the SPACE.
- Surfaces read from their mapped Space.
*/

-- =========================================================
-- 1. Dynamic Mapping (The Decoupling)
-- =========================================================

-- New table to handle M:N configuration (though logically 1 surface -> 1 space per tenant context)
-- We remove the hardcoded 'space_key' from surfaces logic effectively by using this as truth.
create table if not exists public.space_surface_mappings (
    mapping_id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    
    -- Foreign Keys using Keys (Text) as per Registry standard, or IDs if feasible. 
    -- Existing schemas (004, 001) use Keys (text) for Spaces/Surfaces mostly.
    -- We'll verify against 004_nexus_spaces (key) and 001_init_registry_crm (key).
    space_key text not null references public.spaces(key),
    surface_key text not null references public.surfaces(key),
    
    active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Constraint: A Surface can only point to ONE Space at a time for a given Tenant context.
    -- This Prevents "Split Brain" where AGNX points to Space A and Space B simultaneously.
    unique(tenant_id, surface_key)
);

-- RLS
alter table public.space_surface_mappings enable row level security;
create policy "Tenant Read Mappings" on public.space_surface_mappings for select using (public.is_tenant_member(tenant_id));
create policy "Service Write Mappings" on public.space_surface_mappings for all using (public.is_service_role());

-- =========================================================
-- 2. The Feed Registry (Space Level)
-- =========================================================

create table if not exists public.space_feeds (
    feed_id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    space_key text not null references public.spaces(key),
    
    name text not null,       -- e.g. "My YouTube", "Niche Competitors"
    type text not null check (type in ('rss', 'api', 'webhook', 'system', 'youtube')),
    
    -- Configuration (URL, API Key, Channel ID)
    config jsonb default '{}'::jsonb,
    
    is_system_injected boolean default false, -- Was this auto-created by God Mode?
    status text default 'active',
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.space_feeds enable row level security;
create policy "Tenant Read Feeds" on public.space_feeds for select using (public.is_tenant_member(tenant_id));
create policy "Service Write Feeds" on public.space_feeds for all using (public.is_service_role());

-- =========================================================
-- 3. Feed Items (The Content Stream)
-- =========================================================

-- Stores the actual items retrieved from the feeds (Video, Article, Tweet)
create table if not exists public.space_feed_items (
    item_id uuid primary key default gen_random_uuid(),
    feed_id uuid references public.space_feeds(feed_id) on delete cascade not null,
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    
    external_id text,         -- Unique ID from source (e.g. YouTube Video ID)
    title text,
    summary text,
    url text,
    published_at timestamptz,
    
    media_assets jsonb default '[]'::jsonb, -- Images/Videos associated
    meta jsonb default '{}'::jsonb,
    
    created_at timestamptz default now(),
    unique(feed_id, external_id)
);

-- RLS
alter table public.space_feed_items enable row level security;
create policy "Tenant Read Feed Items" on public.space_feed_items for select using (public.is_tenant_member(tenant_id));

-- =========================================================
-- 4. Co-Founder View (The Aggregator)
-- =========================================================
-- A view that Unions Nexus Memories and Feed Items for a "Time Stream"
-- Note: This requires 'nexus_memories' to exist. If not, this is a placeholder stub.

create or replace view public.view_space_timeline as
select
    item_id as id,
    tenant_id,
    'feed_item' as type,
    title as label,
    summary as content,
    published_at as sort_date,
    meta
from public.space_feed_items
-- UNION ALL
-- select id, tenant_id, 'memory', ... from nexus_memories ...
;

-- =========================================================
-- 5. Trigger Hooks (God Mode Injection Stub)
-- =========================================================

-- Trigger function to be called when a new Tenant Space is configured
create or replace function public.inject_default_space_feeds()
returns trigger language plpgsql security definer as $$
begin
    -- Logic: If creating a 'marketing' space, inject 'Marketing Trends' feed
    -- This would be implemented by the Service Layer (Worker A), but the hook is here.
    return new;
end;
$$;
