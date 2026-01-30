# Snax + Pricing + Discount UI Spec (Dashboard Pricing)

## Scope
Single admin surface for pricing + exchange rates + discount governance.
Use existing pricing dashboard style. No redesign.

## Location
- `atoms-app/src/app/dashboard/pricing/`
- Discount policy panel lives in same area (do not create new routes elsewhere).

## Data Sources (Supabase)
- `public.pricing`
- `public.system_config`
- `public.discount_policy`
- `public.discount_codes`
- `public.discount_redemptions`
- `public.discount_kpi_snapshots`

## Panels

### 1) Pricing Table Editor
**Purpose:** Set base Snax price per tool.

**Table columns:**
- `tool_key` (text, readonly)
- `base_price_snax` (number)
- `price_model` (select: per_call, per_second, per_gb)
- `active` (toggle)
- `updated_at` (readonly)

**Queries:**
- Read: `select * from pricing order by tool_key`
- Update: `update pricing set base_price_snax, price_model, active where tool_key = ?`

### 2) System Config Editor
**Keys:**
- `snax_exchange` (json)
- `crypto_bonus_pct` (number)

**UI:** JSON editor for `snax_exchange`, numeric input for `crypto_bonus_pct`.

**Queries:**
- Read: `select key, value from system_config where key in ('snax_exchange','crypto_bonus_pct')`
- Update: `update system_config set value = ? where key = ?`

### 3) Discount Policy Panel (per surface)
**Controls:**
- Surface dropdown (from `public.surfaces` if available, else text input)
- `min_discount_pct`
- `max_discount_pct`
- `monthly_discount_cap_pct_of_turnover`
- `rolling_window_days`
- KPI ceiling/floor editor (rows: `kpi_slug`, `min`, `max`)
- Status toggle (active/inactive)

**Queries:**
- Read policy: `select * from discount_policy where tenant_id = ? and surface_id = ?`
- Upsert: `insert ... on conflict (tenant_id, surface_id) do update`

### 4) Discount KPI Summary Tiles (BI stub)
**Tiles:**
- Current discount rate (rolling 30d)
- Estimated redemption rate
- Total discounts redeemed (rolling 30d)
- Remaining headroom vs cap

**Queries:**
- `select value from discount_kpi_snapshots where tenant_id = ? and surface_id = ? and kpi_slug = 'discount_rate' order by created_at desc limit 1`
- `select count(*), sum(discount_amount) from discount_redemptions where tenant_id = ? and surface_id = ? and redeemed_at > now() - interval '30 days'`

## Access / Security
- Pricing dashboard uses service-role key.
- No PII displayed (codes only, no recipient info).

## UX Notes
- Flat sections, collapsible headers.
- Do not add new config routes.
- Keep controls minimal; validation on save.
