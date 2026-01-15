## State map

**Purpose**: define grid states for editing contexts.

- Default: structural grid with gutters and row gaps applied; non-focusable; no outlines.
- Hover (edit mode): light outline around grid bounds; no child offsets or padding changes; column divider visuals remain constant.
- Focus (edit mode): focus ring outside gutters; optional handle to toggle dividers; maintains column sizing.
- Locked: grid layout frozen; editing controls disabled; hover/focus outlines removed; children still render with their spans.
- Disabled: grid hidden from interaction; still renders layout but ignores pointer/keyboard and does not emit tracking.
