## State map schema

- `states` object per scheme:
  - `default`: { surface, text, stroke }
  - `hover`: { surface, text, stroke }
  - `pressed`: { surface, text, stroke }
  - `disabled`: { surface, text, stroke, opacity }
  - `focus`: { surface, text, stroke, focus_ring }
  - `error`: { surface, text, stroke }
  - `success`: { surface, text, stroke }
- Button-specific overrides allowed under `button_states`.
- All fields reference token ids; ensure serializer strips literal colour values.
