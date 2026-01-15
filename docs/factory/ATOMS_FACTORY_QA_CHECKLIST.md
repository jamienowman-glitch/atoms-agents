# Atoms Factory QA Checklist

- [ ] 10-bucket structure present (`behaviour/layout/views/typography/colours/icons/data_schema/tracking/accessibility/exposed_tokens`).
- [ ] `exposed_tokens/schema.ts` matches UI_ATOM_TOKEN_CONTRACT token groups; NA groups explicitly `{status:"NA",reason:"…"}`.
- [ ] `exposed_tokens/default.ts` (or per-group default files) populate every token path; no blanks.
- [ ] Typography uses Roboto Flex preset with axis map + constraints; Responsive wrapper applied.
- [ ] Layout covers flow + freeform (positioning/transform/z-index/constraints) with Responsive overrides.
- [ ] Media tokens present for media-capable atoms (asset_ref, alt_text required, focal/crop/fit/mask/aspect).
- [ ] Tracking tokens populated (analytics_event_name, conversion_goal_id, platform_tags, utm_template/utm_defaults); no clickables without tracking.
- [ ] Accessibility tokens set (role/label/tab_index/aria/focus order; alt text non-empty for images).
- [ ] Data binding bucket set (status ENABLED/DISABLED/NA with reason); sanitizer present when enabled.
- [ ] Constraints defined (allowed_edits, allowed_children, numeric min/max, token_surface_hints).
- [ ] Controls metadata present for editor surfaces; capabilities_flags set.
- [ ] Views render only from tokens (no hidden props) and honor Responsive overrides.
- [ ] Registry output lists versioned type_id, schema, defaults, controls, slots; matches stored files.
- [ ] Tests/linters (to be authored) pass for schema completeness and NA enforcement.
