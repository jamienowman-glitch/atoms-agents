# Lane A Implementation Plan

This plan outlines the creation of missing specification files for Lane A atoms (Chat & Swarm).

## Proposed Changes


### bottom_chat_input_bar

#### Dimension: accessibility
- [NEW] [aitom_family/bottom_chat_input_bar/accessibility/labels.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/accessibility/labels.md) - aria labels for input, upload, send, shortcuts.
- [NEW] [aitom_family/bottom_chat_input_bar/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/accessibility/keyboard.md) - tab order and Enter vs Shift+Enter behaviour.
#### Dimension: behaviour
- [NEW] [aitom_family/bottom_chat_input_bar/behaviour/input_handling.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/behaviour/input_handling.md) - enter/send vs shift+enter, multiline cap, focus/blur rules.
- [NEW] [aitom_family/bottom_chat_input_bar/behaviour/triggers.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/behaviour/triggers.md) - upload picker trigger, shortcuts popover trigger, send button behaviour.
- [NEW] [aitom_family/bottom_chat_input_bar/behaviour/keyboard_safe.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/behaviour/keyboard_safe.md) - mobile keyboard handling to keep controls visible.
#### Dimension: colours
- [NEW] [aitom_family/bottom_chat_input_bar/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/colours/palette.md) - pill background, text, placeholder, icons.
- [NEW] [aitom_family/bottom_chat_input_bar/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/colours/state_map.md) - focus/hover/pressed/disabled/error states.
#### Dimension: data_schema
- [NEW] [aitom_family/bottom_chat_input_bar/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/data_schema/schema.md) - input state fields.
- [NEW] [aitom_family/bottom_chat_input_bar/data_schema/behaviour_flags.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/data_schema/behaviour_flags.md) - enter/shift-enter config, disabled flags.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/bottom_chat_input_bar/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/bottom_chat_input_bar/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/bottom_chat_input_bar/icons/upload.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/icons/upload.md) - upload/agent icon ref and states.
- [NEW] [aitom_family/bottom_chat_input_bar/icons/shortcut.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/icons/shortcut.md) - inline shortcut arrow icon ref.
- [NEW] [aitom_family/bottom_chat_input_bar/icons/send.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/icons/send.md) - send icon ref and states.
#### Dimension: layout
- [NEW] [aitom_family/bottom_chat_input_bar/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/layout/structure.md) - pill layout for upload/shortcut/input/send.
- [NEW] [aitom_family/bottom_chat_input_bar/layout/padding.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/layout/padding.md) - internal padding and spacing to prevent overflow.
#### Dimension: tracking
- [NEW] [aitom_family/bottom_chat_input_bar/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/tracking/events.md) - upload_open, shortcuts_open, send_attempt.
- [NEW] [aitom_family/bottom_chat_input_bar/tracking/spec_examples.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/tracking/spec_examples.md) - 
- [NEW] [aitom_family/bottom_chat_input_bar/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/tracking/guardrails.md) - 
#### Dimension: typography
- [NEW] [aitom_family/bottom_chat_input_bar/typography/input.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/typography/input.md) - preset for typed text and placeholder variant.
- [NEW] [aitom_family/bottom_chat_input_bar/typography/shortcuts.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/typography/shortcuts.md) - preset for inline shortcut arrow label if text-based.
#### Dimension: views
- [NEW] [aitom_family/bottom_chat_input_bar/views/default.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/views/default.md) - pill with upload, shortcuts, input, send.
- [NEW] [aitom_family/bottom_chat_input_bar/views/mobile_keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/bottom_chat_input_bar/views/mobile_keyboard.md) - mobile view with keyboard showing and input pinned.

### chat_icon_band_popover

