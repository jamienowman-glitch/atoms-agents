### ATOM: multi_feed_tile
Dimension: typography
Target folder:
- aitom_family/multi_feed_tile/typography/

Tasks:
- Declare Roboto Flex presets for title, subtitle/label, KPI metric value/label, and CTA label; map to the `primary` font key.
- Specify axis tokens (wght, wdth, opsz, and tracking/slnt if needed) per preset to avoid hardcoded weights.
- Define typography token hooks for mode-specific text (product title/price, KPI emphasis, CTA) while keeping colour handled separately.

STATUS: DONE

### ATOM: app_header_appname_dropdown
dimension: typography

Target folder:
- aitom_family/app_header_appname_dropdown/typography/

Required files:
- aitom_family/app_header_appname_dropdown/typography/presets.md – presets for full label and optional prefix/suffix/superscript parts.
- aitom_family/app_header_appname_dropdown/typography/axis_tokens.md – axis tokens for each part and open/hover variants.

Implementation notes:
- Define Roboto Flex presets: prefix (semi-bold uppercase), suffix (lighter italic uppercase), superscript (scaled). Provide single-line ellipsis guidance.
- Include tracking/line-height tokens and density adjustments; expose presets upward.

STATUS: DONE

### ATOM: maybes_note
dimension: typography

Target folder:
- aitom_family/maybes_note/typography/

Required files:
- aitom_family/maybes_note/typography/title_body.md – presets for optional title and body.
- aitom_family/maybes_note/typography/axis_tokens.md – axis tokens for title/body and badge text.

Implementation notes:
- Roboto Flex presets: title mid-weight, body regular; support long text with comfortable line-height; optional badge/meta uses meta preset.
- Single-line ellipsis for title; body multi-line with wrap; no decorative fonts.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: typography

Target folder:
- aitom_family/chat_rail_header_bar/typography/

Required files:
- aitom_family/chat_rail_header_bar/typography/app_label.md – preset for app/surface label with truncation guidance.
- aitom_family/chat_rail_header_bar/typography/axis_tokens.md – axis tokens for label and optional nano preview alignment.

Implementation notes:
- Roboto Flex preset heavier than body; single-line with ellipsis; center aligned; density adjustments minimal.
- Axis tokens for wght/wdth/opsz/line_height/tracking; colours external.

STATUS: DONE

### ATOM: chat_message_list
dimension: typography

Target folder:
- aitom_family/chat_message_list/typography/

Required files:
- aitom_family/chat_message_list/typography/notes.md – references chat_message_block presets; no unique presets.

Implementation notes:
- List inherits body presets from message blocks; note no additional typography defined here.

STATUS: DONE

### ATOM: chat_message_block
dimension: typography

Target folder:
- aitom_family/chat_message_block/typography/

Required files:
- aitom_family/chat_message_block/typography/name_body.md – presets for author name and body.
- aitom_family/chat_message_block/typography/role_tag.md – preset for optional role tag.

Implementation notes:
- Name preset slightly heavier than body; body uses standard chat body; role tag bold/uppercase optional.
- Include line-height and tracking tokens; ensure single-line truncation on name/role tag.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: typography

Target folder:
- aitom_family/chat_message_action_bar/typography/

Required files:
- aitom_family/chat_message_action_bar/typography/tooltips.md – tooltip preset if surfaced.

Implementation notes:
- Icon-only base; document [NO TEXT] unless tooltips shown; tooltips reuse meta preset from theme if enabled.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: typography

Target folder:
- aitom_family/chat_safety_controls_bar/typography/

Required files:
- aitom_family/chat_safety_controls_bar/typography/labels.md – optional labels/numeric indicators preset.

Implementation notes:
- Small/meta preset for labels or numeric values; single-line; spacing handled in layout.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: typography

Target folder:
- aitom_family/bottom_chat_input_bar/typography/

Required files:
- aitom_family/bottom_chat_input_bar/typography/input.md – preset for typed text and placeholder variant.
- aitom_family/bottom_chat_input_bar/typography/shortcuts.md – preset for inline shortcut arrow label if text-based.

Implementation notes:
- Input uses Roboto Flex regular; placeholder variant with lower contrast token; line-height tokens for multiline cap.
- Shortcut arrow is icon by default; if text rendered, use meta preset; keep alignment within pill.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: typography

Target folder:
- aitom_family/chat_shortcuts_popover/typography/

Required files:
- aitom_family/chat_shortcuts_popover/typography/tokens.md – preset for shortcut tokens (², ³ etc.).

Implementation notes:
- Slightly larger than body for tap target; single-line; tracking/line-height tokens included; colours external.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: typography

Target folder:
- aitom_family/chat_upload_source_picker/typography/

Required files:
- aitom_family/chat_upload_source_picker/typography/options.md – preset for option labels.

Implementation notes:
- Single-line labels; mid-weight; ellipsis if needed; active/hover colours handled elsewhere.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: typography

Target folder:
- aitom_family/chat_icon_band_popover/typography/

