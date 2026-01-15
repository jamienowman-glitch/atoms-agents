## Structure

- Padding tokens: `card_padding_compact`, `card_padding_comfortable` (applied uniformly with radius-safe inset).
- Radius tokens: `card_radius_sm/md/lg`; stroke placement token (`inside` | `center` | `outside`) defaults to outside to preserve content space.
- Elevation bounds: `card_elevation_max` to prevent excessive glow spread.
- Width/height follow parent 24-column spans; no fixed pixel widths.
- Badge/focus ring must respect radius and not clip content.