#### Dimension: accessibility
- [NEW] [aitom_family/chat_icon_band_popover/accessibility/toolbar.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/accessibility/toolbar.md) - toolbar semantics and labels.
- [NEW] [aitom_family/chat_icon_band_popover/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/accessibility/keyboard.md) - horizontal navigation and activation.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_icon_band_popover/behaviour/band_switching.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/behaviour/band_switching.md) - tools vs settings exclusivity and interaction with shell.
- [NEW] [aitom_family/chat_icon_band_popover/behaviour/icon_actions.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/behaviour/icon_actions.md) - icon activation, active state, horizontal scroll behaviour.
#### Dimension: colours
- [NEW] [aitom_family/chat_icon_band_popover/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/colours/palette.md) - band background, icon colours, label colours.
- [NEW] [aitom_family/chat_icon_band_popover/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/colours/state_map.md) - hover/pressed/active icons.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_icon_band_popover/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/data_schema/schema.md) - band_type, icons array, active icon.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_icon_band_popover/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_icon_band_popover/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_icon_band_popover/icons/band_icons.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/icons/band_icons.md) - icon refs for tools/settings entries and active state styling.
#### Dimension: layout
- [NEW] [aitom_family/chat_icon_band_popover/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/layout/structure.md) - band height, padding, icon spacing, attachment to rail.
- [NEW] [aitom_family/chat_icon_band_popover/layout/scroll.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/layout/scroll.md) - horizontal scroll behaviour on mobile.
#### Dimension: tracking
- [NEW] [aitom_family/chat_icon_band_popover/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/tracking/events.md) - chat_band_icon_click.
- [NEW] [aitom_family/chat_icon_band_popover/tracking/guardrails.md.](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/tracking/guardrails.md.) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_icon_band_popover/typography/labels.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/typography/labels.md) - optional tiny labels under icons.
#### Dimension: views
- [NEW] [aitom_family/chat_icon_band_popover/views/tools.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/views/tools.md) - tools band example with scroll on mobile.
- [NEW] [aitom_family/chat_icon_band_popover/views/settings.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_icon_band_popover/views/settings.md) - settings band example with active icon.

### chat_message_action_bar

#### Dimension: accessibility
- [NEW] [aitom_family/chat_message_action_bar/accessibility/aria.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/accessibility/aria.md) - labels for each action.
- [NEW] [aitom_family/chat_message_action_bar/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/accessibility/keyboard.md) - focus and activation rules.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_message_action_bar/behaviour/actions.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/behaviour/actions.md) - per-icon activation rules and availability flags.
- [NEW] [aitom_family/chat_message_action_bar/behaviour/states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/behaviour/states.md) - hover/pressed/disabled focus handling and tap targets.
#### Dimension: colours
- [NEW] [aitom_family/chat_message_action_bar/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/colours/palette.md) - icon base colour on dark background.
- [NEW] [aitom_family/chat_message_action_bar/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/colours/state_map.md) - hover/pressed/disabled/focus.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_message_action_bar/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/data_schema/schema.md) - action availability flags.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_message_action_bar/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_message_action_bar/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_message_action_bar/icons/actions.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/icons/actions.md) - icon refs for save/alert/review/delete/todo with states.
#### Dimension: layout
- [NEW] [aitom_family/chat_message_action_bar/layout/row.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/layout/row.md) - icon row spacing, padding, alignment under message body.
#### Dimension: tracking
- [NEW] [aitom_family/chat_message_action_bar/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/tracking/events.md) - 
- [NEW] [aitom_family/chat_message_action_bar/tracking/spec_examples.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/tracking/spec_examples.md) - 
- [NEW] [aitom_family/chat_message_action_bar/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/tracking/guardrails.md) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_message_action_bar/typography/tooltips.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/typography/tooltips.md) - tooltip preset if surfaced.
#### Dimension: views
- [NEW] [aitom_family/chat_message_action_bar/views/default.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_action_bar/views/default.md) - row of five icons with hover/pressed/disabled samples.

### chat_message_block

