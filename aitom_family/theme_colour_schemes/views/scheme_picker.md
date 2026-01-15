## Scheme picker view

- Default presentation: swatch + label list on black base.
- Desktop: grid of swatches (2–4 per row) within 24-column span; mobile: single-column stack with generous tap targets.
- Each item shows selected state via stroke + check icon + focus ring; hover/pressed states use state_map tokens.
- Include optional contrast note per swatch using `scheme_label` preset.
- Respect focus order top-to-bottom, left-to-right; ensure keyboard navigation mirrors visual order.
