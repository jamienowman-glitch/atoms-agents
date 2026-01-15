## Scheme picker layout (if surfaced)

- Picker aligns to 24-column grid; default span: 24/24 mobile, 12/24 tablet, 8/24 desktop (override via parent).
- Swatch list tokens:
  - `swatch_size`
  - `swatch_gap`
  - `swatch_padding`
  - `label_gap`
- Alignment: left-aligned swatches with optional two-column layout on desktop; single column on mobile.
- Respect outer margins from `theme_layout_settings`; if embedded in settings sidebar, inherit sidebar padding tokens.
- If no picker UI is shown, note [NO LAYOUT] beyond token exposure and consuming atoms apply scheme via config.