Required files:
- aitom_family/chat_icon_band_popover/typography/labels.md – optional tiny labels under icons.

Implementation notes:
- Labels use small/meta preset; may be hidden via token; align center under icons; colours external.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: typography

Target folder:
- aitom_family/chat_rail_shell/typography/

Required files:
- aitom_family/chat_rail_shell/typography/label_presets.md – presets for header label and nano preview text.
- aitom_family/chat_rail_shell/typography/body.md – base body preset reference for message list text.

Implementation notes:
- Use Roboto Flex presets: header label heavier than message body; nano preview shares body weight with single-line ellipsis.
- Provide compact vs standard line-height tokens; keep colours external; ensure consistency with downstream chat_message_block presets.

STATUS: DONE

### ATOM: macro_temp_indicator
dimension: typography

Target folder:
- aitom_family/macro_temp_indicator/typography/

Required files:
- aitom_family/macro_temp_indicator/typography/value_preset.md – numeric preset.
- aitom_family/macro_temp_indicator/typography/degree.md – degree glyph sizing/position tokens.

Implementation notes:
- Numeric preset uses Roboto Flex medium; degree uses matched opsz/line-height and scaled size token; ensure baseline alignment.
- Provide compact/comfortable line-height tokens; no colour here.

STATUS: DONE

### ATOM: main_menu_icon_button
dimension: typography

Target folder:
- aitom_family/main_menu_icon_button/typography/

Required files:
- aitom_family/main_menu_icon_button/typography/notes.md – note [NO TYPOGRAPHY].

Implementation notes:
- Icon-only; no text; document no typography unless tooltip is added elsewhere.

STATUS: DONE

### ATOM: surface_header_nano
dimension: typography

Target folder:
- aitom_family/surface_header_nano/typography/

Required files:
- aitom_family/surface_header_nano/typography/notes.md – [NO TYPOGRAPHY] in nano state.

Implementation notes:
- Nano shows icon only; note absence of text. If transition overlay shows text, defer to micro/standard tokens.

STATUS: DONE

### ATOM: surface_header_shell_micro
dimension: typography

Target folder:
- aitom_family/surface_header_shell_micro/typography/

Required files:
- aitom_family/surface_header_shell_micro/typography/app_label.md – preset reference for app name (reuse dropdown preset).
- aitom_family/surface_header_shell_micro/typography/states.md – size adjustments for micro vs standard.

Implementation notes:
- Reference app_header_appname_dropdown preset; provide micro scale tokens (slightly smaller) while keeping readability.
- Include line-height adjustments for compact state; no new fonts.

STATUS: DONE

### ATOM: surface_header_shell_standard
dimension: typography

Target folder:
- aitom_family/surface_header_shell_standard/typography/

Required files:
- aitom_family/surface_header_shell_standard/typography/app_label.md – preset reference for app name.
- aitom_family/surface_header_shell_standard/typography/states.md – default vs compact/scrolled adjustments.

Implementation notes:
- Reference dropdown preset; maintain consistent line-height and truncation guidance; compact state may reduce size slightly via tokens.
- No typography for logo/temperature beyond references to sub-atoms.

STATUS: DONE

### ATOM: surface_logo_centerpiece
dimension: typography

Target folder:
- aitom_family/surface_logo_centerpiece/typography/

Required files:
- aitom_family/surface_logo_centerpiece/typography/notes.md – [NO TYPOGRAPHY].

Implementation notes:
- Image-only; document no text. If caption needed, defer to parent.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: typography

Target folder:
- aitom_family/floating_pill_toolbar/typography/

Required files:
- aitom_family/floating_pill_toolbar/typography/label_presets.md – optional presets for launcher/tool labels if shown.
- aitom_family/floating_pill_toolbar/typography/axis_tokens.md – axis tokens for badge labels and tool label variants.

Implementation notes:
- Default UI is icon-only; document [NO LABEL] path, but provide optional Roboto Flex presets for tiny labels/tooltips tied to theme meta/label presets.
- Axis tokens: wght/wdth/opsz/tracking/line_height for badge label and tool label; include density tweaks for compact/comfortable.
- Keep colours external; expose typography tokens upward for builder overrides.

STATUS: DONE

### ATOM: layout_group_container
dimension: typography

Target folder:
- aitom_family/layout_group_container/typography/

Required files:
- aitom_family/layout_group_container/typography/labels.md – presets for optional section titles/subtitles within container.
- aitom_family/layout_group_container/typography/axis_tokens.md – axis tokens for those presets.

Implementation notes:
- Define optional presets for section heading/subheading/meta when the container carries its own title; bind to Roboto Flex with axis tokens (wght, wdth, slnt, opsz, tracking, line-height).
- Expose presets upward; colour handled elsewhere. Keep minimal if container is mostly structural.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: typography

Target folder:
- aitom_family/layout_columns_grid/typography/

Required files:
- aitom_family/layout_columns_grid/typography/labels.md – presets for column headers/labels if used.
- aitom_family/layout_columns_grid/typography/axis_tokens.md – axis tokens for those labels.

