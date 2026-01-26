# Tech Spec: Canvas Harness & Atoms-UI Architecture

**Status:** DRAFT
**Target:** `packages/atoms-ui` (or new repo)

---

## 1. Architectural Goals
1.  **Decoupling:** Separate "UI Muscles" (TopPill, ToolPill, ToolPop, ChatRail) from the "AgentFlow" application logic.
2.  **Productization:** Enable `atoms-ui` to be a standalone product (MCP) usable by other agents.
3.  **Context Awareness:** Ensure tools automatically adapt to the active Canvas (Multi21, Stigma, etc.) via a unified **Harness**.
4.  **Single Realtime Gate:** Centralize WebSocket/SSE connections in the Harness, preventing multi-socket chaos.

---

## 2. Repository Structure: `atoms-ui` (The Warehouse)

We will move the "Muscles" into a clean structure.

```text
atoms-ui/
├── muscles/                  # The UI Tools (Context Unaware Components)
│   ├── TopPill/             # WorkbenchHeader
│   ├── ToolPill/            # WorkbenchDock (Dumb)
│   ├── ToolPop/             # BottomControlsPanel (Smart/Scoped)
│   ├── ChatRail/            # Chat Interface
│   └── InfoCard/            # Metadata Inspector
├── harness/                  # The Logic Wrapper (Context Provider)
│   ├── ToolHarness.tsx      # The Main Wrapper
│   ├── RealtimeBridge.ts    # The Single Socket Manager
│   └── Registry.ts          # Tool Defs
├── canvases/                 # The interchangeable Workspaces
│   ├── multi21/             # Existing Layout Design
│   ├── stigma/              # New Design Tool
│   └── allyoucaneat/        # Planning Tool
└── index.ts                 # Exports
```

---

## 3. The Harness Architecture

The **Harness** is the "Universal Remote". It wraps the UI Muscles and injects the correct context.

### 3.1 `ToolHarness` Wrapper
It intercepts the `useToolState` calls from the Muscles and repoints them to the active Canvas scope.

```tsx
// harness/ToolHarness.tsx
interface HarnessProps {
  canvasId: string;       // e.g., "canvas_01" (The Instance)
  canvasType: string;     // e.g., "multi21" (The Class)
  activeAtomId?: string;  // e.g., "node_42" (The Selection)
  realtimeConfig: ConnectionConfig;
  children: React.ReactNode;
}

export const ToolHarness = ({ canvasId, activeAtomId, ...props }) => {
  // 1. Establish Realtime Bridge (One Socket)
  useRealtimeBridge(props.realtimeConfig);

  // 2. Derive Scope
  // If activeAtomId is present, scope tools to [canvasId : atom : atomId]
  // Else, scope tools to [canvasId : global]
  const scope = activeAtomId ? { scope: 'atom', entityId: activeAtomId } : { scope: 'global' };

  return (
    <ToolControlProvider scope={scope} surfaceId={canvasId}>
       {/* 
           The Muscles are mounted here. 
           They naturally "read" this Provider without code changes.
       */}
       <WorkbenchShell>
          {props.children}
       </WorkbenchShell>
    </ToolControlProvider>
  );
}
```

### 3.2 The Realtime Bridge (The Gateway)
Instead of every component opening a socket, the Harness manages **one** connection and dispatches events to the correct specific context.

*   **Ingest:** Listens to `wss://gate3/stream`.
*   **Dispatch:**
    *   `run_event` -> ChatRail (MessageStream)
    *   `tool.update` -> ToolPill/ToolPop (State Sync)
    *   `whiteboard.write` -> TokenLens/InfoCard (Memory)
    *   `gesture` -> Canvas (Mouse Cursors)

---

## 4. The Muscles (Lift & Shift)

### A. TopPill (The Navigator)
*   **Role:** Navigation & View Mode.
*   **Binding:** Binds to `canvasId:system:view_mode`.
*   **Change:** `useToolState('previewMode')` reads from Harness Provider.

### B. ToolPill (The Injector)
*   **Role:** Drag Sources.
*   **Binding:** "Dumb". Receives `sources={ACTIVE_CANVAS_REGISTRY[canvasType]}` from Harness.
*   **Change:** Remove hardcoded `SEED_FEEDS`. Accept props.

### C. ToolPop (The Mutator) - *Critical*
*   **Role:** Contextual Editing.
*   **Binding:** Binds to `activeAtomId` (e.g., specific Text Block).
*   **Behavior:**
    *   When user clicks `Text Node 1` -> Harness updates `activeAtomId`.
    *   ToolPop rerenders, pointing all sliders to `Text Node 1`.
    *   Changing "Font Size" sends update for `Text Node 1`.
    *   **Change:** Remove `surfaceId='multi21.designer'`. Use `useToolControl().scope`.

### D. ChatRail (The Coordinator)
*   **Role:** Communication.
*   **Binding:** Binds to `runId`.
*   **Change:** Ensure it sits at `z-50` in the Harness layout. Input Context Pills read from Harness Metadata.

---

## 5. TokenLens & ContextLens (New Eyes)

These live in the Harness as the "Debugger" layer.

*   **TokenLens:** Visualizes `whiteboardWrites` for the active Node.
*   **ContextLens (New):**
    *   **Spec:** A side-panel (or mode in DualMagnifier) that shows "Injected Signals".
    *   **Data Source:** `MemoryGateway.read_whiteboard(edge_id)`.
    *   **Action:** Allows user to manually "Inject" a simulated signal (e.g., "Simulate Shopify Stock Low") for testing.

---

## 6. Canvas Integration Strategy

1.  **Multi21:** The first citizen. Migrated "as is" into `/canvases/multi21`.
2.  **Stigma:** New Design Tool. Will use the **same** ToolPop muscles but with different "Magnet" configurations (likely more CSS tools).
3.  **AllYouCanEat:** Planning Tool. Will mostly use ChatRail and TopPill, less ToolPop.

This architecture proves the "Universal Remote" concept.
