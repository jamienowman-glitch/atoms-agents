# Atoms UI - Architectural Standards

## The Harness & Canvas Pattern
The `atoms-ui` repository enforces a strict separation between the "Harness" (Tooling/Rig) and the "Canvas" (Content/State).

### 1. The Harness (`/harnesses`)
The Harness is the container that holds the Canvas. It is responsible for all **Tooling**, **Navigation**, and **Global State**.
*   **Definition**: A "Rig" that you load different Canvases into.
*   **Key Components**:
    *   **`TopPill`**: Top navigation bar (Environment, View Mode toggles).
    *   **`ChatRail`**: Collapsible communication rail (Bottom/Left).
    *   **`ToolPop`**: The bottom control panel that "pops" out of the ChatRail (Magnifiers, Grid Sliders).
    *   **`ToolPill`**: The floating action button (e.g., `+`) for adding elements.

### 2. The Canvas (`/canvas`)
The Canvas is the pure visual representation of the content.
*   **Definition**: A render surface for atomic blocks.
*   **Rule**: **NO OVERLAYS**. The canvas should never contain UI controls (like sliders or popups) that hide the content. All controls must be lifted to the Harness.
*   **Components**:
    *   `WysiwygCanvas`: Renders `MultiTile` blocks.
    *   `MultiTile`: The atomic unit of content.

### 3. Nomenclature (Strict)
*   **`ToolPop`**: BOTTOM PANEL (Controls).
*   **`ToolPill`**: FLOATING BUTTON (Add).
*   **`ContextPill`**: **DELETED/BANNED**. Do not use floating context lozenges that obscure content.

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
