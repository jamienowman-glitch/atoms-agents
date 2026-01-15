## atom: lanes_calendar_grid_v1
dimension: exposed_tokens
target_folder: aitom_family/lanes_calendar_grid_v1/exposed_tokens/
tasks:
- Export design tokens. Typography: Day/Lane label specs (font, size, weight, tracking). Colours: Bg, Text, Cell Fills/Borders. Layout: Cell size, Spacing, Gutter width.
STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: exposed_tokens

Target folder:
- aitom_family/floating_pill_toolbar/exposed_tokens/

Required files:
- aitom_family/floating_pill_toolbar/exposed_tokens/token_index.md
- aitom_family/floating_pill_toolbar/exposed_tokens/defaults.md

Implementation notes:
- Expose tokens for: snap grid size/origin, chat-rail exclusion padding, pill heights/widths (collapsed/expanded), radius, padding, icon gaps, sub-pill size, gather offsets, expansion direction rules, tap-vs-drag threshold, drag start delay, animation duration/ease, colour hooks, icon refs, optional label typography, tracking_id/view_id.
- Provide default values and safe ranges for grid spacing, offsets, animation timings (with reduced-motion fallback), and cluster offsets to avoid collisions.

STATUS: DONE

### ATOM: maybes_note
dimension: exposed_tokens

Target folder:
- aitom_family/maybes_note/exposed_tokens/

Required files:
- aitom_family/maybes_note/exposed_tokens/token_index.md
- aitom_family/maybes_note/exposed_tokens/defaults.md

Implementation notes:
- Expose: colour_token (design palette ref), title/body typography refs, padding, radius, spacing title→body, max_width, pinned badge style, archived overlay, layout_x/layout_y/layout_scale, canvas snap grid (if any), drag/resize affordance visibility, tracking override.
- Provide defaults: dark surface with light text, standard padding/radius, no Nexus mirror by default, pinned highlight subtle, archived dimmed; layout scales constrained to safe ranges.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_rail_header_bar/exposed_tokens/

Required files:
- aitom_family/chat_rail_header_bar/exposed_tokens/token_index.md
- aitom_family/chat_rail_header_bar/exposed_tokens/defaults.md

Implementation notes:
- Expose: header_height, padding, icon order/spacing, icon size, label typography ref, active underline/fill tokens, focus ring, label visibility toggle for narrow widths, tracking_key override.
- Provide defaults and safe ranges; keep colour refs semantic.

STATUS: DONE

### ATOM: chat_message_list
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_list/exposed_tokens/

Required files:
- aitom_family/chat_message_list/exposed_tokens/token_index.md
- aitom_family/chat_message_list/exposed_tokens/defaults.md

Implementation notes:
- Expose: list_padding, message_spacing, max_line_width, auto_scroll_threshold, loading/empty placeholder toggles; inherit typography/colours from child atoms.
- Defaults keep no horizontal scroll and snap-to-bottom enabled when near bottom.

STATUS: DONE

### ATOM: chat_message_block
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_block/exposed_tokens/

Required files:
- aitom_family/chat_message_block/exposed_tokens/token_index.md
- aitom_family/chat_message_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: name/body/role_tag typography refs, alignment toggle (agent/user), avatar size/spacing, max_width, spacing name→body→action_bar, highlight overlay colour/duration.
- Defaults keep wrap within rail and high-contrast text.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_action_bar/exposed_tokens/

Required files:
- aitom_family/chat_message_action_bar/exposed_tokens/token_index.md
- aitom_family/chat_message_action_bar/exposed_tokens/defaults.md

Implementation notes:
- Expose: icon size, spacing, padding, hover/pressed/disabled overlays, tooltip typography ref, tracking overrides per action.
- Defaults enforce tap targets and consistent spacing.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_safety_controls_bar/exposed_tokens/

Required files:
- aitom_family/chat_safety_controls_bar/exposed_tokens/token_index.md
- aitom_family/chat_safety_controls_bar/exposed_tokens/defaults.md

Implementation notes:
- Expose: control icon size, spacing, active indicator style, overflow behaviour (wrap/scroll), max_visible_controls.
- Provide defaults keeping bar compact and aligned above input.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: exposed_tokens

Target folder:
- aitom_family/bottom_chat_input_bar/exposed_tokens/

Required files:
- aitom_family/bottom_chat_input_bar/exposed_tokens/token_index.md
- aitom_family/bottom_chat_input_bar/exposed_tokens/defaults.md

Implementation notes:
- Expose: pill_height, corner_radius, padding, upload/shortcut/send icon sizes, input typography ref, placeholder style, enter_vs_shift_enter behaviour token, max_lines, tracking override.
- Defaults ensure no horizontal overflow and send always visible.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: exposed_tokens

Target folder:
- aitom_family/chat_shortcuts_popover/exposed_tokens/

Required files:
- aitom_family/chat_shortcuts_popover/exposed_tokens/token_index.md
- aitom_family/chat_shortcuts_popover/exposed_tokens/defaults.md

