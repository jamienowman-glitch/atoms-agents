# Multi²¹ (Multi21) · Grid Designer

> Pre-flight for Multi²¹ work:
> - Read `docs/constitution/00_CONSTITUTION.md`
> - Read `docs/constitution/01_FACTORY_RULES.md`
> - For role-specific rules, see:
>   - `docs/GEMINI_PLANS.MD` (Architect)
>   - `docs/01_DEV_CONCRETE.MD` (Implementer)
> - For Multi²¹ API/spec, see `docs/multi21.md`

Multi²¹ is the **square grid designer**. It’s the core building block for:

- Content galleries (YouTube, product cards, event flyers).
- KPI dashboards.
- Future “performance wall” layouts.

It lives at: `/multi21`

> **Plan edit rules**  
> – **Architect (Gem)** owns the structure and wording of this plan.  
> – **Implementers (Max)** are **allowed and required** to:  
>   – Follow the "Logging & Status (Max)" instructions in each phase.  
>   – Mark phases as Done in this file when complete.  
>   – Move a task from **Active** → **Completed Tasks** when all phases are done, as described in the "Task Completion Ritual (Max)".  
> – **Implementers MUST NOT** change the goals, descriptions, or phase structure.

---

## 1. Current Behaviour (baseline)

**Layout**

- Uses a CSS grid for the **main tile area**.
- Columns are controlled via sliders:
  - Mobile columns
  - Desktop columns
- Gap (gutter) is controllable.
- There is an “edge-to-edge” style where tiles can visually touch (no visible gap).

**Tiles**

- Each tile is currently:
  - Landscape thumbnail
  - Optional title text
  - Optional meta line
  - CTA text + arrow (or tiny arrow only)

**Controls**

- Bottom panel has 3 states:
  - Collapsed: thin bar with label and chevron.
  - Compact: core sliders (cols mobile/desktop, gap, radius, items).
  - Full: extended controls (layout extras, visibility toggles, etc.).
- Panel state is persisted in `localStorage` (key `multi21_panel_state`).

---

## 2. Golden Rules (specific to Multi²¹)

1. **Square grid as first-class**
   - Everything should be expressible in **grid units**, both horizontal and vertical.
   - Think “24 units across” and “N units tall”, not arbitrary pixels.

2. **Multiple tile aspect ratios**
   - We must support:
     - Square
     - Portrait
     - Landscape
   - Aspect ratios should be applied via **config / props**, not baked into the markup.

3. **Re-usable tile types**
   - The same grid should be able to render:
     - Generic card (image + title + meta + CTA)
     - KPI card (number + label + trend)
     - Product card (image + price + tag)
     - Text / icon card (no image, just content)

4. **CTA controls**
   - CTA **word** and CTA **arrow** are separate toggles:
     - Word only
     - Arrow only
     - Both
     - None
   - Styles for arrows should be tokenised so we can recolour them later.

---

## 3. Backlog · Multi²¹

Use these IDs when writing plans/logs.

### Done / In Progress

- `M21-01` – Base grid + sliders for mobile/desktop columns and gap.
- `M21-02` – 3-state collapsible bottom panel (collapsed / compact / full).
- `M21-03` – Edge-to-edge option (remove visible gutters between tiles where requested).
- `M21-04` – CTA arrow length and spacing tweaks to feel balanced on mobile.
- `M21-05` – Aspect ratio modes (square, portrait, landscape).

*(If something here is not actually done, adjust in the log.)*

### Next Up

- `M21-06` – **Tile type variants**
  - Add internal variants:
    - `card.generic`
    - `card.kpi`
    - `card.product`
    - `card.text`
  - Each variant should share a base frame, but change inner layout/content.

- `M21-07` – **CTA toggles**
  - Separate toggles for:
    - `showCtaLabel`
    - `showCtaArrow`
  - Ensure layout looks clean in all combinations.

- `M21-08` – **Stackable blocks**
  - Allow multiple Multi²¹ blocks vertically on one page.
  - Each block has its own settings (aspect ratios, tile type, colours).

- `M21-09` – **Absolute offset sliders**
  - For each block, allow:
    - Horizontal offset (within grid limits)
    - Vertical offset (within its own section)
  - Think: “layout nudging” while still respecting the 24-grid.

