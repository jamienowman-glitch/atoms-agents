## Interaction states

- Default: collapsed header, chevron pointing down/right per token, body hidden.
- Hover: header background/underline token optional; do not shift layout; chevron colour may brighten.
- Focus: visible focus ring token around header; keep padding stable.
- Pressed/active: subtle state via tokenized overlay; trigger toggle on release/keyboard activation.
- Disabled (if supplied): header non-interactive, aria-disabled, focus removed; chevron dimmed; body remains in last state but hidden when disabled is true.
- Expanded: chevron rotated by tokenized angle; body visible with spacing tokens; divider above/below optional.

