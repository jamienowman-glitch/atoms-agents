# ChatRail & Multi21 Interaction Recap
**Date:** January 15, 2026
**Component Focus:** `ChatRailShell`, `BottomControlsPanel`

## 1. Core Architecture
The ChatRail system is designed as a **dual-layer interaction model** where the Chat interface expands upwards, and the Bottom Controls "ride" on top of it.

### File Locations
*   **Chat Component:** `components/chat/ChatRailShell.tsx`
*   **Controls Component:** `components/multi21/BottomControlsPanel.tsx`
*   **Global Layout:** `app/layout.tsx` (Viewport configuration)
*   **State Control:** `context/ToolControlContext.tsx`

---

## 2. The 4-Stage "Physics" System
The chat window operates in 4 distinct height modes. These are hard-coded in logic to ensure predictable expansion.

| Mode | Height | Description |
| :--- | :--- | :--- |
| **Nano** | `60px` | Default collapsed state. Shows "Agent" label and placeholder text. |
| **Micro** | `180px` | Quick interaction. Shows input + last message. Preserves canvas visibility. |
| **Standard** | `50vh` | Half-screen chat. Balanced for conversation + reference. |
| **Full** | `92vh` | Near full-screen focus. Leaves space for top bar only. |

### Transitions
*   **Animations:** Uses `cubic-bezier(0.23, 1, 0.32, 1)` for a "physics-like" smooth spring feel.
*   **Class:** `transition-all duration-300`.

---

## 3. Interaction & State Management
We moved to a **Hybrid State Model** to ensure instant responsiveness while keeping the app in sync.

### Logic: `ChatRailShell.tsx`
1.  **Local State (`useState`):** Clicks update a local `localMode` variable immediately. This ensures the UI expands *instantly* with zero latency on touch devices.
2.  **Global Sync (`useToolControl`):** Immediately after setting local state, we broadcast the change to the global `chat.mode` tool state.
3.  **The "Ride" Effect:** The `BottomControlsPanel` listens to this global state. When it sees `micro`, it changes its CSS `bottom` property to `180px` (plus padding), effectively "riding" up with the rail.

### Controls (`BottomControlsPanel.tsx`)
*   **Previously:** Used to hide (`opacity-0`) when chat expanded.
*   **Current:** Always visible. Dynamically calculates `bottom-[X]` position based on the chat mode.
*   **Input Handling:** Font size forced to `16px` (`text-base`) to prevent iOS Safari from auto-zooming when the keyboard opens.

---

## 4. Mobile Layout Stabilization (The "Nuclear" Fix)
We encountered significant issues with the ChatRail causing the entire page to scroll horizontally ("blowout") on mobile. This was resolved with a strict multi-layer containment strategy.

### Layer 1: Global Safety (`app/layout.tsx`)
*   **Viewport Meta:** Explicitly set `width=device-width, initial-scale=1, maximum-scale=1`.
*   **Body:** Added `overflow-x-hidden`.

### Layer 2: Component Constraint (`ChatRailShell.tsx`)
*   **Positioning:** Uses `fixed bottom-0 inset-x-0` (Anchored Left & Right).
*   **Containment:** `max-w-full overflow-hidden box-border`.
*   **Touch:** `touch-manipulation` added to disable double-tap zooming on the rail itself.
*   **No Negative Margins:** All negative margins `-m-2` were removed from edge controls to prevent layout leakage.

---

## 5. UX Polish
*   **Chevron Order:** `[Down Arrow] [ Separator ] [ Up Arrow ]`
*   **Logic:**
    *   **Right (Up):** Always Expands (Nano -> Micro -> Std -> Full).
    *   **Left (Down):** Always Collapses (Full -> Std -> Micro -> Nano).
*   **Input Focus:** Auto-focuses the input field when expanding to `Micro` or `Standard`.

---

## Action Items for Architect
*   **Review `ChatRailShell.tsx`**: Ensure the local/global sync pattern fits the long-term state management strategy (Is `useState` duplication acceptable for performance?).
*   **Tool Registry:** Verify that `chat.mode` is properly defined in the `tool-registry.ts` if strict typing is enforced later.