- `M21-10` – **Portrait full-screen mobile mode**
  - One tile can occupy the full viewport on mobile (for hero experiences).
  - Ensure safe scrolling between tiles.

- `M21-11` – **Config surface for agent use**
  - Expose a clean config object for Multi²¹ layouts so agents (or other tools) can:
    - Read the current layout
    - Propose new layouts
    - Apply them without touching component internals.

---


---

## 4. Active Plan (for Architect)

> Only the Architect (Gemini) should write in this section.
> Implementers (ChatGPT Codex / OSS) should **read**, not edit.

### Active Task: None (awaiting next assignment)

No active task. Refer to Future Tasks for the next pickup.

---

## 5. Future Tasks

*(None listed)*

---

## M21-CHAT-RAIL-MODES – Chat Rail States

**Goal**: Implement the 4 visual states of the Chat Rail.
- **Scope**: Global Chat Component.
- **Outcome**: Nano, Micro, Standard, and Full Screen modes with smooth transitions.

**Phase CR1: State Machine & Layout**
- **Goal**: Define states and basic layout shell.
- **Files**: `components/chat/ChatRail.tsx`.
- **Steps (Max / Implementer)**:
  - Define `ChatMode` enum: `nano`, `micro`, `standard`, `full`.
  - Create layout container that animates between these states.
  - **Test**: Toggle states via dev tools / temporary buttons.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Task Completion Ritual (Max)**
When all phases are complete:
1. Move **M21-CHAT-RAIL-MODES** to **Completed Tasks**.
2. Verify that `docs/logs/DEV_LOG.md` contains entries for each phase.

---

## M21-CHAT-RAIL-CONTROLS – Safety & Streaming UI

**Goal**: Implement the specific atoms for 3-Wise, Strategy Lock, and Streaming.
- **Scope**: Chat Input & Message Areas.
- **Outcome**: Visual controls for safety and feedback (logic wired later).

**Phase CC1: Input Area Atoms**
- **Goal**: Build the input row controls.
- **Files**: `components/chat/ChatInput.tsx`.
- **Steps (Max / Implementer)**:
  - `atom-chat-3wise-trigger`: Button to invoke 3-Wise check.
  - `atom-chat-fire-refine`: Button to "Fire" or "Refine" prompt.
  - `atom-chat-streaming-grid`: The animated grid of squares.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase CC2: Message Atoms**
- **Goal**: Build the per-message action atoms.
- **Files**: `components/chat/ChatMessage.tsx`.
- **Steps (Max / Implementer)**:
  - `atom-chat-msg-strategy-lock`: Icon indicating a locked plan.
  - `atom-chat-msg-save`: Button to save to Nexus.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Task Completion Ritual (Max)**
When all phases are complete:
1. Move **M21-CHAT-RAIL-CONTROLS** to **Completed Tasks**.
2. Verify that `docs/logs/DEV_LOG.md` contains entries for each phase.

---

## 6. Completed Tasks

### M21-22 – Tool Registry & SSE Targeting (Completed 2025-12-02)

**Goal**: Canonical tool registry, SSE validation, centralized tool state, and wiring across designer and scoped surfaces.

**Status**: All phases done.
- ✅ Phase T1: Registry definition.
- ✅ Phase T2: SSE bridge validation.
- ✅ Phase T3: Centralized tool state via context.
- ✅ Phase T4: UI wiring (global sliders/toggles via ToolControl).
- ✅ Phase T5: Scoped wiring for tile/block tools.

**Key files**: `lib/multi21/tool-registry.ts`, `lib/multi21/sse-handler.ts`, `context/ToolControlContext.tsx`, `components/multi21/BottomControlsPanel.tsx`, `components/multi21/Multi21Designer.tsx`, `components/multi21/TilePopup.tsx`, `components/multi21/Multi21Block.tsx`.


### M21-21 – Tool Options & Pop-outs (Completed 2025-12-02)

**Goal**: Define a unified **Tool With Options** pattern for all surfaces (Mobile Vertical, Mobile Horizontal, Desktop Panels).
- **Concept**: Tools can have sub-options (e.g. `gridDensity: low/med/high`).
- **Interaction**:
  - **Tap**: Opens a central pop-out menu.
  - **Long-press (Mobile) / Right-click (Desktop)**: Cycles through options without opening the menu.

