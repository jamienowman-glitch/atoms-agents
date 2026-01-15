## Breakpoint overrides

- Optional object per preset:
```json
{
  "mobile": { "size_px": 16, "opsz": 16 },
  "tablet": { "size_px": 18, "opsz": 18 },
  "desktop": { "size_px": 20, "opsz": 20 }
}
```
- Allowed fields: `size_px`, `line_height`, `tracking`, `opsz`.
- Validation: clamp within safe ranges per role (e.g., body_sm 13–15px); reject values that break contrast/legibility.
- Applied atomically on breakpoint change; avoid per-character animations.
