## Default values and ranges

- `default_scheme_id`: `dark_base`
- Dark base defaults:
  - Surfaces: primary=#000, secondary=#0d0d0d, overlay=rgba(0,0,0,0.6)
  - Text: primary=#fff, secondary=#dcdcdc, disabled=rgba(255,255,255,0.4)
  - Strokes: primary=#fff, subtle=rgba(255,255,255,0.2)
  - Accent primary=#fff, secondary=#bfbfbf
  - Button fill=#fff, button text=#000, outline=#fff
  - Focus ring=#fff
  - Status: error=#ff4d4f, success=#4caf50, warning=#f5a524
  - Overlays: backdrop=rgba(0,0,0,0.5), glow=rgba(255,255,255,0.12)
  - Opacity disabled=0.4, hover lift=0.08
- Inverted/light variant suggested: surfaces light, text dark with equivalent contrast.
- Ranges: keep opacity between 0–1; ensure contrasts ≥4.5:1 for body text; allow full override by builder.
