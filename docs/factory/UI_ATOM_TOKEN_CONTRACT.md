# UI Atom Token Contract (Canonical)

## 1) Two Levels: Definition vs Instance
- **ElementDefinition / AtomSpec (atoms_factory)**: `{ type_id, version, token_schema, defaults, controls_metadata, slots/children_rules, capabilities_flags }`. Token schema must be typed, constrained, and complete with explicit `"status":"NA","reason":"…"`` objects where not applicable. Defaults must fill every token path (use NA objects when a token group is not used).
- **ElementInstance (canvas)**: `{ id, type_id@version, tokens, children?, computed? }`. Instances are created on the collaborative canvas; `tokens` must conform to the AtomSpec schema; `computed` is read-only runtime output.

## 2) Token Groups + NA Rule
- Fixed token groups every atom must expose (may be NA with reason): `content, typography, color, border, spacing, size, layout, effects, media, interaction, linking, data_binding, tracking, accessibility, constraints`.
- **NA not blank**: Any non-applicable group must be present as `{ "status": "NA", "reason": "<why>" }`. Empty or omitted groups are forbidden.

## 3) Responsive Wrapper
```ts
type Responsive<T> = { base: T; mobile?: Partial<T>; desktop?: Partial<T>; /* future: tablet, wide, emailClientOverrides, etc. */ }
```
- `base` is always defined; overrides only include deltas. All visual tokens use `Responsive`.

## 4) Layout Model: Flow + Freeform
- **Container/flow layout**: tokens for `layout.flow`, `layout.columns`, `layout.gap`, `layout.align`, `layout.justify`; supports Shopify/Klaviyo stacking and responsive column collapse.
- **Freeform placement**: tokens for `layout.positioning (flow|absolute|fixed|sticky)`, `layout.x/y`, `layout.transform`, `layout.rotation`, `layout.scale`, `layout.anchor`, `layout.z_index`, `layout.constraints`. Freeform tokens must exist even if current renderer is flow-first.

## 5) Agent-Facing Contract
- Agents mutate **token surfaces**, not entire elements. TokenSurface is an allowlist of JSON Pointer paths (e.g., `/scene/nodes/btn_12/tokens/content/label`).
- All edits are **JSON Patch** operations against token paths; human edits use the same shape.
- Asset changes happen via tools returning `asset_ref`, then patched into `tokens.media.asset_ref`.
- Responsive overrides live at `tokens.<group>.mobile|desktop` and are patched the same way.

## 6) Core Atom Requirements (minimum set, max token coverage)
- **Text (headline/body/caption)**: content text; typography (Roboto Flex preset + axes); color; layout width/height/flow/freeform; accessibility (aria/locale); tracking hooks.
- **Button/CTA**: content label + optional icon slot; linking (href/action); tracking (click event, conversion_goal_id, utm template); typography/color/border/spacing/size; interaction states; accessibility role/label/focus hints.
- **Image**: media asset_ref + fit/focal/crop/mask/aspect; layout + freeform; effects (opacity/filter/blur tokens exist); accessibility alt (required); optional linking; tracking (impression/click).
- **Section/Frame/Container**: layout flow vs grid vs flex; columns/stacking/gap/padding/alignment; color/background/border; responsive overrides; data_binding repeater + conditional visibility; tracking optional.
- **Columns/Grid**: column count/widths/wrap behavior; per-breakpoint mapping; gap/alignment; constraints for allowed children.
- **Chat Message/DM Block**: content (text, quick replies, cards); actions (reply buttons, navigate, webhook); channel constraints (NA per channel); tracking (reply click); accessibility for preview/web.

## 7) Data Binding Schema
```ts
type DataBinding = {
  status: "ENABLED"|"DISABLED"|"NA";
  source?: { kind: "variable"|"collection"|"repeat"|"template" };
  expr?: string;
  fallback?: any;
  sanitizer?: { mode: "strict"|"lenient"; allow_html?: boolean };
};
```
- Every atom exposes `tokens.data_binding`; NA requires a reason.

## 8) Tracking + UTM Tokens
- Clickable atoms must include: `linking.href` or `linking.action`, `linking.utm_template (optional)`, `tracking.analytics_event_name`, `tracking.conversion_goal_id`, optional `tracking.experiment_id`, `tracking.platform_tags`, `tracking.utm_defaults`.
- Email UTMs are templates applied at export/send time. NA requires explicit reason.

## 9) Storage Format + Registry Output (atoms_factory)
- Per atom folder uses **10-bucket structure**: `behaviour/`, `layout/`, `views/`, `typography/`, `colours/`, `icons/`, `data_schema/`, `tracking/`, `accessibility/`, `exposed_tokens/`.
- Source of truth lives in `exposed_tokens/schema.ts` + `exposed_tokens/default.ts` (complete defaults, no blanks). Views must render **only** from tokens.
- Registry output (builder ingest): list of atom types + versions + schemas + defaults + control hints; powers palette/inspector/agent token surface derivation.

## 10) UI → Agents Contract (concise)
- Canvas is a scene graph of element instances with typed token groups.
- All edits are JSON Patch ops against token paths; TokenSurface allowlist limits agent writes.
- Asset changes patch `tokens.media.asset_ref`; responsive overrides live under `tokens.<group>.mobile|desktop`.
- Tokens are never blank; non-applicable = `"status":"NA","reason":"<why>"`.

## 11) Max Token Superset (A–S)
- **A) Identity + Structure (all atoms)**: `meta.atom_id`, `meta.atom_kind`, `meta.variant_id`, `meta.version`, `tree.parent_id`, `tree.children_ids[]`, `tree.slot_rules`, `lock.lock_flags (lock_move|lock_resize|lock_edit|lock_style)`, `visibility.visible`, `visibility.hide_on.mobile|desktop`, `state_refs` or NA.
- **B) Content (text + dynamic)**: `content.text.content`, `content.text.rich` or NA, `content.text.max_chars`, `content.text.placeholder`, `content.text.language`, `content.text.transform`, `content.text.truncation`, `content.text.clamp_lines`, `content.bindings` or NA, `content.merge_tags` or NA, `content.conditional` or NA.
- **C) Typography (Roboto Flex + axes, Responsive)**: `family_preset (roboto_flex)`, `size`, `weight`, `line_height`, `letter_spacing`, `word_spacing`, `text_align`, `vertical_align`, `text_decoration`, `font_style`, `wrap`, `hyphenation`, `ligatures`, `numerals`, `smoothing`, `axes` map, `axis_constraints` or NA, `optical_size`, `grade`, `width`, `slant`, standardized axes (xtra/xopq/etc.).
- **D) Color (Responsive)**: `color.text`, `color.background`, `color.surface`, `color.border`, `color.accent`, `color.muted`, `color.link`, `color.icon`, `color.overlay`, `color.selection`, `color.focus_ring`, `color.semantic.error|warn|success|info`, gradients (`color.background_gradient`, `color.text_gradient` or NA), `color.opacity`, `color.blend_mode` or NA.
- **E) Border (Responsive)**: `border.width`, `border.radius`, `border.style`, `border.color`, `border.outline` or NA.
- **F) Spacing (Responsive)**: `spacing.padding`, `spacing.margin`, `spacing.gap`.
- **G) Size (Responsive)**: `size.width`, `size.height`, `size.min_width|min_height`, `size.max_width|max_height`, `size.aspect_ratio` or NA, `size.aspect_lock` or NA.
- **H) Layout (Responsive, flow + freeform)**: `layout.display`, `layout.flow.direction|order` or NA, `layout.flex.direction|wrap|justify|align|align_self|grow|shrink|basis`, `layout.grid.columns|rows|column_gap|row_gap|areas or NA`, `layout.columns.count|widths|wrap_behavior|stack_on_mobile`, `layout.positioning`, `layout.x|y` or NA, `layout.rotation` or NA, `layout.scale_x|scale_y` or NA, `layout.anchor` or NA, `layout.z_index`, `layout.overflow`.
- **I) Effects (Responsive)**: `effects.opacity`, `effects.shadow` or NA, `effects.blur` or NA, `effects.filters` or NA, `effects.blend` or NA.
- **J) Media**: `media.kind (image|video|audio|NA)`, `media.asset_ref` or NA, `media.alt_text` or NA (required for images), `media.focal_point` or NA, `media.fit`, `media.crop`, `media.mask`, `media.aspect_ratio`, `media.placeholder`, video (`media.poster_ref`, `media.start_time|end_time`, `media.autoplay|loop|muted|controls`, `media.playback_rate`, `media.captions_ref`), audio (`media.autoplay|loop|muted|controls`).
- **K) Interaction**: `interaction.enabled|disabled|loading`, `interaction.cursor` or NA, `interaction.states.hover|pressed|focus` (style overrides) or NA, `interaction.transitions` or NA, `interaction.handlers.on_click|on_hover|on_focus|on_submit` or NA.
- **L) Linking**: `linking.mode (href|action|NA)`, `linking.href` or NA, `linking.target` or NA, `linking.rel` or NA, `linking.action_type`, `linking.action_payload`, `linking.utm_template` or NA.
- **M) Data Binding**: `data_binding.status`, `data_binding.source`, `data_binding.expr`, `data_binding.fallback`, `data_binding.sanitizer` — NA must include reason.
- **N) Tracking**: `tracking.analytics_id`, `tracking.analytics_event_name`, `tracking.conversion_goal_id`, `tracking.experiment_id`, `tracking.impression_event`, `tracking.click_event`, `tracking.conversion_event`, `tracking.platform_tags`, `tracking.utm_defaults`, `tracking.link_tracking` — NA must include reason.
- **O) Accessibility**: `accessibility.role`, `accessibility.label`, `accessibility.description` or NA, `accessibility.aria` map or NA, `accessibility.tab_index` or NA, `accessibility.focus_order` or NA, `accessibility.keyboard_nav` or NA, `accessibility.contrast_target` or NA, `accessibility.reduced_motion_support` or NA, `accessibility.alt_text` required for images.
- **P) Constraints**: `constraints.allowed_edits`, `constraints.min|max` per field or NA, `constraints.allowed_children` or NA, `constraints.email_safe` or NA, `constraints.dm_channel_constraints` or NA, `constraints.token_surface_hints` or NA.
- **Q) Editor UX**: `editor.selectable`, `editor.draggable`, `editor.resizable`, `editor.rotatable`, `editor.snap_to_grid` or NA, `editor.snap_to_edges` or NA, `editor.guides` or NA, `editor.lock_aspect_on_resize` or NA, `editor.resize_handles` or NA, `editor.drag_handle_zone` or NA, `editor.inline_edit` or NA, `editor.inspector_groups` or NA.
- **R) Email-specific**: `email.status (ENABLED|DISABLED|NA)`, `email.safe_width` or NA, `email.inline_styles` or NA, `email.dark_mode_handling` or NA, `email.preheader_text` or NA, `email.unsubscribe_required` or NA, `email.client_compat_mode` or NA, `email.table_wrapping` or NA, `email.merge_tag_rules` or NA, `email.spam_safe` or NA.
- **S) DM-specific**: `dm.status (ENABLED|DISABLED|NA)`, `dm.channel` or NA, `dm.message_kind` or NA, `dm.quick_replies[]` or NA, `dm.buttons[]` or NA, `dm.typing_delay_ms` or NA, `dm.delay_before_ms` or NA, `dm.input_capture` or NA, `dm.fallback_text` or NA, `dm.channel_constraints` or NA.
