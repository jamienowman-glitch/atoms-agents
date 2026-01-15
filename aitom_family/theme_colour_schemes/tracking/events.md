## Events

- `colour_scheme_selected`
  - Payload: `scheme_id`, `previous_scheme_id`, `source` (user/template/api), `tracking_id/view_id`, `context` (UTMs/ref/click_id), `consent_granted` (bool).
  - Fire on explicit user selection only; suppress on initial hydrate.
- `colour_scheme_applied`
  - Payload: `scheme_id`, `surface` (app/page id), `breakpoint`, `density`, `tracking_id/view_id`, `context`, `consent_granted`.
  - Fire after tokens applied without visual flicker.