Implementation notes:
- Expose: token font size, spacing, popover width/height, corner_radius, animation duration/ease, max_tokens_before_wrap.
- Defaults favour compact pill with reduced-motion fallback.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: exposed_tokens

Target folder:
- aitom_family/chat_upload_source_picker/exposed_tokens/

Required files:
- aitom_family/chat_upload_source_picker/exposed_tokens/token_index.md
- aitom_family/chat_upload_source_picker/exposed_tokens/defaults.md

Implementation notes:
- Expose: picker_width, row_height, padding, corner_radius, icon size, max_visible_options, selection highlight tokens, tracking overrides.
- Defaults keep popover compact and anchored to input without covering controls.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: exposed_tokens

Target folder:
- aitom_family/chat_icon_band_popover/exposed_tokens/

Required files:
- aitom_family/chat_icon_band_popover/exposed_tokens/token_index.md
- aitom_family/chat_icon_band_popover/exposed_tokens/defaults.md

Implementation notes:
- Expose: band_height, icon size, spacing, padding, scroll behaviour (snap/free), active state styling, label typography ref (optional), tracking override.
- Defaults maintain single-band visibility and mobile horizontal scroll without breaking layout.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: exposed_tokens

Target folder:
- aitom_family/chat_rail_shell/exposed_tokens/

Required files:
- aitom_family/chat_rail_shell/exposed_tokens/token_index.md
- aitom_family/chat_rail_shell/exposed_tokens/defaults.md

Implementation notes:
- Expose: chat_rail_corner_radius, chat_rail_max_width, chat_rail_padding, chat_header_height, state heights (nano/micro/standard/full), safe-area offsets, docked/undocked positions, band_height, message_list_min/max_height, state transition duration/ease, tracking_key override.
- Behaviour tokens: state transition map, nano preview click behaviour, band toggle policy (exclusive), auto-scroll threshold, dock snap grid.
- Provide defaults and safe ranges; ensure horizontal overflow prevention (send button always visible) encoded in spacing tokens.

STATUS: DONE

### ATOM: chat_card_v1
dimension: exposed_tokens

Target folder:
- aitom_family/chat_card_v1/exposed_tokens/

Required files:
- aitom_family/chat_card_v1/exposed_tokens/token_index.md – list all tokens that higher-level templates/apps can override.
- aitom_family/chat_card_v1/exposed_tokens/mapping.md – describe how exposed tokens map to each dimension (typography, colours, layout, icons, behaviour).
- aitom_family/chat_card_v1/exposed_tokens/defaults.md – capture default token values and inheritance notes.

Implementation notes:
- Enumerate typography presets (chat_card_handle, chat_card_role, chat_card_preview) as exposed tokens so apps can remap axis values while preserving preset names.
- Expose colour tokens for background surface, pill stroke, pill fill, hover/active fills, text roles, unread indicator, and glow/outline where applicable.
- Expose layout tokens: pill corner radius, stroke weight, avatar size, avatar cluster offsets/scales, horizontal/vertical padding, gap between avatar and text, gap between text and preview, and row gap.
- Expose behaviour-related tokens: transition durations/easing, unread badge size/position, and state opacity levels.
- Expose icon set selector tokens for single avatar and group cluster members to allow brand-level swaps without changing file paths in code.
- Clarify that defaults live in this atom but are overrideable at template/app level; include guidance on safe ranges for overrides.

STATUS: DONE

### ATOM: section_hero_banner
dimension: exposed_tokens

Target folder:
- aitom_family/section_hero_banner/exposed_tokens/

Required files:
- aitom_family/section_hero_banner/exposed_tokens/token_index.md
- aitom_family/section_hero_banner/exposed_tokens/defaults.md

Implementation notes:
- Expose: overlay colour/opacity, media aspect/fill, padding top/bottom, content alignment, text max_width, spacing between heading/body/CTA, full_bleed toggle, heading/body presets (refs), CTA tokens (refs to button), play icon tokens (if video), tracking_id/view_id.
- Provide defaults and safe ranges for spacing/max_width/overlay opacity.

STATUS: DONE

### ATOM: section_rich_text
dimension: exposed_tokens

Target folder:
- aitom_family/section_rich_text/exposed_tokens/

Required files:
- aitom_family/section_rich_text/exposed_tokens/token_index.md
- aitom_family/section_rich_text/exposed_tokens/defaults.md

Implementation notes:
- Expose: heading/body presets (refs), link state colours, spacing (heading-body, body-CTA, top/bottom), max_width, alignment, CTA tokens (refs), tracking_id/view_id.
- Provide defaults and ranges; no content tokens.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: exposed_tokens

Target folder:
- aitom_family/section_multicolumn_features/exposed_tokens/

Required files:
- aitom_family/section_multicolumn_features/exposed_tokens/token_index.md
- aitom_family/section_multicolumn_features/exposed_tokens/defaults.md

Implementation notes:
- Expose: column counts per breakpoint, row/column gaps, padding, card surface variant, feature icon size, heading/body presets, CTA tokens, alignment, optional divider toggle, tracking_id/view_id.
- Provide defaults and safe ranges; align with 24-column grid.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: exposed_tokens

