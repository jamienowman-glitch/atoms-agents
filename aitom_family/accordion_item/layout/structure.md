## Structure

- Header occupies full 24-column span of its parent; padding via `accordion_header_padding_x`/`accordion_header_padding_y` tokens.
- Body uses `accordion_body_padding_x`/`accordion_body_padding_y` tokens; aligns text to header start edge.
- Divider placement token `accordion_divider_inset` controls stroke inset relative to parent container; default flush to container span.
- Radius token `accordion_radius` applied to outer wrapper; expanded body shares same radius to avoid seams.
- Chevron alignment uses `accordion_chevron_offset` token to keep icon and text aligned without hardcoded pixels.

