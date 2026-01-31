# Atomic Task Plan: The Unified God Dashboard

**Goal**: Consolidate all "God Mode" tools, factories, and configs into a single, clean namespace: `atoms-app/src/app/dashboard`.

## 1. The Route Map (The New Reality)

### A. The Control Center (`/dashboard`)
*   **Location**: `src/app/dashboard/page.tsx`
*   **Purpose**: The Launchpad. Tiles for every Factory and Config section.

### B. The Factories (Production)
*   **Site Spawner**: Move `god/factory` -> `dashboard/sites/factory`.
*   **Muscle Factory**: Move `god/config/muscles` -> `dashboard/muscles`.
*   **Connector Factory**: Move `god/config/connectors` -> `dashboard/connectors`.
*   **Tool Registry**: Move `god/config/tools` -> `dashboard/tools`.

### C. The Configuration (Data)
*   **Financial**: Move `god/config/pricing` -> `dashboard/finance`.
*   **Spaces & Feeds**: Move `god/config/spaces` -> `dashboard/spaces`.
*   **Surfaces**: Move `god/config/surfaces` -> `dashboard/surfaces`.
*   **Canvases**: Move `god/config/canvases` -> `dashboard/canvases`.

### D. The System
*   **Health**: Move `system/health` -> `dashboard/health`. (Keep `system` for API if needed, but UI goes to dashboard).

## 2. Migration Strategy (Atomic Moves)
1.  **Create Root**: Ensure `src/app/dashboard/layout.tsx` exists (The Shell).
2.  **Move & Name**: Rename directories. Updating imports will be handled by the Agent (using search/replace if VS Code refactor isn't available).
3.  **Kill `god`**: Remove the `src/app/god` directory once empty.

## 3. Atomic Tasks (The Architect)
- [ ] **Scaffold**: Create `src/app/dashboard` layout and page.
- [ ] **Migrate**: Move `god/config/connectors` -> `dashboard/connectors`.
- [ ] **Migrate**: Move `god/config/muscles` -> `dashboard/muscles`.
- [ ] **Migrate**: Move `god/factory` -> `dashboard/sites`.
- [ ] **Migrate**: Move `god/config/pricing` -> `dashboard/finance`.
- [ ] **Migrate**: Move `god/config/*` (Remaining) -> `dashboard/*`.
- [ ] **Cleanup**: Delete `src/app/god`.
