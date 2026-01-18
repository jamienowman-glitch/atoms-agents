# Multi21 Reconstruction Report: Phase 8 - Phase 19

This report details the work implemented by Antigravity (Agent) during the provided session context. It ignores the current state of the repository and reconstructs the architecture, mappings, and UI elements based on the development logs.

## Baseline Reality (Starting State)
- **Repo State**: `Multi21Designer.tsx` existed as a flat list of `media` and `text` blocks.
- **Controls**: `BottomControlsPanel.tsx` had a basic horizontal scrolling list of tools and generic sliders.
- **Registry**: `tool-registry.ts` contained basic `grid.*` and `typo.*` tokens but lacked advanced styling, interaction, or layout primitives.
- **Critical Issues**:
  - Typography size changes affected both Desktop and Mobile simultaneously (no split state).
  - No color/styling system existed (hardcoded or missing).
  - Use of "Up/Down" buttons for reordering (no Drag-and-Drop).

---
## Phase 7: The Dual Magnifier Engine (Designer Panel)
**Objective**: Create a "Professional Grade" control surface that mimics physical lens selection, allowing deep customizability without UI clutter.

### 1. The "Dual Mag" Interface (`BottomControlsPanel.tsx`)
- **Concept**: Two side-by-side "Lens" selectors (implemented as `ToolCarousel`).
  - **Right Mag (Macro)**: Selects the High-Level Mode (Layout | Typography | Style).
  - **Left Mag (Micro)**: Contextually displays sub-tools for the active Mode.
- **Micro Interactions**:
  - **Snap-Scroll**: Custom physics-based scroll for the carousel.
  - **Dynamic Scaling**: Icons scale up/down based on distance from center (Fisheye effect).

### 2. Layout Engine (Grid & Geometry)
**Mapping Strategy**: Most "Size" values are split into `_desktop` and `_mobile` tokens to ensure responsive fidelity.
- **Tool A: Density**
  - **Desktop Cols**: `grid.cols_desktop` (1-12)
  - **Mobile Cols**: `grid.cols_mobile` (Typically 1-2)
  - **Query Limit**: `feed.query.limit` (Items to fetch)
- **Tool B: Spacing**
  - **Gap X**: `grid.gap_x` (0-100px)
  - **Gap Y**: `grid.gap_y` (0-100px)
- **Tool C: Geometry**
  - **Aspect Ratio**: `grid.aspect_ratio` (Global Enum: '1:1', '16:9', '9:16', '4:3')
  - **Corner Radius**: `grid.tile_radius` (0-50px)

### 3. Typography Engine (Variable Fonts)
**Forensic Note**: We moved away from static font selects to a **Variable Font Axis** system using `Roboto Flex`.
- **Tool A: Identity**
  - **Family**: `typo.family` (Enum mapped to Index: 0=Sans, 1=Serif, 2=Slab, 3=Mono)
  - **Vibe (Casual)**: `typo.casual` (0.0 - 1.0). Maps to the `CASL` axis of Roboto Flex.
    - *Mapping*: `0` = Formal, `1` = Casual.
- **Tool B: Body (Weight & Width)**
  - **Weight**: `typo.weight` (100 - 1000). Maps to `wght` axis.
  - **Width**: `typo.width` (25 - 151). Maps to `wdth` axis.
- **Tool C: Scale (Responsive Size)**
  - **Preset**: `typo.preset_index` (Base size from a hidden array).
  - **Size**: `typo.size_desktop` vs `typo.size_mobile` (Pixel perfect overrides).
- **Tool D: Style (Slant & Grade)**
  - **Slant**: `typo.slant` (-10° to 0°). Maps to `slnt` axis.
  - **Grade**: `typo.grade` (-200 to 150). Maps to `GRAD` axis (optical weight without changing layout width).

### 4. Style Engine (Chameleon)
- **Tool A: Palette**
  - **Target Switcher**: Background | Text | Funk
  - **Logic**: A single `ColorRibbon` component dynamically re-binds to the selected target.
  - **Mappings**: `style.bg`, `style.text`, `style.accent`.
- **Tool B: Effects**
  - **Opacity**: `style.opacity`.
  - **Blur**: `style.blur`.
- **Tool C: Borders**
  - **Width**: `style.border_width`.
  - **Color**: `style.border_color`.

---

## Phase 8: The Chameleon Engine (Color & Style)
**Objective**: Introduce a granular styling system and fix the responsive typography defect.

### 1. Style System
- **New Features**: Background Color, Text Color, "Funk" (Accent) Color, Opacity, Blur, Border Width/Color.
- **Tool Mapping (`tool-registry.ts`)**:
  - `style.background`: Color hex string.
  - `style.text_color`: Color hex string.
  - `style.funk`: Accent color (used for badges, buttons).
  - `style.opacity`: Number (0-100).
  - `style.blur`: Number (px).
  - `style.border_width`: Number (px).
  - `style.border_color`: Color hex string.
- **New UI Elements (`BottomControlsPanel.tsx`)**:
  - **"Style" Tab**: A new section in the bottom panel.
  - **Color Picker**: A custom hybrid control with a Hex Input and Visual Swatch.
  - **Effect Sliders**: Specific sliders for Opacity and Blur.
  - **Border Control**: Combined Slider (width) and Swatch (color).

### 2. Responsive Typography Fix
- **Implementation**: Split the single `fontSize` state into `fontSizeDesktop` and `fontSizeMobile`.
- **Logic**: Updated `Multi21.tsx` to apply these via CSS variables inside media queries (`@media (min-width: 768px)`).
- **Control Logic**: The "Scale" slider in `BottomControlsPanel` was updated to dynamically target the correct token based on the active view mode (Desktop vs Mobile).

---

## Phase 14: The CTA Engine (Action Block)
**Objective**: Add a "Call to Action" primitive.

