# State of the World: Northstar Canvas UI
**Date**: 2025-12-20
**Scope**: `/Users/jaynowman/dev/ui`

## 1. Implemented Components

The repository is a monorepo containing the following production-grade packages:

### **Apps**
*   **[`apps/studio`](file:///Users/jaynowman/dev/ui/apps/studio)**: The main React entry point.
    *   **Role**: Host application for the canvas. It wires together the `CanvasKernel`, `CanvasTransport`, and `CanvasView`. It also hosts the **Proof Panel** debugging UI.
    *   **Key File**: `src/App.tsx` (Root orchestration).

### **Packages**
*   **[`packages/contracts`](file:///Users/jaynowman/dev/ui/packages/contracts)**: Shared type definitions.
    *   **Exports**: `CanvasOp` (Add/Update/Move/Remove), `StreamEvent`, `Command`, `GestureEvent`.
    *   **Role**: The source of truth for the wire protocol and internal data structures.
*   **[`packages/canvas-kernel`](file:///Users/jaynowman/dev/ui/packages/canvas-kernel)**: The state machine.
    *   **Exports**: `CanvasKernel` class.
    *   **Role**: Manages the graph state (`atoms` + `nodes`). Handles **Optimistic Updates** (`pendingOps`), **Rebasing**, and **Conflict Recovery** (`applyRemote`).
*   **[`packages/transport`](file:///Users/jaynowman/dev/ui/packages/transport)**: The network layer.
    *   **Exports**: `CanvasTransport` class.
    *   **Role**: Handles **SSE** (Reliable Ops), **WebSocket** (Ephemeral Gestures), and **HTTP** (Commands). Implements **Last-Event-ID** resume and exponential backoff.
*   **[`packages/ui-atoms`](file:///Users/jaynowman/dev/ui/packages/ui-atoms)**: The visual components.
    *   **Exports**: `BoxAtom`, `TextAtom`, `AtomRegistry`.
    *   **Role**: React components rendering individual atoms using `framer-motion` for layout animations.
*   **[`packages/projections`](file:///Users/jaynowman/dev/ui/packages/projections)**: The canvas renderer.
    *   **Exports**: `CanvasView`.
    *   **Role**: Recursive renderer that walks the kernel's state and renders `ui-atoms`. Handles selection and cursor overlays.
*   **[`packages/agent-driver`](file:///Users/jaynowman/dev/ui/packages/agent-driver)**: The agent seam.
    *   **Exports**: `runScriptedAgent` function.
    *   **Role**: A scripting engine that emits ops incrementally (character-by-char typing) to simulate human/agent behavior for visual verification.

### **Scripts**
*   **[`scripts/test_server.ts`](file:///Users/jaynowman/dev/ui/scripts/test_server.ts)**: The backend simulation.
    *   **Role**: A localized Node.js server implementing the freeze wire protocol. It simulates a persistence layer, broadcasts SSE events, and deterministically triggers 409 conflicts for testing.

---

## 2. Runtime Dataflow

The system follows a strict Unidirectional Data Flow combined with Optimistic UI:

1.  **User Action**: User clicks a button in `App.tsx` (or types).
2.  **Internal Op**: `App.tsx` constructs a `CanvasOp` (e.g., `kind: 'update'`).
3.  **Kernel (Optimistic)**:
    *   `kernel.applyLocal(op)` is called.
    *   Op is pushed to `pendingOps` queue.
    *   `optimisticState` is updated immediately.
    *   UI re-renders via `kernel.subscribe`.
4.  **Transport (Commit)**:
    *   `transport.sendCommand` POSTs the op to `/commands`.
    *   Includes `correlation_id` and `base_rev`.
5.  **Backend (Process)**:
    *   Server checks `base_rev`.
    *   **Success**: Increments revision, broadcasts `op_committed` via SSE.
    *   **Conflict (409)**: Returns `REV_MISMATCH` with `recovery_ops`.
6.  **Kernel (Reconcile)**:
    *   **On SSE Event**: `kernel.applyRemote(ops, rev)` updates `committedState` and calls `rebase()`.
    *   **On 409**: `kernel.applyRemote(recoveryOps, serverRev)` updates `committedState` and calls `rebase()`.
    *   **Rebase**: `pendingOps` are re-applied on top of the new `committedState` to calculate the new `optimisticState`.

---

## 3. Proof Panel Internals

The Debug Inspector in `App.tsx` drives the specific "Visible Work" proofs:

| Button | Internal Action | Payload / Behavior |
| :--- | :--- | :--- |
| **Type/Del** | Calls `simulateAgentTyping` using `runScriptedAgent`. | **Ops**: Emits multiple `update` ops (one per char) with 100ms delay.<br>**Proof**: Verifies partial updates are rendered visibly (no "snap" to final text). |
| **Move** | Calls `randomizeLayout`. | **Ops**: Emits `move` op (index change).<br>**Proof**: `ui-atoms` uses `layoutId`, so the element animates smoothly to new position. |
| **Resize** | Calls `simulateAgentResize`. | **Ops**: Emits multiple `set_token` ops (increasing padding).<br>**Proof**: Box grows smoothly over time. |
| **Conflict** | Calls `triggerConflict`. | **Ops**: Emits `add` op with `correlation_id: "test-conflict"`.<br>**Proof**: Server detects this ID, returns `409` + `recovery_ops` (Red Box). Client applies Red Box, proving recovery logic. |
| **Reconnect** | Calls `toggleConnection`. | **Action**: `transport.disconnect()` -> `transport.connect()`.<br>**Proof**: Transport sends `Last-Event-ID` header on reconnect. Server replays missed events from memory. |

---

## 4. Known Gaps (What is Missing)

While the foundation is hardened, a "Real Builder" would need:
1.  **Real Persistence**: The `test_server.ts` is in-memory only. Restarting it wipes the graph.
2.  **Auth Integration**: Tokens are currently stubs (`SYSTEM_TEST_TOKEN`). Real auth middleware is needed.
3.  **Complex Selection/Focus**: We have basic selection (`selectedIds`), but no concept of multi-user selection coloring or "attendance" lists.
4.  **Undo/Redo UI**: The Kernel supports undo stacks, but the Studio UI has no buttons/keyboard shortcuts wired to `kernel.undo()`.
5.  **Rich Text**: Atoms are simple strings. No rich text (bold/italic) schema or CRDT for text content (currently atomic replace).

---

## 5. Source of Truth

### **Key Documentation**
*   **[WIRE_PROTOCOL.md](file:///Users/jaynowman/dev/ui/docs/WIRE_PROTOCOL.md)**: The frozen network specification.
*   **[DEMO_STEPS.md](file:///Users/jaynowman/dev/ui/docs/DEMO_STEPS.md)**: Step-by-step verification script.
*   **[PROOF_VISIBLE_WORK.md](file:///Users/jaynowman/dev/ui/docs/PROOF_VISIBLE_WORK.md)**: Checklist of completed proofs.

### **Key Entry Files**
*   **Kernel**: [`packages/canvas-kernel/src/index.ts`](file:///Users/jaynowman/dev/ui/packages/canvas-kernel/src/index.ts)
*   **Transport**: [`packages/transport/src/index.ts`](file:///Users/jaynowman/dev/ui/packages/transport/src/index.ts)
*   **App Orchestration**: [`apps/studio/src/App.tsx`](file:///Users/jaynowman/dev/ui/apps/studio/src/App.tsx)

### **Run Commands**
```bash
# 1. Backend
npx tsx scripts/test_server.ts

# 2. Frontend
npm run dev --workspace=apps/studio
# Open http://localhost:3000
```