### 1. High-level UX Flows

**Flow A: Mobile Horizontal (Tools Toolbar)**
- **Context**: User taps "Tools" icon -> Horizontal pill opens.
- **Action**: User taps a tool (e.g. `Grid Density`).
- **Result**: A **Central Pop-out** overlay appears in the middle of the screen.
  - Shows 3 options: Low, Medium, High.
  - Current option is highlighted.
- **Selection**: User taps "High". Pop-out closes. Tool icon updates to reflect "High".

**Flow B: Mobile Vertical (Settings Toolbar)**
- **Context**: User opens "Settings" vertical pill.
- **Action**: User **Long-presses** the `Preview Mode` tool.
- **Result**: No menu opens.
  - The tool **cycles** to the next option (e.g. Desktop -> Tablet).
  - A tiny "jiggle" animation and toast confirms the change.
  - Ideal for power users switching modes quickly.

**Flow C: Desktop Panel**
- **Context**: Floating Settings panel.
- **Action**: User **Right-clicks** a tool.
- **Result**: Cycles to the next option (consistent with mobile long-press).
- **Alt Action**: User **Clicks** the tool.
- **Result**: Opens the Central Pop-out overlay.

### 2. Tool & Options Architecture
**`ToolConfig`**:
```typescript
interface ToolOption {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  isDefault?: boolean;
}

interface ToolConfig {
  id: string;
  type: 'simple' | 'withOptions';
  icon: ReactNode;
  label?: string;
  options?: ToolOption[]; // Only if type === 'withOptions'
}
```

### 3. Pop-out Menu Spec (Central Overlay)
- **Placement**: Centered in viewport (modal-like).
- **Visuals**:
  - Dimmed backdrop.
  - Rounded container.
  - Title = Tool Name.
- **Content**:
  - List of options (rows).
  - **Max 4 visible**.
  - If > 4 options: **Vertical Scroll** inside the container.
- **Behavior**:
  - Tap Option -> Select & Close.
  - Tap Backdrop -> Close (Cancel).

### 4. Long-press / Cycle Spec
- **Mobile**:
  - **Gesture**: Press & Hold (> 400ms).
  - **Feedback**: Haptic (if available) + Visual Jiggle + Icon update.
- **Desktop**:
  - **Gesture**: Right-click (Context Menu event).
  - **Feedback**: Visual Jiggle + Icon update.
- **Logic**:
  - `nextOptionIndex = (currentIndex + 1) % options.length`

### 5. State & Nesting Model
**Integration with `ControlsState`**:
- State is keyed by `toolId`.
```typescript
interface ToolState {
  currentOptionId: string;
}
```
- **Reuse**:
  - The `ToolButton` component handles the Tap/Long-press logic internally.
  - It accepts `ToolConfig` as a prop.
  - It works inside any container (Flex Row, Flex Col, Grid).

### 6. Phased Implementation Plan

**Phase O1: Model Definition**
- **Goal**: Define types and update existing tools to use `ToolConfig`.
- **Files**: `types/multi21-tools.ts`.
- **Steps (Max / Implementer)**:
  - Create interfaces.
  - Refactor one existing tool (e.g. `previewMode`) to match this shape.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.
- ✅ Phase O1 completed (2025-12-02) by Max.

**Phase O2: Central Pop-out**
- **Goal**: Implement the overlay UI.
- **Files**: `components/multi21/overlays/ToolOptionsPopup.tsx`.
- **Steps (Max / Implementer)**:
  - Create modal overlay.
  - Render options list.
  - Handle selection.
  - **Test**: Tap tool -> verify popup opens and selection works.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.
- ✅ Phase O2 completed (2025-12-02) by Max.

**Phase O3: Cycle Behavior**
- **Goal**: Implement Long-press/Right-click cycling.
- **Files**: `components/multi21/tools/ToolButton.tsx`.
- **Steps (Max / Implementer)**:
  - Add `useLongPress` hook.
  - Add `onContextMenu` handler for desktop.
  - Implement cycle logic.
  - **Test**: Long-press on mobile, Right-click on desktop.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.
- ✅ Phase O3 completed (2025-12-02) by Max.

