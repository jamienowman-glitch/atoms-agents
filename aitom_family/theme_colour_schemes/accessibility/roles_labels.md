## Roles and labels

- Scheme picker semantics: prefer `role="radiogroup"` with `radio` items; alternatively `listbox` + `option`.
- Each scheme gets `aria-label` including name and contrast note (e.g., “Dark Base – high contrast”).
- Selected scheme announces via `aria-checked="true"`; keep additional text markers (check icon) for non-colour cues.
- Focus ring must use high-contrast token; ensure visible on both dark and light swatches.