Target folder:
- aitom_family/section_featured_collection_grid/exposed_tokens/

Required files:
- aitom_family/section_featured_collection_grid/exposed_tokens/token_index.md
- aitom_family/section_featured_collection_grid/exposed_tokens/defaults.md

Implementation notes:
- Expose: columns per breakpoint, gutters/row gaps, item_limit, card surface variant, section heading/body presets, CTA tokens, loading/empty state tokens, padding, alignment, tracking_id/view_id.
- Provide defaults and ranges; keep colour/typography references to theme tokens.

STATUS: DONE

### ATOM: section_collection_list
dimension: exposed_tokens

Target folder:
- aitom_family/section_collection_list/exposed_tokens/

Required files:
- aitom_family/section_collection_list/exposed_tokens/token_index.md
- aitom_family/section_collection_list/exposed_tokens/defaults.md

Implementation notes:
- Expose: columns per breakpoint, gaps, card surface variant, image aspect/radius, layout_mode (grid/list) toggle, section typography presets, CTA tokens, padding/alignment, tracking_id/view_id, loading/empty tokens.
- Provide defaults and safe ranges; align to 24-column grid.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: exposed_tokens
Target folder:
- aitom_family/wireframe_canvas/exposed_tokens/

Tasks:
- Expose grid tokens: canvas background colour, grid line colour/thickness, snap spacing, and grid visibility toggle.
- Expose behaviour tokens: snap enabled default, drag threshold, SSE update throttle, and element lock/select flags.
- Expose overlay tokens: typography presets for labels, icon sizes/colours for handles, highlight colours for selection/remote agents, and coordinate readout format.

STATUS: DONE

### ATOM: blackboard
Dimension: exposed_tokens
Target folder:
- aitom_family/blackboard/exposed_tokens/

Tasks:
- Expose grid tokens: canvas background colour, grid line colour/thickness, snap spacing, and grid visibility toggle.
- Expose behaviour tokens: snap enabled default, drag threshold, live-update throttle for SSE, and selectable/lockable element flags.
- Expose overlay tokens: typography presets for labels, icon sizes/colours for handles, highlight colours for selection/remote agents, and coordinate readout format.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: exposed_tokens
Target folder:
- aitom_family/multi_feed_tile/exposed_tokens/

Tasks:
- Publish styling tokens: tile_bg_color, tile_border_color, tile_border_radius, tile_padding, tile_gap, tile_hover_scale, tile_aspect_ratio, and media_overlay_opacity.
- Expose typography preset tokens for title, subtitle/label, KPI metric value/label, and CTA label referencing Roboto Flex axes.
- Provide behaviour/layout tokens: clickable flag, draggable flag, CTA visibility/styling knobs, icon colour/sizing tokens so agents can tune overlays without code changes.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: exposed_tokens

Target folder:
- aitom_family/theme_layout_settings/exposed_tokens/

Required files:
- aitom_family/theme_layout_settings/exposed_tokens/token_index.md – list exposed layout tokens.
- aitom_family/theme_layout_settings/exposed_tokens/defaults.md – default values/ranges.

Implementation notes:
- Expose: grid_span_mobile/tablet/desktop defaults, outer_margin_*, gutter_*, container_max_width, section_padding_top/bottom, vertical_gap, safe_area_insets, full_bleed toggle, density preset selector, focus ring colour for layout guides.
- Provide safe ranges and note dependency on 24-column spec.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: exposed_tokens

Target folder:
- aitom_family/theme_colour_schemes/exposed_tokens/

Required files:
- aitom_family/theme_colour_schemes/exposed_tokens/token_index.md
- aitom_family/theme_colour_schemes/exposed_tokens/defaults.md

Implementation notes:
- Expose scheme list and tokens: surfaces (primary/secondary/overlay), text roles, strokes, accents, button fills/outline, focus, hover/pressed/disabled, error/success, overlay/opacity, default_scheme_id.
- Include notes on high-contrast overrides and safe ranges; all values overrideable by builder.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: exposed_tokens

Target folder:
- aitom_family/theme_typography_settings/exposed_tokens/

Required files:
- aitom_family/theme_typography_settings/exposed_tokens/token_index.md
- aitom_family/theme_typography_settings/exposed_tokens/defaults.md

Implementation notes:
- Expose preset names and their axis tokens (wght, wdth, slnt, opsz, tracking, line-height) for h1–h6, body-lg/md/sm, label/meta, button, caption/overline; include size ramps per breakpoint.
- Provide allowable ranges and compact/comfortable line-height switches; include typography_theme_id selector.

STATUS: DONE

### ATOM: theme_card_surface
dimension: exposed_tokens

Target folder:
- aitom_family/theme_card_surface/exposed_tokens/

Required files:
- aitom_family/theme_card_surface/exposed_tokens/token_index.md
- aitom_family/theme_card_surface/exposed_tokens/defaults.md

