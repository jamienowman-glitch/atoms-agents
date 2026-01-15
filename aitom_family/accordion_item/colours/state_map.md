## State map

- Hover: `accordion_header_background_hover`, `accordion_header_text_hover`, `accordion_chevron_colour_hover`.
- Focus: `accordion_header_focus_ring` token; background remains stable to avoid layout shift.
- Pressed/active: `accordion_header_background_pressed`, `accordion_chevron_colour_pressed`.
- Expanded: `accordion_header_background_expanded`, `accordion_chevron_colour_expanded`, optional `accordion_divider_stroke_expanded`.
- Disabled: `accordion_header_text_disabled`, `accordion_chevron_colour_disabled`; background unchanged.
- All tokens reference semantic colour roles; avoid opacity hacks on text that break contrast.

