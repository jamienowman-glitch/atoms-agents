## State map for text roles

- Links: default = `text_link`; hover = `text_link_hover`; pressed = `text_link_pressed`; focus uses `focus_ring` from colour scheme, not text colour change.
- Error/Success: stick to `text_error`/`text_success`; avoid hover shifts.
- Disabled: `text_disabled` + opacity token; do not drop below 3:1 contrast on dark base.
- Inherit surface-aware variants for light schemes; ensure tokens have inverted counterparts.