#### Dimension: accessibility
- [NEW] [aitom_family/chat_message_block/accessibility/semantics.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/accessibility/semantics.md) - labeling of author and body, role tags.
- [NEW] [aitom_family/chat_message_block/accessibility/focus.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/accessibility/focus.md) - focus behaviour when action bar present.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_message_block/behaviour/alignment.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/behaviour/alignment.md) - agent vs human alignment rules and optional role tag placement.
- [NEW] [aitom_family/chat_message_block/behaviour/highlight.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/behaviour/highlight.md) - new/search highlight duration and reduced-motion handling.
#### Dimension: colours
- [NEW] [aitom_family/chat_message_block/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/colours/palette.md) - name/body/role_tag text, optional divider, highlight overlay.
- [NEW] [aitom_family/chat_message_block/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/colours/state_map.md) - highlight/selected states.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_message_block/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/data_schema/schema.md) - message fields and optional role_tag/avatar.
- [NEW] [aitom_family/chat_message_block/data_schema/derived_flags.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/data_schema/derived_flags.md) - is_new/highlight derived state.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_message_block/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_message_block/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_message_block/icons/avatar.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/icons/avatar.md) - avatar slot mapping and sizing.
#### Dimension: layout
- [NEW] [aitom_family/chat_message_block/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/layout/structure.md) - stacking of name/body/action bar, avatar alignment.
- [NEW] [aitom_family/chat_message_block/layout/spacing.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/layout/spacing.md) - gaps between elements, max width, highlight area.
#### Dimension: tracking
- [NEW] [aitom_family/chat_message_block/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/tracking/events.md) - message_view event.
- [NEW] [aitom_family/chat_message_block/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/tracking/guardrails.md) - PII/message body exclusions.
#### Dimension: typography
- [NEW] [aitom_family/chat_message_block/typography/name_body.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/typography/name_body.md) - presets for author name and body.
- [NEW] [aitom_family/chat_message_block/typography/role_tag.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/typography/role_tag.md) - preset for optional role tag.
#### Dimension: views
- [NEW] [aitom_family/chat_message_block/views/agent_user.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/views/agent_user.md) - agent (left) and human (right) variants with avatar.
- [NEW] [aitom_family/chat_message_block/views/highlight.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_block/views/highlight.md) - highlighted/new message example.

### chat_message_list

#### Dimension: accessibility
- [NEW] [aitom_family/chat_message_list/accessibility/live_region.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/accessibility/live_region.md) - live region settings for new messages.
- [NEW] [aitom_family/chat_message_list/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/accessibility/keyboard.md) - scroll/focus guidance.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_message_list/behaviour/scrolling.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/behaviour/scrolling.md) - auto-scroll to bottom rules and user override.
- [NEW] [aitom_family/chat_message_list/behaviour/state_rules.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/behaviour/state_rules.md) - loading/empty/visible states and message alignment inheritance.
#### Dimension: colours
- [NEW] [aitom_family/chat_message_list/colours/notes.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/colours/notes.md) - inherit rail colours; [NO UNIQUE COLOURS].
#### Dimension: data_schema
- [NEW] [aitom_family/chat_message_list/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/data_schema/schema.md) - list fields including messages refs and history flags.
- [NEW] [aitom_family/chat_message_list/data_schema/scroll_state.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/data_schema/scroll_state.md) - scroll position/auto-scroll flags (optional).
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_message_list/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_message_list/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_message_list/icons/notes.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/icons/notes.md) - note [NO ICONS] at list level.
#### Dimension: layout
- [NEW] [aitom_family/chat_message_list/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/layout/structure.md) - scroll container sizing within rail stack.
- [NEW] [aitom_family/chat_message_list/layout/spacing.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/layout/spacing.md) - padding and vertical spacing tokens.
#### Dimension: tracking
- [NEW] [aitom_family/chat_message_list/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/tracking/events.md) - chat_scroll event definition.
- [NEW] [aitom_family/chat_message_list/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/tracking/guardrails.md) - disallow message bodies.
#### Dimension: typography
- [NEW] [aitom_family/chat_message_list/typography/notes.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/typography/notes.md) - references chat_message_block presets; no unique presets.
#### Dimension: views
- [NEW] [aitom_family/chat_message_list/views/states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_message_list/views/states.md) - loading, empty, populated views with scroll indicator.

### chat_rail_header_bar

