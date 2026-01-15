## Chevron icon

- Default icon: `icons/chevron-down.svg` (token `accordion_chevron_icon_ref`); allow swapping via token without changing layout.
- Size token: `accordion_chevron_size` tied to icon scale; align vertically centered in header.
- Colour token: `accordion_chevron_colour` with state overrides for hover/focus/expanded.
- Rotation: `accordion_chevron_rotation_expanded` (default 180deg) animated via behaviour tokens; respect reduced motion by snapping when needed.
- Padding/alignment: use `accordion_chevron_padding` token to set spacing from header text; no hardcoded pixels.

