# Atoms Factory Bulk Build Spec

## Objective
Systematically update or create atoms to comply with `UI_ATOM_TOKEN_CONTRACT.md`.

## 1. Structure Enforcement
Every atom MUST follow the 10-bucket structure:
1.  `exposed_tokens/` (Schema + Defaults)
2.  `views/` (React + CSS)
3.  `behaviour/` (State Machines)
4.  `layout/` (Constraints)
5.  `typography/` (Presets)
6.  `colours/` (Palettes)
7.  `icons/` (Assets)
8.  `data_schema/` (Props/State)
9.  `tracking/` (Events)
10. `accessibility/` (A11y)

**Rule:** No bucket may be missing. If empty, use `placeholder.md` or `NA.md` with reason.

## 2. Schema Requirements (exposed_tokens)
*   **Source of Truth:** `exposed_tokens/schema.ts` (or `_index.ts` exporting Zod/Type).
*   **Completeness:** Must cover all required token groups from the contract.
*   **No Blanks:** `NA` allowed, but `undefined`/omitted forbidden for required groups.

## 3. Typography
*   Must map to `fonts/roboto_flex_presets.tsv`.
*   Expose `axes` map for variable font control.

## 4. Tracking
*   `tracking` bucket must define `analytics_event_name` and `conversion_goal_id` schema.
*   Must support UTM template binding.

## 5. Accessibility
*   `accessibility` bucket must define `role`, `label`, `aria`.
*   If NA, `accessibility/NA.md` explanation required.

## 6. Build Process
1.  **Request:** Fill `UI_ELEMENT_REQUEST_TEMPLATE.tsv`.
2.  **Scaffold:** Run `python scaffold_atom.py` (future tool) to gen 10 buckets.
3.  **Implement:** Fill schema, views, defaults.
4.  **Verify:** Run `ATOMS_FACTORY_QA_CHECKLIST.md`.