Implementation notes:
- Grid itself is structural; provide lightweight presets for optional column headers or captions; Roboto Flex with exposed axis tokens.
- Keep presets optional; colour separate.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: typography

Target folder:
- aitom_family/layout_spacer_block/typography/

Required files:
- aitom_family/layout_spacer_block/typography/notes.md – note [NO TYPOGRAPHY] unless debug labels used.

Implementation notes:
- Spacer has no text; document no typography presets unless debug mode labels are added (then reference existing meta preset).

STATUS: DONE

### ATOM: layout_divider_block
dimension: typography

Target folder:
- aitom_family/layout_divider_block/typography/

Required files:
- aitom_family/layout_divider_block/typography/label.md – preset for optional divider label.
- aitom_family/layout_divider_block/typography/axis_tokens.md – axis tokens for label.

Implementation notes:
- If a labeled divider is used, define a small/meta preset (Roboto Flex) with axis tokens and truncation guidance; otherwise state [NO LABEL] requirement.
- Expose the label preset upward for theme control.

STATUS: DONE

### ATOM: heading_block
dimension: typography

Target folder:
- aitom_family/heading_block/typography/

Required files:
- aitom_family/heading_block/typography/presets.md – heading levels H1–H6 presets.
- aitom_family/heading_block/typography/axis_tokens.md – axis tokens per level.
- aitom_family/heading_block/typography/link_states.md – link hover/active variants if heading is linked.

Implementation notes:
- Define named presets for H1–H6 (Roboto Flex) with axis tokens (wght, wdth, slnt, opsz, tracking, line-height) and breakpoint-aware sizes/opsz.
- Provide optional link state weight/underline tweaks via tokens; colour handled separately.
- Expose presets upward for builder mapping; include max-width/ellipsis guidance tie-in.

STATUS: DONE

### ATOM: rich_text_block
dimension: typography

Target folder:
- aitom_family/rich_text_block/typography/

Required files:
- aitom_family/rich_text_block/typography/presets.md – body, emphasis, list text presets.
- aitom_family/rich_text_block/typography/axis_tokens.md – axis tokens for each preset.
- aitom_family/rich_text_block/typography/link_states.md – link state typography tweaks if any.

Implementation notes:
- Define body-lg/md/sm and emphasis presets using Roboto Flex with axis tokens; include line-height tokens for compact/comfortable.
- Link typography uses same family with optional weight/underline tokens; colours separate.
- Ensure list markers align with type metrics; expose all presets upward.

STATUS: DONE

### ATOM: button_single
dimension: typography

Target folder:
- aitom_family/button_single/typography/

Required files:
- aitom_family/button_single/typography/preset.md – button label preset.
- aitom_family/button_single/typography/axis_tokens.md – axis tokens for label.

Implementation notes:
- Define button label preset (Roboto Flex) with axis tokens and uppercase toggle token; ensure legibility on black/white variants.
- Expose preset upward; keep letter-spacing/tokenizable; align with padding for vertical centering.

STATUS: DONE

### ATOM: button_group
dimension: typography

Target folder:
- aitom_family/button_group/typography/

Required files:
- aitom_family/button_group/typography/notes.md – reference button_single preset usage.

Implementation notes:
- Reuse button_single label preset; note inheritance and no extra presets needed unless secondary style requires alternate weight; keep tokens exposed via button_single.

STATUS: DONE

### ATOM: image_media_block
dimension: typography

Target folder:
- aitom_family/image_media_block/typography/

Required files:
- aitom_family/image_media_block/typography/caption.md – caption/meta presets.
- aitom_family/image_media_block/typography/axis_tokens.md – axis tokens for caption/meta.

Implementation notes:
- Define caption/meta preset for optional overlays/figcaption; Roboto Flex with small size and clear line-height; expose upward.
- No colour here; ensure readability over dark image via colour tokens elsewhere.

STATUS: DONE

### ATOM: video_media_block
dimension: typography

Target folder:
- aitom_family/video_media_block/typography/

Required files:
- aitom_family/video_media_block/typography/caption.md – caption/meta preset for overlay controls.
- aitom_family/video_media_block/typography/axis_tokens.md – axis tokens for caption/meta.

Implementation notes:
- Provide a small caption preset for overlays or control labels; Roboto Flex with axis tokens; exposed upward. Keep colours separate.

STATUS: DONE

### ATOM: accordion_item
dimension: typography

Target folder:
- aitom_family/accordion_item/typography/

Required files:
- aitom_family/accordion_item/typography/header_body.md – presets for header and body.
- aitom_family/accordion_item/typography/axis_tokens.md – axis tokens for both presets.

Implementation notes:
- Header preset: slightly heavier/condensed option; body preset aligns with rich_text_block body. Both Roboto Flex with axis tokens; include line-height tokens and optional uppercase toggle for header.
- Expose both presets upward; link colours handled elsewhere.

STATUS: DONE

### ATOM: section_hero_banner
dimension: typography

