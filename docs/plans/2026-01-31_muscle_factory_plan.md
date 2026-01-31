# Atomic Task Plan: The Muscle Factory (Heavy Industry)

**Goal**: A dedicated production line for "Heavy Lifting" Muscles (Audio, Video, CAD) that ensures every unit is Production-Ready and Sellable from day one.

## 1. The Distinction: Muscle vs. Tool
*   **Tool**: Lightweight orchestration (e.g., Site Factory, Bridge). Internal utility.
*   **Muscle**: Heavy computation unit (e.g., Video Transcoder, Audio Extractor). **External Product**.

## 2. The Architecture (`atoms-muscle`)

### A. The "Pro Button" (Scaffolding)
*   **UI**: `atoms-app/dashboard/muscles`.
    *   **Action**: "+ New Muscle".
    *   **Input**: Name ("Echo Chamber"), Category (Audio), Description.
*   **The Builder (`atoms-muscle/scripts/scaffold_muscle.py`)**:
    *   Creates `src/audio/echo_chamber/`.
    *   Generates **The Holy Trinity**:
        1.  `service.py`: The Logic (Stubbed).
        2.  `mcp.py`: The Connector (Auto-wired).
        3.  `SKILL.md`: The Manual (Pre-filled with name/desc).
    *   Generates **The Law**:
        4.  `AGENTS.md`: Copies the strict "Muscle Law" into the folder.

### B. The "Butcher Slice" (Packaging)
*   **Goal**: Export a Muscle as a standalone product.
*   **The Slicer (`atoms-muscle/scripts/slice_muscle.py`)**:
    *   **Input**: Muscle Name.
    *   **Action**:
        *   Extracts the specific folder.
        *   Traces dependencies (ensures `atoms-core` imports are handled or vendored?). *Note: Core imports might need distinct handling for sale.*
        *   Bundles into a zip/tarball.
        *   Generates `README.md` from `SKILL.md`.

### C. The Muscle Registry (Supabase)
*   **Table**: `public.muscles` (Distinct from `tools`).
    *   `id`, `key`, `name`, `category`, `status` (dev, prod, sale_ready).
    *   `pricing_model` (free, paid).
    *   `slice_path` (url to the export).

## 3. Atomic Tasks (The Factory Foreman)
- [ ] **DB**: Create `public.muscles`.
- [ ] **Scaffolder**: Build `scripts/scaffold_muscle.py`.
    *   Must use Templates for `mcp.py` etc. to ensure 100% compliance.
- [ ] **Slicer**: Build `scripts/slice_muscle.py`.
- [ ] **UI**: Build `atoms-app/dashboard/muscles/page.tsx`.
    *   The "Green Light" Dashboard: Checks if MCP/SKILL/Slice exist.
