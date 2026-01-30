# Atoms UI - Architectural Standards

## GOLDEN UI STATE: CHAT RAIL & POPUPS (LOCKED)
> [!WARNING]
> The following UI behaviors are **PERFECTED**. Do not change them "incidentally". If you touch them, you must verify they still work exactly as described.
> **AUDIT REQUIRED**: AFTER EVERY TASK, YOU MUST AUDIT YOUR CHANGES AGAINST THIS CONSTITUTION.

### 1. ChatRail Shell (Nano Mode)
*   **Behavior**: In `nano` mode, the Input Box is HIDDEN. The Message Thread is VISIBLE.
*   **Height**: Fixed at `128px` (Header + 1 Message Bubble).
*   **Reference**: `ChatRailShell.tsx` -> `getHeight()`.

### 2. Popups (ToolPop / LogicPop)
*   **Positioning**: MUST be **Dynamic**. They attach to the top of the ChatRail.
    *   *Code Rule*: `style={{ bottom: chatMode === 'nano' ? '128px' : ... }}`
*   **Layering**: MUST have `z-index: 60` (or higher) to sit **ON TOP** of the ChatRail (z-50).
    *   *Failure Mode*: If Z-Index is < 50, the "Brain" button stops working because the Rail covers it.
*   **Layout**:
    *   **ToolPop**: Height must be `h-auto` (Hug content). Do NOT use fixed height (`h-[260px]`). Do NOT use bottom padding (`pb-20`).
    *   **LogicPop**: Must have explicit Close ('X') button wired to `onClose` prop.

### 3. Harness Wiring
*   **Rule**: The Harness (`WysiwygBuilderHarness`) MUST pass `onClose={() => setOpen(false)}` to both Popups.
*   **Rule**: Toggles must be mutually exclusive (Opening Brain closes Tools).

### 4. MANDATORY REGRESSION CHECK
**Before finishing any task involving `atoms-ui`, you must verify:**
1.  [ ] **Brain Button**: Click Brain in Nano Mode -> Does menu appear *over* the rail?
2.  [ ] **Close Buttons**: Click 'X' on both menus -> Do they close?
3.  [ ] **Nano Mode**: Is the Input Box hidden? Is the Message visible?
4.  [ ] **Gap Check**: Open Tools -> Is there a huge white gap at the bottom? (Should be NO).

## CRITICAL BACKUP INTEGRITY
> [!IMPORTANT]
> **BACKUP PATH**: `atoms-ui/_backups`
> **RULE**: NEVER DELETE FILES IN THIS DIRECTORY.
> These are manual save points requested by the User (e.g. `wysiwyg_2026_01_30_stable`).
> Even if disk space is low, DO NOT DELETE.
> Checking for and restoring from these backups is PERMITTED if the main branch is corrupted.

## The Harness & Canvas Pattern
The `atoms-ui` repository enforces a strict separation between the "Harness" (Tooling/Rig) and the "Canvas" (Content/State).

### 1. The Harness (`/harnesses`)
The Harness is the container that holds the Canvas. It is responsible for all **Tooling**, **Navigation**, and **Global State**.
*   **Definition**: A "Rig" that you load different Canvases into.
*   **Key Components**:
    *   **`TopPill`**: Top navigation bar (Environment, View Mode toggles).
    *   **`ChatRail`**: Collapsible communication rail (Bottom/Left).
    *   **`ChatRail`**: Collapsible communication rail (Bottom/Left).
    *   **`ToolPop`**: The bottom control panel (Right) for Canvas Output tools.
    *   **`LogicPop`**: The bottom control panel (Left) for Agent Brain/Logging tools.
    *   **`ToolPill`**: The floating action button (e.g., `+`) for adding elements.

### 2. The Canvas (`/canvas`)
The Canvas is the pure visual representation of the content.
*   **Definition**: A render surface for atomic blocks.
*   **Rule**: **NO OVERLAYS**. The canvas should never contain UI controls (like sliders or popups) that hide the content. All controls must be lifted to the Harness.
*   **Components**:
    *   `WysiwygCanvas`: Renders `MultiTile` blocks.
    *   `MultiTile`: The atomic unit of content.

### 3. Nomenclature (Strict)
*   **`TopPill`**: BOTTOM PANEL (Controls).
*   **`ToolPill`**: FLOATING BUTTON (Add).
*   **`ContextPill`**: **DELETED/BANNED**. Do not use floating context lozenges that obscure content.

#### The Suffix Law
To maintain continuity across different canvases (Web, Seb, Deck), all Harness UI components must follow this naming pattern. Do **not** invent new suffixes.
1.  **`*TopPill`**: Any top navigation bar (e.g., `DesktopTopPill`, `MobileTopPill`). default: `TopPill`.
2.  **`*ToolPop`**: Any bottom control panel (e.g., `WysiwygToolPop` [Right], `LogicPop` [Left]). default: `ToolPop`.
3.  **`*ToolPill`**: Any floating action button (e.g., `WebToolPill`, `EmailToolPill`). default: `ToolPill`.

### 6. The "Mother Harness" Strategy
We are currently building the **Central Mother Harness**.
*   **Status**: **ACTIVE DEVELOPMENT**. Do not fork yet.
*   **Rule**: All improvements (branding, controls, inputs) must happen on the `WysiwygBuilderHarness` (the current proxy for Mother) until the User declares it "Golden".
*   **Evolution**:
    1.  **Phase 1 (Current)**: Build ONE perfect Harness.
    2.  **Phase 2**: Lock it.
    3.  **Phase 3**: Fork/Inherit for specialized needs (Video, CAD, Freeform).
    4.  **Drift Policy**: **ZERO DRIFT** allowed during Phase 1.