Target folder:
- aitom_family/section_hero_banner/typography/

Required files:
- aitom_family/section_hero_banner/typography/presets.md – headline, subhead/body, CTA label presets.
- aitom_family/section_hero_banner/typography/axis_tokens.md – axis tokens per preset and breakpoint adjustments.

Implementation notes:
- Define headline/subhead/body presets using theme_typography_settings (Roboto Flex) with axis tokens and size ramps per breakpoint; CTA uses button preset reference.
- Provide line-height/letter-spacing tokens for compact/comfortable; link colours handled elsewhere.

STATUS: DONE

### ATOM: section_rich_text
dimension: typography

Target folder:
- aitom_family/section_rich_text/typography/

Required files:
- aitom_family/section_rich_text/typography/presets.md – heading and body/link presets.
- aitom_family/section_rich_text/typography/axis_tokens.md – axis tokens for those presets.

Implementation notes:
- Use heading preset reference + rich_text_block body/link presets; include line-height tokens and max-width guidance; expose upward for override.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: typography

Target folder:
- aitom_family/section_multicolumn_features/typography/

Required files:
- aitom_family/section_multicolumn_features/typography/presets.md – feature heading/body/CTA presets.
- aitom_family/section_multicolumn_features/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define presets for feature title, description, CTA (reuse button preset), optional meta/badge; Roboto Flex with axis tokens; expose per role for overrides.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: typography

Target folder:
- aitom_family/section_featured_collection_grid/typography/

Required files:
- aitom_family/section_featured_collection_grid/typography/presets.md – section heading/body/CTA presets; card text references.
- aitom_family/section_featured_collection_grid/typography/axis_tokens.md – axis tokens for section-level presets.

Implementation notes:
- Section heading/body/CTA presets aligned to theme_typography_settings; card content uses product/card atoms elsewhere—reference not redefine.
- Provide size/line-height tokens for responsiveness; expose upward.

STATUS: DONE

### ATOM: section_collection_list
dimension: typography

Target folder:
- aitom_family/section_collection_list/typography/

Required files:
- aitom_family/section_collection_list/typography/presets.md – section heading/body/CTA presets; collection card text references.
- aitom_family/section_collection_list/typography/axis_tokens.md – axis tokens for section-level presets.

Implementation notes:
- Define section heading/body and optional CTA presets; collection card text comes from card surface/product presets—reference them; expose section presets upward.

STATUS: DONE

### ATOM: section_media_collage
dimension: typography

Target folder:
- aitom_family/section_media_collage/typography/

Required files:
- aitom_family/section_media_collage/typography/presets.md – captions/meta for tiles; optional heading for section.
- aitom_family/section_media_collage/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define section heading/body presets (if used) referencing theme_typography_settings; tile captions/meta presets for overlays; Roboto Flex with axis tokens and line-height guidance.
- Expose presets upward; colours handled elsewhere.

STATUS: DONE

### ATOM: section_image_with_text
dimension: typography

Target folder:
- aitom_family/section_image_with_text/typography/

Required files:
- aitom_family/section_image_with_text/typography/presets.md – heading/body/CTA presets.
- aitom_family/section_image_with_text/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Use theme heading/body presets; CTA references button preset; include line-height/opsz per breakpoint; expose upward.

STATUS: DONE

### ATOM: section_slideshow
dimension: typography

Target folder:
- aitom_family/section_slideshow/typography/

Required files:
- aitom_family/section_slideshow/typography/presets.md – slide heading/body/caption/CTA presets.
- aitom_family/section_slideshow/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define slide heading/body/caption and CTA presets referencing theme_typography_settings; include size ramps for mobile/desktop; expose upward.

STATUS: DONE

### ATOM: section_blog_posts
dimension: typography

Target folder:
- aitom_family/section_blog_posts/typography/

Required files:
- aitom_family/section_blog_posts/typography/presets.md – section heading/body, card title/excerpt/meta presets.
- aitom_family/section_blog_posts/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Section heading/body presets; card title/excerpt/meta presets referencing theme_typography_settings; ensure line-height for excerpts; expose upward.

STATUS: DONE

### ATOM: section_email_signup
dimension: typography

Target folder:
- aitom_family/section_email_signup/typography/

Required files:
- aitom_family/section_email_signup/typography/presets.md – label/input text/helper/error presets, CTA preset ref.
- aitom_family/section_email_signup/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define presets for label/input text, helper/success/error messages; CTA uses button preset; ensure legibility on dark base; expose upward.

STATUS: DONE

### ATOM: section_custom_markup
dimension: typography

Target folder:
- aitom_family/section_custom_markup/typography/

Required files:
- aitom_family/section_custom_markup/typography/notes.md – typography inheritance guidance.

Implementation notes:
- Custom content should inherit theme_typography_settings unless overridden; document that this atom does not define new presets; note [INHERIT TYPOGRAPHY].

STATUS: DONE

### ATOM: product_media_gallery
dimension: typography

Target folder:
- aitom_family/product_media_gallery/typography/

