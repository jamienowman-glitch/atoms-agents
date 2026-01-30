# Snax + Pricing + Discount Engine — Atomic Task Plan (2026-01-30)

## Goal
Ship production‑ready Snax pricing + discount governance (per tenant + per surface), backed by Supabase and editable in the pricing dashboard.

## References
- **Snax schema patch:** `atoms-core/sql/015_snax_auth_patch.sql`
- **Discount schema patch:** `atoms-core/sql/016_discount_engine.sql`
- **Discount contract:** `docs/contracts/discount-engine-contract.md`
- **UI spec:** `docs/plans/2026-01-30_snax-pricing-discount-ui-spec.md`
- **Core laws:** `/Users/jaynowman/dev/AGENTS.md`

---

## Phase A — Snax Core (Minimal to go live)

### A1) Apply Snax Patch (Supabase)
- Apply `atoms-core/sql/015_snax_auth_patch.sql` in Supabase SQL Editor.
- Confirms tables: `tenants`, `tenant_members`, `snax_wallets`, `snax_ledger`, `api_keys`, `pricing`, `crypto_deposits`, `system_config`.
- Confirms RPC: `snax_charge`.

### A2) Seed system_config
Create rows in `public.system_config`:
- `snax_exchange` = `{ "USD": 10, "GBP": 10, "EUR": 10 }`
- `crypto_bonus_pct` = `20`
- Optional: `snax_rounding` = `{ "mode": "round", "precision": 0 }`

### A3) Seed pricing
Populate `public.pricing` with initial tool prices:
- `tool_key` -> `base_price_snax`
- Ensure `active=true` for live tools.

### A4) Pricing UI (Dashboard)
Create/complete pricing UI under:
- `atoms-app/src/app/dashboard/pricing/`
- Tables: `pricing`, `system_config`
- Actions:
  - Edit base price
  - Toggle active
  - Edit exchange rate + crypto bonus

---

## Phase B — Discount Engine (Governance + KPIs)

### B1) Schema Patch
Add tables (per contract):
- `discount_policy`
- `discount_codes`
- `discount_redemptions`
- `discount_kpi_snapshots`
- RLS: tenant read, service-role write
Use: `atoms-core/sql/016_discount_engine.sql`.

### B2) RPCs / Server Logic
Implement:
- `create_discount_code`
- `validate_discount_code`
- `redeem_discount_code`
- `compute_discount_eligibility`

Enforce:
- Policy min/max
- KPI ceilings/floors
- Monthly cap % of turnover

### B2.1) Snax Integration (Hook Point)
Add an **optional** `coupon_code` to `snax_charge` (DB‑side) OR pre‑validate in `snax_guard`:
- Validate discount code (tenant+surface)
- Adjust `p_cost_snax`
- Insert redemption record
Prefer DB‑side to keep atomicity.

### B3) Pricing Dashboard — Discount Policy UI
Add a Discount Policy panel to the pricing dashboard:
- Per‑surface selector
- Inputs: min%, max%, monthly cap%
- KPI ceiling/floor editor
- Summary tiles (rolling 30d)

### B4) Event V2 Stub
Emit event on redemption:
- `discount.redeemed` (no PII)

---

## Phase C — Acceptance Criteria
- Snax schema applied + verified
- Pricing + system_config editable via UI
- Discount policy enforced per surface
- Discount redemptions tracked
- KPI snapshot stub present

---

## Kickoff Prompts
### Worker 1 — Snax + Pricing
Role: Snax Foundation Engineer  
Mission: Apply Snax schema + seed pricing + expose exchange settings in pricing dashboard.  

Read first:  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/atoms-core/AGENTS.md`  
- `/Users/jaynowman/dev/atoms-app/AGENTS.md`  

Tasks:  
1) Apply `atoms-core/sql/015_snax_auth_patch.sql` in Supabase.  
2) Seed `public.system_config`:
   - `snax_exchange` = `{ "USD": 10, "GBP": 10, "EUR": 10 }`
   - `crypto_bonus_pct` = `20`
3) Seed `public.pricing` with initial tool_key → base_price_snax.  
4) Implement pricing dashboard UI in `atoms-app/src/app/dashboard/pricing/` for:
   - pricing table editor  
   - system_config editor (exchange + crypto bonus)

Definition of Done:  
- Schema applied, pricing seeded, UI edits persist to Supabase.

### Worker 2 — Discount Engine
Role: Discount Engine Lead  
Mission: Build discount governance (policy + codes + redemptions + KPI stubs).  

Read first:  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/atoms-core/AGENTS.md`  
- `docs/contracts/discount-engine-contract.md`  

Tasks:  
1) Implement schema patch in `atoms-core/sql/016_discount_engine.sql`.  
2) Build RPCs: `create_discount_code`, `validate_discount_code`, `redeem_discount_code`, `compute_discount_eligibility`.  
3) Add optional hook to Snax (`coupon_code` to `snax_charge` or DB‑side validation).  
4) Emit `discount.redeemed` event stub (no PII).  

Definition of Done:  
- Policy enforcement works, redemptions tracked, KPI snapshot stub exists.

### Worker 3 — Pricing Dashboard (Discount UI)
Role: Config UI Integrator  
Mission: Build Discount Policy panel in pricing dashboard without redesign.  

Read first:  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/atoms-app/AGENTS.md`  
- `docs/plans/2026-01-30_snax-pricing-discount-ui-spec.md`  

Tasks:  
1) Add Discount Policy panel under `atoms-app/src/app/dashboard/pricing/`.  
2) Implement per‑surface policy editor + KPI ceiling/floor editor.  
3) Add summary tiles from `discount_kpi_snapshots` + redemptions.  

Definition of Done:  
- UI saves to Supabase; summary tiles render; no new routes.
