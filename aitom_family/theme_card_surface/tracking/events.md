## Events

- `card_surface_variant_selected`
  - Payload: `surface_id`, `variant_id`, `source` (user/template), `tracking_id/view_id`, `context` (UTMs/ref/click_id), `consent_granted`.
- `card_surface_state_previewed`
  - Payload: `surface_id`, `variant_id`, `state` (hover/pressed/focus/selected/disabled), `tracking_id/view_id`, `context`, `consent_granted`.
- Avoid emitting during initial load unless user triggers preview/selection.