Implementation notes:
- Expose tokens: surface fills (dark/light), stroke colour/weight, radius scales, padding scales (compact/comfortable), elevation/glow levels, hover/pressed/selected/focus state tokens, badge slot position, outline vs filled variant toggle.
- Provide safe ranges and default variant selector.

STATUS: DONE

### ATOM: layout_group_container
dimension: exposed_tokens

Target folder:
- aitom_family/layout_group_container/exposed_tokens/

Required files:
- aitom_family/layout_group_container/exposed_tokens/token_index.md
- aitom_family/layout_group_container/exposed_tokens/defaults.md

Implementation notes:
- Expose: grid_span_* defaults, padding (top/bottom/left/right), gap, background/stroke token refs, radius (if used), full_bleed toggle, max_width_override, alignment, density preset, spacing above/below, tracking_id/view_id hooks.
- Provide default values and safe ranges aligned to theme_layout_settings and 24-column constraints.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: exposed_tokens

Target folder:
- aitom_family/layout_columns_grid/exposed_tokens/

Required files:
- aitom_family/layout_columns_grid/exposed_tokens/token_index.md
- aitom_family/layout_columns_grid/exposed_tokens/defaults.md

Implementation notes:
- Expose: column_count per breakpoint, default child span/offset tokens, gutter override, row_gap, column_divider stroke/style toggle, equal_height toggle, alignment tokens, wrap_on_mobile toggle.
- Provide safe ranges; reference 24-column grid rules.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: exposed_tokens

Target folder:
- aitom_family/layout_spacer_block/exposed_tokens/

Required files:
- aitom_family/layout_spacer_block/exposed_tokens/token_index.md
- aitom_family/layout_spacer_block/exposed_tokens/defaults.md

Implementation notes:
- Expose spacer_size tokens (xs–xl), breakpoint overrides, density modifier, optional debug outline toggle.
- Include default size values and allowable min/max clamps.

STATUS: DONE

### ATOM: layout_divider_block
dimension: exposed_tokens

Target folder:
- aitom_family/layout_divider_block/exposed_tokens/

Required files:
- aitom_family/layout_divider_block/exposed_tokens/token_index.md
- aitom_family/layout_divider_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: stroke colour/weight/style tokens, inset/margins per breakpoint, spacing above/below, divider_length (full/inset), optional label typography token ref, dashed/dotted toggle.
- Provide safe ranges and default values; keep decorative by default unless label enabled.

STATUS: DONE

### ATOM: heading_block
dimension: exposed_tokens

Target folder:
- aitom_family/heading_block/exposed_tokens/

Required files:
- aitom_family/heading_block/exposed_tokens/token_index.md
- aitom_family/heading_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: heading level, typography preset per level, alignment, max_width, spacing above/below, underline/divider toggle tokens, link toggle + state colour refs, tracking_id/view_id.
- Provide default values and safe ranges for max_width and spacing; keep tokens agnostic.

STATUS: DONE

### ATOM: rich_text_block
dimension: exposed_tokens

Target folder:
- aitom_family/rich_text_block/exposed_tokens/

Required files:
- aitom_family/rich_text_block/exposed_tokens/token_index.md
- aitom_family/rich_text_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: body/emphasis/link typography presets, link colours/states, paragraph spacing, spacing above/below, max_width, alignment, link target/rel toggle, tracking_id/view_id.
- Provide defaults and safe ranges; no content tokens.

STATUS: DONE

### ATOM: button_single
dimension: exposed_tokens

Target folder:
- aitom_family/button_single/exposed_tokens/

Required files:
- aitom_family/button_single/exposed_tokens/token_index.md
- aitom_family/button_single/exposed_tokens/defaults.md

Implementation notes:
- Expose: variant (solid/outline), label preset, padding X/Y, radius, stroke width, fill/stroke/text colours per state, focus ring, icon size/gap, min width, full_width_mobile toggle, loading state token, tracking_id/view_id.
- Provide safe ranges; align colours with theme schemes.

STATUS: DONE

### ATOM: button_group
dimension: exposed_tokens

Target folder:
- aitom_family/button_group/exposed_tokens/

Required files:
- aitom_family/button_group/exposed_tokens/token_index.md
- aitom_family/button_group/exposed_tokens/defaults.md

Implementation notes:
- Expose: orientation per breakpoint, gap, alignment, primary/secondary variant assignment, shared radius/padding via button_single tokens, stacking toggle, tracking_id/view_id.
- Provide defaults and ranges; inherit from button_single.

STATUS: DONE

### ATOM: image_media_block
dimension: exposed_tokens

Target folder:
- aitom_family/image_media_block/exposed_tokens/

Required files:
- aitom_family/image_media_block/exposed_tokens/token_index.md
- aitom_family/image_media_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: aspect_ratio, object_fit, radius, stroke, padding inset, overlay colour/opacity, hover overlay toggle, caption preset ref, alignment, link toggle, placeholder token, tracking_id/view_id.
- Provide defaults and ranges; keep colour refs to theme schemes.

