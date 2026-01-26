# Atomic Plan: Domain-Driven Registry Migration

## Phase 1: Schema Definition (SQL)
- [ ] **Create System Tables**:
    -   `surfaces`, `canvases`, `muscles`, `agents`.
- [ ] **Create User Tables**:
    -   `projects` (Hierarchy).
    -   `leads` (CRM with `surface_key`, `utm_*`).
    -   `tenant_configs` (Per-Surface Settings).
- [ ] **Apply RLS**:
    -   `leads`: `auth.uid() = tenant_id`.
    -   `tenant_configs`: `auth.uid() = tenant_id`.


## Phase 2: The Seeder (System Assets)
- [ ] **Script**: `atoms-core/scripts/seed_domain_registry.py`.
    -   Maps `atoms-registry/surfaces/*.yaml` -> `public.surfaces`.
    -   Maps `atoms-registry/canvases/*.yaml` -> `public.canvases`.
    -   Maps `atoms-registry/muscle/*.yaml` -> `public.muscles`.

## Phase 3: Client Update
- [ ] **`RegistryClient`**: Update to query specific tables.
    -   `getSurfaces()` -> `supabase.from('surfaces').select('*')`.
    -   `getProjects()` -> `supabase.from('projects').select('*').eq('tenant_id', my_tenant)`.

## Phase 4: Future Proofing
-   [ ] Verify "CRM" scenario: Create a Project "My CRM", then create Child Project "Contact A".
-   [ ] Verify "Global Agent": Create an Agent in `agents` table (Global), ensure all tenants can see it.
