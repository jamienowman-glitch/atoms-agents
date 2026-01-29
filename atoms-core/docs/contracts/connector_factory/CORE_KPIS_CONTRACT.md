# Core KPIs Contract (Connector Factory)

## Purpose
Lock the six core KPIs and their definitions. These are the canonical source of truth for BI and reporting.

## Table: `core_kpis`
Required columns:
- `core_kpi_id` (PK, uuid)
- `name` (text, unique)
- `display_label` (text)
- `description` (text)
- `format` (text) — e.g., `currency`, `percentage`, `ratio`, `integer`
- `calculation_logic` (text)
- `window_token` (text)
- `comparison_token` (text)
- `estimate` (boolean)
- `missing_components` (jsonb array of strings)
- `notes` (text)
- `metadata` (jsonb)

## Schema Rules
- `missing_components` stores JSON arrays like `["cogs","shipping_cost"]`.
- `metadata` must be stored (do not drop); used for UI hints and future configuration.

## Locked Seed Definitions (6 Core KPIs)

### 1) `profit_after_costs`
- Display Label: Profit After Costs (Before Tax)
- Description: Net Sales minus all visible costs (COGS, Marketing, Fees, Shipping).
- Format: Currency
- Calculation Logic: Net Sales - (COGS + Total Marketing Spend + Payment Fees + Platform Fees + Shipping Costs)
- Notes/Constraints: Pre-tax. If any cost component is missing, flag as ESTIMATE.

### 2) `mer`
- Display Label: MER (Marketing Efficiency Ratio)
- Description: Blended marketing efficiency. Net Sales divided by Total Marketing Spend.
- Format: Ratio (Decimal)
- Calculation Logic: Net Sales / (Paid Media Spend + Influencer Spend + Agency Fees)
- Notes/Constraints: Must be viewed alongside Discount Rate. If spend channels are disconnected, flag as ESTIMATE.

### 3) `growth_yoy`
- Display Label: Growth (YoY)
- Description: Year-over-Year change in Profit After Costs.
- Format: Percentage
- Calculation Logic: (Current Profit - Prior Year Profit) / Prior Year Profit
- Fallback Logic: If Profit is ESTIMATE/incomplete, fallback to (Current Net Sales - Prior Year Net Sales) / Prior Year Net Sales and label as "Top Line Growth".

### 4) `discount_rate`
- Display Label: Discount Rate
- Description: Total margin reduction via promos/markdowns relative to Gross Sales.
- Format: Percentage
- Calculation Logic: Total Discounts / Gross Sales
- Notes/Constraints: Gross Sales is pre-discount. Discounts include codes, auto-discounts, and bundles.

### 5) `returns_rate`
- Display Label: Returns Rate
- Description: Percentage of units physically received back vs units sold.
- Format: Percentage
- Calculation Logic: Returned Units (Received) / Sold Units
- Notes/Constraints: "Sold Units" window matches view. If "Received" data is unavailable, use "Requested" and flag ESTIMATE.

### 6) `aoa`
- Display Label: Active Owned Audience (AOA)
- Description: Unique people reachable via owned channels engaged in the last 90 days.
- Format: Integer
- Calculation Logic: Count(Unique IDs) where channel is (Email OR SMS OR Push) AND last_engagement_date >= (CURRENT_DATE - 90)
- Notes/Constraints: Engagement = Open, Click, Reply, or Logged-in Visit.
