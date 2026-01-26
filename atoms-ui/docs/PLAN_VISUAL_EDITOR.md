# Atomic Plan: MCP-Powered Visual Editor

**Objective**: Build the Forge GUI using real API data.

## Phase 1: The API Client
- [ ] **Create `harness/registry/client.ts`**:
    -   Implement `getMuscles()` -> GET `/registries/entries?namespace=muscles`.
    -   Implement `getMcpTools()` -> POST `/tools/list`.
    -   Use `CanvasTransport` for auth headers.

## Phase 2: The Forge Canvas
- [ ] **Create `canvases/forge/ForgeCanvas.tsx`**:
    -   Standard 3-column layout.
    -   Load data on mount via Client.
- [ ] **Create `canvases/forge/components/MuscleLibrary.tsx`**:
    -   Render list of Muscles from API.
- [ ] **Create `canvases/forge/components/PropertyPanel.tsx`**:
    -   Render input form based on MCP Schema.

## Phase 3: The Integration
- [ ] **Connect ChatRail**: Wire agent conversation to Contract state.
- [ ] **Implement "Simulated Forge"**: Generate JSON contract that references real Tool IDs.

## Verification
-   **Manual**:
    -   Ensure `northstar-engines` is running (Port 8000).
    -   Open Forge.
    -   Verify "Muscles" list populates from the real backend.
