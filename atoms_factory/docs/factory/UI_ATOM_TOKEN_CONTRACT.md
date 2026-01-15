# UI Atom Token Contract

## 1. Definition vs Instance

### 1.1 ElementDefinition (AtomSpec)
Lives in `atoms_factory`. Versioned.
*   **type_id + version**: Unique identifier.
*   **token_schema**: Typed keys, constrained values, no blanks (NA objects used).
*   **defaults**: Complete set of default values matching schema.
*   **controls_metadata**: Hints for builder (color picker, slider, etc.).
*   **slots/children_rules**: Allowed children types, min/max counts, slot IDs.
*   **capabilities_flags**: `supports_link`, `supports_asset`, `supports_richtext`, etc.

### 1.2 ElementInstance
Lives on collaborative canvas (Engine State).
*   **id**: Unique instance ID.
*   **type_id@version**: Reference to definition.
*   **tokens**: Runtime values matching schema.
*   **children**: List of child instance IDs (if allowed).
*   **computed**: Runtime-calculated read-only values.

## 2. Token Model

### 2.1 Fixed Token Groups
Every atom MUST expose these groups (NA allowed, but never missing/blank):
1.  `content`
2.  `typography`
3.  `color`
4.  `border`
5.  `spacing`
6.  `size`
7.  `layout`
8.  `effects`
9.  `media`
10. `interaction`
11. `linking`
12. `data_binding`
13. `tracking`
14. `accessibility`
15. `constraints`

### 2.2 NA Rule
Any group not applicable MUST be explicitly marked:
```json
"media": { "status": "NA", "reason": "No media surface" }
```

## 3. Responsive Wrapper
All visual tokens should use `Responsive<T>`:
```typescript
type Responsive<T> = {
  base: T;
  mobile?: Partial<T>;
  desktop?: Partial<T>;
}
```

## 4. Layout Model
Must support both paradigms:
1.  **Flow/Container**: `flow`, `columns`, `gap`, `align`, `justify`.
2.  **Freeform**: `position`, `transform`, `zIndex`, `constraints`.

## 5. Agent-Facing Contract
*   **TokenSurface**: Allowlist of JSON pointers agents can mutate.
*   **CanvasOps**: JSON Patch format.
    *   `{ "op": "replace", "path": "/tokens/content/label", "value": "Buy" }`

## 6. Max Token Superset

### A) Identity + Structure
*   `meta.atom_id`, `meta.atom_kind`, `meta.variant_id`, `meta.version`
*   `tree.parent_id`, `tree.children_ids[]`, `tree.slot_rules`
*   `lock.lock_flags`, `visibility.visible`, `visibility.hide_on`

### B) Content
*   `content.text.content`, `content.text.rich`, `content.text.placeholder`
*   `content.text.language`, `content.text.transform`, `content.text.truncation`
*   `content.bindings`, `content.merge_tags`, `content.conditional`

### C) Typography (Roboto Flex)
*   `base.family_preset` (roboto_flex)
*   `base.size`, `base.weight`, `base.line_height`
*   `base.letter_spacing`, `base.word_spacing`
*   `base.text_align`, `base.vertical_align`
*   `base.text_decoration`, `base.font_style`
*   `base.axes` (variable font axes map)

### D) Color
*   `color.text`, `color.background`, `color.surface`, `color.border`
*   `color.accent`, `color.muted`, `color.link`, `color.icon`
*   `color.overlay`, `color.selection`, `color.focus_ring`
*   `color.semantic` (error, warn, success, info)
*   `color.opacity`, `color.blend_mode`

### E) Border
*   `border.width`, `border.radius`, `border.style`, `border.color`

### F) Spacing
*   `spacing.padding`, `spacing.margin`, `spacing.gap`

### G) Size
*   `size.width`, `size.height`, `size.min/max`
*   `size.aspect_ratio`, `size.aspect_lock`

### H) Layout
*   `display` (block, flex, grid, stack)
*   `flow.direction`, `flex.wrap`, `flex.justify/align`
*   `grid.columns`, `grid.rows`, `grid.gap`
*   `positioning` (absolute, relative), `x`, `y`, `z_index`, `rotation`

### I) Effects
*   `effects.opacity`, `effects.shadow`, `effects.blur`, `effects.filters`

### J) Media
*   `media.kind`, `media.asset_ref`, `media.alt_text`
*   `media.fit`, `media.crop`, `media.mask`
*   `media.video` (poster, loop, autoplay)

### K) Interaction
*   `interaction.enabled`, `interaction.cursor`
*   `interaction.states` (hover, pressed - overrides)
*   `interaction.transitions`
*   `interaction.handlers` (on_click, etc. - actions)

### L) Linking
*   `linking.href`, `linking.action_type`, `linking.action_payload`
*   `linking.target`, `linking.utm_template`

### M) Data Binding
*   `status` (ENABLED/DISABLED), `source`, `expr`, `fallback`

### N) Tracking
*   `analytics_id`, `analytics_event_name`, `conversion_goal_id`
*   `impression_event`, `click_event`
*   `platform_tags` (email, web, dm)

### O) Accessibility
*   `role`, `label`, `description`, `aria`
*   `tab_index`, `focus_order`, `keyboard_nav`
*   `contrast_target`

### P) Constraints
*   `allowed_edits`, `min/max`, `allowed_children`
*   `email_safe`, `dm_channel_constraints`

### Q) Editor UX
*   `selectable`, `draggable`, `resizable`, `rotatable`
*   `snap_to_grid`, `guides`

### R) Email Specific
*   `email.safe_width`, `email.inline_styles`, `email.dark_mode_handling`

### S) DM Specific
*   `dm.channel`, `dm.quick_replies`, `dm.buttons`