### 7. Logic Persistence (The Event Spine)
*   **Location**: The **Logging View** and **Event Spine** connection must live in the **Harness** (specifically usually triggered via `LogicPop` or `ChatRail`).
*   **Reasoning**: Users must be able to see the "Agent's Brain" (Thoughts, Handovers, Run State) regardless of which Canvas (Web, Email, Slides) is currently active. The Canvas is just the hands; the Harness is the brain interface.

### 7.1 Event Spine V2 Contract (Supabase‑First)
**Canonical Doc:** `docs/plans/2026-01-29_event-spine-v2-contract.md`
**Scope:** Replay filters support `run_id`, `node_id`, `canvas_id`, `agent_id` (single or multi).  
**Ordering:** `normalized_timestamp` then `sequence_id`.  
**Context:** `context_scope` is explicit (`whiteboard` / `blackboard`).  
**Artifacts:** URIs in payloads + `event_spine_v2_artifacts` join.

### 4. Responsive Tooling Strategy (Mobile First -> Desktop Scale)
*   **Principle**: The Harness (`WysiwygBuilderHarness`) holds the **Truth** (State). The Tool Surfaces (`ToolPop`, `ToolPill`) are just **Views**.
*   **Scalability**: We are currently building the "Mobile Layout" (Bottom Sheet / Floating Buttons) because it is the hardest contestraint.
*   **Future Proofing**: For Desktop, we can simply conditionally render a different component (e.g., `DesktopSideDock`) or adapt `ToolPop` CSS, while injecting the *exact same* state props from the Harness. We are **not** coupled to the mobile layout; we are just prioritizing it.

### 5. The Multi21 Vision (Roadmap)
We are moving from a set of disjointed tools to a **Universal Harness** that loads specialized **Canvas Cartridges**.

#### A. The Universal Harness
One central "Rig" (`WysiwygBuilderHarness`) that provides the standard environment (TopPill, ChatRail, ToolPop). It accepts a "Cartridge" (Canvas) to determine what is being built.

#### B. The Cartridges (Canvases)
*   **Multi²¹-WEB** (Current): Functionality for building responsive websites. Export -> React/HTML/Shopify.
*   **Multi²¹-SEB** (Email): Fixed-width (600px) canvas for building emails. Uses table-based atoms. Export -> Klaviyo/Mailchimp.
*   **Multi²¹-DECK** (Slides): 16:9 canvas for presentations. Presentation/Practice modes. Export -> PPTX/PDF.
*   **Multi²¹-DM** (Messaging): Vertical wireframe of "cards" for designing chat/DM flows.

#### C. The Production Line
*   All Canvases share the same **UI Atoms** (Button, Text, Media).
*   Atoms are polymorphic: A `<ButtonBlock />` renders as a `<button>` in WEB, a `<table>` in SEB, and an `<image>` in DECK.
*   We will automate the creation of these atoms to rapidly scale our UI library (330+ items).

#### D. Next-Gen Harnesses (Future)
*   **FreeFormHarness**: Moving away from the "Block Builder" to a coordinate-based system (X, Y, Z).
    *   **Stigma Cartridge**: Infinite canvas for Figma-style web design.
    *   **Fume Cartridge**: Fixed-pixel canvas (1080x1080) for Photoshop-style graphic design.

## Critical Mission
This separation is the result of a major refactor (Jan 2026) to decouple "Tool Surfaces" from "Content Atoms". Future agents must respect this boundary: **Code goes in Atoms, Tools go in Harness.**

### 5. The Multi21 Vision (Roadmap)
We are moving from a set of disjointed tools to a **Universal Harness** that loads specialized **Canvas Cartridges**.

#### A. The Universal Harness
One central "Rig" (`WysiwygBuilderHarness`) that provides the standard environment (TopPill, ChatRail, ToolPop). It accepts a "Cartridge" (Canvas) to determine what is being built.

#### B. The Cartridges (Canvases)
*   **Multi²¹-WEB** (Current): Functionality for building responsive websites. Export -> React/HTML/Shopify.
*   **Multi²¹-SEB** (Email): Fixed-width (600px) canvas for building emails. Uses table-based atoms. Export -> Klaviyo/Mailchimp.
*   **Multi²¹-DECK** (Slides): 16:9 canvas for presentations. Presentation/Practice modes. Export -> PPTX/PDF.
*   **Multi²¹-DM** (Messaging): Vertical wireframe of "cards" for designing chat/DM flows.

#### C. The Production Line
*   All Canvases share the same **UI Atoms** (Button, Text, Media).
*   Atoms are polymorphic: A `<ButtonBlock />` renders as a `<button>` in WEB, a `<table>` in SEB, and an `<image>` in DECK.
*   We will automate the creation of these atoms to rapidly scale our UI library (330+ items).

#### D. Next-Gen Harnesses (Future)
*   **FreeFormHarness**: Moving away from the "Block Builder" to a coordinate-based system (X, Y, Z).
    *   **Stigma Cartridge**: Infinite canvas for Figma-style web design.
    *   **Fume Cartridge**: Fixed-pixel canvas (1080x1080) for Photoshop-style graphic design.
