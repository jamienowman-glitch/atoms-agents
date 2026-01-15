## Interaction state mapping

- Map semantic states to scheme tokens: `default`, `hover`, `pressed`, `focus`, `disabled`, plus `error` and `success` variants.
- Buttons/CTAs: use fill/outline tokens per state; ensure focus ring token remains legible on both dark/light scheme variants.
- Text links: apply link/base tokens with hover/pressed adjustments; disabled uses secondary text with reduced opacity token.
- Badges/alerts: route error/success/warning states to dedicated tokens; avoid reusing accent tokens.
- Ensure every state token exists for each scheme; if missing, fall back to default scheme values and log a soft warning (no visual flash).

