## Contrast and high-contrast guidance

- All text on dark surfaces should meet WCAG AA: 4.5:1 for body/meta, 3:1 for large headings. Baseline tokens should target ≥7:1 on dark mode.
- Provide `high_contrast_variant` token set per scheme that boosts text and stroke contrast and dims overlays.
- Avoid using accent-only indicators; pair selection with stroke/focus ring.
- Ensure focus ring contrast against both dark and light variants (use neutral bright ring rather than accent).
- Test disabled states to remain distinguishable without dropping below 3:1 against surfaces.
