## Toggle behaviour

- Header acts as a button; click/tap or Enter/Space toggles `expanded`.
- Apply `aria-expanded` on the header and `aria-controls` pointing to the body id; body uses `aria-labelledby` pointing back to the header.
- Modes: `accordion_mode` token chooses `single` (auto-closes siblings) or `multi` (independent). Logic uses token rather than hardcoded behaviour.
- `start_open` token controls initial expanded state; preserve state when data updates unless explicitly reset.
- Prevent layout jump by animating height/opacity only when reduced motion is off; otherwise snap open/closed.
- Chevron rotation is tied to expanded boolean; icon not focusable.

