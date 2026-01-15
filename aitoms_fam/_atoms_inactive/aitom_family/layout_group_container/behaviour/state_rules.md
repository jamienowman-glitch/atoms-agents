## State rules

**Purpose**: define default, editable, and disabled container behaviour.

**Default**:
- Structural wrapper only; no hover/focus outline unless edit mode toggled on via tokens.
- Applies padding, gap, and background/stroke tokens without animation; respect reduced-motion by avoiding layout shifts on hover.

**Editable/focusable mode**:
- When `is_editable` token is true, show subtle hover outline and focus ring outside stroke; ring uses layout focus tokens from theme_layout_settings.
- Selection/focus does not alter padding or child layout; do not block child focusable elements.

**Disabled/locked**:
- Locked container keeps layout but disables hover/focus; apply reduced opacity token while ensuring text contrast remains within WCAG.
- Full-bleed toggle is frozen when locked; block alignment/padding changes until unlocked.
