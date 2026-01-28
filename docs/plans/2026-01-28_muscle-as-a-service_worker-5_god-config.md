# 2026-01-28 — Operation Muscle-as-a-Service: Worker 5 (God Config UI)

## Mission
Make the existing Muscle Config screen show a live, category‑grouped muscle list with MCP readiness, description, and links to AGENTS/Skill, without relocating the UI yet.

## Scope (Allowed Paths)
- `atoms-app/src/app/god/config/*` (specifically `atoms-app/src/app/god/config/muscles/page.tsx`)
- `atoms-app/src/app/api/god/config/*`
- `atoms-core/sql/*` (only if resolving schema conflict)
- `atoms-app/supabase/migrations/*` (if needed for app‑side migrations)

## Hard Laws (Do Not Break)
- **Do not refactor UI logic** beyond the required changes.
- **No new backend routes** for canvases/harnesses; stay in God Config scope.
- **No northstar-engines usage**.
- **Service vs Library:** `atoms-core` is the library; `atoms-muscle` is the standalone runtime/service.

## Tasks (Atomic)
1. **Resolve Muscles Schema Conflict**
   - Compare `atoms-core/sql/001_init_registry_crm.sql` vs `atoms-core/sql/007_muscle_registry.sql`.
   - Establish a single source of truth for `public.muscles` (columns + RLS + seed).
   - Required fields: `slug`, `name`, `status`, `base_price_snax`, `active` (bool), `category`, `description`, `mcp_endpoint`, `agents_md_path`, `skill_md_path`.
   - Update one canonical SQL file and document the decision.

2. **Update Existing Muscle Config Screen (No Relocation)**
   - **Do not move the screen**; keep it at `atoms-app/src/app/god/config/muscles/page.tsx` for now (unnesting later).
   - Keep the existing UI style; avoid redesigns.
   - Add **category dropdowns** to avoid a single long list.
   - Display for each muscle:
     - `name`, `status`, `base_price_snax`, `active` toggle.
     - `mcp_endpoint` only if status indicates prod‑ready.
     - Plain description of what it does.
     - Links (or copyable paths) to `AGENTS.md` and `SKILL.md` for that muscle.
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
- Existing muscle config screen shows live, category‑grouped list with MCP readiness, description, and links.
- Pricing page exists and updates live config.

## Notes / Risks
- Keep UI changes minimal and consistent with existing God Config styles.
- Do not relocate the muscle config screen yet; unnesting happens later.

## Kickoff Prompt (Copy/Paste)
Role: You are the Config Systems Integrator.  
Mission: Build the “God Config” Muscle dashboard to manage our Muscle‑as‑a‑Service economy.

Phase 0: Context  
- Read `/Users/jaynowman/dev/AGENTS.md` and `/Users/jaynowman/dev/atoms-muscle/AGENTS.md`.  
- **Target Path (do not relocate yet):** `atoms-app/src/app/god/config/muscles/page.tsx`  
- Data Source: `public.muscles` + `public.system_config`

Phase 1: Schema Integrity  
- Conflict Resolution: Check `001_init_registry_crm.sql` and `007_muscle_registry.sql`.  
- Single Source of Truth for `public.muscles`, must include:  
  `slug`, `name`, `status`, `base_price_snax`, `active` (bool), `category`, `description`, `mcp_endpoint`, `agents_md_path`, `skill_md_path`.  
- Create the migration if the DB is broken.

Phase 2: The Dashboard (UI — no redesign)  
- **Do not move the screen**; keep the current file path.  
- Keep existing UI style.  
- Add **category dropdowns** so it’s not one huge list.  
- For each muscle show:  
  - Name, Status, Price (Snax), Active toggle  
  - MCP URL only if prod‑ready  
  - Plain description  
  - Links (or copyable paths) to `AGENTS.md` and `SKILL.md`  
- Config Panel: edit `system_config` (Exchange Rate & Crypto Bonus %).  
- Real‑time: reflect live DB state.

Phase 3: Connection  
- Ensure the dashboard works with the new Tenants + Wallets schema.  
- All changes must persist and refresh safely.

GO.
