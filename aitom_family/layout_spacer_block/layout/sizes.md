## Spacer sizing

- Spacer fills the available width within the parent 24-column span; no horizontal padding or offsets are applied.
- Vertical height is driven by `spacer_size_{xs|sm|md|lg|xl}` tokens mapped to the theme spacing scale; default points to `spacer_size_md`.
- Breakpoint tokens `spacer_size_mobile`, `spacer_size_tablet`, and `spacer_size_desktop` override the base size when provided; otherwise inherit default.
- Density tokens `spacer_density_modifier` shift height up/down one step within the size scale for compact vs comfortable layouts rather than using raw pixels.
- Clamp tokens `spacer_min_height` and `spacer_max_height` keep spacing within safe bounds so mobile stacks do not collapse or balloon.
- Optional mobile reduction is handled by selecting a smaller token for the mobile breakpoint when sections stack; never drop below the minimum height token.
- Spacer carries zero intrinsic padding or gutters; neighbouring blocks manage vertical rhythm with their own spacing tokens.

