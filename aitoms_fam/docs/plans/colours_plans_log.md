## atom: lanes_calendar_grid_v1
dimension: colours
target_folder: aitom_family/lanes_calendar_grid_v1/colours/
tasks:
- Define semantic colour tokens. Background: Light neutral (off-white). Text: Neutral light, Primary Accent (for current day 'M'). Cells: Dark neutral (Active/Done), Accent border (Planned), Faint neutral border (Empty). Row Highlight: Subtle background or bold text style.
STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: colours

Target folder:
- aitom_family/floating_pill_toolbar/colours/

Required files:
- aitom_family/floating_pill_toolbar/colours/palette.md – base/hover/pressed/disabled colours for launcher pill, expanded bar, sub-pills, icons.
- aitom_family/floating_pill_toolbar/colours/state_map.md – state mapping for collapsed/expanded, drag/snapping, gather highlight, focus rings.

Implementation notes:
- Define semantic tokens for surfaces: launcher_base, expanded_base, sub_pill_base, focus ring, divider/glow if any; text/icon colours for normal/hover/pressed/disabled.
- Include gather highlight token for primary toolbar in cluster; ensure contrast on black base; no hardcoded hex.
- Reduced motion does not change colour; keep overlays tokenized.

STATUS: DONE

### ATOM: maybes_note
dimension: colours

Target folder:
- aitom_family/maybes_note/colours/

Required files:
- aitom_family/maybes_note/colours/palette.md – background/foreground, colour_token hook, badge states.
- aitom_family/maybes_note/colours/state_map.md – pinned/archived/hover/focus colours.

Implementation notes:
- Base dark background with light text; colour_token applied to accent/badge; pinned highlight token; archived dimmed; focus ring tokenized; no gradients.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: colours

Target folder:
- aitom_family/chat_rail_header_bar/colours/

Required files:
- aitom_family/chat_rail_header_bar/colours/palette.md – background, label text, icon colours.
- aitom_family/chat_rail_header_bar/colours/state_map.md – hover/pressed/active/disabled for header icons and label.

Implementation notes:
- Define rail header background (inherits rail), primary text/icon, active underline/fill for tools/settings, focus ring tokens; no gradients.

STATUS: DONE

### ATOM: chat_message_list
dimension: colours

Target folder:
- aitom_family/chat_message_list/colours/

Required files:
- aitom_family/chat_message_list/colours/notes.md – inherit rail colours; [NO UNIQUE COLOURS].

Implementation notes:
- Use rail background/text; highlight handled in message block; note no unique tokens.

STATUS: DONE

### ATOM: chat_message_block
dimension: colours

Target folder:
- aitom_family/chat_message_block/colours/

Required files:
- aitom_family/chat_message_block/colours/palette.md – name/body/role_tag text, optional divider, highlight overlay.
- aitom_family/chat_message_block/colours/state_map.md – highlight/selected states.

Implementation notes:
- High-contrast text; secondary tone for meta; highlight overlay token for new/search; avatar inherits global background; no bubbles.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: colours

Target folder:
- aitom_family/chat_message_action_bar/colours/

Required files:
- aitom_family/chat_message_action_bar/colours/palette.md – icon base colour on dark background.
- aitom_family/chat_message_action_bar/colours/state_map.md – hover/pressed/disabled/focus.

Implementation notes:
- Icons match primary text; hover/pressed use subtle brightness/overlay; disabled dimmed; focus ring tokenized.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: colours

Target folder:
- aitom_family/chat_safety_controls_bar/colours/

Required files:
- aitom_family/chat_safety_controls_bar/colours/palette.md – icon base colour, active indicator.
- aitom_family/chat_safety_controls_bar/colours/state_map.md – hover/pressed/active.

Implementation notes:
- Monochrome icons; active uses filled disc/underline token; ensure contrast on dark base.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: colours

Target folder:
- aitom_family/bottom_chat_input_bar/colours/

Required files:
- aitom_family/bottom_chat_input_bar/colours/palette.md – pill background, text, placeholder, icons.
- aitom_family/bottom_chat_input_bar/colours/state_map.md – focus/hover/pressed/disabled/error states.

Implementation notes:
- Light pill on dark rail; placeholder lower contrast token; focus outline token; error subtle border token; icon colours invert appropriately.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: colours

Target folder:
- aitom_family/chat_shortcuts_popover/colours/

Required files:
- aitom_family/chat_shortcuts_popover/colours/palette.md – popover background, token text.
- aitom_family/chat_shortcuts_popover/colours/state_map.md – hover/pressed/focus.

Implementation notes:
- Dark panel with light text; hover/pressed slight brightness; focus ring token; no shadows.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: colours

Target folder:
- aitom_family/chat_upload_source_picker/colours/

Required files:
- aitom_family/chat_upload_source_picker/colours/palette.md – background, text, icon colours.
- aitom_family/chat_upload_source_picker/colours/state_map.md – hover/selected row and focus.

Implementation notes:
- Dark panel, light text/icons; selected row token; focus ring visible; no gradients.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: colours

