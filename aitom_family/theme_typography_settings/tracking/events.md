## Events

- `typography_theme_selected`
  - Payload: `typography_theme_id`, `source` (user/template/api), `tracking_id/view_id`, `context` (UTMs/ref/click_id), `consent_granted`.
- `typography_preset_applied`
  - Payload: `typography_theme_id`, `preset_ids` (array), `breakpoint`, `density`, `tracking_id/view_id`, `context`, `consent_granted`.
- Suppress both on initial hydration unless user changes selection.
