## State map

- Map states to tokens per scheme:
  - Default: `surface_primary`, `text_primary`, `stroke_primary`.
  - Hover: `surface_hover`, `text_primary`, `stroke_primary` (subtle lift).
  - Pressed: `surface_pressed`, `text_primary`, `stroke_primary`.
  - Disabled: `surface_disabled`, `text_disabled`, `stroke_subtle`, lowered opacity token.
  - Focus: `surface_primary`, `text_primary`, `stroke_primary`, `focus_ring`.
  - Error/Success: reuse `error`/`success` + state overlays.
- Include button-specific mapping: fill + outline variants per state using button tokens.
- Ensure every scheme defines these tokens; fallback to baseline if missing.
