# Builder Capabilities Gapmap

## Shopify-style web builder (sections/blocks)
- What exists: Block/section model in `packages/builder-registry/src/models.ts` and `SCHEMAS`; rendering via `packages/projections/src/index.tsx` + `packages/ui-atoms/src/index.tsx`; layout primitives in `packages/builder-layout/src/components.tsx`; inspector edits plain props.
- Gaps: No tokenized schema or responsive overrides; no flow/grid/columns tokens; no config-driven registry; no recovery_ops-aware optimistic rollback; lacks tracking/UTM/accessibility tokens; no tool_canvas_mode; registry fetch lacks versioning/NA enforcement.
- Minimum primitives: Canonical token groups (content/typography/color/layout/linking/tracking/accessibility/constraints), responsive wrapper, recovery_ops-aware kernel apply, conflict-safe add/move/remove, server-fetched registry with version pinning.

## Klaviyo-style email builder
- What exists: None dedicated; current atoms/layout not email-safe; no table/email render path; analytics client web-only (`packages/analytics/src/client.ts`).
- Gaps: Missing email token group (safe widths, inline styles, unsubscribe, dark-mode handling); no email-safe layout renderer; no UTM/email link tracking template tokens; no preview/export pipeline.
- Minimum primitives: Email-specific token group + constraints, table-wrapped renderers, export surface (HTML/MJML) honoring tokens, email platform tags in tracking.

## ManyChat DM builder
- What exists: Chat-themed atoms in registry (`ui-atoms` uses chat components) but props are freeform; no channel constraints; no DM action/linking semantics; no sequencing/timing tokens.
- Gaps: DM token group (channel, quick replies, delays), action payload schemas, platform constraint enforcement, analytics for reply clicks; no agent/builder surface for sequencing messages.
- Minimum primitives: DM token set with NA rules per channel, action/link schema, typing delay tokens, validation per platform, registry entries per DM atom type.

## Figma-style freeform canvas (absolute positioning)
- What exists: CanvasKernel supports add/move/update but Atom properties are block-flow only; CanvasView renders flow layout; no position/transform tokens; no constraints/lock flags; no cursor/state overlay beyond simple selection.
- Gaps: Freeform positioning model (x/y/rotation/scale/z-index), constraints + lock flags, snap guides, frame/section containers, responsive overrides for placement, recovery_ops rebasing in freeform space, asset linking pipeline.
- Minimum primitives: Layout token set covering absolute/fixed/sticky, transform tokens, constraints + guards, frame atom spec, freeform renderer honoring tokens, JSON Patch surface for token paths.
