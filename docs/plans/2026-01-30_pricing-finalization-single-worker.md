# Pricing Finalization — Single Worker Plan (2026-01-30)

## Objective
Consolidate all Snax + Pricing + Discount work into **one clean, production‑ready pricing dashboard** and a **single valid schema path**. This plan replaces the old Worker‑3 flow.

## Read First (mandatory)
- `/Users/jaynowman/dev/AGENTS.md`
- `/Users/jaynowman/dev/atoms-core/AGENTS.md`
- `/Users/jaynowman/dev/atoms-app/AGENTS.md`
- `/Users/jaynowman/dev/docs/plans/2026-01-30_snax-pricing-discount-atomic-task-plan.md`
- `/Users/jaynowman/dev/docs/plans/2026-01-30_snax-pricing-discount-ui-spec.md`

---

## Phase 1 — Decide the **Single** Schema Path (UUID vs Text)
1) Inspect Supabase `public.tenants.id` type (uuid vs text).
2) **If UUID:** use
   - `atoms-core/sql/015_snax_auth_patch_uuid.sql`
   - `atoms-core/sql/016_discount_engine_uuid.sql`
3) **If text:** use
   - `atoms-core/sql/015_snax_auth_patch.sql`
   - `atoms-core/sql/016_discount_engine.sql`
4) Mark the unused patch as **deprecated** in a header comment (do NOT delete unless instructed).

## Phase 2 — Apply Patches + Seed Data
1) Apply the selected 015 + 016 in Supabase SQL Editor.
2) Seed `system_config`:
   - `snax_exchange` = `{ "USD": 10, "GBP": 10, "EUR": 10 }`
   - `crypto_bonus_pct` = `20`
3) Seed `pricing` with minimal tool_key → base_price_snax.
4) Create a default `discount_policy` row per surface (min/max + KPI ceilings).

## Phase 3 — Fix the UI Location (one reality)
1) **Move pricing UI** from legacy path to new path:
   - FROM: `atoms-app/src/app/god/config/pricing/page.tsx`
   - TO: `atoms-app/src/app/dashboard/pricing/page.tsx`
2) **Remove or stub** the legacy file so no one edits it again.
3) Update any navigation links that still point to `/god/config/pricing`.

## Phase 4 — Discount Panel Integration
1) Add Discount Policy panel into the new dashboard pricing screen.
2) Use `discount_policy`, `discount_kpi_snapshots`, `discount_redemptions`.
3) Summary tiles must render (rolling 30d).

## Phase 5 — Verification Checklist
- Pricing dashboard loads and writes to Supabase.
- Exchange rate + crypto bonus persist.
- Discount policy saves per surface.
- KPI tiles render.
- Only one UI location remains (dashboard/pricing).

---

## Definition of Done
- Supabase schema applied (one path only).
- Pricing UI exists **only** at `atoms-app/src/app/dashboard/pricing/`.
- Discount panel integrated.
- No dangling references to `/god/config/pricing`.

