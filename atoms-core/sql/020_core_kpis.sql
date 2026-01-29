-- 020_core_kpis.sql
-- Purpose: The 6 Locked Core KPIs serving as the source of truth.

CREATE TABLE IF NOT EXISTS core_kpis (
    core_kpi_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    display_label text,
    description text,
    window_token text,
    comparison_token text,
    estimate boolean DEFAULT false,
    missing_components jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Seed Data (Locked Definitions)
INSERT INTO core_kpis (name, display_label, description, window_token, comparison_token, estimate, missing_components, metadata, notes) VALUES
(
    'profit_after_costs',
    'Profit After Costs (Before Tax)',
    'Net Sales minus all visible costs (COGS, Marketing, Fees, Shipping).',
    'Rolling 7D', -- Default assumptions if not specified, but keeping simple
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Currency", "calculation_logic": "Net Sales - (COGS + Total Marketing Spend + Payment Fees + Platform Fees + Shipping Costs)"}'::jsonb,
    'This is Pre-Tax. If any cost component is missing, flag as ESTIMATE.'
),
(
    'mer',
    'MER',
    'Blended marketing efficiency. Net Sales divided by Total Marketing Spend.',
    'Rolling 7D',
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Ratio (Decimal)", "calculation_logic": "Net Sales / (Paid Media Spend + Influencer Spend + Agency Fees)"}'::jsonb,
    'Must be viewed alongside Discount Rate. If spend channels are disconnected, flag as ESTIMATE.'
),
(
    'growth_yoy',
    'Growth',
    'Year-over-Year change in Profit After Costs.',
    'Year-over-Year',
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Percentage", "calculation_logic": "(Current Profit - Prior Year Profit) / Prior Year Profit", "fallback_logic": "If Profit is an ESTIMATE or incomplete, fallback to (Current Net Sales - Prior Year Net Sales) / Prior Year Net Sales and label as Top Line Growth"}'::jsonb,
    'Fallback to YoY Net Sales when profit is ESTIMATE'
),
(
    'discount_rate',
    'Discount Rate',
    'Total margin reduction via promos/markdowns relative to Gross Sales.',
    'Rolling 7D',
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Percentage", "calculation_logic": "Total Discounts / Gross Sales"}'::jsonb,
    'Gross Sales is pre-discount. Discounts include codes, auto-discounts, and bundles.'
),
(
    'returns_rate',
    'Returns Rate',
    'Percentage of units physically received back vs units sold.',
    'Rolling 7D',
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Percentage", "calculation_logic": "Returned Units (Received) / Sold Units"}'::jsonb,
    'Mark ESTIMATE until return confirmations available. If Received data is unavailable, use Requested and flag as ESTIMATE.'
),
(
    'aoa',
    'AOA',
    'Unique people reachable via owned channels engaged in the last 90 days.',
    'Rolling 90D',
    'YoY',
    false,
    '[]'::jsonb,
    '{"format": "Integer", "calculation_logic": "Count(Unique IDs) where channel is (Email OR SMS OR Push) AND last_engagement_date >= (CURRENT_DATE - 90)"}'::jsonb,
    'Engagement = Open, Click, Reply, or Logged-in Visit.'
)
ON CONFLICT (name) DO UPDATE
SET
    display_label = EXCLUDED.display_label,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    notes = EXCLUDED.notes;