#### Dimension: accessibility
- [NEW] [aitom_family/chat_rail_header_bar/accessibility/roles_labels.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/accessibility/roles_labels.md) - toolbar semantics and icon ARIA labels.
- [NEW] [aitom_family/chat_rail_header_bar/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/accessibility/keyboard.md) - keyboard activation and focus order.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_rail_header_bar/behaviour/toggles.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/behaviour/toggles.md) - minimise/expand/tools/settings toggle rules and band exclusivity.
- [NEW] [aitom_family/chat_rail_header_bar/behaviour/states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/behaviour/states.md) - default/hover/pressed/active/disabled states for icons and label truncation.
#### Dimension: colours
- [NEW] [aitom_family/chat_rail_header_bar/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/colours/palette.md) - background, label text, icon colours.
- [NEW] [aitom_family/chat_rail_header_bar/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/colours/state_map.md) - hover/pressed/active/disabled for header icons and label.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_rail_header_bar/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/data_schema/schema.md) - header fields and control visibility.
- [NEW] [aitom_family/chat_rail_header_bar/data_schema/state_derivations.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/data_schema/state_derivations.md) - derived active states for bands and disable conditions.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_rail_header_bar/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_rail_header_bar/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_rail_header_bar/icons/header_icons.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/icons/header_icons.md) - mapping for minimise/expand/tools/settings and order tokens.
#### Dimension: layout
- [NEW] [aitom_family/chat_rail_header_bar/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/layout/structure.md) - three-zone layout, padding, label centering.
- [NEW] [aitom_family/chat_rail_header_bar/layout/spacing.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/layout/spacing.md) - icon spacing/order tokens, min widths, truncation rules.
#### Dimension: tracking
- [NEW] [aitom_family/chat_rail_header_bar/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/tracking/events.md) - 
- [NEW] [aitom_family/chat_rail_header_bar/tracking/spec_examples.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/tracking/spec_examples.md) - 
- [NEW] [aitom_family/chat_rail_header_bar/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/tracking/guardrails.md) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_rail_header_bar/typography/app_label.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/typography/app_label.md) - preset for app/surface label with truncation guidance.
- [NEW] [aitom_family/chat_rail_header_bar/typography/axis_tokens.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/typography/axis_tokens.md) - axis tokens for label and optional nano preview alignment.
#### Dimension: views
- [NEW] [aitom_family/chat_rail_header_bar/views/default.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/views/default.md) - header layout with label and icons on dark base.
- [NEW] [aitom_family/chat_rail_header_bar/views/active_states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_header_bar/views/active_states.md) - active tools/settings state, disabled min/expand.

### chat_rail_shell

#### Dimension: accessibility
- [NEW] [aitom_family/chat_rail_shell/accessibility/semantics.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/accessibility/semantics.md) - landmark/region roles and labels per state.
- [NEW] [aitom_family/chat_rail_shell/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/accessibility/keyboard.md) - tab order, keyboard controls for minimise/expand/bands, undocked move.
- [NEW] [aitom_family/chat_rail_shell/accessibility/motion.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/accessibility/motion.md) - reduced-motion behaviour for state changes and scrolling.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_rail_shell/behaviour/states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/behaviour/states.md) - nano/micro/standard/full state machine, transitions, and button mapping.
- [NEW] [aitom_family/chat_rail_shell/behaviour/docking.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/behaviour/docking.md) - dock/undock rules, drag constraints, persistence of position.
- [NEW] [aitom_family/chat_rail_shell/behaviour/mobile_anchoring.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/behaviour/mobile_anchoring.md) - bottom anchoring, keyboard-safe behaviour, chat rail exclusion of OS chrome.
- [NEW] [aitom_family/chat_rail_shell/behaviour/bands.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/behaviour/bands.md) - tools/settings band mutual exclusivity, toggle rules.
- [NEW] [aitom_family/chat_rail_shell/behaviour/scrolling.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/behaviour/scrolling.md) - message list auto-scroll rules, scroll-to-bottom behaviour, state-based visibility.
#### Dimension: colours
- [NEW] [aitom_family/chat_rail_shell/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/colours/palette.md) - background, text roles (primary/secondary), icon colours, dividers.
- [NEW] [aitom_family/chat_rail_shell/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/colours/state_map.md) - state colours for header controls, bands, nano preview, focus/hover/pressed.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_rail_shell/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/data_schema/schema.md) - chat rail fields and state enum.
- [NEW] [aitom_family/chat_rail_shell/data_schema/positioning.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/data_schema/positioning.md) - dock/undock position data and safe-area insets.
- [NEW] [aitom_family/chat_rail_shell/data_schema/state_derivations.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/data_schema/state_derivations.md) - derived flags (is_docked, has_band_open, unread/badge).
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_rail_shell/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_rail_shell/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_rail_shell/icons/header_controls.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/icons/header_controls.md) - minimise/expand/tools/settings icon mapping and states.
- [NEW] [aitom_family/chat_rail_shell/icons/preview.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/icons/preview.md) - optional nano preview icon/avatar slot.
#### Dimension: layout
- [NEW] [aitom_family/chat_rail_shell/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/layout/structure.md) - vertical stack (header, band, list, safety, input), radius, padding.
- [NEW] [aitom_family/chat_rail_shell/layout/responsive.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/layout/responsive.md) - mobile anchoring, desktop docked/undocked sizing, max width.
- [NEW] [aitom_family/chat_rail_shell/layout/state_sizes.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/layout/state_sizes.md) - height/width tokens per state (nano/micro/standard/full) and safe-area offsets.
#### Dimension: tracking
- [NEW] [aitom_family/chat_rail_shell/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/tracking/events.md) - event definitions and payload fields.
- [NEW] [aitom_family/chat_rail_shell/tracking/spec_examples.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/tracking/spec_examples.md) - sample payloads.
- [NEW] [aitom_family/chat_rail_shell/tracking/guardrails.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/tracking/guardrails.md) - consent and PII rules.
#### Dimension: typography
- [NEW] [aitom_family/chat_rail_shell/typography/label_presets.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/typography/label_presets.md) - presets for header label and nano preview text.
- [NEW] [aitom_family/chat_rail_shell/typography/body.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/typography/body.md) - base body preset reference for message list text.
#### Dimension: views
- [NEW] [aitom_family/chat_rail_shell/views/states.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/views/states.md) - visuals for nano/micro/standard/full on mobile/desktop.
- [NEW] [aitom_family/chat_rail_shell/views/docking.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/views/docking.md) - docked vs undocked positions and drag handles.
- [NEW] [aitom_family/chat_rail_shell/views/bands.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_rail_shell/views/bands.md) - tools/settings band examples and mutual exclusivity.

