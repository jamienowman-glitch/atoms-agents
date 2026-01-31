# Tech Spec: The Tool Factory ("Black Tools")

**Status**: PROPOSED
**Architect**: Antigravity (on behalf of User)

## 1. Executive Vision
We are creating a "Internal Tool Factory" for lightweight, deterministic scripts (e.g. `remove_paragraph`, `convert_csv`, `validate_json`).
These sit **between** the heavy GPU "Muscles" and the Agents themselves. They are the "Black Tools"—small, fast, and free to use.

## 2. Architecture Laws

### A. The "Black Tool" Definition
*   **Lightweight**: Runs in standard CPU/RAM (no heavy GPU).
*   **Deterministic**: Same input = Same output.
*   **Atomic**: Does one thing well.
*   **Registered**: Must exist in `public.tools_registry` to be discoverable.

### B. The Registry (`023_tools_registry.sql`)
*   We use the existing registry but enhance it.
*   **Categories**: `text_processing`, `file_manipulation`, `validation`, `dev_ops`, `data_transform`.
*   **Schema**: Every tool must define its `input_schema` and `output_schema` (JSONB) so Agents know how to call it.

### C. The Production Line
1.  **Script**: Write the Python/Node script in `atoms-tools/scripts/`.
2.  **Manifest**: Create a sidecar `tool.yaml` defining inputs/outputs.
3.  **Register**: A generic "Tool Registrar" scans the folder and upserts to Supabase.
4.  **Expose**: The "God Console" or "Agent Toolkit" reads the registry and registers the function.

## 3. Atomic Task Plan

### Phase 1: Registry Upgrade (Worker A)
**Goal**: Prepare the database.
*   [ ] **Schema Patch**: Update `023_tools_registry.sql` to include `category`, `input_schema`, `output_schema`.
*   [ ] **Seed**: Register initial tools found in `atoms-core/scripts` (e.g. `migrate_templates.py`).

### Phase 2: The Tool Scanner (Worker A)
**Goal**: Automate registration.
*   [ ] **Script**: `atoms-core/scripts/register_tools.py`.
*   [ ] **Logic**: Scans a target directory, reads `tool.yaml`, upserts to DB.

### Phase 3: The Agent Skill (Worker B)
**Goal**: Teach Agents to use the library.
*   [ ] **Skill**: `atoms-core/.agent/skills/use-black-tools/SKILL.md`.
*   [ ] **Prompt**: "When you need to transform data, check the Tool Registry first. Do not hallucinate Python code if a verified tool exists."

## 4. Verification
*   **Registry Check**: `select * from tools_registry` returns items.
*   **Usage Check**: Agent can "search tools" and execute one.
