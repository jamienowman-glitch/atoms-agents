2026-01-28 — Temperature Engine Lift (Northstar ➜ Atoms‑Core) + UI Contract
=======================================================================

Goal
----
Lift the existing **Temperature Engine** out of `/Users/jaynowman/dev/northstar-engines` into
`/Users/jaynowman/dev/atoms-core` as a **prod-ready, space-aware service**, then wire the **UI**
for configuration + indicator display (TopPill) without nesting or scattering logic.

Non‑Negotiables
--------------
- **No `.env` / `.env.*`** anywhere. Use `VaultLoader` and `/Users/jaynowman/northstar-keys/`.
- **No imports from `northstar-engines` inside `atoms-core`** (copy, don’t reference).
- **No new monolith config files**. Keep atomic, small modules.
- **No unnecessary nesting**. Temperature lives in one obvious place in `atoms-core`.
- **Supabase is registry/config source of truth**. Cosmos is durability for snapshots/events.
- **Do not delete** anything in `northstar-engines` during the lift. Copy only.

Existing Assets (Authoritative Source Paths)
-------------------------------------------
Canonical temperature service (keep):
- `/Users/jaynowman/dev/northstar-engines/engines/temperature/models.py`
- `/Users/jaynowman/dev/northstar-engines/engines/temperature/service.py`
- `/Users/jaynowman/dev/northstar-engines/engines/temperature/repository.py`
- `/Users/jaynowman/dev/northstar-engines/engines/temperature/routes.py`
- `/Users/jaynowman/dev/northstar-engines/engines/temperature/tests/test_temperature_config.py`

Gate integration (used by policy):
- `/Users/jaynowman/dev/northstar-engines/engines/nexus/hardening/gate_chain.py`

Older control-layer temperature (secondary):
- `/Users/jaynowman/dev/northstar-engines/engines/control/temperature/engine.py`
- `/Users/jaynowman/dev/northstar-engines/engines/control/temperature/service.py`
- `/Users/jaynowman/dev/northstar-engines/engines/control/temperature/schemas.py`

Surface alias normalization (should be copied or re‑implemented):
- `/Users/jaynowman/dev/northstar-engines/engines/common/surface_normalizer.py`

Target Home (Atoms‑Core)
------------------------
All temperature code must live **flat** here:
- `/Users/jaynowman/dev/atoms-core/src/temperature/`
  - `models.py`
  - `service.py`
  - `repository.py`
  - `routes.py`
  - `metrics_adapter.py` (if separate)
  - `__init__.py`

### Router registration
Add to:
- `/Users/jaynowman/dev/atoms-core/src/main.py`

Temperature Contract (V1 — Space‑Level)
---------------------------------------
**Key shift:** Temperature is **space‑level** (aggregated across surfaces), not per‑surface.

### Config Types
**TemperatureFloorConfig**
- `id`
- `tenant_id`
- `env`
- `space_id`
- `surface_ids` (optional list used by aggregation filters)
- `performance_floors: {metric_key: float}`
- `cadence_floors: {metric_key: float}`
- `metadata`
- `created_at`, `updated_at`

**TemperatureCeilingConfig**
- `id`
- `tenant_id`
- `env`
- `space_id`
- `surface_ids` (optional)
- `ceilings: {metric_key: float}`
- `metadata`
- `created_at`, `updated_at`

**TemperatureWeights**
- `id`
- `tenant_id`
- `env`
- `space_id`
- `surface_ids` (optional)
- `weights: {metric_key: float}`
- `source: "system_default" | "tenant_override" | "llm_tuned"`
- `created_at`, `updated_at`

**TemperatureSnapshot**
- `id`
- `tenant_id`
- `env`
- `space_id`
- `surface_ids` (optional)
- `value`
- `window_start`, `window_end`
- `floors_breached[]`, `ceilings_breached[]`
- `raw_metrics: {metric_key: float}`
- `source` (metrics adapter source id)
- `usage_window_days`
- `kpi_corridors_used[]` (optional)
- `created_at`