### chat_safety_controls_bar

#### Dimension: accessibility
- [NEW] [aitom_family/chat_safety_controls_bar/accessibility/aria.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/accessibility/aria.md) - control labels and states.
- [NEW] [aitom_family/chat_safety_controls_bar/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/accessibility/keyboard.md) - navigation and activation.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_safety_controls_bar/behaviour/toggles.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/behaviour/toggles.md) - control activation/toggle rules and state propagation.
- [NEW] [aitom_family/chat_safety_controls_bar/behaviour/focus.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/behaviour/focus.md) - keyboard navigation and focus order.
#### Dimension: colours
- [NEW] [aitom_family/chat_safety_controls_bar/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/colours/palette.md) - icon base colour, active indicator.
- [NEW] [aitom_family/chat_safety_controls_bar/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/colours/state_map.md) - hover/pressed/active.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_safety_controls_bar/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/data_schema/schema.md) - controls array and states.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_safety_controls_bar/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_safety_controls_bar/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_safety_controls_bar/icons/controls.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/icons/controls.md) - icon refs for slider/scales/fire etc. with active state styling.
#### Dimension: layout
- [NEW] [aitom_family/chat_safety_controls_bar/layout/row.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/layout/row.md) - icon row spacing, padding, alignment above input.
- [NEW] [aitom_family/chat_safety_controls_bar/layout/overflow.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/layout/overflow.md) - behaviour when controls exceed width (wrap/scroll).
#### Dimension: tracking
- [NEW] [aitom_family/chat_safety_controls_bar/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/tracking/events.md) - chat_safety_control_toggle.
- [NEW] [aitom_family/chat_safety_controls_bar/tracking/guardrails.md.](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/tracking/guardrails.md.) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_safety_controls_bar/typography/labels.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/typography/labels.md) - optional labels/numeric indicators preset.
#### Dimension: views
- [NEW] [aitom_family/chat_safety_controls_bar/views/default.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/views/default.md) - control row with off/on states.
- [NEW] [aitom_family/chat_safety_controls_bar/views/overflow.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_safety_controls_bar/views/overflow.md) - handling when controls exceed width (wrap/scroll).

### chat_shortcuts_popover

