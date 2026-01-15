## Tracking hooks

**Purpose**: outline minimal analytics surfaces without leaking child content.

- Impression: emit `container_impression` once per view with `container_id`, `variant` (full_bleed/density), `breakpoint`, and `tracking_id/view_id` if provided. Throttle to avoid repeats on resize.
- Variant changes: when density, alignment, or full_bleed tokens change through user action, emit `container_variant_change` with previous/current values. Do not fire on initial hydration.
- Alignment changes: optional `container_alignment_change` when alignment token is adjusted in a builder; include `alignment`, `container_id`, and context (UTMs/consent flag).
- Guardrails: never log child text/media; payloads must stay token/id based. Respect consent flag before emitting non-essential events.
