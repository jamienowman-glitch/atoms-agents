# Plan: Atoms-UI Migration & Harness Implementation

**Status:** PROPOSED
**Objective:** Decouple UI Muscles into `packages/atoms-ui` and implement the Canvas Harness.

---

## Phase 1: Foundation Setup

### 1.1 Create Repository Structure
- [ ] Create directory `packages/atoms-ui`.
- [ ] Initialize `packages/atoms-ui/package.json` (if using workspaces) or just folder structure.
- [ ] Create core directories:
    - `packages/atoms-ui/muscles/`
    - `packages/atoms-ui/harness/`
    - `packages/atoms-ui/canvases/`
    - `packages/atoms-ui/types/`

### 1.2 Define Core Types
- [ ] Create `packages/atoms-ui/types/ToolEvent.ts` (Lift from `sse-handler.ts`).
- [ ] Create `packages/atoms-ui/types/CanvasContext.ts`.

---

## Phase 2: lift & Shift (The Muscles)

Each move involves copying the file, removing application-specific dependencies (like `SEED_FEEDS`), and updating the `useToolState` calls to be generic.

### 2.1 TopPill (WorkbenchHeader)
- [ ] Move `WorkbenchHeader.tsx` -> `muscles/TopPill/TopPill.tsx`.
- [ ] Refactor: Accept `viewMode` as prop or context, remove hardcoded `multi21` toggle logic (make it active canvas aware).

### 2.2 ToolPill (WorkbenchDock)
- [ ] Move `WorkbenchDock.tsx` -> `muscles/ToolPill/ToolPill.tsx`.
- [ ] Refactor: Remove local `SEED_FEEDS` import. Accept `tools: ToolDefinition[]` as prop from Harness.

### 2.3 ToolPop (BottomControlsPanel) - *Critical*
- [ ] Move `BottomControlsPanel.tsx` -> `muscles/ToolPop/ToolPop.tsx`.
- [ ] Refactor:
    - Replace `surfaceId: 'multi21.designer'` with `useToolScope().surfaceId`.
    - Replace `entityId` with `useToolScope().entityId`.
    - Extract `SEED_FEEDS` logic to `harness/adapters/Multi21Adapter.ts` (or similar).

### 2.4 ChatRail
- [ ] Move `ChatRailShell.tsx` -> `muscles/ChatRail/ChatRail.tsx`.
- [ ] Verify Z-Index is `z-50`.

---

## Phase 3: The Harness Implementation

### 3.1 ToolControlProvider
- [ ] Lift `ToolControlContext.tsx` -> `harness/ToolControlProvider.tsx`.
- [ ] Add `scope` prop ({ surfaceId, entityId }).
- [ ] Update `useToolState` to use the provided scope automatically.

### 3.2 RealtimeBridge
- [ ] Create `harness/RealtimeBridge.ts`.
- [ ] Implement `useRealtimeBridge(url, runId)`.
- [ ] logic: Single socket connection, event dispatching to `ToolControlProvider`.

### 3.3 ToolHarness Component
- [ ] Create `harness/ToolHarness.tsx`.
- [ ] Logic:
    - Mounts `RealtimeBridge`.
    - Mounts `ToolControlProvider`.
    - Renders `children` (The Canvas).
    - Renders `ToolPop` / `ChatRail` (The Muscles) in a fixed layout shell.

---

## Phase 4: Canvas Migration (Multi21)

### 4.1 Create Canvas Module
- [ ] Create `canvases/multi21/index.tsx`.
- [ ] Move `Lenses/**` (React Flow Graph) to this directory.

### 4.2 Wire the Harness
- [ ] Create `canvases/multi21/Multi21Harness.tsx`.
- [ ] Implementation:
    ```tsx
    <ToolHarness canvasId="multi21_demo" canvasType="multi21">
        <Multi21Canvas />
    </ToolHarness>
    ```

---

## Phase 5: Verification

### 5.1 The Ghost Test
- [ ] Create a tailored test page `/test/harness-ghost`.
- [ ] Mount `ToolHarness` with *no canvas*.
- [ ] Verify `ToolPop` sliders move and update internal state (Ghost State).

### 5.2 The Realtime Test
- [ ] Connect Harness to a live Run ID.
- [ ] Trigger an SSE event.
- [ ] Verify `ChatRail` types out a message.