**Phase O4: Application**
- **Goal**: Apply to real tools.
- **Steps (Max / Implementer)**:
  - Convert `previewMode`, `aspectRatio`, `tileVariant` to use this system.
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.
- ✅ Phase O4 completed (2025-12-02) by Max.

**Phase O5: Refinement**
- **Goal**: Polish.
- **Steps (Max / Implementer)**:
  - Add animations (jiggle, pop-in).
  - Handle edge cases (many options).
- **Logging & Status (Max)**:
  - Append entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.
- ✅ Phase O5 completed (2025-12-02) by Max.

### 7. Task Completion Ritual (Max)
When all phases are complete:
1. Move **M21-21** from **Future Tasks** → **Completed Tasks** in this file.
2. Ensure log entries exist for each completed phase in `docs/logs/DEV_LOG.md`.

### 8. Safety & Non-regression
- **Grid**: No changes.
- **Layouts**: Fits within existing toolbar/panel layouts.
- **Accessibility**: Ensure pop-out is focus-trapped and keyboard navigable.

*(End of M21-21 Plan)*

---






### M21-20 – Floating Launchers & Stacks (Completed 2025-12-02)

**Goal**: Unified floating launcher system with snapping, stacking, and basic surfaces for desktop/mobile.

**Status**: All phases done.
- ✅ Phase F1: Models and snap calculation utilities.
- ✅ Phase F2: Draggable launcher with snap-to-edge.
- ✅ Phase F3: Edge-based stacking renderer.
- ✅ Phase F4: Surface wiring for vertical/horizontal stacks.
- ✅ Phase F5: Layout persistence and update hook via context.

**Key files**: `components/multi21/launchers/LauncherTypes.ts`, `LauncherUtils.ts`, `FloatingLauncher.tsx`, `LauncherStack.tsx`, `LauncherManager.tsx`, `LauncherContext.tsx`.

### M21-19 – Mobile Horizontal Toolbar (Completed 2025-12-01)

**Goal**: Horizontal floating toolbar for mobile Tools icon.

**Status**: All phases done.
- ✅ Phase T1: Toolbar UI shell.
- ✅ Phase T2: Positioning logic and max-width clamp.
- ✅ Phase T3: Tools icon wired with horizontal toolbar.
- ✅ Phase T4: Designer integration (Settings vertical + Tools horizontal).

**Key files**: `components/multi21/mobile/HorizontalToolbar.tsx`, `components/multi21/mobile/MobileFloatingManager.tsx`, `docs/logs/MULTI21_LOG.md`.

### M21-18 – Mobile Floating Primitives (Completed 2025-12-01)

**Goal**: Evolve the mobile floating gear into a reusable **Floating Icon + Toolbar** primitive (mobile-only).

**Status**: All phases done.
- ✅ Phase M1: FloatingIcon primitive (drag/tap, snap-to-corner).
- ✅ Phase M2: FloatingToolbar primitive (oriented expansion from icon).
- ✅ Phase M3: Wiring & state via `MobileFloatingManager` with persistence to `multi21_mobile_layout`.
- ✅ Phase M4: Migrated legacy mobile gear to the new manager; Settings controls live in the toolbar.
- ✅ Phase M5: Added Tools icon/toolbar with independent positioning and open state.

**Key files**: `components/multi21/mobile/FloatingIcon.tsx`, `components/multi21/mobile/FloatingToolbar.tsx`, `components/multi21/mobile/MobileFloatingManager.tsx`, `components/multi21/Multi21Designer.tsx`.

### M21-17: Dockable Desktop Panel System

**Goal**: Implement a Photoshop-style dockable panel system for **Desktop only**. Panels can float, dock to Left/Right/Bottom edges, and be minimised. Mobile behaviour remains unchanged.
- **Files to touch**:
  - `components/multi21/DesktopPanelSystem.tsx` (New: Manager)
  - `components/multi21/Panel.tsx` (New: Generic Panel UI)
  - `components/multi21/DockZone.tsx` (New: Drop targets)
  - `components/multi21/Multi21Designer.tsx` (Wiring)
  - `types/multi21-panels.ts` (New: Types)

#### 1. High-level UX Spec (Desktop)
- **Panels**:
  - Have a header with Title, Drag Handle, and Minimise/Close buttons.
  - Can be dragged freely around the screen (floating).
  - Can be resized (nice-to-have v2, fixed width v1).
