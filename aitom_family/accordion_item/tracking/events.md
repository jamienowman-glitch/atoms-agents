## Events

- `accordion_toggle`
  - Payload: `accordion_id` (string), `item_id` (string), `expanded` (boolean), `mode` (single|multi), `tracking_id` (string, optional), `view_id` (string, optional), `context` (UTM/ref/click_id bag), `consent_required` (boolean).
  - Fire on user-initiated toggle (click/tap/keyboard). Do not emit on purely programmatic state sync unless surfaced as user-visible change.
- Optional: emit `accordion_initial_state` when rendering if analytics requires baseline; same payload minus `expanded` transition (use `initial_expanded` instead) and only when consent allows.
- Never include title/body text or content snippets; ids only.

