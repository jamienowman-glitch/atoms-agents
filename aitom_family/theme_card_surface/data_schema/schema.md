## Schema: theme_card_surface

- `surface_id` (string, required)
- `variants` (array):
  - `variant_id` (string)
  - `surface` tokens: dark/light references
  - `stroke` tokens: colour, weight, placement
  - `radius_scale`
  - `padding_scale` (compact/comfortable)
  - `elevation` tokens: default/hover/pressed/selected
  - `badge_slot` (position, size tokens)
- `default_variant_id` (string)
- Values reference token ids, not raw colours.
