## Guardrails

- Require consent for non-essential toggle analytics; defer/skip if consent not granted.
- Do not log `title_ref` or `body_ref` contents, user inputs, or messages; ids only.
- Ensure events are deduped to avoid flooding on rapid open/close; throttle if necessary.
- Respect reduced motion: if animations are disabled, still emit toggle events but avoid tagging animation state.
- UTM/context data stays within `context` bag; never at top-level fields.

