## State behaviours

- Default: flat surface, base stroke, no elevation.
- Hover: optional slight elevation/glow token; brighten stroke subtly; no layout shift.
- Pressed: reduce elevation, darken fill using pressed token.
- Focus: add focus ring outside stroke; do not alter layout metrics.
- Selected/active: lock elevated/outlined state; persist until deselected.
- Disabled: lower opacity token, keep stroke visible enough for contrast; no hover/press response.