Required files:
- aitom_family/product_media_gallery/typography/captions.md – presets for captions/labels on media/thumbs.
- aitom_family/product_media_gallery/typography/axis_tokens.md – axis tokens for captions/meta.

Implementation notes:
- Define caption/meta preset for overlays/thumb labels; Roboto Flex with axis tokens; expose upward. Main media uses no text unless caption shown.

STATUS: DONE

### ATOM: product_info_stack
dimension: typography

Target folder:
- aitom_family/product_info_stack/typography/

Required files:
- aitom_family/product_info_stack/typography/notes.md – references to child atom presets.

Implementation notes:
- Stack itself defines no new presets; references child atom presets. Note inheritance and [NO NEW PRESETS].

STATUS: DONE

### ATOM: product_title_block
dimension: typography

Target folder:
- aitom_family/product_title_block/typography/

Required files:
- aitom_family/product_title_block/typography/presets.md – title/subtitle presets.
- aitom_family/product_title_block/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define title and optional subtitle/meta presets using Roboto Flex; include line-height and tracking tokens; expose upward with breakpoint-aware sizes.

STATUS: DONE

### ATOM: product_price_block
dimension: typography

Target folder:
- aitom_family/product_price_block/typography/

Required files:
- aitom_family/product_price_block/typography/presets.md – price, compare-at, badge text presets.
- aitom_family/product_price_block/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Define price preset (heavier), compare-at preset (lighter/strike-through), badge text preset; Roboto Flex with axis tokens; expose upward.

STATUS: DONE

### ATOM: product_variant_picker
dimension: typography

Target folder:
- aitom_family/product_variant_picker/typography/

Required files:
- aitom_family/product_variant_picker/typography/presets.md – option label/value presets.
- aitom_family/product_variant_picker/typography/axis_tokens.md – axis tokens per preset.

Implementation notes:
- Option group label preset; option value preset (buttons/swatches/dropdown); include size/line-height tokens; expose upward.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: typography

Target folder:
- aitom_family/product_buy_buttons_block/typography/

Required files:
- aitom_family/product_buy_buttons_block/typography/notes.md – reuse button label preset.

Implementation notes:
- Reuse button_single label preset; note no additional presets; optional meta text if present should reference existing presets.

STATUS: DONE

### ATOM: product_description_block
dimension: typography

Target folder:
- aitom_family/product_description_block/typography/

Required files:
- aitom_family/product_description_block/typography/presets.md – body/emphasis/link presets.
- aitom_family/product_description_block/typography/axis_tokens.md – axis tokens for these presets.

Implementation notes:
- Use rich_text_block body/emphasis/link presets; include line-height/paragraph spacing tokens; expose upward; no colours here.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: typography

Target folder:
- aitom_family/product_collapsible_section/typography/

Required files:
- aitom_family/product_collapsible_section/typography/header_body.md – header/body presets.
- aitom_family/product_collapsible_section/typography/axis_tokens.md – axis tokens for both.

Implementation notes:
- Header preset slightly heavier; body matches product_description body; Roboto Flex axis tokens; expose both; include line-height tokens.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: typography

Target folder:
- aitom_family/product_recommendations_section/typography/

Required files:
- aitom_family/product_recommendations_section/typography/presets.md – section heading/body presets; card text references.
- aitom_family/product_recommendations_section/typography/axis_tokens.md – axis tokens for section presets.

Implementation notes:
- Section heading/body presets referencing theme_typography_settings; card content uses existing product/card presets—reference, not redefine. Expose section presets upward.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: typography
Target folder:
- aitom_family/wireframe_canvas/typography/

Tasks:
- Define Roboto Flex presets for grid labels, coordinate readouts, and element captions tied to the `primary` font with axis tokens (wght, wdth, opsz).
- Ensure presets maintain contrast on black background; differentiate static labels from live overlays.
- Expose typography tokens for overlays and controls so agents/humans can tune without hardcoding sizes.

STATUS: DONE

### ATOM: blackboard
Dimension: typography
Target folder:
- aitom_family/blackboard/typography/

Tasks:
- Define Roboto Flex presets for grid labels, coordinate readouts, and element captions; map to the `primary` font and set axis tokens (wght, wdth, opsz).
- Ensure typography supports high-contrast display on black background; separate presets for static labels vs live coordinate overlays.
- Expose typography tokens for agent/human overlays without hardcoding sizes.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: typography

Target folder:
- aitom_family/theme_layout_settings/typography/

Required files:
- aitom_family/theme_layout_settings/typography/presets.md – document any layout-label or utility text presets.
- aitom_family/theme_layout_settings/typography/axis_tokens.md – axis tokens for those presets.

Implementation notes:
- Define minimal presets for layout labels/status text (if needed) tied to Roboto Flex; keep typography mostly delegated to consuming atoms but expose slots for helper UI in settings panels.
- Bind presets to axis tokens (wght/wdth/slnt/opsz/tracking) and expose them upward; no colours here.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: typography

Target folder:
- aitom_family/theme_colour_schemes/typography/