### Required Headers/Context (Atoms‑Core)
Temperature endpoints must resolve:
`tenant_id`, `env`, `mode`, `project_id`, `surface_id`, `space_id`, `user_id`
from `IdentityMiddleware` state + headers (no direct use of northstar auth).

### Events (Event Spine)
Emit a `TEMPERATURE_SNAPSHOT` Dataset/Event when snapshot is computed.  
Payload must reference only IDs + metrics (no blobs).

Persistence Contract
--------------------
**Config** (Supabase): create tables for floors/ceilings/weights keyed by `(tenant_id, env, space_id)`.
**Snapshots** (Cosmos): append‑only storage with partition key = `(tenant_id, space_id)`.
**No filesystem** in prod mode.

Metrics Contract (Adapter)
--------------------------
Temperature consumes metrics from:
- KPI corridors (space+surface scoped)
- Budget usage
- Custom KPI outputs from event spine

Define a `TemperatureMetricsAdapter` that:
- Accepts `space_id`, `surface_ids[]`, `window_start/end`, `metric_keys[]`
- Returns `{metric_key: float}`
- Uses event spine or KPI service (no file reads)

UI Contract (Surface/Space Harness + Config)
-------------------------------------------
**Display requirement:** Temperature value visible **even when TopPill is closed**, scoped to Space.

### God‑Mode Config UI (Atoms‑App)
Must allow:
- Create/edit **space‑level** floors/ceilings/weights
- Select surfaces included in the space calculation
- Configure `window_days`
- Attach algorithm note/metadata (for later economist tweaks)

### Surface/Space Harness UI (Atoms‑UI)
Must show:
- Temperature indicator in TopPill closed state
- Temperature detail panel (on tap) with last snapshot + trend

Checklist (Backend Lift)
------------------------
- [ ] Copy temperature models/service/repo/routes into `atoms-core/src/temperature`
- [ ] Replace identity/auth with atoms‑core middleware context
- [ ] Replace FileTemperatureRepository with Supabase + Cosmos repositories
- [ ] Replace metrics adapter with event‑spine/KPI adapter
- [ ] Register router in `atoms-core/src/main.py`
- [ ] Add tests for config + snapshot + auth gating
- [ ] Update `atoms-core/AGENTS.md` to link this contract doc

Checklist (UI)
--------------
- [ ] Add God‑Mode Temperature Config page in `atoms-app` (space‑level)
- [ ] Wire to new atoms‑core endpoints
- [ ] Update Surface/Space harness UI to display temperature (TopPill closed)
- [ ] Add temperature panel view (tap/expand)
- [ ] Update `atoms-ui/agents.md` and relevant `SKILL.md` to reference the contract

Atomic Task List — Backend Lift (Cloud Worker)
---------------------------------------------
ATOMS-TEMP-01 — Create temperature module
- Create: `/Users/jaynowman/dev/atoms-core/src/temperature/models.py`
- Create: `/Users/jaynowman/dev/atoms-core/src/temperature/service.py`
- Create: `/Users/jaynowman/dev/atoms-core/src/temperature/repository.py`
- Create: `/Users/jaynowman/dev/atoms-core/src/temperature/routes.py`
- DoD: module imports clean, no northstar imports

ATOMS-TEMP-02 — Context adapter
- Create a lightweight context helper under `/Users/jaynowman/dev/atoms-core/src/identity/`
- DoD: all temperature routes use atoms‑core identity state, not northstar auth

ATOMS-TEMP-03 — Supabase config tables
- Add migrations under `/Users/jaynowman/dev/atoms-core/supabase/migrations/`
- Tables: `temperature_floors`, `temperature_ceilings`, `temperature_weights`
- DoD: CRUD works with RLS + service key via VaultLoader

