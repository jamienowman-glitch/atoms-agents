## Colour schemes palette

Define 2–4 schemes as token sets; defaults assume dark base.

- Shared fields per scheme:
  - `surface_primary`, `surface_secondary`, `surface_overlay`
  - `text_primary`, `text_secondary`, `text_disabled`
  - `stroke_primary`, `stroke_subtle`
  - `accent_primary`, `accent_secondary`
  - Buttons: `button_fill`, `button_fill_hover`, `button_outline`, `button_text`
  - Focus: `focus_ring`
  - Status: `error`, `success`, `warning`
  - Overlays/glow: `overlay_backdrop`, `glow`
- Start with baseline scheme: black surfaces, white text, white strokes, accent = white or subtle grey.
- Provide light/inverted scheme option: light surface, black text; ensure focus ring remains visible.
- All values are semantic tokens; no hardcoded hex outside defaults.
