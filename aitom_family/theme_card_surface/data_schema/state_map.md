## State map schema

- `states` per variant:
  - `default`: { surface, stroke, elevation }
  - `hover`: { surface, stroke, elevation }
  - `pressed`: { surface, stroke, elevation }
  - `focus`: { surface, stroke, focus_ring }
  - `selected`: { surface, stroke, elevation }
  - `disabled`: { surface, stroke, elevation, opacity }
- Badge may have state overrides (optional).
- All references are token ids; no literal colour or pixel values.