Required files:
- aitom_family/theme_colour_schemes/typography/labels.md – preset for scheme names/labels in pickers.
- aitom_family/theme_colour_schemes/typography/axis_tokens.md – axis tokens for those labels.

Implementation notes:
- Provide a single label/meta preset for scheme selectors (Roboto Flex), with axis tokens exposed; keep colour separate.
- Ensure readability on black/white; presets must be overrideable by builder typography settings.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: typography

Target folder:
- aitom_family/theme_typography_settings/typography/

Required files:
- aitom_family/theme_typography_settings/typography/presets.md – heading/body/meta/button/label/overline presets.
- aitom_family/theme_typography_settings/typography/axis_tokens.md – axis tokens per preset (wght, wdth, slnt, opsz, tracking, line-height).
- aitom_family/theme_typography_settings/typography/state_variants.md – hover/active/link state adjustments.

Implementation notes:
- Define named presets (h1–h6, body-lg/md/sm, label/meta, button, caption/overline) mapped to Roboto Flex with full axis tokens; expose compact/comfortable line-height tokens.
- Include breakpoint-aware size/opsz guidance and allowable ranges for builder overrides.
- State variants: minor weight/tracking tweaks for interactive text; keep family constant.

STATUS: DONE

### ATOM: theme_card_surface
dimension: typography

Target folder:
- aitom_family/theme_card_surface/typography/

Required files:
- aitom_family/theme_card_surface/typography/tokens.md – typography hooks for any surface-level labels/badges.
- aitom_family/theme_card_surface/typography/axis_tokens.md – axis tokens for those hooks.

Implementation notes:
- Provide optional presets for card badges/meta labels (e.g., “Featured”, “Sale”) with Roboto Flex axis tokens; main card content comes from composed atoms, not this surface.
- Expose presets upward so builders can remap badge/meta styling per theme.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: typography

Target folder:
- aitom_family/wireframe_canvas/typography/

Required files:
- aitom_family/wireframe_canvas/typography/labels.md – presets for element labels and sticky notes.
- aitom_family/wireframe_canvas/typography/ui_controls.md – zooming/grid toggle labels.

Implementation notes:
- Use Roboto Flex for all canvas text; ensure legibility on dark background (white text).
- Define a scalable type scale for zoomed-out readability if zoom is supported.
- Fixed-size vs zoom-dependent labels: clarify if text scales with canvas or stays viewport-fixed.
- STATUS: DONE
- Implemented: `labels.md`, `ui_controls.md`.

### ATOM: blackboard
dimension: typography

Target folder:
- aitom_family/blackboard/typography/

Required files:
- aitom_family/blackboard/typography/base.md – root font-family (Roboto Flex) declarations found here or delegated to theme.

Implementation notes:
- Typically minimal; consumes `theme_typography_settings`.
- STATUS: DONE
- Implemented: `base.md`.

### ATOM: theme_layout_settings
dimension: typography

Target folder:
- aitom_family/theme_layout_settings/typography/

Required files:
- None. (Layout does not own typography).

Implementation notes:
- Placeholder to confirm N/A.
- STATUS: DONE (N/A).

### ATOM: theme_colour_schemes
dimension: typography

Target folder:
- aitom_family/theme_colour_schemes/typography/

Required files:
- None. (Colours do not own typography, though tokens apply to text).

Implementation notes:
- Placeholder.
- STATUS: DONE (No unique typography required, see `theme_typography_settings`).

### ATOM: theme_typography_settings
dimension: typography

Target folder:
- aitom_family/theme_typography_settings/typography/

Required files:
- aitom_family/theme_typography_settings/typography/presets.md – definitions for heading_*, body_*, label_*, button_*.
- aitom_family/theme_typography_settings/typography/axes.md – variable font axis mappings (wght, wdth, slnt).

Implementation notes:
- THE SOURCE OF TRUTH for all text styles.
- Must use Roboto Flex axes. define generic roles (e.g. type_heading_lg) not semantic ones (product_title) to keep it reusable.
- STATUS: DONE
- Implemented: `presets.md` (role definitions), `axes.md` (Roboto Flex axis tokens).

### ATOM: theme_card_surface
dimension: typography

Target folder:
- aitom_family/theme_card_surface/typography/

Required files:
- aitom_family/theme_card_surface/typography/inheritance.md – ensure card text inherits correct presets.

Implementation notes:
- Cards don't define new fonts; they consume theme presets.
- STATUS: DONE
- Implemented: `inheritance.md` (inherits from theme presets).

### ATOM: accordion_item
dimension: typography

Target folder:
- aitom_family/accordion_item/typography/

Required files:
- aitom_family/accordion_item/typography/presets.md – header/body presets.

Implementation notes:
- Use type_heading_sm for header, type_body_md for content.
- Status: ACTIVE

### ATOM: button_group
dimension: typography

Target folder:
- aitom_family/button_group/typography/

Required files:
- None. (Inherits from button_single).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: button_single
dimension: typography

