## Colour usage

- Spacer is transparent and inherits parent surfaces; no fill or text colour tokens apply.
- Default state: [NO COLOUR]. Do not attach strokes unless debug is enabled.
- Optional debug outline may reference `spacer_debug_outline_stroke` token pointing to an existing semantic stroke that maintains contrast on the black base.
- Keep colour hooks isolated so layout-only usage stays visually neutral.

