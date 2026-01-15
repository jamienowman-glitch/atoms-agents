## Semantics

- Header rendered as a button (or button-like element) with `aria-expanded` and `aria-controls` pointing to the body id.
- Body region uses `role="region"` (optional) with `aria-labelledby` pointing to the header id for clear association.
- If multiple accordions in single-open mode, ensure the parent grouping has an accessible label describing the set (e.g., `aria-label="FAQ"`).
- Chevron/indicator is decorative and should be `aria-hidden="true"`.

