## Roles and labels

- Card surface itself is structural; when interactive, parent should set `role="button"` or `link` with clear `aria-label`.
- Focus ring must respect radius and stroke; ensure 3:1 contrast against background.
- Announce state changes (selected/disabled) via `aria-pressed` or `aria-disabled` when applicable.
