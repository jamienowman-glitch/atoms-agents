/*
# 020_core_kpis.sql

## Description
Tracks the canonical KPI definitions for Connector Factory dashboards. Entries are derived from legacy kpi.json data but now live in the core_kpis registry with normalized JSON metadata.
*/

create table if not exists public.core_kpis (
    core_kpi_id uuid primary key default gen_random_uuid(),
    name text not null unique,
    display_label text,
    description text,
    window_token text,
    comparison_token text,
    estimate boolean not null default false,
    missing_components jsonb default '[]'::jsonb,
    notes text,
    created_at timestamptz default now()
);

insert into public.core_kpis (
    name,
    display_label,
    description,
    window_token,
    comparison_token,
    estimate,
    missing_components,
    notes
) values
('profit_after_costs',
 'Profit After Costs (Before Tax)',
 'Net sales after discounts/returns minus included costs before tax',
 'Rolling 7D',
 'YoY',
 false,
 '[]'::jsonb,
 'Include marketing, payment, and platform fees when available; mark ESTIMATE otherwise'),
('mer',
 'MER',
 'Media Efficiency Ratio = Net Sales / Total Marketing Spend',
 'Rolling 7D',
 'YoY',
 true,
 '["marketing_spend"]'::jsonb,
 'Treat influencer spend as marketing_spend; mark missing components when spend not reported'),
('growth',
 'Growth',
 'YoY change in Profit After Costs (Before Tax)',
 'Year-over-Year',
 'YoY',
 true,
 '[]'::jsonb,
 'Fallback to YoY Net Sales when profit is ESTIMATE'),
('discount_rate',
 'Discount Rate',
 'Total Discounts ÷ Gross Sales (pre-discount, pre-tax)',
 'Rolling 7D',
 'YoY',
 false,
 '[]'::jsonb,
 'Include promos, markdowns, and bundle discounts'),
('returns_rate',
 'Returns Rate',
 'Confirmed returned units ÷ sold units',
 'Rolling 7D',
 'YoY',
 true,
 '["returned_units"]'::jsonb,
 'Mark ESTIMATE until return confirmations available'),
('aoa',
 'AOA',
 '90D unique reachable owned-channel audience',
 'Rolling 90D',
 'YoY',
 false,
 '[]'::jsonb,
 'Include multichannel engagements (open/click/reply/react)');
