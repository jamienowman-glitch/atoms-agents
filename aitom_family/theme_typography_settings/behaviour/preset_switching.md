## Preset switching

- Presets bound to roles (h1–h6, body-lg/md/sm, label/meta, button, caption/overline).
- Switching can occur per breakpoint/density: apply token sets atomically on breakpoint change; avoid mid-frame flashes.
- Keep Roboto Flex family constant; only axis/size/line-height tokens change.
- When user selects a preset pack, broadcast typography change event with typography_theme_id, affected presets, breakpoint, density, tracking_id/view_id, UTMs.
- Respect reduced motion: no animated font-size transitions; only allow instant swaps.
