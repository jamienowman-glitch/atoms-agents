## Animation

- Expand/collapse timing driven by `accordion_animation_duration` and `accordion_animation_ease` tokens.
- Animate height/opacity of the body and chevron rotation; respect `prefers-reduced-motion` by reducing duration to zero and skipping easing when reduced.
- Stagger is not used; all transitions happen together to avoid desync with layout.
- Keep animations transform-only for the chevron; avoid translating text to prevent blur.

