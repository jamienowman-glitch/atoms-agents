# UI Element Request Guide

Use `UI_ELEMENT_REQUEST_TEMPLATE.tsv` to request new/updated atoms. Fill every column; never leave blanks. If a field does not apply, set `"status": "NA"` with a short reason.

Required-by-default token groups per atom type:
- Text: content, typography, color, spacing, size, layout, accessibility, tracking, constraints, data_binding, linking (if linkable).
- Button/CTA: content, typography, color, border, spacing, size, layout, interaction, linking, tracking, accessibility, constraints.
- Image: media, layout, size, effects, color (overlays), accessibility (alt), tracking, linking, constraints.
- Container/Section/Grid: layout, spacing, size, color, constraints (allowed children/slots), accessibility, data_binding, tracking.
- Chat/DM blocks: content, interaction/actions, layout, spacing, color, media (optional), tracking, dm/email constraints, accessibility.

Column instructions:
- **element name**: Human-friendly label (e.g., “Hero Banner”, “DM Quick Reply”).
- **element category**: One of `web`, `email`, `dm`, `freeform` (multi-select allowed via comma).
- **base atom type**: Core type (text/button/image/container/grid/chat_message/etc.).
- **required token groups**: Comma list of token groups that MUST be filled (use Responsive where applicable).
- **optional token groups**: Comma list of additional groups; if unused, add NA rows with reasons.
- **allowed children/slots**: Slot IDs + allowed types and min/max counts; NA if leaf with reason.
- **tracking needs**: Describe analytics/conversion/utm needs; if none, set NA + reason.
- **accessibility notes**: Required a11y metadata (roles, labels, alt, focus order); NA + reason not allowed for image alt.
- **NA fields**: Enumerate any token groups marked NA with the explicit reason.
- **sample use cases**: Short scenarios this element supports.
- **mapping notes**: Parity callouts (e.g., “Shopify: image_with_text”, “Klaviyo: two-column block”).

Validation checklist before submitting:
- Every token group either specified or marked `"status":"NA","reason":"…"`.
- Responsive expectations captured (mobile/desktop overrides) when visual.
- Data binding status set (ENABLED/DISABLED/NA) with source if enabled.
- Tracking/UTM needs explicit, especially for clickable elements.
- Constraints include allowed children/edits to support agent token surfaces.
