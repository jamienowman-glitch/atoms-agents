## ATOMIC TASKS: Connector Factory Foundation

The Connector Factory is being rebuilt inside `atoms-core`/`atoms-app`. The following atomic tasks break the work into executable steps for junior agents. Each phase names files, schema, and checks required to keep the FIREARMS rule and scope coverage mandate.

## UX Law (God Config)
The God Config UI must follow the existing config style but avoid nesting cards inside cards. Prefer flat sections with clear headers and collapsible bodies. Mobile usability is a first-class requirement.

### Phase 1 – The Foundation (Supabase Schema)
1. **Create `firearm_types` registry**  
   - File: `atoms-core/sql/016_firearm_types.sql` (new migration).  
   - Columns: `firearm_type_id uuid pk`, `name text unique not null`, `description text`, `created_at timestamptz default now()`.  
   - Purpose: the single source of truth for firearms categories. No logic beyond this table.
2. **Add `connector_providers` table**  
   - File: `atoms-core/sql/017_connector_providers.sql`.  
   - Columns: `provider_id text pk`, `display_name text`, `platform_slug text unique not null`, `naming_rule text not null`, `created_at timestamptz default now()`.  
   - `naming_rule` will eventually drive the naming engine (Phase 2). No dangerous metadata allowed.
3. **Add `connector_scopes` table**  
   - File: `atoms-core/sql/018_connector_scopes.sql`.  
   - Columns must include: `scope_id uuid pk`, `provider_id text fk->connector_providers`, `scope_name text`, `scope_type text`, `description text`, `requires_firearm boolean default false not null`, `firearm_type_id uuid references firearm_types(id)`, `notes text`, `created_at timestamptz default now()`.  
   - Every platform scope stored here. `requires_firearm` plus `firearm_type_id` enforces the only permitted safety gate.
4. **Add UTMs + Metrics tables**  
   - File: `atoms-core/sql/019_platform_metrics.sql`.  
   - Tables: `platform_metrics (metric_id pk, provider_id fk, metric_name, description, data_source, created_at)`, `generic_metrics (generic_metric_id pk, name, description, category, created_at)` and optionally `metric_mappings`.  
   - Include `utm_templates` table in same migration or next: `template_id pk`, `provider_id fk`, `first_touch_template text`, `last_touch_template text`, `content_type_template text`, `custom_rules jsonb`, `created_at`.
5. **Add `core_kpis` table**  
   - File: `atoms-core/sql/020_core_kpis.sql`.  
   - Columns: `core_kpi_id uuid pk`, `name text unique`, `display_label text`, `description text`, `window_token text`, `comparison_token text`, `estimate boolean`, `missing_components jsonb`, `notes text`, `created_at timestamptz default now()`.

### Phase 2 – The Logic (Engines)
1. **Naming Engine**  
   - File: `atoms-app/lib/engines/naming-engine.ts`.  
   - Export a pure function `formatProviderKey(platformName: string, rule: string): string` that respects the `connector_providers.naming_rule` string. No side effects, no network calls.
2. **UTM Engine**  
   - File: `atoms-app/lib/engines/utm-engine.ts`.  
   - Pure function that accepts provider context, `utm_templates`, and generates normalized templates for first/last touch + content type. Document inputs/outputs.

### Phase 2.5 – UI Build (God Config: Connectors)
1. **Add top-level nav entry**  
   - File: `atoms-app/src/app/god/config/...` (follow existing config nav).  
   - Label: `Connectors` (or final name; must be logged in AGENTS).
2. **Connectors list view**  
   - Pull list from `connector_providers`.  
   - Display logo + name + status.  
   - Avoid nested cards; use a single list with clear separators.
3. **Connector editor (collapsible sections)**  
   - Sections: Dev Account, Scopes, KPI, UTM, Budgets, OAuth/Marketplace, BYOK.  
   - Each section collapses to a single header line and expands to flat fields.  
   - All dropdowns are Supabase-backed with Plus buttons that insert new entries and refresh lists.
4. **Mobile usability**  
   - Ensure scrollable sections, large touch targets, and no horizontal overflow.

### Phase 3 – The Reference Library
1. **Seed Core KPIs from legacy data**  
   - Source: `northstar-engines/data/seed/surfaces/squared2/kpi.json`.  
   - Task: convert entries into SQL `INSERT INTO public.core_kpis (...)` statements and merge into a new migration/fill script.  
   - Verify the migration includes `missing_components` as JSON array and `notes`.
2. **Re-home the scope checklist**  
   - Move `northstar-engines/ui/docs/workbench/tsv_import/platform_scopes.tsv` → `atoms-core/docs/SCOPE_AUDIT_CHECKLIST.md`.  
   - Replace TSV table with markdown table or list, clearly referencing each scope but maintaining original descriptions. Add instructions: “Admins use this list to hand-verify future connectors. Do not import this data into the schema; it remains a checklist.”
3. **Document Firearms rule**  
   - In `atoms-core/docs/SCOPE_AUDIT_CHECKLIST.md` add a top note: “Firearms table is the only danger gate; every `requires_firearm = true` entry must point to `firearms_types`. No other danger/risk fields exist.”

### Phase 3.5 – Connector Skills (Samples)
1. **Add sample SKILLs (YouTube, Shopify)**  
   - Files:  
     - `atoms-connectors/src/youtube/SKILL.md`  
     - `atoms-connectors/src/shopify/SKILL.md`  
   - Use the agent skill format with metadata + usage.  
   - Must align to the Connector Factory contract (scopes, KPI mappings, UTM templates, firearms rules).

### Phase 4 – Verification & Decommission
1. **Firearms Audit**  
   - Task: run schema validation or SQL check that `connector_scopes` includes `requires_firearm` boolean and `firearm_type_id` FK; missing either is a failure (build stops). Document verification script or query (e.g., `SELECT column_name FROM information_schema.columns ...`).
2. **Clean legacy references**  
   - After KPI migration and scope checklist move complete, confirm no atoms-* files refer to `northstar-engines/` to prevent broken links.

## Kickoff Prompt (for a Junior UX Agent)
Role: UX Expert  
Goal: Build the God Config “Connectors” UI with mobile-first usability.  
Constraints: No nested cards inside cards; flat layout with collapsible headers.  
Scope: Implement list view + editor sections for Dev Account, Scopes, KPI, UTM, Budgets, OAuth/Marketplace, BYOK.  
Data: All dropdowns must be Supabase-backed and support Plus buttons for persistent adds.  
Deliverable: a working UI scaffold wired to Supabase reads/writes, plus empty-state UX for first-run.

### Notes for Junior Workers
- Always cite absolute paths.  
- No additional “danger level” fields or semantic equivalents may be added anywhere. Firearms standing is the only gate.  
- The legacy `platform_scopes.tsv` is a checklist, not a seed. Do not load it into Postgres. Use it purely for manual audits.  
- After all migrations, run Supabase SQL Editor tests and share the result in task comments.