STATUS: DONE

### ATOM: video_media_block
dimension: exposed_tokens

Target folder:
- aitom_family/video_media_block/exposed_tokens/

Required files:
- aitom_family/video_media_block/exposed_tokens/token_index.md
- aitom_family/video_media_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: aspect_ratio, radius, stroke, overlay colour/opacity, play icon size/position, controls visibility, autoplay/mute/loop toggles, nocookie toggle, caption preset ref, tracking_id/view_id.
- Provide defaults and ranges; align colours with theme schemes.

STATUS: DONE

### ATOM: accordion_item
dimension: exposed_tokens

Target folder:
- aitom_family/accordion_item/exposed_tokens/

Required files:
- aitom_family/accordion_item/exposed_tokens/token_index.md
- aitom_family/accordion_item/exposed_tokens/defaults.md

Implementation notes:
- Expose: header/body typography presets, header/body padding, icon size/colour, divider stroke, radius, expand/collapse animation duration/ease, start_open, mode (single/multi), spacing above/below, tracking_id/view_id.
- Provide defaults and safe ranges; respect reduced motion for animation tokens.

STATUS: DONE

### ATOM: section_media_collage
dimension: exposed_tokens

Target folder:
- aitom_family/section_media_collage/exposed_tokens/

Required files:
- aitom_family/section_media_collage/exposed_tokens/token_index.md
- aitom_family/section_media_collage/exposed_tokens/defaults.md

Implementation notes:
- Expose: pattern selection, tile spans/aspect ratios, gaps, padding, overlay colour/opacity, radius/stroke, caption presets, clickable toggle, card surface variant (if used), tracking_id/view_id.
- Provide defaults and safe ranges; align to 24-column grid rules.

STATUS: DONE

### ATOM: section_image_with_text
dimension: exposed_tokens

Target folder:
- aitom_family/section_image_with_text/exposed_tokens/

Required files:
- aitom_family/section_image_with_text/exposed_tokens/token_index.md
- aitom_family/section_image_with_text/exposed_tokens/defaults.md

Implementation notes:
- Expose: media/text spans per breakpoint, swap toggle, gap, padding, media aspect/radius/stroke, overlay opacity, text max_width/alignment, CTA tokens (refs), tracking_id/view_id.
- Provide defaults and ranges; ensure reading order guidance.

STATUS: DONE

### ATOM: section_slideshow
dimension: exposed_tokens

Target folder:
- aitom_family/section_slideshow/exposed_tokens/

Required files:
- aitom_family/section_slideshow/exposed_tokens/token_index.md
- aitom_family/section_slideshow/exposed_tokens/defaults.md

Implementation notes:
- Expose: autoplay (bool), interval, transition type/duration/ease, overlay colour/opacity, padding, content alignment/max_width, media aspect, control style (arrows/dots), control placement, CTA tokens, tracking_id/view_id.
- Provide defaults and safe ranges; respect reduced motion/consent toggles.

STATUS: DONE

### ATOM: section_blog_posts
dimension: exposed_tokens

Target folder:
- aitom_family/section_blog_posts/exposed_tokens/

Required files:
- aitom_family/section_blog_posts/exposed_tokens/token_index.md
- aitom_family/section_blog_posts/exposed_tokens/defaults.md

Implementation notes:
- Expose: columns per breakpoint, gaps, card surface variant, image aspect/radius, item_limit, section typography presets, CTA tokens, padding/alignment, loading/empty tokens, tracking_id/view_id.
- Provide defaults and ranges; keep colour/typography refs to theme tokens.

STATUS: DONE

### ATOM: section_email_signup
dimension: exposed_tokens

Target folder:
- aitom_family/section_email_signup/exposed_tokens/

Required files:
- aitom_family/section_email_signup/exposed_tokens/token_index.md
- aitom_family/section_email_signup/exposed_tokens/defaults.md

Implementation notes:
- Expose: input padding/radius/stroke/fill tokens, label/helper/error presets, spacing between form elements, max_width, alignment, button tokens (refs), error/success state tokens, tracking_id/view_id.
- Provide defaults and safe ranges; ensure PII not included.

STATUS: DONE

### ATOM: section_custom_markup
dimension: exposed_tokens

Target folder:
- aitom_family/section_custom_markup/exposed_tokens/

Required files:
- aitom_family/section_custom_markup/exposed_tokens/token_index.md
- aitom_family/section_custom_markup/exposed_tokens/defaults.md

Implementation notes:
- Expose: padding, background/stroke tokens, max_width, full_bleed toggle, inherit_typography/colour flags, tracking_id/view_id.
- Provide defaults and ranges; note that content is external and not tokenized here.

STATUS: DONE

### ATOM: product_media_gallery
dimension: exposed_tokens

Target folder:
- aitom_family/product_media_gallery/exposed_tokens/

Required files:
- aitom_family/product_media_gallery/exposed_tokens/token_index.md
- aitom_family/product_media_gallery/exposed_tokens/defaults.md