Target folder:
- aitom_family/chat_icon_band_popover/colours/

Required files:
- aitom_family/chat_icon_band_popover/colours/palette.md – band background, icon colours, label colours.
- aitom_family/chat_icon_band_popover/colours/state_map.md – hover/pressed/active icons.

Implementation notes:
- Inherits rail background; icons light; active underline/filled disc token; ensure contrast with labels if shown.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: colours

Target folder:
- aitom_family/chat_rail_shell/colours/

Required files:
- aitom_family/chat_rail_shell/colours/palette.md – background, text roles (primary/secondary), icon colours, dividers.
- aitom_family/chat_rail_shell/colours/state_map.md – state colours for header controls, bands, nano preview, focus/hover/pressed.

Implementation notes:
- Define semantic tokens: rail_background, header_text_primary, text_secondary, icon_default/hover/active, divider, focus_ring.
- Ensure input bar colours come from its atom; avoid hardcoded hex; maintain contrast on dark base; state overlays tokenized.

STATUS: DONE

### ATOM: chat_card_v1
dimension: colours

Target folder:
- aitom_family/chat_card_v1/colours/

Required files:
- aitom_family/chat_card_v1/colours/palette.md – list colour tokens for surface, pill stroke/fill, text roles, hover/active fills, and unread indicators.
- aitom_family/chat_card_v1/colours/state_map.md – map each interaction state (default, hover, pressed, active, unread) to the palette tokens.
- aitom_family/chat_card_v1/colours/accessibility_notes.md – contrast targets and fallback variants for high-contrast modes.