### 1. CTA Block
- **New Component**: `Multi21_CTA.tsx`.
- **Features**: 
  - **Variants**: Solid, Outline, Ghost.
  - **Sizes**: Small, Medium, Large.
  - **Layout**: Full Width toggle, Alignment (Left/Center/Right).
- **Tool Mapping**:
  - `cta.variant`: Enum ('solid', 'outline', 'ghost').
  - `cta.size`: Enum ('sm', 'md', 'lg').
  - `cta.fullWidth`: Boolean.
  - `cta.align`: Enum ('left', 'center', 'right').
  - `cta.label`: String (Inline editable).
- **UI Elements**:
  - **Add Menu**: Added a "Button" pill to the floating add menu.
  - **CTA Controls**: Segmented controls (pill-shaped toggles) in the Bottom Panel for Variant and Size.

---

## Phase 15: The Page Director (Global Settings)
**Objective**: Move page-level configuration out of block tools into a global "Command Center."

### 1. Top Pill & Settings Drawer
- **New Components**: 
  - `TopControls.tsx` (Persistent top bar).
  - `PageSettingsPanel.tsx` (Right-side slide-out drawer).
- **Features**:
  - **Global Design**: Page Background color, Global "Funk" accent.
  - **SEO**: Title, Description, Slug (with Google Search Result Preview card).
  - **Tracking**: Inputs for GA4, Meta Pixel, TikTok Pixel.
- **UI Elements**:
  - **View Switcher**: Desktop/Mobile toggle moved to Top Bar.
  - **Settings Trigger**: Gear icon opening the drawer.
  - **Search Preview**: A visual card mimicking a Google result to preview SEO settings.
- **Mapping**:
  - `page.background`, `page.funk`.
  - `seo.title`, `seo.description`, `seo.slug`.
  - `tracking.ga4`, `tracking.meta`, `tracking.tiktok`.

---

## Phase 16: Interaction Layer (Direct Manipulation)
**Objective**: Replace clunky buttons with tactile Drag-and-Drop.

### 1. Drag & Drop System
- **Implementation**: Integrated `@dnd-kit` (Core, Sortable, Modifiers).
- **Wrapper**: Created `SortableBlockWrapper.tsx` to handle drag refs and listeners.
- **New UI**:
  - **Block HUD**: A hover-state overlay for every block.
  - **Drag Handle**: A "Six-Dot" grip icon on the top-left of the HUD.
  - **Delete Action**: A Trash Can icon on the top-right of the HUD (with confirmation).
- **Logic**: Implemented collision detection and array reordering logic in `Multi21Designer.tsx`.

---

## Phase 17: Layouts & Nesting (Rows & Columns)
**Objective**: Allow blocks to be placed side-by-side.

### 1. The Row Primitive
- **New Component**: `Multi21_Row.tsx`.
- **Features**: 1, 2, or 3 column grids.
- **Data Structure**: Updated `Block` type to be recursive (`children: Block[][]`).
- **Interaction**: 
  - Enabled **Nested Drag-and-Drop**: Users can drag a block from the main stack *into* a column, or between columns.
- **UI Elements**:
  - **Enhanced Add Menu**: Added `[I]`, `[II]`, `[III]` buttons to quickly insert rows.

---

## Phase 18: E-E-A-T Header & Menu Block
**Objective**: Create a high-trust navigation header.

### 1. Header Block
- **New Component**: `Multi21_Header.tsx`.
- **Features**: 
  - **Trust Signals**: Configurable badges (Secure Icon, Ratings, Verified).
  - **Nav Menus**: Sourced from `seed-menus.ts` (Main, Landing, Minimal).
  - **Contact Priority**: Highlights email/phone.
- **Tool Mapping**:
  - `header.layout`: Enum ('left', 'center', 'split').
  - `header.trust_signal`: Enum.
  - `header.sticky`: Boolean.
- **UI Elements**:
  - **Controls**: Specific segmented controls for Trust Signal types in Bottom Panel.

---

## Phase 19: The Pop-up Engine (Overlay & Teaser)
**Objective**: Create a comprehensive popup creation system.

### 1. Layer Architecture (Navigator)
- **New UI**:
  - **Navigator Panel**: A Left Rail panel added to `DesktopPanelSystem`.
  - **Layers Tab**: A switch to toggle view between "Page" and "Pop-up Overlay".
- **Logic**:
  - `viewLayer` state ('page' | 'popup').
  - Separated `pageBlocks` vs `popupBlocks` arrays.
  - **Dimming**: When "Pop-up" is active, main page content is dimmed and inert; Popup content is fully interactive with DnD.

### 2. Teaser & Trigger System
- **New Component**: `Multi21_PopupWrapper.tsx`.
- **Features**:
  - **Teaser Mode**: A small "Launcher Pill" (e.g., "Chat with us") that expands into the modal.
  - **Triggers**: Exit Intent, Timer, Scroll, Manual (Teaser).
- **Tool Mapping**:
  - `popup.trigger`: Enum ('exit', 'timer', 'scroll', 'manual_teaser').
  - `popup.teaser_text`: String.
  - `popup.teaser_position`: Enum ('bottom_left', 'bottom_right').
  - `popup.overlay_opacity`, `popup.position`.
- **UI Elements**:
  - **Teaser Settings**: Inputs for Teaser Text and Position buttons in Bottom Panel.
  - **Teaser Pill**: The actual rendered launcher button in the preview.

### 3. Data Attribution (The "Spy")
- **New Component**: `HiddenAttributionFields.tsx`.
- **Logic**: Automatically reads URL search params (`utm_source`, `utm_medium`, `gclid`) and `document.referrer`.
- **Output**: Renders `<input type="hidden">` fields injected into the layout for form capture.
