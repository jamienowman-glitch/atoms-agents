## Interaction (edit mode)

**Purpose**: define edit-mode affordances without affecting layout.

- Passive by default; grid itself is not focusable in view mode.
- Edit mode: outline grid bounds on hover with a 1px tokenized stroke; focus ring appears outside gutter area when grid is selected. No padding change on hover/focus.
- Selection: clicking the grid in builder selects container; children remain individually selectable; outlines never overlap child focus rings.
- Keyboard: when grid is selected, arrow keys cycle focus across children in DOM order; Enter opens child edit controls; Escape clears grid selection.
- Reduced motion: disable any animated outline fade; use instant opacity toggles to respect prefers-reduced-motion.
