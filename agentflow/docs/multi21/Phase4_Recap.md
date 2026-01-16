# Multi21 Phase 4: Layout & Wiring Stabilization Recap

## 1. Core Architecture: "The Manual Wiring"
We moved away from global Context for layout-critical state to **Manual Prop Drilling**. This ensures instantaneous, synchronous updates between siblings (Rail and Panel) by using the Parent (`BuilderShell`) as the single source of truth.

### The Brain: `BuilderShell.tsx`
- **Holds State:**
  - `chatMode`: ('nano' | 'micro' | 'standard' | 'full') - Controls Height.
  - `showTools`: (boolean) - Controls Visibility.
- **Orchestrates:**
  - Passes `chatMode` to **Rail** (to set height).
  - Passes `chatMode` to **Panel** (to set bottom anchor position).
  - Passes `showTools` to **Panel** (to trigger "Toaster" animation).

## 2. Component Behaviors

### A. The Dock: `ChatRailShell.tsx` (Z-Index: 50)
- **Role:** The anchoring element of the interface.
- **Behavior:**
  - **Controlled:** Does NOT decide its own mode. It requests changes via `onModeChange`.
  - **Ghost Icons:** Expand/Minimize buttons are always rendered in fixed positions. Inactive ones are `opacity-0` but present, ensuring muscle memory stability (no jumping icons).
  - **Tool Toggle:** Clicking the Wrench calls `onToggleTools` in parent.
- **Visuals:** Console aesthetic (rounded top, shadow), 16px icons.

### B. The Card: `BottomControlsPanel.tsx` (Z-Index: 40)
- **Role:** The configuration layer that "Rides the Rail".
- **Behavior:**
  - **Rides the Rail:** Its `bottom` CSS property is calculated based on the `chatMode` prop. It always sits exactly on top of the rail, moving in sync.
  - **Toaster Animation:**
    - **Hidden:** `translate-y-[100%]` (Slides DOWN behind the Rail).
    - **Shown:** `translate-y-0` (Slides UP to sit on the Rail).
  - **Auto-Expand:** When opened via the Wrench, it effectively skips the "Collapsed" header-only state and opens directly to "Compact" (Sliders visible).

### C. The Floater: `FloatingAction.tsx` (Z-Index: 60)
- **Role:** Primary creation trigger.
- **Behavior:**
  - **Topmost:** `z-60` ensures it floats above everything.
  - **Draggable:** Uses native Pointer Events for smooth drag interaction on all devices.
  - **Compact:** 40px circle (`w-10 h-10`).

## 3. Z-Index Hierarchy (The Stack)
To prevent visual fighting, we enforce a strict layer deck:

| Layer | Component | Z-Index | Description |
| :--- | :--- | :--- | :--- |
| **4** | `FloatingAction` | `z-60` | Drag-over everything. |
| **3** | `ChatRailShell` | `z-50` | The solid anchor "Dock". |
| **2** | `BottomControlsPanel` | `z-40` | The "Card" slides from behind the Dock. |
| **1** | Main Canvas | `z-0` | The content being edited. |

## 4. Why This Works
By lifting state to `BuilderShell`, we eliminated the "One Frame Lag" where the Rail would grow before the Panel knew it needed to move. Now, `setChatMode` triggers a re-render of **both** components in the exact same React cycle, ensuring perfect visual lockstep.