Implementation notes:
- Expose: layout_mode (thumb orientation), aspect_ratio, thumb size/gap, radius/stroke, overlay colour/opacity, active thumb styling, zoom/lightbox toggle, video overlay tokens, padding, tracking_id/view_id.
- Provide defaults and safe ranges; align with 24-column layout.

STATUS: DONE

### ATOM: product_info_stack
dimension: exposed_tokens

Target folder:
- aitom_family/product_info_stack/exposed_tokens/

Required files:
- aitom_family/product_info_stack/exposed_tokens/token_index.md
- aitom_family/product_info_stack/exposed_tokens/defaults.md

Implementation notes:
- Expose: spacing between child blocks, padding, optional divider toggle, alignment, sticky offset passthrough, tracking_id/view_id. No content tokens.

STATUS: DONE

### ATOM: product_title_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_title_block/exposed_tokens/

Required files:
- aitom_family/product_title_block/exposed_tokens/token_index.md
- aitom_family/product_title_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: title/subtitle typography presets, alignment, max_width, spacing, underline/divider toggle, link enabled, tracking_id/view_id.
- Provide default values and ranges; keep agnostic.

STATUS: DONE

### ATOM: product_price_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_price_block/exposed_tokens/

Required files:
- aitom_family/product_price_block/exposed_tokens/token_index.md
- aitom_family/product_price_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: price/compare/badge typography presets, badge styling (fill/text/stroke), spacing between price elements, alignment, strike-through style, tracking_id/view_id. No price values.

STATUS: DONE

### ATOM: product_variant_picker
dimension: exposed_tokens

Target folder:
- aitom_family/product_variant_picker/exposed_tokens/

Required files:
- aitom_family/product_variant_picker/exposed_tokens/token_index.md
- aitom_family/product_variant_picker/exposed_tokens/defaults.md

Implementation notes:
- Expose: control type (dropdown/buttons/swatches), label/value typography presets, swatch size/radius/spacing, dropdown padding/radius, spacing between options, hover/focus/selected/disabled/error state tokens, alignment, tracking_id/view_id.
- Provide default ranges and note reduced-motion handling for state animations.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_buy_buttons_block/exposed_tokens/

Required files:
- aitom_family/product_buy_buttons_block/exposed_tokens/token_index.md
- aitom_family/product_buy_buttons_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: add_to_cart/buy_now variant selection, label preset ref, padding, radius, gap, alignment, full_width_mobile toggle, sticky_enabled, sticky_offset, loading/disabled tokens, tracking_id/view_id. Colours via button_single refs.

STATUS: DONE

### ATOM: product_description_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_description_block/exposed_tokens/

Required files:
- aitom_family/product_description_block/exposed_tokens/token_index.md
- aitom_family/product_description_block/exposed_tokens/defaults.md

Implementation notes:
- Expose: body/emphasis/link presets, link colours/states, paragraph spacing, spacing above/below, max_width, truncation toggle/lines, read_more label token, tracking_id/view_id.
- Provide default values and ranges.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: exposed_tokens

Target folder:
- aitom_family/product_collapsible_section/exposed_tokens/

Required files:
- aitom_family/product_collapsible_section/exposed_tokens/token_index.md
- aitom_family/product_collapsible_section/exposed_tokens/defaults.md

Implementation notes:
- Expose: header/body presets, padding, icon size/colour, divider stroke, radius, animation duration/ease, start_open, mode (single/multi), spacing above/below, tracking_id/view_id.
- Provide defaults and safe ranges; respect reduced motion.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: exposed_tokens

Target folder:
- aitom_family/product_recommendations_section/exposed_tokens/

Required files:
- aitom_family/product_recommendations_section/exposed_tokens/token_index.md
- aitom_family/product_recommendations_section/exposed_tokens/defaults.md

Implementation notes:
- Expose: columns per breakpoint, gaps, card surface variant, image aspect/radius, item_limit, section typography presets, CTA tokens, padding/alignment, loading/empty tokens, tracking_id/view_id.
- Provide defaults and ranges; keep references to theme tokens.

STATUS: ACTIVE

### ATOM: wireframe_canvas
dimension: exposed_tokens

Target folder:
- aitom_family/wireframe_canvas/exposed_tokens/

Required files:
- aitom_family/wireframe_canvas/exposed_tokens/config.md – listing of themable values.

Implementation notes:
- canvas_bg_colour, grid_line_primary, grid_line_secondary.
- snap_strength (pixels), default_zoom_level.
- selection_halo_colour.
- Allows builders to reskin the wireframe look (e.g., blue print vs dark mode).

STATUS: ACTIVE

### ATOM: blackboard
dimension: exposed_tokens

Target folder:
- aitom_family/blackboard/exposed_tokens/

Required files:
- aitom_family/blackboard/exposed_tokens/config.md – background_color override.

Implementation notes:
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: exposed_tokens

Target folder:
- aitom_family/theme_layout_settings/exposed_tokens/

Required files:
- aitom_family/theme_layout_settings/exposed_tokens/grid.md – max_width, gutter_width options.

