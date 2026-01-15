## Schema: theme_typography_settings

- `typography_theme_id` (string, required)
- `presets` (array):
  - `id` (string)
  - `role` (enum: h1–h6, body_lg/md/sm, label, meta, button, caption, overline)
  - `font_id` (string, default Roboto Flex)
  - `axis_tokens` { wght, wdth, slnt, opsz, tracking, line_height }
  - `size_px` (number) optional if not derived from opsz
  - `text_transform` (string, optional)
  - `breakpoint_overrides` (object, optional)
- `default_preset_map` (role → preset id)
- No content strings; IDs/tokens only.
