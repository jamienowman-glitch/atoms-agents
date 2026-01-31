# Atomic Task Plan: The Universal Tool Registry

**Goal**: Establish a Single Source of Truth for all Agent Tools (Muscles), automatically synced from code to a Supabase Registry.

## 1. The Law of Discovery
*   **The Artifact**: `SKILL.md` is the definition. If it's not in `SKILL.md`, it doesn't exist.
*   **The Registry**: `public.tools` in Supabase.
*   **The Mechanism**: Automated Sync Script (`sync_registry.py`).

## 2. The Architecture

### A. The Schema (`public.tools`)
*   `id` (uuid, pk)
*   `key` (text, unique): `site_spawner`, `rag_search`.
*   `name` (text): Human readable.
*   `description` (text): From SKILL.md.
*   `category` (text): `factory`, `knowledge`, `media`.
*   `input_schema` (jsonb): The JSON Schema for the tool args (parsed from `mcp.py` or manually defined).
*   `is_active` (bool): Defaults to true.

### B. The Sync Engine (`atoms-muscle/scripts/sync_registry.py`)
Replaces the old `sync_muscles.py`.
1.  **Scan**: Walk `atoms-muscle/src/*`.
2.  **Parse**:
    *   Read `SKILL.md` frontmatter (YAML) for name/desc.
    *   Read `mcp.py` (ast parsing) or import it to get the Schema.
3.  **Upsert**: Push to `public.tools`.

### C. The UI (`atoms-app/dashboard/tools`)
*   **Registry Browser**: A searchable table of all available tools.
*   **Status**: Healthy/Broken (based on last sync).

## 3. Atomic Tasks (The Toolsmith)
- [ ] **DB**: Create `public.tools` table.
- [ ] **Script**: Build `atoms-muscle/scripts/sync_registry.py`.
    *   Must handle `SKILL.md` parsing errors gracefully.
    *   Must validate compliance (Does `mcp.py` exist?).
- [ ] **CI/CD**: Add to deployment pipeline (Sync on push).