Target folder:
- aitom_family/button_single/typography/

Required files:
- aitom_family/button_single/typography/presets.md – button label preset.

Implementation notes:
- type_button_md.
- Status: ACTIVE

### ATOM: heading_block
dimension: typography

Target folder:
- aitom_family/heading_block/typography/

Required files:
- aitom_family/heading_block/typography/presets.md – map h1-h6 to type_heading_*.

Implementation notes:
- Flexible mapping based on prop/token.
- Status: ACTIVE

### ATOM: rich_text_block
dimension: typography

Target folder:
- aitom_family/rich_text_block/typography/

Required files:
- aitom_family/rich_text_block/typography/presets.md – body text, lists, inline codes.

Implementation notes:
- type_body_md base.
- Status: ACTIVE

### ATOM: image_media_block
dimension: typography

Target folder:
- aitom_family/image_media_block/typography/

Required files:
- aitom_family/image_media_block/typography/caption.md – caption preset.

Implementation notes:
- type_meta_sm for captions.
- Status: ACTIVE

### ATOM: video_media_block
dimension: typography

Target folder:
- aitom_family/video_media_block/typography/

Required files:
- aitom_family/video_media_block/typography/caption.md – caption preset.

Implementation notes:
- type_meta_sm.
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: typography

Target folder:
- aitom_family/layout_columns_grid/typography/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: typography

Target folder:
- aitom_family/layout_divider_block/typography/

Required files:
- aitom_family/layout_divider_block/typography/label.md – optional center label.

Implementation notes:
- type_meta_xs (uppercase).
- STATUS: DONE
- Implemented: `label.md`.

### ATOM: layout_group_container
dimension: typography

Target folder:
- aitom_family/layout_group_container/typography/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: typography

Target folder:
- aitom_family/layout_spacer_block/typography/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: typography

Target folder:
- aitom_family/floating_pill_toolbar/typography/

Required files:
- aitom_family/floating_pill_toolbar/typography/labels.md – tooltips or icon labels.

Implementation notes:
- type_meta_xs.
- STATUS: DONE
- Implemented: `labels.md`.

### ATOM: maybes_note
dimension: typography

Target folder:
- aitom_family/maybes_note/typography/

Required files:
- aitom_family/maybes_note/typography/presets.md – handwriting or body preset.

Implementation notes:
- type_body_md (maybe specific monospace or hand trait).
- STATUS: DONE
- Implemented: `presets.md`.

### ATOM: chat_card_v1
dimension: typography

Target folder:
- aitom_family/chat_card_v1/typography/

Required files:
- aitom_family/chat_card_v1/typography/presets.md – title/body presets.

Implementation notes:
- type_heading_sm, type_body_md.
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: typography

Target folder:
- aitom_family/chat_rail_shell/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: typography

Target folder:
- aitom_family/chat_rail_header_bar/typography/

Required files:
- aitom_family/chat_rail_header_bar/typography/title.md – rail title.

Implementation notes:
- type_heading_xs (uppercase).
- Status: ACTIVE

### ATOM: chat_message_list
dimension: typography

Target folder:
- aitom_family/chat_message_list/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: typography

Target folder:
- aitom_family/chat_message_block/typography/

Required files:
- aitom_family/chat_message_block/typography/content.md – user vs agent text styles.

Implementation notes:
- type_body_md (user), type_body_md (agent).
- STATUS: DONE
- Implemented: `content.md`.

### ATOM: chat_message_action_bar
dimension: typography

Target folder:
- aitom_family/chat_message_action_bar/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: typography

Target folder:
- aitom_family/chat_safety_controls_bar/typography/

Required files:
- aitom_family/chat_safety_controls_bar/typography/label.md – warning text.

Implementation notes:
- type_meta_sm.
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: typography

Target folder:
- aitom_family/bottom_chat_input_bar/typography/

Required files:
- aitom_family/bottom_chat_input_bar/typography/input.md – textarea font.

Implementation notes:
- type_body_md (input).
- STATUS: DONE
- Implemented: `input.md`.

### ATOM: chat_shortcuts_popover
dimension: typography

Target folder:
- aitom_family/chat_shortcuts_popover/typography/

Required files:
- aitom_family/chat_shortcuts_popover/typography/list.md – command names/descriptions.

Implementation notes:
- type_body_sm (command), type_meta_xs (desc).
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: typography

Target folder:
- aitom_family/chat_upload_source_picker/typography/

Required files:
- aitom_family/chat_upload_source_picker/typography/labels.md – option labels.

Implementation notes:
- type_body_sm.
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: typography

Target folder:
- aitom_family/chat_icon_band_popover/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: typography

Target folder:
- aitom_family/surface_header_nano/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: typography

Target folder:
- aitom_family/surface_header_shell_micro/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: typography

Target folder:
- aitom_family/surface_header_shell_standard/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: typography

Target folder:
- aitom_family/surface_logo_centerpiece/typography/

Required files:
- aitom_family/surface_logo_centerpiece/typography/logotype.md – brand font or SVG fallback.