Implementation notes:
- Allow brands to tune "spaciousness".
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: exposed_tokens

Target folder:
- aitom_family/theme_colour_schemes/exposed_tokens/

Required files:
- aitom_family/theme_colour_schemes/exposed_tokens/override.md – full palette replacement vector.

Implementation notes:
- The mechanism for creating a new theme.
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: exposed_tokens

Target folder:
- aitom_family/theme_typography_settings/exposed_tokens/

Required files:
- aitom_family/theme_typography_settings/exposed_tokens/fonts.md – font-family swap, scale_ratio tuning.

Implementation notes:
- Allow brands to swap Roboto Flex for something else (if supported) or tune sizes.
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: exposed_tokens

Target folder:
- aitom_family/theme_card_surface/exposed_tokens/

Required files:
- aitom_family/theme_card_surface/exposed_tokens/geometry.md – border_radius, border_width, flat_vs_elevated.

Implementation notes:
- Major stylistic lever (round vs square cards).
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: accordion_item
dimension: exposed_tokens

Target folder:
- aitom_family/accordion_item/exposed_tokens/

Required files:
- aitom_family/accordion_item/exposed_tokens/style.md – border_width, icon_rotation.

Implementation notes:
- Status: ACTIVE

### ATOM: button_group
dimension: exposed_tokens

Target folder:
- aitom_family/button_group/exposed_tokens/

Required files:
- aitom_family/button_group/exposed_tokens/layout.md – gap_default.

Implementation notes:
- Status: ACTIVE

### ATOM: button_single
dimension: exposed_tokens

Target folder:
- aitom_family/button_single/exposed_tokens/

Required files:
- aitom_family/button_single/exposed_tokens/variants.md – radius, padding, text_transform.

Implementation notes:
- Status: ACTIVE

### ATOM: heading_block
dimension: exposed_tokens

Target folder:
- aitom_family/heading_block/exposed_tokens/

Required files:
- aitom_family/heading_block/exposed_tokens/typography.md – preset overrides.

Implementation notes:
- Status: ACTIVE

### ATOM: rich_text_block
dimension: exposed_tokens

Target folder:
- aitom_family/rich_text_block/exposed_tokens/

Required files:
- aitom_family/rich_text_block/exposed_tokens/typography.md – prose overrides.

Implementation notes:
- Status: ACTIVE

### ATOM: image_media_block
dimension: exposed_tokens

Target folder:
- aitom_family/image_media_block/exposed_tokens/

Required files:
- aitom_family/image_media_block/exposed_tokens/visuals.md – radius, shadow.

Implementation notes:
- Status: ACTIVE

### ATOM: video_media_block
dimension: exposed_tokens

Target folder:
- aitom_family/video_media_block/exposed_tokens/

Required files:
- aitom_family/video_media_block/exposed_tokens/visuals.md – radius, shadow.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: exposed_tokens

Target folder:
- aitom_family/layout_columns_grid/exposed_tokens/

Required files:
- aitom_family/layout_columns_grid/exposed_tokens/config.md – gap options.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: exposed_tokens

Target folder:
- aitom_family/layout_divider_block/exposed_tokens/

Required files:
- aitom_family/layout_divider_block/exposed_tokens/style.md – color, thickness.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_group_container
dimension: exposed_tokens

Target folder:
- aitom_family/layout_group_container/exposed_tokens/

Required files:
- aitom_family/layout_group_container/exposed_tokens/style.md – padding options, max_width options.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: exposed_tokens

Target folder:
- aitom_family/layout_spacer_block/exposed_tokens/

Required files:
- aitom_family/layout_spacer_block/exposed_tokens/sizes.md – available spacers.

Implementation notes:
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: exposed_tokens

Target folder:
- aitom_family/floating_pill_toolbar/exposed_tokens/

Required files:
- aitom_family/floating_pill_toolbar/exposed_tokens/style.md – radius, shadow.

Implementation notes:
- Status: ACTIVE

### ATOM: maybes_note
dimension: exposed_tokens

Target folder:
- aitom_family/maybes_note/exposed_tokens/

Required files:
- aitom_family/maybes_note/exposed_tokens/appearance.md – tint options.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: chat_card_v1
dimension: exposed_tokens

Target folder:
- aitom_family/chat_card_v1/exposed_tokens/

Required files:
- aitom_family/chat_card_v1/exposed_tokens/style.md – radius, elevation.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: exposed_tokens

Target folder:
- aitom_family/chat_rail_shell/exposed_tokens/

Required files:
- aitom_family/chat_rail_shell/exposed_tokens/layout.md – max_width choice.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_rail_header_bar/exposed_tokens/

Required files:
- aitom_family/chat_rail_header_bar/exposed_tokens/style.md – border toggle.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_list/exposed_tokens/

Required files:
- aitom_family/chat_message_list/exposed_tokens/layout.md – padding override.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_block/exposed_tokens/

Required files:
- aitom_family/chat_message_block/exposed_tokens/style.md – bubble radius.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_message_action_bar/exposed_tokens/

