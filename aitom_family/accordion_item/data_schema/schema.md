## Schema: accordion_item

- `id` (string, required) – unique item identifier.
- `title_ref` (string, required) – content slot reference for header text.
- `body_ref` (string, required) – content slot reference for body rich text/markup.
- `start_open` (boolean, optional, default false) – initial expanded state.
- `mode` (enum: `single` | `multi`, optional, default `multi`) – governs whether siblings auto-collapse (single) or not (multi).
- `icon_id` (string, optional) – token ref for chevron/indicator icon to allow swaps.
- `tracking_id` (string, optional) – layout/tracking hook; avoid PII.
- `view_id` (string, optional) – view scope identifier for analytics.
- No PII; data carries ids and content refs only. Timestamps or message bodies are not stored here.

