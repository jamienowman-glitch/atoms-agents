## Responsive rules

**Purpose**: inset/margin adjustments per breakpoint.

- Breakpoints inherit spacing from layout tokens: desktop/tablet/mobile margin-above/below tokens scale down on smaller screens; values apply instantly without animation.
- Inset handling: when `inset=true`, align stroke to the 24-column grid with left/right insets matching container padding; on mobile, reduce inset to avoid edge crowding while respecting safe areas.
- Full-bleed contexts: if parent is full-bleed, allow divider to extend edge-to-edge only when inset flag is off; otherwise keep inset consistent with section padding.
- Label placement: label (if present) sits on the stroke with padding that scales by breakpoint; never forces multi-line wrapping that would break the divider line.
