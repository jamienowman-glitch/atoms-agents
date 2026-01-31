/*
# 026_production_lines_registry.sql
# PRODUCTION LINES REGISTRY

## Requirements
- Track all "Factories" / "Engines" in the system.
- Provide documentation links and UI routes for God Config.
*/

create table if not exists public.production_lines (
    line_id uuid primary key default gen_random_uuid(),
    slug text unique not null,           -- e.g. 'connector_factory'
    display_name text not null,          -- e.g. 'Connector Factory'
    description text,
    status text check (status in ('planned', 'building', 'active', 'deprecated')) default 'planned',
    
    -- References
    repo_path text,                      -- e.g. 'atoms-connectors'
    docs_path text,                      -- e.g. 'atoms-core/docs/plans/...'
    config_route text,                   -- e.g. '/god/config/connectors'
    
    -- Metadata
    owner text default 'Antigravity',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.production_lines enable row level security;
create policy "Public Read Production Lines" on public.production_lines for select using (true);
create policy "Service Write Production Lines" on public.production_lines for all using (public.is_service_role());

-- Seed Data (The current active lines)
insert into public.production_lines (slug, display_name, description, status, repo_path, docs_path, config_route)
values 
(
    'connector_factory',
    'Connector Factory',
    'The "Printing Press" for SaaS Connectors. Automates manifest-based build, registration, and firearms gating.',
    'building',
    'atoms-connectors',
    'atoms-core/docs/plans/2026-01-30_connector_factory_atomic_plan.md',
    '/god/config/connectors'
),
(
    'microsite_press',
    'Website Printing Press',
    'Automated production line for detached Next.js marketing sites. Includes SEO, Analytics, and Pricing injection.',
    'building',
    'atoms-site-templates',
    'atoms-core/docs/plans/2026-01-30_microsite_upgrade_plan.md',
    '/god/config/sites'
),
(
    'discount_engine',
    'Discount Engine',
    'Policy-based pricing governance. Enforces Tenant Budgets and KPI Ceilings (floors) on all discounts.',
    'building',
    'atoms-core',
    'atoms-core/docs/plans/2026-01-30_discount_engine_plan.md',
    '/god/config/pricing/discounts'
),
(
    'kpi_framework',
    'KPI & Temperature Framework',
    'The "BI Classic" layer. Enforces locked definitions for Profit, MER, Growth, and 6-Band Temperature regulation.',
    'active',
    'atoms-core',
    'atoms-core/docs/plans/2026-01-30_kpi_framework_plan.md',
    '/god/config/kpis'
),
(
    'muscle_factory',
    'Muscle Factory',
    'Standardized build pipeline for MCP-based tools (Muscles). Enforces tenant-compute-first and SKILL.md laws.',
    'active',
    'atoms-muscle',
    'atoms-muscle/AGENTS.md',
    '/god/config/muscles'
),
(
    'email_identity_service',
    'Email & Identity Service',
    'Automated provisioning of domain-based email identities (e.g. aissistant@client-domain.com). Powers the "Aissistant" customer service layer.',
    'planned',
    'atoms-core',
    'atoms-core/docs/plans/2026-01-30_email_identity_plan.md', -- Placeholder for future spec
    '/god/config/identity'
)
on conflict (slug) do update set
    description = excluded.description,
    status = excluded.status,
    docs_path = excluded.docs_path,
    config_route = excluded.config_route;
