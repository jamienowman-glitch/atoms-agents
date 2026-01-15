## Spec examples

- Toggle example:
  - Event: `accordion_toggle`
  - Payload: `{ accordion_id: "faq_block", item_id: "shipping", expanded: true, mode: "single", tracking_id: "trk_123", view_id: "view_abc", context: { utm_source: "email", ref: "spring" }, consent_required: true }`
- Initial state example (optional):
  - Event: `accordion_initial_state`
  - Payload: `{ accordion_id: "faq_block", item_id: "returns", initial_expanded: false, mode: "multi", tracking_id: "trk_123", view_id: "view_abc", context: { utm_medium: "cpc" }, consent_required: true }`

