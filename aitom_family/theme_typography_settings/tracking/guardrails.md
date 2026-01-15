## Guardrails

- No text content logged; only preset/theme ids and context.
- Gate non-essential events on consent; if consent is false, drop UTMs but keep operational logs minimal.
- Do not emit during hydration unless user changes settings.
- Avoid sending axis numeric values in analytics; reference token ids instead.