#### Dimension: accessibility
- [NEW] [aitom_family/chat_shortcuts_popover/accessibility/roles.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/accessibility/roles.md) - menu semantics and focus return.
- [NEW] [aitom_family/chat_shortcuts_popover/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/accessibility/keyboard.md) - navigation between tokens and insertion.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_shortcuts_popover/behaviour/open_close.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/behaviour/open_close.md) - trigger, outside click/escape close, return focus to input.
- [NEW] [aitom_family/chat_shortcuts_popover/behaviour/navigation.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/behaviour/navigation.md) - keyboard navigation between tokens and insertion action.
#### Dimension: colours
- [NEW] [aitom_family/chat_shortcuts_popover/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/colours/palette.md) - popover background, token text.
- [NEW] [aitom_family/chat_shortcuts_popover/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/colours/state_map.md) - hover/pressed/focus.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_shortcuts_popover/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/data_schema/schema.md) - tokens array and default order.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_shortcuts_popover/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_shortcuts_popover/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_shortcuts_popover/icons/notes.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/icons/notes.md) - [NO ICONS] beyond text tokens.
#### Dimension: layout
- [NEW] [aitom_family/chat_shortcuts_popover/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/layout/structure.md) - popover sizing, token arrangement, anchor positioning.
#### Dimension: tracking
- [NEW] [aitom_family/chat_shortcuts_popover/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/tracking/events.md) - chat_shortcut_token_insert.
- [NEW] [aitom_family/chat_shortcuts_popover/tracking/guardrails.md.](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/tracking/guardrails.md.) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_shortcuts_popover/typography/tokens.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/typography/tokens.md) - preset for shortcut tokens (², ³ etc.).
#### Dimension: views
- [NEW] [aitom_family/chat_shortcuts_popover/views/open.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_shortcuts_popover/views/open.md) - open popover with tokens displayed.

### chat_upload_source_picker

#### Dimension: accessibility
- [NEW] [aitom_family/chat_upload_source_picker/accessibility/roles.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/accessibility/roles.md) - popover labelling and option semantics.
- [NEW] [aitom_family/chat_upload_source_picker/accessibility/keyboard.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/accessibility/keyboard.md) - option navigation and selection.
#### Dimension: behaviour
- [NEW] [aitom_family/chat_upload_source_picker/behaviour/selection.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/behaviour/selection.md) - source selection rules, device picker invocation, future destination selection hook.
- [NEW] [aitom_family/chat_upload_source_picker/behaviour/open_close.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/behaviour/open_close.md) - trigger, outside click/escape, focus return to upload button.
#### Dimension: colours
- [NEW] [aitom_family/chat_upload_source_picker/colours/palette.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/colours/palette.md) - background, text, icon colours.
- [NEW] [aitom_family/chat_upload_source_picker/colours/state_map.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/colours/state_map.md) - hover/selected row and focus.
#### Dimension: data_schema
- [NEW] [aitom_family/chat_upload_source_picker/data_schema/schema.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/data_schema/schema.md) - sources/destinations arrays and defaults.
- [NEW] [aitom_family/chat_upload_source_picker/data_schema/state.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/data_schema/state.md) - selection state and routing notes.
#### Dimension: exposed_tokens
- [NEW] [aitom_family/chat_upload_source_picker/exposed_tokens/token_index.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/exposed_tokens/token_index.md) - 
- [NEW] [aitom_family/chat_upload_source_picker/exposed_tokens/defaults.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/exposed_tokens/defaults.md) - 
#### Dimension: icons
- [NEW] [aitom_family/chat_upload_source_picker/icons/sources.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/icons/sources.md) - optional icons per source/destination type.
#### Dimension: layout
- [NEW] [aitom_family/chat_upload_source_picker/layout/structure.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/layout/structure.md) - popover width/height, list/grid option layout, anchor.
- [NEW] [aitom_family/chat_upload_source_picker/layout/overflow.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/layout/overflow.md) - scrolling behaviour when options exceed max.
#### Dimension: tracking
- [NEW] [aitom_family/chat_upload_source_picker/tracking/events.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/tracking/events.md) - upload_source_opened, upload_source_selected, future destination_selected.
- [NEW] [aitom_family/chat_upload_source_picker/tracking/guardrails.md.](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/tracking/guardrails.md.) - 
#### Dimension: typography
- [NEW] [aitom_family/chat_upload_source_picker/typography/options.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/typography/options.md) - preset for option labels.
#### Dimension: views
- [NEW] [aitom_family/chat_upload_source_picker/views/options.md](/Users/jaynowman/dev/aitoms_fam/aitom_family/chat_upload_source_picker/views/options.md) - source list/grid with hover/selected.

## Verification Plan

### Automated Verification

- Run a script to verify that all files listed above exist.
- Check that file content is not empty.