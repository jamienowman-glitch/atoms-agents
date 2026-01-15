## Focus handling

- Focus ring sits outside stroke; use `card_focus_ring_colour` and `card_focus_ring_width` tokens.
- Maintain radius alignment with card corners; ring should not clip content.
- No animation on focus; instantaneous render for accessibility.
- When card contains nested CTAs, parent surface focus should be independent; child focus should not trigger surface state changes.
