## Default values and ranges

- Typography: `accordion_header_typography` → theme preset `tokens.typography.heading_sm`; `accordion_body_typography` → `tokens.typography.body_md`; text transform `none`.
- Layout: header padding x/y use spacing scale mid values (e.g., `spacing_md`); body padding slightly larger on y. Divider inset defaults to `0` (flush). Radius uses `radius_sm` from theme_card_surface tokens. Item gap uses `spacing_sm` desktop, `spacing_xs` mobile.
- Icons: chevron size `icon_sm`, padding `spacing_xs`, rotation expanded `180deg`. Offset `0` by default.
- Colours: header/body text inherit primary/secondary text tokens on black base; chevron matches header text; divider uses neutral stroke on dark; hover/pressed use subtle overlay tokens; focus ring references global focus token.
- Behaviour: `accordion_mode` default `multi`; `accordion_start_open` false; `accordion_animation_duration` 150–200ms; ease `standard_decouple` token; reduced motion flag follows system preference.
- Tracking: tracking_id/view_id optional and pass-through; no defaults required.
- Ranges: padding may vary within spacing scale; radius within theme radius scale; animation duration 0ms–250ms with reduced motion forcing 0ms.