Required files:
- aitom_family/chat_message_action_bar/exposed_tokens/config.md – show/hide actions.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: exposed_tokens

Target folder:
- aitom_family/chat_safety_controls_bar/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: exposed_tokens

Target folder:
- aitom_family/bottom_chat_input_bar/exposed_tokens/

Required files:
- aitom_family/bottom_chat_input_bar/exposed_tokens/style.md – border_radius.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: exposed_tokens

Target folder:
- aitom_family/chat_shortcuts_popover/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: exposed_tokens

Target folder:
- aitom_family/chat_upload_source_picker/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: exposed_tokens

Target folder:
- aitom_family/chat_icon_band_popover/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: exposed_tokens

Target folder:
- aitom_family/surface_header_nano/exposed_tokens/

Required files:
- aitom_family/surface_header_nano/exposed_tokens/config.md – trigger width.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: exposed_tokens

Target folder:
- aitom_family/surface_header_shell_micro/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: exposed_tokens

Target folder:
- aitom_family/surface_header_shell_standard/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: exposed_tokens

Target folder:
- aitom_family/surface_logo_centerpiece/exposed_tokens/

Required files:
- aitom_family/surface_logo_centerpiece/exposed_tokens/assets.md – logo svg override.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: exposed_tokens

Target folder:
- aitom_family/app_header_appname_dropdown/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: exposed_tokens

Target folder:
- aitom_family/macro_temp_indicator/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: exposed_tokens

Target folder:
- aitom_family/main_menu_icon_button/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: product_buy_buttons_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_buy_buttons_block/exposed_tokens/

Required files:
- aitom_family/product_buy_buttons_block/exposed_tokens/style.md – full_width.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: exposed_tokens

Target folder:
- aitom_family/product_collapsible_section/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_description_block/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: exposed_tokens

Target folder:
- aitom_family/product_info_stack/exposed_tokens/

Required files:
- aitom_family/product_info_stack/exposed_tokens/layout.md – gap options.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: exposed_tokens

Target folder:
- aitom_family/product_media_gallery/exposed_tokens/

Required files:
- aitom_family/product_media_gallery/exposed_tokens/layout.md – thumbnail position.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_price_block/exposed_tokens/

Required files:
- aitom_family/product_price_block/exposed_tokens/typography.md – size override.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: exposed_tokens

Target folder:
- aitom_family/product_recommendations_section/exposed_tokens/

Required files:
- aitom_family/product_recommendations_section/exposed_tokens/config.md – heading text.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: exposed_tokens

Target folder:
- aitom_family/product_title_block/exposed_tokens/

Required files:
- aitom_family/product_title_block/exposed_tokens/typography.md – size override.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: exposed_tokens

Target folder:
- aitom_family/product_variant_picker/exposed_tokens/

Required files:
- aitom_family/product_variant_picker/exposed_tokens/style.md – pills vs dropdown.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: exposed_tokens

Target folder:
- aitom_family/section_blog_posts/exposed_tokens/

Required files:
- aitom_family/section_blog_posts/exposed_tokens/layout.md – grid columns.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: exposed_tokens

Target folder:
- aitom_family/section_collection_list/exposed_tokens/

Required files:
- aitom_family/section_collection_list/exposed_tokens/layout.md – grid columns.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: exposed_tokens

Target folder:
- aitom_family/section_custom_markup/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: exposed_tokens

Target folder:
- aitom_family/section_email_signup/exposed_tokens/

Required files:
- aitom_family/section_email_signup/exposed_tokens/style.md – color scheme.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: exposed_tokens

Target folder:
- aitom_family/section_featured_collection_grid/exposed_tokens/

Required files:
- aitom_family/section_featured_collection_grid/exposed_tokens/layout.md – products per row.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: exposed_tokens

Target folder:
- aitom_family/section_hero_banner/exposed_tokens/

Required files:
- aitom_family/section_hero_banner/exposed_tokens/layout.md – height options (small/med/large).

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: exposed_tokens

Target folder:
- aitom_family/section_image_with_text/exposed_tokens/

Required files:
- aitom_family/section_image_with_text/exposed_tokens/layout.md – image position (left/right).

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: exposed_tokens

Target folder:
- aitom_family/section_media_collage/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: exposed_tokens

Target folder:
- aitom_family/section_multicolumn_features/exposed_tokens/

Required files:
- aitom_family/section_multicolumn_features/exposed_tokens/layout.md – column count.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: exposed_tokens

Target folder:
- aitom_family/section_rich_text/exposed_tokens/

Required files:
- aitom_family/section_rich_text/exposed_tokens/style.md – align (center/left).

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: exposed_tokens

Target folder:
- aitom_family/section_slideshow/exposed_tokens/

Required files:
- aitom_family/section_slideshow/exposed_tokens/config.md – autoplay speed.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: exposed_tokens

Target folder:
- aitom_family/lanes_calendar_grid_v1/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: exposed_tokens

Target folder:
- aitom_family/multi_feed_tile/exposed_tokens/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
