# 2026-01-28 — Operation Muscle-as-a-Service: Worker 5 (God Config UI)

## Mission
Make the God Config dashboard reflect the live Supabase state for muscles + pricing, with a single source of truth for the muscles table schema.

## Scope (Allowed Paths)
- `atoms-app/src/app/god/config/*`
- `atoms-app/src/app/api/god/config/*`
- `atoms-core/sql/*` (only if resolving schema conflict)
- `atoms-app/supabase/migrations/*` (if needed for app‑side migrations)

## Hard Laws (Do Not Break)
- **Do not refactor UI logic** beyond the required changes.
- **No new backend routes** for canvases/harnesses; stay in God Config scope.
- **No northstar-engines usage**.

## Tasks (Atomic)
1. **Resolve Muscles Schema Conflict**
   - Compare `atoms-core/sql/001_init_registry_crm.sql` vs `atoms-core/sql/007_muscle_registry.sql`.
   - Establish a single source of truth for `public.muscles` (columns + RLS + seed).
   - Update one canonical SQL file and document the decision.

2. **God Config Muscles Grid**
   - Replace the current card list with a Data Grid for `public.muscles`.
   - Required columns: Name, Price (Snax), Status, Active Toggle.
   - Actions: Edit Exchange Rate (writes to `system_config`).

3. **Wire to Supabase**
   - Use existing `createClient()`.
   - Ensure edits persist and refresh the UI state.
   - Handle loading + error states gracefully (no crashes).

4. **Pricing Config Page**
   - Create `/god/config/pricing` page if missing.
   - Provide UI for Exchange Rate + pricing overrides using `system_config` + `pricing` tables.

## Deliverables / Definition of Done
- Muscles schema conflict resolved and documented.
- God Config shows a true data grid for `public.muscles` with edit actions.
- Pricing page exists and updates live config.

## Notes / Risks
- Keep UI changes minimal and consistent with existing God Config styles.
