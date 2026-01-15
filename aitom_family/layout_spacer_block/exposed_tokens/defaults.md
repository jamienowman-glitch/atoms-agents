## Default values and ranges

- `spacer_size_default`: `md` mapped to the mid-scale spacing token from theme_layout_settings.
- Breakpoint defaults inherit the base size; recommended mobile override may step down to `sm` when sections stack tightly.
- `spacer_density_modifier`: `none` by default; compact reduces one size step, comfortable keeps base height.
- `spacer_min_height`: align with the smallest vertical spacing token; never zero unless explicitly set for collapsed variants.
- `spacer_max_height`: do not exceed `xl` scale to avoid oversized gaps on mobile; allow builder override within spacing scale only.
- `spacer_debug_outline_enabled`: false; when true, use `spacer_debug_outline_stroke` referencing the semantic stroke used for layout debugging on the black base.

