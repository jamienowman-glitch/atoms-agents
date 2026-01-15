## Density switching

- Density presets: `compact` and `comfortable` controlled via tokens for padding, vertical rhythm, and gutter deltas; defaults come from theme settings.
- Switching rules: changes triggered by template toggle or user setting should flip padding/gutter tokens atomically before render; avoid mid-frame mix states.
- Breakpoint awareness: allow separate density per breakpoint, but keep 24-column spans unchanged; only padding/vertical gaps scale.
- Analytics: when density changes, emit layout change event with layout_id, density, breakpoint, tracking_id/view_id, and UTMs; suppress duplicates during initial hydration.
- Reduced motion: no animated transitions between densities; if motion tokens exist, gate them behind prefers-reduced-motion checks and keep duration near-zero otherwise.
