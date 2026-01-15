## Accessibility behaviour

- Render the spacer as a non-semantic block with `aria-hidden="true"` and optionally `role="presentation"` so it is skipped by assistive tech.
- Keep the spacer unfocusable (no `tabindex`); ensure debug wrappers inherit the same aria-hidden treatment.
- Avoid announcing spacer size or debug labels; spacing changes should not create focus traps or scroll jumps.

