## Guardrails

- Do not log literal colour values; use token ids only.
- Suppress events during initial hydration unless a change occurs.
- Gate non-essential events on consent (GDPR/CCPA); operational logs may omit UTMs if consent is false.
- No PII in payloads; context bag limited to UTMs/ref/click_id.
