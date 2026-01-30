# Tech Spec: The Automated Connector Factory

**Status**: APPROVED
**Date**: 2026-01-30
**Architect**: Antigravity (on behalf of User)

## 1. Executive Vision
We are building a "Printing Press" for SaaS Connectors. The goal is to allow an Agent or Human to "order" a connector, and have the system semi-automatically build, register, and gate it.

**The Flow:**
1.  **The Order**: Operator creates a stub in `atoms-connectors` (or UI Wizard starts the process).
2.  **The Agent**: "Build Connectors" Agent searches docs, writes `service.py` & `manifest.yaml`.
3.  **The Sentinel**: `scripts/sentinel.py` watches the folder, validates the standard, generates `mcp.py`, and registers it in Supabase.
4.  **The Gate**: The Connector appears in "God Config" as `draft`. A human ticks "Firearms", maps KPIs, and clicks "Approve".

## 2. Architecture Laws (To be enforced by AGENTS.md)

### A. The Schema First Law (`manifest.yaml`)
Every connector MUST have a `manifest.yaml` in its root. This is the Source of Truth for the Auto-Builder.
```yaml
provider_slug: "shopify"
display_name: "Shopify"
scopes:
  - name: "read_orders"
    description: "Read access to orders"
    requires_firearm: false
  - name: "write_products"
    requires_firearm: true
kpis:
  - raw: "total_sales"
    standard: "gross_sales"
utm_capabilities:
  - "email"
  - "social"
```

### B. The Sentinel Law
*   **No Manual Registration**: Humans/Agents do not run `INSERT INTO connector_providers`.
*   **The Script**: `python3 scripts/sentinel.py` is the ONLY way to register code. It reads `manifest.yaml` and upserts to DB.

### C. The Vault Law
*   **No .env**: Connectors fetch secrets via `atoms_core.vault`.
*   **Standard Keys**: `PROVIDER_{SLUG}_{KEY}` (e.g. `PROVIDER_SHOPIFY_API_KEY`).

## 3. Atomic Task Plan

### Phase 1: The Automation Layer (Worker A)
**Goal**: Enable the "Sentinel" to read code and write to DB.

*   [ ] **Scaffold Scripts**: Create `atoms-connectors/scripts/` folder.
*   [ ] **Implement `factory.py`**:
    *   `load_manifest(path) -> dict`: strictly validates YAML schema.
    *   `generate_mcp(manifest) -> str`: jinja2 template for `mcp.py`.
*   [ ] **Implement `sentinel.py`**:
    *   Iterate `src/*`.
    *   For each folder: `load_manifest` -> `upsert_provider` -> `upsert_scopes` -> `generate_mcp`.
*   [ ] **Initialize `AGENTS.md`**: Write the Constitution of the Connector Factory.

### Phase 2: The Factory UI (Worker B)
**Goal**: "God Config" UI for mapping and approval.

*   [ ] **Refactor `page.tsx`**: The current single-file giant is unmaintainable. Split into components (`/components/ScopeManager`, `/components/KpiMapper`).
*   [ ] **Implement `ScopeManager`**:
    *   List scopes from DB (populated by Sentinel).
    *   **Firearm Gating**: Toggle `requires_firearm` (boolean).
    *   **Firearm Type**: Select from `firearm_types` registry.
*   [ ] **Implement `KpiMapper`**:
    *   List `platform_metrics` (from manifest).
    *   Drag-and-drop to `core_kpis`.
*   [ ] **Implement `UtmBuilder`**:
    *   Define URL patterns per content type.
*   [ ] **Implement `VaultWriter`**:
    *   Secure Pop-up that writes to `connector_dev_accounts` (System Dev Keys).

### Phase 3: The Agent Skill (Worker A - Verification)
**Goal**: Teach the Agent how to build.

*   [ ] **Create Skill**: `atoms-connectors/.agent/skills/build-connector/SKILL.md`.
*   [ ] **Define Procedure**:
    1.  Search Docs.
    2.  Write `manifest.yaml` (Scopes, Metrics).
    3.  Write `service.mcp` (The Logic).
    4.  Run Sentinel.

## 4. Database Schema Alignment (Confirmed)
*   **Scopes**: `connector_scopes` table supports `requires_firearm`.
*   **KPIs**: `kpi_mappings` connects `platform_metrics` to `core_kpis`.
*   **UTMs**: `utm_templates` table ready.

## 5. Success Criteria
*   **Deterministic**: Running `sentinel.py` on the same folder always yields the same DB state.
*   **Safe**: No connector is `is_approved=true` by default.
*   **Mapped**: Every metric has a clear path to a Core KPI.
