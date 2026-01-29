# Harness Tool Surfaces Spec (Draft)

This document captures the current "golden" harness behavior target. It is intentionally detailed so agents stop reinventing tool areas and instead map new canvas behavior into stable slots.

## Scope
- Applies to all harnesses and canvases unless an explicit exception is approved (e.g., HAZE).
- Tool surfaces are fixed; canvases change inside them.
- Canvas-agnostic harness behavior is the default.

## 1. ChatRail (Mobile)
- ChatRail must be full-screen on mobile and anchored at the bottom.
- It must preserve its four modes and the existing open/close behavior (chevron).
- The ChatRail header uses curved edges; any child panel must respect this curvature.

## 2. ToolPop (Collapsible)
Purpose: "Area 51" for context-aware tools with dual magnifiers.

### Placement and Trigger
- ToolPop is attached to the top edge of the ChatRail (not the bottom of the screen).
- It appears when a tool icon at the top of the ChatRail is tapped.
- The ToolPop panel must pop from within the curved top of the ChatRail, not as a square overflow.

### Structure
Left column: left magnifier (category list).
- Slot 1 is reserved for UI atom-specific controls (contextual to the selected atom).
- Slots 2+ are canvas harness categories and should be stable across canvases.

Right column: context-aware controls based on left magnifier selection.
- Globally: variable font tooling always maps to the same sliders.
- Color category always exposes background, text, and foreground controls.

Default category order (unless an exception is approved):
1) Color
2) Font
3) Type
4) (One more stable category; confirm from golden example)

## 3. ToolPill (Collapsible)
Purpose: add elements into the canvas (clips, copy, items).

Rules:
- Do not duplicate or rebuild the ToolPill; reuse the canonical one.
- Default presentation is a vertical lozenge that collapses to a small floating button.
- Long-press opens a horizontal lozenge attached to the vertical pill (category select).
- Icons only. No text labels for the primary control set.

## 4. Atom Flip (Collapsible)
Purpose: deep controls when flipping a UI element (e.g., SEO/UTM).
- This is a harness-level concept, not a per-atom component.
- Always available in the harness with stable placement.

## 5. TopPill (Collapsible)
Purpose: mix of space, canvas, and surface controls.

Behavior:
- Tapping/triggering the TopPill opens a right-side panel for canvas harness controls.
- This panel sets the editing viewport (not viewing mode).
  - Video: 4:3, 9:16, 16:9, 1:1, 4:5
  - Images: 1080x1080, 1080x1350, 1080x1920, 1920x1080, 1600x1200
- Export opens a right drawer.
- Settings opens a right drawer for SEO/page settings (slug, metadata).
- Set asset ownership: which site the asset belongs to; can link to campaigns.
- For video/image, set SEO-friendly filename.

Center of TopPill:
- Live temperature measurement for the current space (wired to engine).

Left of TopPill:
- Abbreviation indicates current surface.
- When expanded, show suggested "edge flow" and scheduling entry for the current flow.
- Edge flow can trigger the current flow from a completion event in another flow.

## 6. TopPill Expand (Full Header)
- Double-click (or equivalent) expands to full header (exists in Multi21 golden).
- Left hamburger: surface-level navigation (homepage, flows list).
- Suggested flows can appear below (stub allowed for now).

## 7. ChatRail Inline Actions
- Under each agent message, show a row of icons (left-aligned).
- Most icons can be stubbed until backing services are ready.

## 8. Space-Level Tools (ChatRail Settings)
- A settings button on the left side of ChatRail opens a panel for space-level tools.
- This is separate from ToolPop.
- Large icon buttons:
  - HAZE
  - MAYBES
  - ACTIVE BI
  - AGENTSEND
- These launch separate worlds (exit current canvas).

## 9. Inline Text Editing
- Inline text editing must work across canvases.
- Click text in the canvas to edit in-place.

