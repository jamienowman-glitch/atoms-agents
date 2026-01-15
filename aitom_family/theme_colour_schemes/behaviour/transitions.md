## Scheme transition timings

- Default transition: instant swap for surfaces/text/strokes; optional short fade (`transition_duration_scheme_change`) for backgrounds only when `prefers-reduced-motion` is false.
- Easing token: `transition_ease_scheme_change` (recommend ease-out). Keep duration under 120ms to avoid perceived flicker.
- Disable animations entirely when reduced motion is on or during initial hydration.
- Do not animate focus rings/unread badges; they should snap to new colours for accessibility.
- Apply transitions via tokens so builder can tune or disable globally.
