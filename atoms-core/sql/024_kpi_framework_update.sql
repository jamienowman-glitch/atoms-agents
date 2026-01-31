/*
# 024_kpi_framework_update.sql
# SURFACE KPI & TEMPERATURE FRAMEWORK

## Requirements
- Enforce Standard 6 Core KPIs with Locked Definitions.
- Enforce Standard 6 Temperature Bands.
- Schema support for Connector Contribution.
*/

-- =========================================================
-- 1. Core KPIs (Locked Definitions)
-- =========================================================

-- Update standard definitions to match Surgical Spec
update public.core_kpis set
    display_label = 'Profit After Costs (Before Tax)',
    description = 'Net Sales - Minimum Included Costs (COGS, Marketing, Payment, Platform)',
    window_token = 'Rolling 7D',
    -- Clear out old notes/json to ensure fresh start
    notes = 'Financial Guardrail. Excludes Tax.',
    missing_components = '[]'::jsonb
where name = 'profit_after_costs';

update public.core_kpis set
    display_label = 'MER',
    description = 'Net Sales / Total Marketing Spend (Paid Media + Influencer + Agency)',
    window_token = 'Rolling 7D',
    estimate = true,
    missing_components = '["agency_fees"]'::jsonb
where name = 'mer';

update public.core_kpis set
    display_label = 'Growth',
    description = 'YoY change in Profit After Costs (Before Tax)',
    window_token = 'Year-over-Year',
    estimate = true
where name = 'growth';

update public.core_kpis set
    display_label = 'Discount Rate',
    description = 'Total Discounts / Gross Sales (pre-discount, pre-tax)',
    window_token = 'Rolling 7D',
    estimate = false
where name = 'discount_rate';

update public.core_kpis set
    display_label = 'Returns Rate',
    description = 'Returned Units (received) / Sold Units',
    window_token = 'Rolling 7D',
    estimate = true
where name = 'returns_rate';

-- Upsert AOA (Active Owned Audience)
insert into public.core_kpis (name, display_label, description, window_token, comparison_token, estimate, missing_components, notes)
values (
    'aoa',
    'Active Owned Audience (AOA)',
    'Unique people reachable via owned channels who engaged at least once in the last 90D',
    'Rolling 90D',
    'YoY',
    false,
    '[]'::jsonb,
    'Includes Email, SMS, Push, On-site Recognized.'
) on conflict (name) do update set
    description = excluded.description,
    window_token = excluded.window_token;

-- =========================================================
-- 2. Temperature Bands (Registry)
-- =========================================================

create table if not exists public.temperature_bands_registry (
    band_id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    display_name text not null,
    min_val integer not null,
    max_val integer not null,
    behavioral_intent text not null, -- Instructions for Agents
    color_token text not null,
    created_at timestamptz default now()
);

alter table public.temperature_bands_registry enable row level security;
create policy "Public Read" on public.temperature_bands_registry for select using (true);

insert into public.temperature_bands_registry (slug, display_name, min_val, max_val, behavioral_intent, color_token)
values
('ice', 'Ice', 0, 40, 'Emergency Review. Autopilot disabled. Deep situation-room review mode.', 'blue-900'),
('blue', 'Blue', 40, 55, 'Underheating / Contingency. Tighter focus on what works. Stronger activation.', 'blue-500'),
('yellow_low', 'Yellow (Low)', 55, 65, 'Minor Correction. Small adjustments. Less experimentation.', 'yellow-400'),
('green', 'Green', 65, 75, 'Optimum. Business as usual. Normal agent loops. Strategic growth planning.', 'green-500'),
('yellow_high', 'Yellow (High)', 75, 90, 'Overheating. Cooling behaviors. Demand/Supply mismatch. Propose product focus swaps.', 'yellow-600'),
('red', 'Red', 90, 100, 'Action Stations. Produce detailed action plan. Human loop required.', 'red-600')
on conflict (slug) do update set
    min_val = excluded.min_val,
    max_val = excluded.max_val,
    behavioral_intent = excluded.behavioral_intent;

-- =========================================================
-- 3. Connector Contribution (Mapping Support)
-- =========================================================

-- Extends metric_mappings to declare "Is this an estimate?" and what it contributes to.
alter table public.metric_mappings
    add column if not exists contributes_to_core_kpi text,
    add column if not exists is_estimate boolean default false,
    add column if not exists conversion_factor numeric default 1.0; -- e.g. cents to dollars

-- Index for fast lookup of "Who feeds Profit?"
create index if not exists idx_metric_mappings_contribution on public.metric_mappings(contributes_to_core_kpi);
