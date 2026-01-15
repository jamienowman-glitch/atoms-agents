## Schema: theme_colour_schemes

Shape:
- `default_scheme_id` (string, required)
- `schemes` (array, min 2)
  - `scheme_id` (string, required)
  - `name` (string, required, display only)
  - `surfaces`: `primary`, `secondary`, `overlay`
  - `text`: `primary`, `secondary`, `disabled`, `inverse` (optional)
  - `strokes`: `primary`, `subtle`
  - `accents`: `primary`, `secondary`
  - `buttons`: `fill`, `fill_hover`, `fill_pressed`, `outline`, `text`
  - `focus`: `ring`
  - `status`: `error`, `success`, `warning`
  - `overlays`: `backdrop`, `glow`
  - `opacity`: `disabled`, `hover_lift` (optional)
- No PII; values reference tokens (e.g., `colour.surface.primary.dark`) not literal hex.
- Validation: all required keys per scheme; fallback to baseline defaults if missing.
