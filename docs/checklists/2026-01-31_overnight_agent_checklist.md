# 🌙 Overnight Agent Deployment Checklist (2026-01-31)

This serves as the Master Scorecard for the morning review.

## 1. HAZE (Planet Explorer)
**Goal**: Build the RAG Heatmap Backend & 3D Visuals.
*   [ ] **Muscle Agent**: Build `video_planet_surface_renderer`.
    *   **Plan**: `docs/plans/2026-01-29_haze-muscle-atomic-task-plan.md`
    *   **Packet**: `worker_prompts_haze.md` (Section 1)
    *   **Mandate**: Must use `nexus.search_hit` (Event V2) for topography.
    *   **Standard**: Factory Strict (MCP/SKILL).
*   [ ] **UI Agent**: Build `HazeWorld.tsx` (Visuals Only).
    *   **Plan**: `docs/plans/2026-01-29_haze-ui-non-muscle-atomic-task-plan.md`
    *   **Packet**: `worker_prompts_haze.md` (Section 2)
    *   **Safety**: **FORBIDDEN** from touching Harness/ToolPill.

## 2. MAYBES (City Note Taker)
**Goal**: Build the Audio Backend & City Ambience.
*   [ ] **Muscle Agent**: Build `audio_capture_normalize`.
    *   **Plan**: `docs/plans/2026-01-29_maybes-muscle-atomic-task-plan.md`
    *   **Packet**: `worker_prompts_maybes.md` (Section 1)
    *   **Standard**: Factory Strict.
*   [ ] **UI Agent**: Build `MaybesCity.tsx` + `WeatherLayer`.
    *   **Plan**: `docs/plans/2026-01-29_maybes-ui-non-muscle-atomic-task-plan.md`
    *   **Packet**: `worker_prompts_maybes.md` (Section 2)
    *   **Safety**: **FORBIDDEN** from touching Harness/ToolPill.

## 3. MIGRATION (The Fixer)
**Goal**: Repair `atoms-core` after the `northstar-engines` quarantine.
*   [ ] **Fixer Agent**: Refactor Imports.
    *   **Plan**: `docs/plans/2026-01-31_legacy_migration_plan.md`
    *   **Packet**: `worker_prompts_migration.md`
    *   **Status**: Code is already moved; just fixing `import engines...` -> `import atoms_muscle...`.

## 4. AGENT CAPABILITIES (The RAG Assistant)
**Goal**: Build the "Knowledge Muscle" for easy RAG.
*   [ ] **Builder Agent**: Create `atoms-muscle/src/knowledge/search_assistant`.
    *   **Plan**: `docs/plans/2026-01-31_agent_rag_assistant_plan.md`
    *   **Packet**: `worker_prompts_rag.md`
    *   **Standard**: Must include `mcp.py`, `SKILL.md`, and Event V2 Logging.
