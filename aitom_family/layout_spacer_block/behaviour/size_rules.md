## Spacer sizing behaviour

- Spacer is passive; no pointer or keyboard interaction.
- Height comes from `spacer_size_{xs|sm|md|lg|xl}` tokens mapped to the layout spacing scale; default uses the schema-provided size token.
- Breakpoint overrides (`spacer_size_mobile/tablet/desktop`) can shrink or expand relative to default; mobile may step down one size instead of collapsing.
- Density handling: `spacer_density_modifier` tokens map compact to a reduced height and comfortable to base/expanded height without hardcoded pixels.
- Clamp behaviour via `spacer_min_height`/`spacer_max_height` tokens to avoid extremes on very small or tall viewports.
- Spacer spans container width with no gutters or padding changes; surrounding blocks own their spacing.

