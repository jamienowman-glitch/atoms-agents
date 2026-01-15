## Schema: layout_spacer_block

- `id` (string, required) – unique spacer instance id.
- `size_token` (enum: xs | sm | md | lg | xl, required) – default height reference tied to spacing tokens.
- `breakpoint_overrides` (object, optional) – `{ mobile?, tablet?, desktop? }` each mapping to a `size_token` enum to adjust height per breakpoint (e.g., shrink on mobile).
- `density_modifier` (enum: compact | comfortable | none, optional) – shifts size up/down according to density tokens rather than raw pixel values.
- `tracking_id` (string, optional) – layout-level identifier only; not used for analytics events.
- No PII or raw pixel values; schema carries ids and token refs only.

