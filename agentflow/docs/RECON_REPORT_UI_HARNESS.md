# UI Architecture Recon & Harness Strategy Report

**Date:** 2026-01-25
**Target:** UI Decoupling & Canvas Harness
**Status:** 🟢 STRATEGY APPROVED / FEASIBLE

---

## Executive Summary
The proposal to create a new "UI Sub-repo" (or distinct packages structure) and implement a "Canvas Harness" is **architecturally sound and highly recommended**.
Current components (especially `BottomControlsPanel`) are tightly coupled to the specific `multi21.designer` surface ID. Without the Harness strategy, adding new Canvases (Stigma, AllYouCanEat) will result in copy-paste updates or spaghetti state logic.

**Recommendation:** Proceed with "Lift & Shift" to a new sub-structure (e.g., `packages/top-u-i` or `agentflow/harness`) and implement the `ToolHarness` wrapper.

---

## Component Analysis

### 1. TopPill (`WorkbenchHeader.tsx`)
*   **Coupling:** Medium.
*   **State:** Uses `useToolState` with hardcoded `multi21.designer` target.
*   **Harness Strategy:** The Harness must wrap this component and provide a `ToolControlProvider` that intercepts the `surfaceId`.
*   **Refactor Effort:** Low.

### 2. ToolPill (`WorkbenchDock.tsx`)
*   **Coupling:** Low (Dumb Component).
*   **State:** Receives all state via Props.
*   **Harness Strategy:** The Harness acts as the "Controller" that reads from the Registry/Context and feeds the props (Sources, Alignment) to the Dock.
*   **Refactor Effort:** Minimal.

### 3. ToolPop (`BottomControlsPanel.tsx`)
*   **Coupling:** 🔴 **HIGH / CRITICAL**.
*   **State:** 
    *   Hardcoded `surfaceId: 'multi21.designer'` in ~20 `useToolState` calls.
    *   Internal logic maps `Content Category` -> `Strategy` (hardcoded).
    *   Hardcoded imports of `SEED_FEEDS`.
*   **Harness Strategy:** This needs the most work. 
    *   **Option A:** Rewrite to accept `scope` prop (Cleanest).
    *   **Option B:** Wrap in a Context Provider that "Shadows" the global state hooks (Quickest Lift & Shift).
*   **Risk:** This component is the "brain" of the UI. Moving it requires ensuring the "Magnet" logic remains intact.

### 4. ChatRail (`ChatRailShell.tsx`)
*   **Coupling:** Medium.
*   **State:** Height/Mode is internal. Message Stream is implied.
*   **Harness Strategy:** Needs to be told *which* Thread/Room to connect to via the Harness. Z-Index needs to be managed relative to the Harness container.

---

## The "New UI Sub-Repo" Evaluation

**Pros:**
1.  **Enforced Separation:** Prevents "drift" where a specific Canvas logic sneaks into the generic ToolPop.
2.  **Productization:** Aligns with the goal of selling "Muscle" (MCP) separate from the App.
3.  **Clean Slate:** Allows "re-wiring" the hardcoded imports without breaking the current `master` immediately.

**Cons:**
1.  **Build Complexity:** Need to ensure the new sub-repo builds correctly with Next.js/React.
2.  **Migration Friction:** Moving files preserves history but requires updating all imports in `agentflow`.

**Verdict:** **YES**. Create the new sub-structure. It allows building the "Harness" safely while the legacy code continues to run.

---

## TokenLens & ContextLens Strategy
Thinking ahead to the "Wireframe Builder":
*   **TokenLens:** The "Inspector" that sits in the Harness. It effectively replaces `GraphTokenEditor.tsx` but is writable.
*   **ContextLens:** Does not exist yet. It should be built *within* the Harness architecture as a peer to ToolPop.
    *   *Input:* `ContextPills` (ChatRail).
    *   *Output:* Injected Signals into the `Whiteboard` (via MemoryGateway).

## Proposed Action Plan
1.  **Initialize Sub-Repo:** Create structure for `packages/ui-harness` (or similar).
2.  **Create The Harness:** Build the `ToolHarness` wrapper component first.
3.  **Lift ToolPop:** Move `BottomControlsPanel` and refactor it to accept `scope`.
4.  **Wire It:** Mount the Harness in a blank `agentflow` page and verify it can drive a "Ghost Atom" (no canvas, just state).
