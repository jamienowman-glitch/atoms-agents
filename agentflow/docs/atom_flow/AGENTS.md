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
