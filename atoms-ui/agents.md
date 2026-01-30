# Atoms UI - Architectural Standards

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
