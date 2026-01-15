## Spacing

- Internal gaps: `card_gap_media_text`, `card_gap_text_blocks`.
- Compact vs comfortable: scale padding and gaps via density tokens; keep consistent across breakpoints.
- Section spacing: rely on parent layout tokens; card itself should not add external margins beyond optional `card_stack_gap` when composing multiple cards.
- Ensure media overlays/badges sit within padding without reducing text space.
