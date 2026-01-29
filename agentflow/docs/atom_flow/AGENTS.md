# AGENTS.md — ATOM FLOW SAFETY RULES

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


This document is a hard safety boundary. If any instruction conflicts with this file, STOP and ask.

## GLOBAL RULES (ALL AGENTS)
- DO NOT modify any file outside your role scope.
- DO NOT change stable tools (Font, Type, Colour), magnifier structure, or tool registry.
- DO NOT refactor, rename, or reformat unrelated code.
- DO NOT “clean up” imports or styling outside the target file.
- If a requirement implies touching stable systems, STOP and ask.

## ARCHITECT SCOPE
- READ ONLY:
  - `docs/atom_flow/templates/BOSSMAN_ATOM_TALK.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
  - `docs/toolmap_template.md`
  - `docs/toolmap.md`
- WRITE ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
- FORBIDDEN:
  - Any code changes.
  - Any changes to controls, tools, or components.

## WORKER SCOPE
- READ ONLY:
  - `docs/atom_flow/specs/[AtomName]_TECH_SPEC.md`
  - `docs/atom_flow/templates/_GenericAtom.tsx`
- WRITE ONLY:
  - `components/multi21/atoms/[AtomName].tsx`
- FORBIDDEN:
  - Any change to `BottomControlsPanel`, `ConnectedBlock`, `Tool registry`, or any existing atom.

## REFERENCES
- `docs/atom_flow/skills/ARCHITECT_SKILL.md`
- `docs/atom_flow/skills/WORKER_SKILL.md`
## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 🏭 MUSCLE FACTORY STANDARD (2026)
- **Path law:** muscles live in `atoms-muscle/src/{category}/{name}` (no legacy nesting).
- **Wrapper law:** every muscle must include a complete `mcp.py` (no stubs).
- **Skill law:** every muscle must include `SKILL.md` using the global template and **unique** content (no placeholders).
- **Imports:** `atoms-muscle` is runtime/service; `atoms-core` is library. Use explicit `from atoms_core.src.<domain> ...` imports only.
- **No northstar-engines.**
- **Tenant compute first:** interactive render runs on device; server CPU fallback **only** for explicit export/offline.
- **Automation steps:**
  - After creating/updating a muscle, run `python3 atoms-muscle/scripts/normalize_mcp.py`.
  - Before deploy/hand-off, run `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`.

## Connector Factory Laws (Global)
- **God Config Name (Locked):** `Connector Factory — God Config` (log this exact name in all layers).
- **UX Law (God Config):** Use the existing config style but avoid nested cards/boxes. Prefer flat sections with collapsible headers and mobile-first usability.
- **Firearms Only Gate:** No danger levels, risk scores, allow-lists, or parallel gating fields. Safety is **only** `requires_firearm` + `firearm_type_id`.
- **Firearms Handling (Locked):** Agents must leave `requires_firearm=false` and `firearm_type_id` empty in drafts. Only humans set firearms in the UI.
- **Draft-Only Rule:** Connector contracts remain `draft` until a human explicitly approves in the UI.
- **UTM Templates Schema (Locked):** `utm_templates` must include `template_id`, `provider_slug` (indexed), `content_type_slug`, `static_params` (jsonb), `allowed_variables` (jsonb array), `pattern_structure`, `is_approved` (default false). Builder must drop empty variables cleanly (no double underscores).
- **Metric Mappings Schema (Locked):** `metric_mappings` must exist with `mapping_id`, `provider_slug` (indexed), `raw_metric_name`, `standard_metric_slug`, `aggregation_method` (sum/avg/max), `is_approved` (default false).
- **Firearms Licenses Registry (Locked):** `firearms_licenses` registry table with `license_key` (pk), `category`, `description`. Seed initial licenses for Financial, Communication, System/Founder.
- **Naming Engine Rule (Locked):** `formatProviderKey(platformName, rule)` is pure; basic slugify → uppercase → underscores; apply `rule` as a token template (e.g., `PROVIDER_{PLATFORM}_KEY`).
- **Core KPIs Schema (Locked):** `core_kpis.missing_components` is jsonb array of strings; `core_kpis.metadata` is jsonb (store and do not drop).

