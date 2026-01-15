## Responsive behaviour

**Purpose**: describe alignment, padding, and full-bleed behaviour per breakpoint.

- Breakpoints: mobile/tablet/desktop follow 24-column spans from `grid_span_*` tokens. Container width clamps to theme_layout_settings container width unless `full_bleed=true`.
- Padding: apply per-side padding tokens that adjust with density (compact/comfortable). Padding changes are discrete (no animated tween) and respect safe-area inset tokens on mobile.
- Alignment: support start/center/stretch alignment tokens; alignment never reorders children. Center alignment recenters content within the measured span without affecting grid gutters.
- Full bleed: when enabled, drop outer margins while maintaining internal padding/gap and 24-column internal alignment; disable any hover animation that would shift content at the edges.
- Density switching: compact reduces padding and gap by tokenized ratio; comfortable restores defaults. Switches are instant on breakpoint/density changes to avoid reflow flicker.
