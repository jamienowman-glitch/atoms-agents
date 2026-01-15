## Typography presets

- Header preset: Roboto Flex token `tokens.typography.accordion.header` with slightly heavier/condensed feel; supports optional uppercase toggle via `accordion_header_text_transform`.
- Body preset: reuse rich text body token `tokens.typography.accordion.body` aligned to theme body copy for readability.
- Both presets inherit colour from colour tokens; no inline colour overrides here.
- Preserve line-height tokens for comfortable/compact density; allow truncation tokens on header only if provided by parent.