Implementation notes:
- type_heading_md (tracking-wide).
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: typography

Target folder:
- aitom_family/app_header_appname_dropdown/typography/

Required files:
- aitom_family/app_header_appname_dropdown/typography/label.md – app name.

Implementation notes:
- type_heading_sm.
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: typography

Target folder:
- aitom_family/macro_temp_indicator/typography/

Required files:
- aitom_family/macro_temp_indicator/typography/value.md – numeric display.

Implementation notes:
- type_mono_sm.
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: typography

Target folder:
- aitom_family/main_menu_icon_button/typography/

Required files:
- None.

Implementation notes:
- STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: typography

Target folder:
- aitom_family/product_buy_buttons_block/typography/

Required files:
- aitom_family/product_buy_buttons_block/typography/button.md – CTA font.

Implementation notes:
- type_button_lg.
- STATUS: DONE
- Implemented: `button.md`.

### ATOM: product_collapsible_section
dimension: typography

Target folder:
- aitom_family/product_collapsible_section/typography/

Required files:
- aitom_family/product_collapsible_section/typography/header.md – accordion header.

Implementation notes:
- type_heading_xs.
- Status: ACTIVE

### ATOM: product_description_block
dimension: typography

Target folder:
- aitom_family/product_description_block/typography/

Required files:
- aitom_family/product_description_block/typography/body.md – product details.

Implementation notes:
- type_body_md.
- Status: ACTIVE

### ATOM: product_info_stack
dimension: typography

Target folder:
- aitom_family/product_info_stack/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: typography

Target folder:
- aitom_family/product_media_gallery/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: typography

Target folder:
- aitom_family/product_price_block/typography/

Required files:
- aitom_family/product_price_block/typography/price.md – current/compare price.

Implementation notes:
- type_heading_sm (price), type_body_sm_strikethrough (compare).
- STATUS: DONE
- Implemented: `price.md`.

### ATOM: product_recommendations_section
dimension: typography

Target folder:
- aitom_family/product_recommendations_section/typography/

Required files:
- aitom_family/product_recommendations_section/typography/heading.md – section title.

Implementation notes:
- type_heading_md.
- Status: ACTIVE

### ATOM: product_title_block
dimension: typography

Target folder:
- aitom_family/product_title_block/typography/

Required files:
- aitom_family/product_title_block/typography/title.md – product name.

Implementation notes:
- type_heading_lg.
- STATUS: DONE
- Implemented: `title.md`.

### ATOM: product_variant_picker
dimension: typography

Target folder:
- aitom_family/product_variant_picker/typography/

Required files:
- aitom_family/product_variant_picker/typography/label.md – option name, value.

Implementation notes:
- type_label_sm.
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: typography

Target folder:
- aitom_family/section_blog_posts/typography/

Required files:
- aitom_family/section_blog_posts/typography/presets.md – article titles, excerpts.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: typography

Target folder:
- aitom_family/section_collection_list/typography/

Required files:
- aitom_family/section_collection_list/typography/title.md – collection name.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: typography

Target folder:
- aitom_family/section_custom_markup/typography/

Required files:
- None. (Custom).

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: typography

Target folder:
- aitom_family/section_email_signup/typography/

Required files:
- aitom_family/section_email_signup/typography/form.md – labels, button.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: typography

Target folder:
- aitom_family/section_featured_collection_grid/typography/

Required files:
- aitom_family/section_featured_collection_grid/typography/heading.md – section title.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: typography

Target folder:
- aitom_family/section_hero_banner/typography/

Required files:
- aitom_family/section_hero_banner/typography/presets.md – hero title, subtitle.

Implementation notes:
- type_display_xl.
- STATUS: DONE
- Implemented: `presets.md`.

### ATOM: section_image_with_text
dimension: typography

Target folder:
- aitom_family/section_image_with_text/typography/

Required files:
- aitom_family/section_image_with_text/typography/presets.md – heading, body.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: typography

Target folder:
- aitom_family/section_media_collage/typography/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: typography

Target folder:
- aitom_family/section_multicolumn_features/typography/

Required files:
- aitom_family/section_multicolumn_features/typography/column.md – feature title, text.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: typography

Target folder:
- aitom_family/section_rich_text/typography/

Required files:
- aitom_family/section_rich_text/typography/content.md – prose styles.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: typography

Target folder:
- aitom_family/section_slideshow/typography/

Required files:
- aitom_family/section_slideshow/typography/slide.md – slide caption/title.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: typography

Target folder:
- aitom_family/lanes_calendar_grid_v1/typography/

Required files:
- aitom_family/lanes_calendar_grid_v1/typography/date.md – day names/numbers.

Implementation notes:
- type_heading_xs, type_mono_sm.
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: typography

Target folder:
- aitom_family/multi_feed_tile/typography/

Required files:
- aitom_family/multi_feed_tile/typography/content.md – tile header/stats.

Implementation notes:
- type_heading_xs, type_mono_md.
- STATUS: DONE
- Implemented: `status.md`.