Implementation notes:
- Define tokens for: background surface (#000000 default), pill stroke, pill fill (subtle tint), handle text, role text, preview text, hover outline/fill, active fill, unread badge/dot, and optional glow colour.
- Avoid hard-coding hex values in usage notes; assign default hexes to tokens but emphasize all consumption must reference tokens.
- Include guidance on opacity tokens for fills/glows so effects remain adjustable without new colours.
- Specify contrast checks against black background and filled pill variant; ensure text roles meet WCAG AA for small text.
- Call out which tokens must be exposed upwards (stroke, fills, text colours, unread indicator) to allow branding without altering the atom spec.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: colours
Target folder:
- aitom_family/wireframe_canvas/colours/

Tasks:
- Define colour tokens for black canvas background, white grid lines, element outlines, selection/hover states, and coordinate overlays with WCAG contrast.
- Specify snap highlight colours and remote-activity indicators that remain legible on dark base.
- Map control colours (snap toggle, reset) to palette tokens; avoid hardcoded hex values.

STATUS: DONE

### ATOM: blackboard
Dimension: colours
Target folder:
- aitom_family/blackboard/colours/

Tasks:
- Define colour tokens for black canvas background, grid lines, element outlines, selection/hover states, and coordinate overlays with sufficient contrast.
- Specify snap-to-grid highlight colours and remote-activity indicators that remain legible on dark base.
- Map CTA/controls (snap toggle, zoom/reset) to existing palette tokens; avoid hardcoded hex values.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: colours
Target folder:
- aitom_family/multi_feed_tile/colours/

Tasks:
- Define colour tokens for tile background (dark base), border, text (title/subtitle/label/metric/CTA), and media overlays while keeping the flat aesthetic (no gradients).
- Specify hover/active/disabled states (background, overlay, border) and CTA state colours that meet WCAG contrast on dark surfaces.
- Map token usage per mode (image/video overlays, KPI emphasis, product price/CTA) without hardcoded hex values.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: colours

Target folder:
- aitom_family/theme_layout_settings/colours/

Required files:
- aitom_family/theme_layout_settings/colours/palette.md – surface, stroke, text roles for layout chrome.
- aitom_family/theme_layout_settings/colours/state_map.md – mapping for focus/active/disabled of layout controls (if any).

Implementation notes:
- Define semantic tokens for base surface (black), secondary surface, strokes for grid/margins, text for helper labels; include focus ring colour.
- Include tokens for safe-area highlights or guides if shown; keep hover/active minimal and flat.
- Expose tokens upward for brand overrides; no raw hex usage outside this palette file.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: colours

Target folder:
- aitom_family/theme_colour_schemes/colours/

Required files:
- aitom_family/theme_colour_schemes/colours/palette.md – define scheme tokens (surface/text/stroke/accent/button/focus/overlay/error/success).
- aitom_family/theme_colour_schemes/colours/state_map.md – state mapping (default/hover/pressed/disabled/focus).
- aitom_family/theme_colour_schemes/colours/contrast_notes.md – WCAG guidance and high-contrast variant.

Implementation notes:
- Create 2–4 schemes starting from black/white baseline; include accent tokens and CTA fills/outline variants.
- Provide opacity tokens for overlays/glows; ensure text and controls meet contrast on dark and light variants.
- Expose scheme ids and all tokens for builder override; avoid hardcoded colours elsewhere.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: colours

Target folder:
- aitom_family/theme_typography_settings/colours/

Required files:
- aitom_family/theme_typography_settings/colours/text_roles.md – tokens for text roles (primary/secondary/muted/error/success/link).
- aitom_family/theme_typography_settings/colours/state_map.md – link/interactive state colours.

Implementation notes:
- Define semantic text colour tokens to pair with typography presets; base on black background with white primary text.
- Map link/interactive hover/pressed states; include error/success text tokens.
- Expose tokens for builder override; no inline hex in usage.

STATUS: DONE

### ATOM: theme_card_surface
dimension: colours

Target folder:
- aitom_family/theme_card_surface/colours/

Required files:
- aitom_family/theme_card_surface/colours/palette.md – surface, stroke, overlay, elevation/glow colours for card variants.
- aitom_family/theme_card_surface/colours/state_map.md – default/hover/pressed/focus/selected/disabled mappings.
- aitom_family/theme_card_surface/colours/contrast.md – guidance for dark/light variants contrast.

Implementation notes:
- Define tokens for dark base surface, optional light/inverted surface, strokes, focus ring, hover/pressed fills, and glow/elevation colour.
- Include badge/background token hooks for embedded flags; keep flat (no gradients).
- Ensure contrast against both dark and light variants; expose all tokens upward for brand control.

STATUS: DONE

### ATOM: layout_group_container
dimension: colours

Target folder:
- aitom_family/layout_group_container/colours/

Required files:
- aitom_family/layout_group_container/colours/palette.md – surface/stroke/text roles for container background and outline.
- aitom_family/layout_group_container/colours/state_map.md – hover/focus (if editable) and disabled state mapping.

Implementation notes:
- Define tokens: surface_base (black), surface_alt, stroke, focus ring, optional overlay; keep buttons/text tokens external.
- Map subtle hover/focus outlines for edit mode; disabled reduces opacity but keeps contrast.
- Expose tokens for brand override; no inline hex in usage.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: colours

Target folder:
- aitom_family/layout_columns_grid/colours/

Required files:
- aitom_family/layout_columns_grid/colours/palette.md – grid background, optional column divider stroke, focus/outline colours.
- aitom_family/layout_columns_grid/colours/state_map.md – edit-mode hover/focus if applicable.

Implementation notes:
- Tokens for background (inheriting black), column divider strokes, hover/focus outlines in editing contexts; keep flat and high-contrast.
- No gradients; expose tokens upward.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: colours

Target folder:
- aitom_family/layout_spacer_block/colours/

Required files:
- aitom_family/layout_spacer_block/colours/notes.md – note [NO COLOUR] unless debug outline used.

Implementation notes:
- Spacer is transparent; if debug outline is enabled, define stroke token on dark base. Otherwise document no colour usage.

STATUS: DONE

### ATOM: layout_divider_block
dimension: colours

Target folder:
- aitom_family/layout_divider_block/colours/

Required files:
- aitom_family/layout_divider_block/colours/palette.md – stroke colour, optional label text colour, and inset background alignment.
- aitom_family/layout_divider_block/colours/state_map.md – hover/focus/disabled (if labeled).

Implementation notes:
- Define stroke colour tokens (default white), optional dashed/dotted style via opacity/alpha tokens; label text uses existing text tokens.
- Ensure contrast on dark base; if label exists, map focus/hover states; otherwise decorative only.

STATUS: DONE

### ATOM: heading_block
dimension: colours

Target folder:
- aitom_family/heading_block/colours/

Required files:
- aitom_family/heading_block/colours/palette.md – text colours and optional underline/divider tokens.
- aitom_family/heading_block/colours/state_map.md – link state colours.

Implementation notes:
- Define tokens for heading text (primary), link hover/active/focus colours, optional underline/divider stroke; ensure contrast on black base.
- Expose tokens; no inline hex; align with theme_colour_schemes.

STATUS: DONE

### ATOM: rich_text_block
dimension: colours

Target folder:
- aitom_family/rich_text_block/colours/

Required files:
- aitom_family/rich_text_block/colours/palette.md – body/emphasis/link text colours.
- aitom_family/rich_text_block/colours/state_map.md – link hover/active/focus colours.

Implementation notes:
- Tokens for body text, emphasis text, link states, list markers if needed; maintain contrast on black base.
- Expose tokens for builder overrides; no hardcoded hex in usage.

STATUS: DONE

### ATOM: button_single
dimension: colours

Target folder:
- aitom_family/button_single/colours/

Required files:
- aitom_family/button_single/colours/palette.md – fill/stroke/text colours per variant.
- aitom_family/button_single/colours/state_map.md – hover/pressed/focus/disabled colours.

Implementation notes:
- Solid variant: white fill/black text defaults; outline: white stroke/transparent fill/white text. Tokens for each state; focus ring colour; disabled opacity token.
- Expose tokens for accent swap; ensure contrast on dark base.

STATUS: DONE

### ATOM: button_group
dimension: colours

Target folder:
- aitom_family/button_group/colours/

Required files:
- aitom_family/button_group/colours/notes.md – inheritance from button_single.

Implementation notes:
- Inherit button_single colour tokens; optionally define primary/secondary differentiation tokens; group has no unique colours otherwise.

STATUS: DONE

### ATOM: image_media_block
dimension: colours

Target folder:
- aitom_family/image_media_block/colours/

Required files:
- aitom_family/image_media_block/colours/palette.md – overlay, stroke, background tokens.
- aitom_family/image_media_block/colours/state_map.md – hover/pressed/focus overlay colours.

Implementation notes:
- Tokens for overlay colour/opacity, stroke (if framed), background placeholder, focus ring; ensure overlays preserve image legibility on hover.
- Expose tokens; align with theme_colour_schemes.

STATUS: DONE

### ATOM: video_media_block
dimension: colours

Target folder:
- aitom_family/video_media_block/colours/

Required files:
- aitom_family/video_media_block/colours/palette.md – overlay, controls, stroke.
- aitom_family/video_media_block/colours/state_map.md – hover/focus/pressed.

Implementation notes:
- Define overlay colour/opacity, play icon colour, control bar tokens, stroke/radius outline; hover/pressed overlays darken/lighten; focus ring colour.
- Expose tokens; maintain contrast against posters/video.

STATUS: DONE

### ATOM: accordion_item
dimension: colours

Target folder:
- aitom_family/accordion_item/colours/

Required files:
- aitom_family/accordion_item/colours/palette.md – header text, body text, stroke/divider, icon colour.
- aitom_family/accordion_item/colours/state_map.md – header hover/pressed/focus, expanded indicator.

Implementation notes:
- Tokens for header text, body text, chevron colour, divider stroke; hover/pressed/focus backgrounds if any; ensure contrast on black base.
- Expose tokens for expanded state highlight; no hardcoded hex.

STATUS: DONE

### ATOM: section_hero_banner
dimension: colours

Target folder:
- aitom_family/section_hero_banner/colours/

Required files:
- aitom_family/section_hero_banner/colours/palette.md – background/overlay, text roles, CTA colours.
- aitom_family/section_hero_banner/colours/state_map.md – hover/pressed/focus for CTAs and overlays.

Implementation notes:
- Tokens for overlay colour/opacity, text (heading/body), CTA fill/outline, focus ring, media fallback background; ensure contrast on dark base.
- Video overlay tokens align with privacy mode; expose tokens for brand overrides.

STATUS: DONE

### ATOM: section_rich_text
dimension: colours

Target folder:
- aitom_family/section_rich_text/colours/

Required files:
- aitom_family/section_rich_text/colours/palette.md – heading/body/link/CTA colours.
- aitom_family/section_rich_text/colours/state_map.md – link/CTA states.

Implementation notes:
- Define tokens for text roles and link states; CTA uses button colours; optional frame/stroke token if used.
- Ensure contrast; expose for overrides.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: colours

Target folder:
- aitom_family/section_multicolumn_features/colours/

Required files:
- aitom_family/section_multicolumn_features/colours/palette.md – section text, feature card surface/stroke, icon/image overlay.
- aitom_family/section_multicolumn_features/colours/state_map.md – hover/pressed/focus for columns/CTAs.

Implementation notes:
- Tokens for section heading/body, card surface variant, icon/overlay colours, CTA states; ensure flat styling on black base.
- Expose badge/accent tokens if used.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: colours

Target folder:
- aitom_family/section_featured_collection_grid/colours/

Required files:
- aitom_family/section_featured_collection_grid/colours/palette.md – section text, grid background, card surface refs, CTA colours.
- aitom_family/section_featured_collection_grid/colours/state_map.md – hover/pressed/focus for cards/CTAs.

Implementation notes:
- Section uses heading/body tokens; cards reference theme_card_surface colours; CTA colours defined via tokens; loading/empty placeholders have their own tokens.
- Ensure contrast across variants; expose all for overrides.

STATUS: DONE

### ATOM: section_collection_list
dimension: colours

Target folder:
- aitom_family/section_collection_list/colours/

Required files:
- aitom_family/section_collection_list/colours/palette.md – section text, card surface colours, image overlays.
- aitom_family/section_collection_list/colours/state_map.md – card hover/pressed/focus, CTA states.

Implementation notes:
- Tokens for section heading/body, card surface, image overlay, CTA states, focus ring; optional list vs grid variants share palette.
- Expose all tokens; ensure contrast.

STATUS: DONE

### ATOM: section_media_collage
dimension: colours

Target folder:
- aitom_family/section_media_collage/colours/

Required files:
- aitom_family/section_media_collage/colours/palette.md – tile overlays, strokes, captions, background.
- aitom_family/section_media_collage/colours/state_map.md – hover/focus/pressed overlays for tiles.

Implementation notes:
- Define tokens for overlay colour/opacity, tile stroke/radius, caption text, badge/indicator colours; ensure contrast on media and black base.
- Hover/focus overlays remain subtle; expose all tokens for override.

STATUS: DONE

### ATOM: section_image_with_text
dimension: colours

Target folder:
- aitom_family/section_image_with_text/colours/

Required files:
- aitom_family/section_image_with_text/colours/palette.md – media frame/overlay, text roles, CTA colours.
- aitom_family/section_image_with_text/colours/state_map.md – hover/focus/pressed for media overlay and CTA.

Implementation notes:
- Tokens for media overlay colour/opacity, stroke/radius, text roles (heading/body), CTA colours; ensure contrast on black base.
- Hover/pressed overlays subtle; expose for overrides.

STATUS: DONE

### ATOM: section_slideshow
dimension: colours

Target folder:
- aitom_family/section_slideshow/colours/

Required files:
- aitom_family/section_slideshow/colours/palette.md – overlay, text, controls (arrows/dots), CTA.
- aitom_family/section_slideshow/colours/state_map.md – hover/focus/pressed for controls/CTA.

Implementation notes:
- Tokens for overlay tint, slide text, control icons/dots, CTA colours, focus ring; ensure readability on images/video.
- States for controls and CTA; expose all tokens; align with theme schemes.

STATUS: DONE

### ATOM: section_blog_posts
dimension: colours

Target folder:
- aitom_family/section_blog_posts/colours/

Required files:
- aitom_family/section_blog_posts/colours/palette.md – section text, card surface, meta/link colours, image overlays.
- aitom_family/section_blog_posts/colours/state_map.md – card hover/focus/pressed, CTA states, loading/empty.

Implementation notes:
- Tokens for heading/body/meta/link colours; card surface/overlay; CTA states; loading skeleton colours; ensure contrast.
- Expose tokens; no hardcoded hex.

STATUS: DONE

### ATOM: section_email_signup
dimension: colours

Target folder:
- aitom_family/section_email_signup/colours/

Required files:
- aitom_family/section_email_signup/colours/palette.md – input fill/stroke/text, button colours, helper/error/success text.
- aitom_family/section_email_signup/colours/state_map.md – focus/hover/pressed/disabled, error/success states.

Implementation notes:
- Define tokens for input background/stroke/text, placeholder, focus ring; button colours per states; helper/success/error text colours; ensure contrast on black base.
- Expose all tokens; respect theme schemes.

STATUS: DONE

### ATOM: section_custom_markup
dimension: colours

Target folder:
- aitom_family/section_custom_markup/colours/

Required files:
- aitom_family/section_custom_markup/colours/palette.md – background/stroke tokens for wrapper.
- aitom_family/section_custom_markup/colours/notes.md – inheritance rules for injected content.

Implementation notes:
- Wrapper colours limited to background/stroke; content inherits theme colours. Note that injected markup controls its own colours unless overridden.
- Expose background/stroke tokens; keep flat styling.

STATUS: DONE

### ATOM: product_media_gallery
dimension: colours

Target folder:
- aitom_family/product_media_gallery/colours/

Required files:
- aitom_family/product_media_gallery/colours/palette.md – media frame, overlay, thumbnail states.
- aitom_family/product_media_gallery/colours/state_map.md – hover/focus/active for thumbs, video overlays.

Implementation notes:
- Tokens for main media background/placeholder, stroke/radius, overlay colour/opacity, thumb default/hover/active, focus ring, play/zoom icon colours; ensure contrast on black base and media.
- Expose tokens; align with theme schemes.

STATUS: DONE

### ATOM: product_info_stack
dimension: colours

Target folder:
- aitom_family/product_info_stack/colours/

Required files:
- aitom_family/product_info_stack/colours/notes.md – [NO COLOUR] beyond inherited child atoms and optional padding/background.

Implementation notes:
- Container may define background/stroke tokens if used; otherwise inherits from parent; document minimal palette tokens only.

STATUS: DONE

### ATOM: product_title_block
dimension: colours

Target folder:
- aitom_family/product_title_block/colours/

Required files:
- aitom_family/product_title_block/colours/palette.md – title/subtitle colours; optional link state.
- aitom_family/product_title_block/colours/state_map.md – link hover/active/focus.

Implementation notes:
- Tokens for title/subtitle text (white base), optional link states, optional underline/divider stroke; ensure contrast; expose for overrides.

STATUS: DONE

### ATOM: product_price_block
dimension: colours

Target folder:
- aitom_family/product_price_block/colours/

Required files:
- aitom_family/product_price_block/colours/palette.md – price, compare-at, badges, and states (sale/sold out).
- aitom_family/product_price_block/colours/state_map.md – hover/focus if badges interactive.

Implementation notes:
- Tokens for price text, compare-at text (muted/strike), badge fill/text, optional separators; ensure contrast on black base; expose for overrides.

STATUS: DONE

### ATOM: product_variant_picker
dimension: colours

Target folder:
- aitom_family/product_variant_picker/colours/

Required files:
- aitom_family/product_variant_picker/colours/palette.md – label/value text, swatch/button backgrounds/strokes.
- aitom_family/product_variant_picker/colours/state_map.md – hover/focus/selected/disabled/error states.

Implementation notes:
- Define tokens for control background/stroke/text across states; highlight selected with clear contrast; error state colour; focus ring colour; ensure out-of-stock style visible.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: colours

Target folder:
- aitom_family/product_buy_buttons_block/colours/

Required files:
- aitom_family/product_buy_buttons_block/colours/notes.md – reuse button_single palette/state map.

Implementation notes:
- Buttons inherit button_single colours; block itself may define background/padding tokens if needed; note inheritance.

STATUS: DONE

### ATOM: product_description_block
dimension: colours

Target folder:
- aitom_family/product_description_block/colours/

Required files:
- aitom_family/product_description_block/colours/palette.md – body/emphasis/link colours.
- aitom_family/product_description_block/colours/state_map.md – link hover/active/focus.

Implementation notes:
- Tokens for text roles and link states; ensure contrast; align with rich_text_block and theme schemes; no inline hex.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: colours

Target folder:
- aitom_family/product_collapsible_section/colours/

Required files:
- aitom_family/product_collapsible_section/colours/palette.md – header/body text, icon, divider, background.
- aitom_family/product_collapsible_section/colours/state_map.md – header hover/focus/pressed, expanded state highlight.

Implementation notes:
- Define tokens for header/body text, chevron colour, divider stroke, hover/pressed/focus backgrounds, expanded indicator; ensure contrast on black base.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: colours

Target folder:
- aitom_family/product_recommendations_section/colours/

Required files:
- aitom_family/product_recommendations_section/colours/palette.md – section text, card surface, image overlays, CTA colours.
- aitom_family/product_recommendations_section/colours/state_map.md – card hover/focus/pressed, CTA states, loading/empty.

Implementation notes:
- Tokens for section heading/body, card surface/overlay, CTA states, loading skeletons; ensure contrast; expose all tokens.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: colours

Target folder:
- aitom_family/wireframe_canvas/colours/

Required files:
- aitom_family/wireframe_canvas/colours/grid.md – grid line colours (primary/secondary lines).
- aitom_family/wireframe_canvas/colours/selection.md – selection halo/fill colours and remote user tints.

Implementation notes:
- Background is strictly #000000 (black).
- Grid lines: white with low opacity (e.g., 10-20%).
- Selection: high-contrast branding colour (blue/white) with glow.
- Remote cursors: define a palette of 5-6 distinct colours for other users.
- STATUS: DONE
- Implemented: `grid.md`, `selection.md`.

### ATOM: blackboard
dimension: colours

Target folder:
- aitom_family/blackboard/colours/

Required files:
- aitom_family/blackboard/colours/base.md – defines the root background colour (usually black).

Implementation notes:
- Consumes `theme_colour_schemes` root token.
- STATUS: DONE
- Implemented: `base.md`.

### ATOM: theme_layout_settings
dimension: colours

Target folder:
- aitom_family/theme_layout_settings/colours/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE (N/A).

### ATOM: theme_colour_schemes
dimension: colours

Target folder:
- aitom_family/theme_colour_schemes/colours/

Required files:
- aitom_family/theme_colour_schemes/colours/palette.md – THE palette definition (surfaces, text, strokes, state overlays).
- aitom_family/theme_colour_schemes/colours/modes.md – light/dark or thematic variants.

Implementation notes:
- THE SOURCE OF TRUTH. Defines all semantic tokens (surface_base, surface_card, text_primary, stroke_default, etc.).
- Must provide high-contrast variant.
- STATUS: DONE
- Implemented: `palette.md` (global semantic tokens), `modes.md` (dark/light primitives).

### ATOM: theme_typography_settings
dimension: colours

Target folder:
- aitom_family/theme_typography_settings/colours/

Required files:
- None.

Implementation notes:
- Text *colour* comes from theme_colour_schemes, not here.
- STATUS: DONE (Colours handled in `theme_colour_schemes`).

### ATOM: theme_card_surface
dimension: colours

Target folder:
- aitom_family/theme_card_surface/colours/

Required files:
- aitom_family/theme_card_surface/colours/tokens.md – maps card-specific semantic roles (card_bg, card_stroke) to theme palette.

Implementation notes:
- Defines the specific subset of colours a card uses.
- STATUS: DONE
- Implemented: `tokens.md` (card-specific role mapping).

### ATOM: accordion_item
dimension: colours

Target folder:
- aitom_family/accordion_item/colours/

Required files:
- aitom_family/accordion_item/colours/border.md – divider line colour.
- aitom_family/accordion_item/colours/text.md – header/content text colours.

Implementation notes:
- Use semantic border_default and text_primary/secondary.
- Status: ACTIVE

### ATOM: button_group
dimension: colours

Target folder:
- aitom_family/button_group/colours/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: button_single
dimension: colours

Target folder:
- aitom_family/button_single/colours/

Required files:
- aitom_family/button_single/colours/variants.md – solid vs outline token sets.

Implementation notes:
- Solid: bg=white, text=black.
- Outline: bg=transparent, border=white, text=white.
- Status: ACTIVE

### ATOM: heading_block
dimension: colours

Target folder:
- aitom_family/heading_block/colours/

Required files:
- aitom_family/heading_block/colours/text.md – primary text colour.

Implementation notes:
- text_primary (white).
- Status: ACTIVE

### ATOM: rich_text_block
dimension: colours

Target folder:
- aitom_family/rich_text_block/colours/

Required files:
- aitom_family/rich_text_block/colours/text.md – body/link colours.

Implementation notes:
- text_secondary (grey) or primary (white).
- link_default / link_hover.
- Status: ACTIVE

### ATOM: image_media_block
dimension: colours

Target folder:
- aitom_family/image_media_block/colours/

Required files:
- aitom_family/image_media_block/colours/overlay.md – hover overlay tint.

Implementation notes:
- overlay_dark_sm (alpha).
- Status: ACTIVE

### ATOM: video_media_block
dimension: colours

Target folder:
- aitom_family/video_media_block/colours/

Required files:
- aitom_family/video_media_block/colours/controls.md – control bar/icon colours.

Implementation notes:
- white on black-alpha.
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: colours

Target folder:
- aitom_family/layout_columns_grid/colours/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: colours

Target folder:
- aitom_family/layout_divider_block/colours/

Required files:
- aitom_family/layout_divider_block/colours/stroke.md – line colour.

Implementation notes:
- border_subtle.
- Status: ACTIVE

### ATOM: layout_group_container
dimension: colours

Target folder:
- aitom_family/layout_group_container/colours/

Required files:
- aitom_family/layout_group_container/colours/background.md – optional surface background.

Implementation notes:
- surface_base (black) usually transport.
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: colours

Target folder:
- aitom_family/layout_spacer_block/colours/

Required files:
- None.

Implementation notes:
- Transparent.
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: colours

Target folder:
- aitom_family/floating_pill_toolbar/colours/

Required files:
- aitom_family/floating_pill_toolbar/colours/surface.md – pill background.

Implementation notes:
- surface_floating (elevated grey/black).
- STATUS: DONE
- Implemented: `surface.md`.

### ATOM: maybes_note
dimension: colours

Target folder:
- aitom_family/maybes_note/colours/

Required files:
- aitom_family/maybes_note/colours/tint.md – sticky note background tint.

Implementation notes:
- user-selectable token (yellow/blue/etc. mapped to dark-mode variants).
- STATUS: DONE
- Implemented: `tint.md`.

### ATOM: chat_card_v1
dimension: colours

Target folder:
- aitom_family/chat_card_v1/colours/

Required files:
- aitom_family/chat_card_v1/colours/surface.md – card background/border.

Implementation notes:
- surface_card, border_subtle.
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: colours

Target folder:
- aitom_family/chat_rail_shell/colours/

Required files:
- aitom_family/chat_rail_shell/colours/background.md – side panel background.

Implementation notes:
- surface_secondary or surface_base.
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: colours

Target folder:
- aitom_family/chat_rail_header_bar/colours/

Required files:
- aitom_family/chat_rail_header_bar/colours/border.md – bottom divider.

Implementation notes:
- border_subtle.
- Status: ACTIVE

### ATOM: chat_message_list
dimension: colours

Target folder:
- aitom_family/chat_message_list/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: colours

Target folder:
- aitom_family/chat_message_block/colours/

Required files:
- aitom_family/chat_message_block/colours/bubble.md – user vs agent bubble fill.

Implementation notes:
- user: surface_highlight (grey/accent); agent: transparent.
- STATUS: DONE
- Implemented: `bubble.md`.

### ATOM: chat_message_action_bar
dimension: colours

Target folder:
- aitom_family/chat_message_action_bar/colours/

Required files:
- aitom_family/chat_message_action_bar/colours/icons.md – icon states.

Implementation notes:
- text_secondary (default) -> text_primary (hover).
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: colours

Target folder:
- aitom_family/chat_safety_controls_bar/colours/

Required files:
- aitom_family/chat_safety_controls_bar/colours/alert.md – warning/error/info tints.

Implementation notes:
- surface_warning_subtle.
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: colours

Target folder:
- aitom_family/bottom_chat_input_bar/colours/

Required files:
- aitom_family/bottom_chat_input_bar/colours/input.md – background/border.

Implementation notes:
- surface_input, border_input_default.
- STATUS: DONE
- Implemented: `input.md`.

### ATOM: chat_shortcuts_popover
dimension: colours

Target folder:
- aitom_family/chat_shortcuts_popover/colours/

Required files:
- aitom_family/chat_shortcuts_popover/colours/menu.md – menu bg/hover items.

Implementation notes:
- surface_overlay, surface_hover.
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: colours

Target folder:
- aitom_family/chat_upload_source_picker/colours/

Required files:
- aitom_family/chat_upload_source_picker/colours/icons.md – source icon tints.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: colours

Target folder:
- aitom_family/chat_icon_band_popover/colours/

Required files:
- aitom_family/chat_icon_band_popover/colours/selection.md – active item highlight.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: colours

Target folder:
- aitom_family/surface_header_nano/colours/

Required files:
- aitom_family/surface_header_nano/colours/background.md – header bg.

Implementation notes:
- surface_header (often transparent or blurred).
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: colours

Target folder:
- aitom_family/surface_header_shell_micro/colours/

Required files:
- aitom_family/surface_header_shell_micro/colours/background.md – header bg.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: colours

Target folder:
- aitom_family/surface_header_shell_standard/colours/

Required files:
- aitom_family/surface_header_shell_standard/colours/background.md – header bg.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: colours

Target folder:
- aitom_family/surface_logo_centerpiece/colours/

Required files:
- aitom_family/surface_logo_centerpiece/colours/fill.md – logo fill.

Implementation notes:
- text_primary or brand_accent.
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: colours

Target folder:
- aitom_family/app_header_appname_dropdown/colours/

Required files:
- aitom_family/app_header_appname_dropdown/colours/state.md – hover/active bg.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: colours

Target folder:
- aitom_family/macro_temp_indicator/colours/

Required files:
- aitom_family/macro_temp_indicator/colours/gradient.md – temperature gradient (cool->hot).

Implementation notes:
- Use semantic steps (temp_low, temp_med, temp_high).
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: colours

Target folder:
- aitom_family/main_menu_icon_button/colours/

Required files:
- None.

Implementation notes:
- STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: colours

Target folder:
- aitom_family/product_buy_buttons_block/colours/

Required files:
- aitom_family/product_buy_buttons_block/colours/button.md – primary CTA colours.

Implementation notes:
- button_primary_fill, button_primary_text.
- STATUS: DONE
- Implemented: `button.md`.

### ATOM: product_collapsible_section
dimension: colours

Target folder:
- aitom_family/product_collapsible_section/colours/

Required files:
- aitom_family/product_collapsible_section/colours/divider.md – border_subtle.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: colours

Target folder:
- aitom_family/product_description_block/colours/

Required files:
- aitom_family/product_description_block/colours/text.md – text_secondary.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: colours

Target folder:
- aitom_family/product_info_stack/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: colours

Target folder:
- aitom_family/product_media_gallery/colours/

Required files:
- aitom_family/product_media_gallery/colours/ui.md – arrow/dot controls tint.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: colours

Target folder:
- aitom_family/product_price_block/colours/

Required files:
- aitom_family/product_price_block/colours/price.md – text_primary, text_disabled (sale).

Implementation notes:
- STATUS: DONE
- Implemented: `price.md`.

### ATOM: product_recommendations_section
dimension: colours

Target folder:
- aitom_family/product_recommendations_section/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: colours

Target folder:
- aitom_family/product_title_block/colours/

Required files:
- aitom_family/product_title_block/colours/text.md – text_primary.

Implementation notes:
- STATUS: DONE
- Implemented: `text.md`.

### ATOM: product_variant_picker
dimension: colours

Target folder:
- aitom_family/product_variant_picker/colours/

Required files:
- aitom_family/product_variant_picker/colours/selection.md – selected state outline/fill.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: colours

Target folder:
- aitom_family/section_blog_posts/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: colours

Target folder:
- aitom_family/section_collection_list/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: colours

Target folder:
- aitom_family/section_custom_markup/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: colours

Target folder:
- aitom_family/section_email_signup/colours/

Required files:
- aitom_family/section_email_signup/colours/input.md – input field colours.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: colours

Target folder:
- aitom_family/section_featured_collection_grid/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: colours

Target folder:
- aitom_family/section_hero_banner/colours/

Required files:
- aitom_family/section_hero_banner/colours/overlay.md – image overlay opacity.

Implementation notes:
- STATUS: DONE
- Implemented: `overlay.md`.

### ATOM: section_image_with_text
dimension: colours

Target folder:
- aitom_family/section_image_with_text/colours/

Required files:
- aitom_family/section_image_with_text/colours/background.md – optional section bg.

Implementation notes:
- STATUS: DONE
- Implemented: `background.md`.

### ATOM: section_media_collage
dimension: colours

Target folder:
- aitom_family/section_media_collage/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: colours

Target folder:
- aitom_family/section_multicolumn_features/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: colours

Target folder:
- aitom_family/section_rich_text/colours/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: colours

Target folder:
- aitom_family/section_slideshow/colours/

Required files:
- aitom_family/section_slideshow/colours/ui.md – control dots.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: colours

Target folder:
- aitom_family/lanes_calendar_grid_v1/colours/

Required files:
- aitom_family/lanes_calendar_grid_v1/colours/grid.md – day cell borders.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: colours

Target folder:
- aitom_family/multi_feed_tile/colours/

Required files:
- aitom_family/multi_feed_tile/colours/status.md – semantic status colours.

Implementation notes:
- STATUS: DONE
- Implemented: `status.md`.
