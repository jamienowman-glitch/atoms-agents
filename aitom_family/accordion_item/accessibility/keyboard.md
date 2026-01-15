## Keyboard interaction

- Header supports Enter and Space to toggle expanded state; ensure Space prevents page scroll.
- Tab focus lands on the header; chevron remains unfocusable.
- Focus ring uses tokenized outline; maintain visible indication on dark base.
- Reduced motion: when active, skip animated height transitions but keep keyboard behaviour identical.
- In single-open mode, moving focus between headers should not auto-collapse; only explicit toggle changes state.

