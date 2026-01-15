## Spec examples

`typography_theme_selected`
```json
{
  "event": "typography_theme_selected",
  "typography_theme_id": "roboto_flex_default",
  "source": "user",
  "tracking_id": "view_theme_panel",
  "context": {
    "utm_source": "email",
    "utm_medium": "newsletter",
    "utm_campaign": "theme_refresh"
  },
  "consent_granted": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

`typography_preset_applied`
```json
{
  "event": "typography_preset_applied",
  "typography_theme_id": "roboto_flex_default",
  "preset_ids": ["h1", "body_md", "button"],
  "breakpoint": "desktop",
  "density": "comfortable",
  "tracking_id": "view_home",
  "context": {},
  "consent_granted": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```
```
