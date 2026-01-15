## Responsive rules

**Purpose**: how columns collapse/expand per breakpoint.

- Column counts driven by `column_count_{mobile,tablet,desktop}` tokens; children inherit `span_*`/`offset_*` tokens and clamp to the available count.
- Mobile: defaults to 1–2 columns; wrap in DOM order with row gaps token; avoid horizontal scroll. Tablet: 2–3 columns; Desktop: 3–5 depending on token.
- Wrapping: when span exceeds available columns, force wrap and reset offset to zero; no animated reflow—changes apply instantly.
- Equal height: if `equal_height=true`, match column heights per row using CSS grid row track sizing; respect reduced motion by skipping animated height transitions.
- Dividers: optional column dividers follow gutter inset tokens; appear at all breakpoints when enabled; do not shrink gutters on activation.
