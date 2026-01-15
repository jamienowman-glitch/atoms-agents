## Elevation rules

- Tokens:
  - `card_elevation_default`
  - `card_elevation_hover`
  - `card_elevation_pressed`
  - `card_elevation_selected`
  - `card_glow_colour`
  - `card_glow_blur`
- Elevation changes are purely visual (shadow/glow); no positional shift. On black base, prefer glow-style elevation over drop shadow.
- Reduce or disable elevation for compact density if needed.
- Motion: optional short transition (≤120ms) on elevation changes, disabled when prefers-reduced-motion.
