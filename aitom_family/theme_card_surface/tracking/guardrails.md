## Guardrails

- Do not log card content or media; only surface/variant/state ids.
- Gate non-essential events on consent; drop UTMs if consent is false.
- Avoid emitting during hydration unless a user action occurs.
- Use token ids instead of colour/shadow numeric values in analytics.