- **Docking**:
  - Dragging a panel near the **Left**, **Right**, or **Bottom** edge reveals a "Dock Zone" highlight.
  - Dropping it there snaps the panel into that dock.
  - Multiple panels in a dock stack:
    - Vertical stacks for Left/Right docks.
    - Horizontal stacks for Bottom dock.
- **Minimising**:
  - Clicking "Minimise" collapses the panel into a small tab/header within its dock.
  - Clicking the tab restores it.
  - Floating panels can also be minimised (collapse to header only).

#### 2. Panel & Dock Architecture
- **`Panel` Component**:
  - Props: `title`, `children`, `isFloating`, `isMinimised`, `onDragStart`, `onToggleMinimise`.
  - Renders the frame and content.
- **`DockManager` (DesktopPanelSystem)**:
  - Owns the state of all panels.
  - Renders the 3 `DockZone` containers (fixed position).
  - Renders the `FloatingLayer` for undocked panels.
  - Handles drag-and-drop logic (using a library like `dnd-kit` or simple HTML5 DnD).

#### 3. Control Grouping Mapping
| Panel | Controls |
| :--- | :--- |
| **Settings** | **View**: `previewMode`<br>**Layout**: `align`, `aspectRatio`<br>**Content**: `tileVariant`<br>**Visibility**: `showTitle`, `showMeta`, `showBadge`, `showCtaLabel`, `showCtaArrow` |
| **Tools** | **Grid**: `colsDesktop`, `colsMobile`, `tileGap`, `tileRadius`<br>**Data**: `itemCount` |

#### 4. State / Persistence Model
**`DesktopPanelsLayoutConfig`**:
```typescript
type DockSide = 'left' | 'right' | 'bottom' | 'float';

interface PanelState {
  id: string;
  side: DockSide;
  order: number; // Index in the dock stack
  isMinimised: boolean;
  position?: { x: number; y: number }; // Only if floating
}

interface DesktopLayoutConfig {
  panels: Record<string, PanelState>;
  version: number;
}
```
- **Default Layout**:
  - Settings: Docked RIGHT.
  - Tools: Docked BOTTOM.
- **Persistence**: Save to `localStorage` key `multi21_desktop_layout`.

#### 5. Phased Implementation Plan

**Phase D1: Generic Panel & Dock UI**
- **Goal**: Create the visual shell.
- **Files**: `components/multi21/Panel.tsx`, `components/multi21/DockZone.tsx`.
- **Steps**:
  - Build `Panel` with header and content area.
  - Build `DockZone` (flex container with border/bg).
  - Create a static layout with dummy panels to verify CSS.

**Phase D2: DockManager & State**
- **Goal**: Implement drag-and-drop docking logic.
- **Files**: `components/multi21/DesktopPanelSystem.tsx`, `types/multi21-panels.ts`.
- **Steps**:
  - Define state shape.
  - Implement `movePanel(id, side, index)` logic.
  - Implement drag handlers (detect edge proximity).
  - Verify panels can move between Left/Right/Bottom/Float.

**Phase D3: Wire Real Controls**
- **Goal**: Move existing Multi21 controls into these panels.
- **Files**: `components/multi21/Multi21Designer.tsx`.
- **Steps**:
  - Instantiate `DesktopPanelSystem` in `Multi21Designer` (desktop only).
  - Pass the actual control sliders/toggles as children to the "Settings" and "Tools" panels.
  - Ensure state updates flow correctly (e.g. slider moves → grid updates).

**Phase D4: Persistence**
- **Goal**: Save/Restore layout.
- **Files**: `components/multi21/DesktopPanelSystem.tsx`.
- **Steps**:
  - `useEffect` to load config on mount.
  - `useEffect` to save config on change.
  - Add "Reset Layout" button (debug).

#### 6. Safety & Non-regression
- **Mobile**: This entire system is conditionally rendered `if (!isMobile)`. Mobile continues to use the existing Floating Gear.
- **Grid**: The `Multi21` grid component is untouched.
- **Edge Cases**:
  - Window resize: Ensure floating panels stay on screen.
  - Empty docks: Should collapse to 0 width/height.

*(When this task is done, move the plan details into the Log and start a new one.)*