ATOMS-TEMP-04 — Cosmos snapshot repository
- Add Cosmos repository in `atoms-core/src/temperature/repository.py`
- DoD: snapshots persist and list by space/tenant

ATOMS-TEMP-05 — Metrics adapter
- Implement `TemperatureMetricsAdapter` backed by KPI/budget/event spine
- DoD: compute_temperature produces non‑empty `raw_metrics`

ATOMS-TEMP-06 — Routes wiring
- Register router in `/Users/jaynowman/dev/atoms-core/src/main.py`
- DoD: `/temperature/*` endpoints available

ATOMS-TEMP-07 — Tests
- Add tests under `/Users/jaynowman/dev/atoms-core/tests/temperature/`
- DoD: auth required + config roundtrip + snapshot compute

Atomic Task List — UI (UI Worker)
--------------------------------
ATOMS-TEMP-UI-01 — God‑Mode Temperature Config
- Add page: `/Users/jaynowman/dev/atoms-app/src/app/god/config/temperature/page.tsx`
- DoD: create/edit floors/ceilings/weights (space level)

ATOMS-TEMP-UI-02 — Space selector + surface aggregation
- Use Supabase registry tables for spaces/surfaces
- DoD: select space + included surfaces

ATOMS-TEMP-UI-03 — TopPill temperature indicator
- Update harness UI in `/Users/jaynowman/dev/atoms-ui` to show temperature in closed state
- DoD: value visible without opening header

ATOMS-TEMP-UI-04 — Temperature panel
- Add expandable panel for details (latest snapshot, trend)
- DoD: panel toggles cleanly on mobile

ATOMS-TEMP-UI-05 — Docs + contract links
- Update `/Users/jaynowman/dev/atoms-ui/agents.md`
- Update `/Users/jaynowman/dev/atoms-app/AGENTS.md`
- DoD: contract linked in both

Kickoff Prompt — Cloud Worker (Backend Lift)
--------------------------------------------
KICKOFF — Temperature Engine Lift (Northstar ➜ Atoms‑Core)
Work root: /Users/jaynowman/dev

Read first:
- `/Users/jaynowman/dev/docs/plans/2026-01-28_temperature-engine-lift-and-ui-contract.md`
- `/Users/jaynowman/dev/atoms-core/AGENTS.md`

Hard guardrails:
- No `.env` files.
- No imports from `northstar-engines` inside `atoms-core`.
- No new monolithic config files.
- Keep temperature code flat under `/Users/jaynowman/dev/atoms-core/src/temperature/`.

Deliverables:
- Implement temperature module in atoms‑core (models/service/repo/routes).
- Use Supabase for config tables and Cosmos for snapshots.
- Replace metrics adapter with event‑spine/KPI adapter.
- Register router in `/Users/jaynowman/dev/atoms-core/src/main.py`.
- Add tests under `/Users/jaynowman/dev/atoms-core/tests/temperature/`.

Proof:
- You can upsert floors/ceilings/weights for a space.
- You can compute a snapshot that persists to Cosmos.

Kickoff Prompt — UI Worker (Temperature UI)
-------------------------------------------
KICKOFF — Temperature UI (God‑Mode Config + Harness Indicator)
Work root: /Users/jaynowman/dev

Read first:
- `/Users/jaynowman/dev/docs/plans/2026-01-28_temperature-engine-lift-and-ui-contract.md`
- `/Users/jaynowman/dev/atoms-app/AGENTS.md`
- `/Users/jaynowman/dev/atoms-ui/agents.md`

Hard guardrails:
- No `.env` files.
- No new routes per canvas/harness.
- Do not refactor unrelated UI logic.

Deliverables:
- God‑Mode page for temperature config:
  `/Users/jaynowman/dev/atoms-app/src/app/god/config/temperature/page.tsx`
- Surface/Space harness TopPill shows temperature even when closed.
- Temperature detail panel (mobile‑usable).

Proof:
- User can edit temperature config and save.
- Temperature indicator is visible on TopPill closed state.

