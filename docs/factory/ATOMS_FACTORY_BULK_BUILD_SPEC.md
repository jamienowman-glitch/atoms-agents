# Atoms Factory Bulk Build Spec

Scope: bulk-generation and hardening of atoms to match the canonical token contract. No runtime feature changes here—spec only.

## Structural Requirements
- Every atom directory MUST contain the 10 buckets: `behaviour/`, `layout/`, `views/`, `typography/`, `colours/`, `icons/`, `data_schema/`, `tracking/`, `accessibility/`, `exposed_tokens/`.
- `exposed_tokens/schema.ts` defines the full token schema aligned to UI_ATOM_TOKEN_CONTRACT (all groups present, NA objects where not applicable).
- `exposed_tokens/default.ts` (or equivalent per-group defaults) supplies complete defaults for every token path; no blanks.
- Views render strictly from tokens; no hidden props or in-memory fallbacks.

## Token + Responsive Rules
- Responsive wrapper required for visual tokens (`Responsive<T>` with base/mobile/desktop).
- NA not blank: any unused group set to `{ status: "NA", reason: "<why>" }`.
- Typography must use Roboto Flex preset with axis map + constraints.
- Layout must support flow + freeform tokens (positioning, transforms, z-index, constraints).
- Tracking bucket must include analytics_event_name, conversion_goal_id, platform_tags, utm_template/utm_defaults.
- Accessibility bucket must be filled (role/label/tab_index/aria maps); alt text required for images (no NA).
- Data binding bucket present for every atom (status ENABLED/DISABLED/NA with reason).

## Registry/Outputs
- Registry generation emits: type_id, version, schema, defaults, controls_metadata, slots/children_rules, capabilities_flags.
- Controls metadata describes editor widgets (e.g., color picker, slider, dropdown, toggle, axis editor).
- TokenSurface hints are emitted for agents (allowlisted JSON Pointer paths).

## Acceptance Criteria
- 100% atoms pass schema validation against the contract (including NA enforcement).
- Recovery_ops/replay compatibility: token schemas avoid local state; instances patchable via JSON Patch.
- No empty files; every bucket has meaningful content or explicit NA callouts.
- Tests/linters (to be defined) verify presence of required token groups and NA fields.
