## State rules

**Purpose**: define behaviour for decorative vs labeled dividers.

- Default: decorative, aria-hidden, non-focusable; renders stroke using tokenized thickness/style; no hover/focus changes.
- Labeled/interactive: when a label link/button is supplied, make the label focusable; divider line itself stays passive. Hover/focus affects label only and uses focus ring tokens that sit outside the label padding.
- Disabled: optional state for interactive labels; keeps line visible but label non-focusable with reduced opacity token while preserving contrast.
- Reduced motion: no animated stroke transitions; state changes are instant opacity/colour swaps to avoid layout shift.
