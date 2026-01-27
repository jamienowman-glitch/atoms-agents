# Tech Spec: Registry Migration to Supabase

> **Status (2026-01-27)**: File-based `atoms-registry/` is deprecated/quarantined. This document is retained for architectural rationale and as a record of the migration.

## 1. Objective
Migrate the "Source of Truth" for System Configuration (Surfaces, Canvases, Muscles) from the file system (`atoms-registry`) to the Database (`Supabase`).
**Goal**: Enable "God Mode" editing in the Console and remove dependency on `northstar-engines` for registry serving.

## 2. Architecture Change
-   **Old**: `atoms-app` -> HTTP -> `northstar-engines` -> `atoms-registry/*.yaml`
-   **New**: `atoms-app` -> Supabase SDK -> `public.registry_entries` (Postgres)

## 3. Database Schema (Domain-Driven)
We reject the "Monolith Table". We define tailored tables for each Entity Type to support future scaling, nesting, and specific query patterns.

### A. System Configuration (Global + Override)
These tables define "How the OS works".
*   **`public.surfaces`**: The Apps (Marketing, Health, Studio).
*   **`public.canvases`**: The UI Templates (Gantt, Whiteboard).
*   **`public.muscles`**: The Backend Tools (Python functions).
*   **`public.agents`**: The Personas (The new Agent Registry).

**Common Columns**: `id`, `key` (slug), `name`, `config` (jsonb), `version`.
**Multi-Tenancy**:
-   `tenant_id` (UUID, Nullable):
    -   `NULL` = **Global System Asset** (Available to everyone).
    -   `UUID` = **Tenant Private Asset** (Custom Canvas/Agent for that user).

### C. Tenant Data (The "Home-Grown CRM")
These tables are the "Dog-Food" CRM.
*   **`public.leads`**: The People.
    -   `id`: UUID.
    -   `tenant_id`: Owner (The Tenant who "owns" this lead).
    -   `surface_key`: Context (e.g., 'agnx', 'mc2'). *Where did we find them?*
    -   `email`: Text.
    -   `utm_source`: Text (e.g., 'youtube').
    -   `utm_campaign`: Text (e.g., 'chalk_farm_v1').
    -   `persona_data`: JSONB (AI-generated Vibe/Summary).

*   **`public.tenant_configs`**: The Settings.
    -   `tenant_id`: UUID.
    -   `surface_key`: Text (e.g., 'agnx').
    -   `config`: JSONB (The settings for THIS tenant on THIS surface).
    -   *PK*: `(tenant_id, surface_key)`.

**Why this structure?**
-   **Isolation**: User settings are scoped to the **Surface**. My 'Health' settings don't mix with my 'Marketing' settings.
-   **CRM Power**: We track `surface_key` on leads. We know if a lead came from the Health App or the Marketing App.

## 4. Security (Row Level Security)
-   **System Tables** (`surfaces`, etc):
    -   **Read**: Public.
    -   **Write**: God Mode Only.
-   **User Tables** (`projects`, `leads`, `tenant_configs`):
    -   **Read/Write**: Strict Tenant Isolation.
    -   `USING (auth.uid() = tenant_id)` (Assuming 1:1 User:Tenant for now).


## 5. Migration Strategy
1.  **Freeze**: Stop editing YAML files.
2.  **Seed**: Run a one-off script (`scripts/seed_registry.ts` in `atoms-core`) to parse the current `atoms-registry` and INSERT them into Supabase.
3.  **Switch**: Update `atoms-ui/RegistryClient` to query the Table instead of the JSON API.

## 6. Impact on Atoms-Core
`atoms-core` (The New OS) will eventualy need to read Muscles from this table to execute them. It should use the `supabase-py` client (already configured in `middleware.py`) to fetch these configs during runtime.
