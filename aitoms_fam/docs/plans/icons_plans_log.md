## atom: lanes_calendar_grid_v1
dimension: icons
target_folder: aitom_family/lanes_calendar_grid_v1/icons/
tasks:
- Verify no icons are used inside cells as per brief. Define any minimal auxiliary icons if strictly necessary for the detail view interactions.
STATUS: DONE

### ATOM: app_header_appname_dropdown
dimension: icons

Target folder:
- aitom_family/app_header_appname_dropdown/icons/

Required files:
- aitom_family/app_header_appname_dropdown/icons/chevron.md – chevron icon mapping and states.

Implementation notes:
- Reference shared chevron icon; tokens for size, stroke/fill, rotation on open; spacing token to text; ensure contrast on dark base.

STATUS: DONE

### ATOM: maybes_note
dimension: icons

Target folder:
- aitom_family/maybes_note/icons/

Required files:
- aitom_family/maybes_note/icons/pin.md – icon for pinned state (optional).

Implementation notes:
- Optional pin icon from registry; tokens for size/placement on card; monochrome on dark base; archive has no icon by default.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: icons

Target folder:
- aitom_family/chat_rail_header_bar/icons/

Required files:
- aitom_family/chat_rail_header_bar/icons/header_icons.md – mapping for minimise/expand/tools/settings and order tokens.

Implementation notes:
- Use global registry icons; tokens for size, padding, stroke/fill, hover/active/disabled states; order tokenized.

STATUS: DONE

### ATOM: chat_message_list
dimension: icons

Target folder:
- aitom_family/chat_message_list/icons/

Required files:
- aitom_family/chat_message_list/icons/notes.md – note [NO ICONS] at list level.

Implementation notes:
- Icons live in message blocks; document none at list container.

STATUS: DONE

### ATOM: chat_message_block
dimension: icons

Target folder:
- aitom_family/chat_message_block/icons/

Required files:
- aitom_family/chat_message_block/icons/avatar.md – avatar slot mapping and sizing.

Implementation notes:
- Optional avatar icon per role; tokens for size, alignment, spacing; uses global registry.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: icons

Target folder:
- aitom_family/chat_message_action_bar/icons/

Required files:
- aitom_family/chat_message_action_bar/icons/actions.md – icon refs for save/alert/review/delete/todo with states.

Implementation notes:
- Five required icons from registry; tokens for size, stroke, spacing, hover/pressed/disabled colour references.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: icons

Target folder:
- aitom_family/chat_safety_controls_bar/icons/

Required files:
- aitom_family/chat_safety_controls_bar/icons/controls.md – icon refs for slider/scales/fire etc. with active state styling.

Implementation notes:
- Map control_id to icon_id; tokens for size, padding, active indicator; monochrome on dark base.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: icons

Target folder:
- aitom_family/bottom_chat_input_bar/icons/

Required files:
- aitom_family/bottom_chat_input_bar/icons/upload.md – upload/agent icon ref and states.
- aitom_family/bottom_chat_input_bar/icons/shortcut.md – inline shortcut arrow icon ref.
- aitom_family/bottom_chat_input_bar/icons/send.md – send icon ref and states.

Implementation notes:
- Icons come from registry; tokens for size, padding, hover/pressed/disabled; ensure contrast on light pill.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: icons

Target folder:
- aitom_family/chat_shortcuts_popover/icons/

Required files:
- aitom_family/chat_shortcuts_popover/icons/notes.md – [NO ICONS] beyond text tokens.

Implementation notes:
- Tokens rendered as text; document no additional icons unless future glyphs added.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: icons

Target folder:
- aitom_family/chat_upload_source_picker/icons/

Required files:
- aitom_family/chat_upload_source_picker/icons/sources.md – optional icons per source/destination type.

Implementation notes:
- Map source_id to icon_id (cloud/device/etc.); tokens for size, spacing; subdued on dark base.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: icons

Target folder:
- aitom_family/chat_icon_band_popover/icons/

Required files:
- aitom_family/chat_icon_band_popover/icons/band_icons.md – icon refs for tools/settings entries and active state styling.

Implementation notes:
- Icons from registry; tokens for large size, padding, active underline/filled disc; horizontal scroll alignment.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: icons

Target folder:
- aitom_family/chat_rail_shell/icons/

Required files:
- aitom_family/chat_rail_shell/icons/header_controls.md – minimise/expand/tools/settings icon mapping and states.
- aitom_family/chat_rail_shell/icons/preview.md – optional nano preview icon/avatar slot.

Implementation notes:
- Reference global icons: icon_minimize, icon_expand, icon_settings, icon_tools; tokens for size, padding, hover/active states.
- Optional preview/avatar icon in nano state uses registry ref; ensure monochrome alignment with header height.

STATUS: DONE

### ATOM: macro_temp_indicator
dimension: icons

Target folder:
- aitom_family/macro_temp_indicator/icons/

Required files:
- aitom_family/macro_temp_indicator/icons/degree.md – degree glyph/icon treatment and sizing.

Implementation notes:
- Degree symbol may be treated as icon; tokenize size/position; colour handled in colours plan.

STATUS: DONE

### ATOM: main_menu_icon_button
dimension: icons

Target folder:
- aitom_family/main_menu_icon_button/icons/

Required files:
- aitom_family/main_menu_icon_button/icons/asset_map.md – map theme_variant to menu_black.png/menu_white.png.

Implementation notes:
- Define icon refs from registry; size tokens; optional hover/pressed state colour tokens; no inline art.

STATUS: DONE

### ATOM: surface_header_nano
dimension: icons

Target folder:
- aitom_family/surface_header_nano/icons/

Required files:
- aitom_family/surface_header_nano/icons/notes.md – references main_menu_icon_button icon.

Implementation notes:
- Nano reuses main_menu_icon_button icon; document no additional icons.

STATUS: DONE

### ATOM: surface_header_shell_micro
dimension: icons

Target folder:
- aitom_family/surface_header_shell_micro/icons/

Required files:
- aitom_family/surface_header_shell_micro/icons/notes.md – references child atom icons.

Implementation notes:
- No unique icons; rely on main_menu_icon_button and app_header_appname_dropdown chevron; document inheritance.

STATUS: DONE

### ATOM: surface_header_shell_standard
dimension: icons

Target folder:
- aitom_family/surface_header_shell_standard/icons/

Required files:
- aitom_family/surface_header_shell_standard/icons/notes.md – references child atom icons including macro_temp degree.

Implementation notes:
- No new icons; document composition of child icons; ensure scale consistency across header height.

STATUS: DONE

### ATOM: surface_logo_centerpiece
dimension: icons

Target folder:
- aitom_family/surface_logo_centerpiece/icons/

Required files:
- aitom_family/surface_logo_centerpiece/icons/logo_slot.md – logo asset slot definition.

Implementation notes:
- Logo uses external asset reference; tokenize max dimensions; no additional glyphs.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: icons

Target folder:
- aitom_family/floating_pill_toolbar/icons/

Required files:
- aitom_family/floating_pill_toolbar/icons/launcher.md – launcher icon token mapping and swap rules.
- aitom_family/floating_pill_toolbar/icons/tools_registry.md – registry for tool icons within the pill and state variants.

Implementation notes:
- Reference existing icons directory; define `launcher_icon_ref` token and per-tool icon refs; support swapping sets per app/context.
- Tokens for icon size, stroke/fill, hover/pressed/disabled states; launcher icon distinct from tool icons.
- Ensure icons invert correctly on dark surfaces; keep mini-pill icon padding tokenized.

STATUS: DONE

### ATOM: chat_card_v1
dimension: icons

Target folder:
- aitom_family/chat_card_v1/icons/

Required files:
- aitom_family/chat_card_v1/icons/avatar_map.md – map default single-chat avatar to existing white robot files and define token names for swaps.
- aitom_family/chat_card_v1/icons/group_cluster.md – describe cluster composition (rows/columns/overlap) and tokenized layout for group avatars.
- aitom_family/chat_card_v1/icons/icon_treatments.md – specify inversion/monochrome rules, padding/masking inside the pill, and fallbacks when assets are missing.

Implementation notes:
- Reference current robot assets by filename (AGENT_PLAIN_WHITE.png, AGENT_LUXURY_WHITE.png, AGENT_STREETWEAR_WHITE.png) without embedding business names; set tokens for default single avatar choice and allowed alternates.
- Define a swap token for the base avatar set so apps can replace robots with human photos or per-agent icons without changing structure; include guidance for supplying a tint/monochrome mask so icons stay legible on black.
- For group chats, outline a 3+2 cluster arrangement with overlap offsets and scale tokens; ensure the cluster stays inside the avatar bounding circle and remains crisp at small sizes.
- Include size tokens (px) aligned with layout avatar container, plus padding tokens to prevent strokes from clipping the pill outline.
- Document state-aware treatments: hover/active may add a faint halo; unread state should not recolor icons; high-contrast mode keeps icons white on black.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: icons
Target folder:
- aitom_family/wireframe_canvas/icons/

Tasks:
- Identify icon IDs for drag handles, snap-to-grid toggle, selection/highlight, and optional remote agent markers; map to global registry.
- Define icon sizing/placement tokens for overlays on dark canvas and inversion rules on hover/active.
- Provide placeholders if specific agent/human markers are not yet chosen, noting [NO-OP] for future mapping.

STATUS: DONE

### ATOM: blackboard
Dimension: icons
Target folder:
- aitom_family/blackboard/icons/

Tasks:
- Identify icons for drag handles, snap-to-grid toggle, and selection/highlight states; ensure IDs map to global icon registry.
- Define icon sizing/placement tokens for overlays on a dark canvas and inversion rules on hover/active.
- Provide icon variants for agent/system activity indicators (e.g., remote cursor/agent marker) if available; otherwise stub with [NO-OP] placeholders.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: icons
Target folder:
- aitom_family/multi_feed_tile/icons/

Tasks:
- Identify icon IDs for video play overlay and KPI trend (up/down) indicators; confirm any CTA affordance icon if used.
- Map icon usage per mode (video overlay, KPI delta) with shared sizing/placement tokens.
- Define colour/inversion rules for icons on the dark base and during hover/active states to preserve contrast.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: icons

Target folder:
- aitom_family/theme_layout_settings/icons/

Required files:
- aitom_family/theme_layout_settings/icons/registry.md – note any optional layout control icons (density toggle, full-bleed toggle).

Implementation notes:
- Minimal icon use; if layout controls are surfaced, reference existing generic icons from /icons/ (e.g., layout/density). Provide tokens for size/colour/inversion on dark base.
- If no icons are needed, document [NO ICONS] to keep scope explicit.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: icons

Target folder:
- aitom_family/theme_colour_schemes/icons/

Required files:
- aitom_family/theme_colour_schemes/icons/registry.md – optional scheme selector/checkmark icons.

Implementation notes:
- Use generic selection/check icons for scheme pickers; define size/placement tokens and inversion rules on dark background.
- If scheme switching is text-only, mark [NO ICONS] but keep file noting the decision.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: icons

Target folder:
- aitom_family/theme_typography_settings/icons/

Required files:
- aitom_family/theme_typography_settings/icons/registry.md – optional icons for preset selectors if any.

Implementation notes:
- Typography settings are primarily textual; if preset selectors need an icon (e.g., link/heading), reference existing icons and define size/colour tokens. Otherwise document [NO ICONS].

STATUS: DONE

### ATOM: theme_card_surface
dimension: icons

Target folder:
- aitom_family/theme_card_surface/icons/

Required files:
- aitom_family/theme_card_surface/icons/badges.md – optional badge/flag icons that can sit on the card shell.

Implementation notes:
- Define optional badge/icon placement tokens (corner radius-aware), size, and inversion on dark/light variants. Reference existing icon filenames; keep tokenized for swap.
- If no default badge icons are shipped, state [NO DEFAULT ICONS] and keep the placement guidance.

STATUS: DONE

### ATOM: layout_group_container
dimension: icons

Target folder:
- aitom_family/layout_group_container/icons/

Required files:
- aitom_family/layout_group_container/icons/registry.md – optional icons for background media toggle or alignment controls.

Implementation notes:
- Container is mostly structural; if UI exposes background/media toggles or alignment controls, reference generic icons from /icons/ and define size/colour tokens on dark base. Otherwise document [NO ICONS].

STATUS: DONE

### ATOM: layout_columns_grid
dimension: icons

Target folder:
- aitom_family/layout_columns_grid/icons/

Required files:
- aitom_family/layout_columns_grid/icons/registry.md – optional icons for add/remove column controls in builder view.

Implementation notes:
- Structural grid; icons only if controls are shown in editing context. Reference existing layout icons; define size/placement/inversion tokens. If none, note [NO ICONS].

STATUS: DONE

### ATOM: layout_spacer_block
dimension: icons

Target folder:
- aitom_family/layout_spacer_block/icons/

Required files:
- aitom_family/layout_spacer_block/icons/notes.md – state [NO ICONS] unless debug handles required.

Implementation notes:
- Spacer has no icons; if debug handles are needed, define minimal handle icon reference and size tokens on dark base.

STATUS: DONE

### ATOM: layout_divider_block
dimension: icons

Target folder:
- aitom_family/layout_divider_block/icons/

Required files:
- aitom_family/layout_divider_block/icons/registry.md – optional label marker or decorative glyph.

Implementation notes:
- Divider may include an optional centered glyph; reference existing simple icon and define size/colour tokens. If unused, document [NO ICONS].

STATUS: DONE

### ATOM: heading_block
dimension: icons

Target folder:
- aitom_family/heading_block/icons/

Required files:
- aitom_family/heading_block/icons/notes.md – note icon usage for linked headings (optional link/arrow icon).

Implementation notes:
- Typically no icons; if heading includes an inline link icon (arrow/external), reference existing icons and define size/spacing/inversion tokens. Otherwise document [NO ICONS].

STATUS: DONE

### ATOM: rich_text_block
dimension: icons

Target folder:
- aitom_family/rich_text_block/icons/

Required files:
- aitom_family/rich_text_block/icons/notes.md – optional inline icon guidance.

Implementation notes:
- Rich text is primarily text; if inline icons are supported, reference generic icons and define size/baseline alignment/inversion tokens; otherwise mark [NO ICONS].

STATUS: DONE

### ATOM: button_single
dimension: icons

Target folder:
- aitom_family/button_single/icons/

Required files:
- aitom_family/button_single/icons/registry.md – icon-left/icon-right references and sizing.

Implementation notes:
- Define tokens for optional leading/trailing icons: size, padding, colour/inversion on dark/white variants; reference existing icon filenames.
- Loading indicator icon placeholder may be noted if used.

STATUS: DONE

### ATOM: button_group
dimension: icons

Target folder:
- aitom_family/button_group/icons/

Required files:
- aitom_family/button_group/icons/notes.md – inherit button_single icon guidance.

Implementation notes:
- Reuse button_single icon tokens; no extra icons at group level.

STATUS: DONE

### ATOM: image_media_block
dimension: icons

Target folder:
- aitom_family/image_media_block/icons/

Required files:
- aitom_family/image_media_block/icons/overlay.md – overlay icon (play/view) if used.

Implementation notes:
- Optional overlay icon (e.g., view/zoom) on hover; define size/position/colour tokens; reference existing icon assets; ensure contrast on images.
- If no overlay icon default, document [NO DEFAULT ICON].

STATUS: DONE

### ATOM: video_media_block
dimension: icons

Target folder:
- aitom_family/video_media_block/icons/

Required files:
- aitom_family/video_media_block/icons/playback.md – play/pause overlay icon tokens.

Implementation notes:
- Define play icon size/position/colour tokens; ensure visibility on dark/bright posters; include focus/hover state handling.
- Reference existing play icon file; allow swapping via token.

STATUS: DONE

### ATOM: accordion_item
dimension: icons

Target folder:
- aitom_family/accordion_item/icons/

Required files:
- aitom_family/accordion_item/icons/chevron.md – chevron/indicator icon mapping and tokens.

Implementation notes:
- Chevron icon rotates on expand; tokens for size, stroke/colour, rotation animation duration (respect reduced motion), and alignment.
- Reference existing chevron icon file; allow swap via token.

STATUS: DONE

### ATOM: section_hero_banner
dimension: icons

Target folder:
- aitom_family/section_hero_banner/icons/

Required files:
- aitom_family/section_hero_banner/icons/media_controls.md – icons for play/pause (if video) and overlay affordances.
- aitom_family/section_hero_banner/icons/cta.md – optional icons for CTAs if used.

Implementation notes:
- Reference existing play/pause icons for video backgrounds; define size/position/colour tokens on dark overlays. CTAs may use optional icons; size/spacing tokens required.
- Ensure inversion on dark/overlay; allow swap tokens.

STATUS: DONE

### ATOM: section_rich_text
dimension: icons

Target folder:
- aitom_family/section_rich_text/icons/

Required files:
- aitom_family/section_rich_text/icons/notes.md – optional inline icons for links/buttons.

Implementation notes:
- Primarily text; if CTA includes icon, reuse button icon tokens; otherwise [NO ICONS] noted.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: icons

Target folder:
- aitom_family/section_multicolumn_features/icons/

Required files:
- aitom_family/section_multicolumn_features/icons/feature_media.md – icon/image usage per column.
- aitom_family/section_multicolumn_features/icons/cta.md – CTA icon guidance if used.

Implementation notes:
- Define tokens for feature icon size/placement/inversion; allow image or icon per column; ensure consistency across columns.
- CTAs follow button icon tokens if used.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: icons

Target folder:
- aitom_family/section_featured_collection_grid/icons/

Required files:
- aitom_family/section_featured_collection_grid/icons/notes.md – reference product card icons if any.

Implementation notes:
- Section-level icons minimal; product card icons handled in card atoms. If “view all” CTA uses icon, reference button tokens. Otherwise note [NO ICONS].

STATUS: DONE

### ATOM: section_collection_list
dimension: icons

Target folder:
- aitom_family/section_collection_list/icons/

Required files:
- aitom_family/section_collection_list/icons/notes.md – collection card icon/media guidance.

Implementation notes:
- Collection cards may show image or generic icon if missing; define fallback icon token and size. If CTA uses icon, reuse button tokens. Otherwise document [NO DEFAULT ICON].

STATUS: DONE

### ATOM: section_media_collage
dimension: icons

Target folder:
- aitom_family/section_media_collage/icons/

Required files:
- aitom_family/section_media_collage/icons/overlay.md – overlay icons for play/zoom if used.

Implementation notes:
- Tiles may use overlay icons (play for video, zoom/view for image); define size/position/colour tokens; reference existing icons; allow swap tokens.
- If no default icons needed, state [NO DEFAULT ICON].

STATUS: DONE

### ATOM: section_image_with_text
dimension: icons

Target folder:
- aitom_family/section_image_with_text/icons/

Required files:
- aitom_family/section_image_with_text/icons/media_overlay.md – optional overlay icon on media.
- aitom_family/section_image_with_text/icons/cta.md – CTA icon usage notes.

Implementation notes:
- Optional overlay icon on media (view/zoom); tokens for size/position/colour; CTA icons follow button tokens. If unused, note [NO ICONS].

STATUS: DONE

### ATOM: section_slideshow
dimension: icons

Target folder:
- aitom_family/section_slideshow/icons/

Required files:
- aitom_family/section_slideshow/icons/controls.md – arrows/dots/play-pause icons.

Implementation notes:
- Define icon references for navigation arrows, play/pause (if autoplay control), and optional dot styling tokens; size/colour/inversion on dark base; allow swaps.

STATUS: DONE

### ATOM: section_blog_posts
dimension: icons

Target folder:
- aitom_family/section_blog_posts/icons/

Required files:
- aitom_family/section_blog_posts/icons/notes.md – optional icons for meta (date/author) or CTA.

Implementation notes:
- If using meta icons (calendar/user), reference existing icons and define size/colour tokens; CTA icons reuse button tokens; else note [NO DEFAULT ICONS].

STATUS: DONE

### ATOM: section_email_signup
dimension: icons

Target folder:
- aitom_family/section_email_signup/icons/

Required files:
- aitom_family/section_email_signup/icons/input.md – optional input leading icon.
- aitom_family/section_email_signup/icons/cta.md – CTA icon usage.

Implementation notes:
- Optional input icon (envelope) with size/padding/colour tokens; CTA icon as per button tokens. If unused, note [NO ICONS].

STATUS: DONE

### ATOM: section_custom_markup
dimension: icons

Target folder:
- aitom_family/section_custom_markup/icons/

Required files:
- aitom_family/section_custom_markup/icons/notes.md – [NO ICONS] unless injected content brings its own.

Implementation notes:
- Container supplies no icons; document that icons come from injected markup only.

STATUS: DONE

### ATOM: product_media_gallery
dimension: icons

Target folder:
- aitom_family/product_media_gallery/icons/

Required files:
- aitom_family/product_media_gallery/icons/play_zoom.md – overlay icons for play/zoom.
- aitom_family/product_media_gallery/icons/thumb_active.md – active thumbnail indicator.

Implementation notes:
- Define overlay play icon for video and zoom/view icon for images; tokens for size/position/colour; allow swap via tokens.
- Active thumbnail marker can be stroke or icon; define size/colour tokens; ensure contrast on dark base.

STATUS: DONE

### ATOM: product_info_stack
dimension: icons

Target folder:
- aitom_family/product_info_stack/icons/

Required files:
- aitom_family/product_info_stack/icons/notes.md – [NO ICONS]; child atoms own icons.

Implementation notes:
- Container has no icons; document that icons come from child atoms only.

STATUS: DONE

### ATOM: product_title_block
dimension: icons

Target folder:
- aitom_family/product_title_block/icons/

Required files:
- aitom_family/product_title_block/icons/notes.md – optional link/arrow icon if title is linked.

Implementation notes:
- Typically no icon; if linked with external/internal indicator, reference existing icon and define size/spacing/inversion tokens; otherwise [NO ICONS].

STATUS: DONE

### ATOM: product_price_block
dimension: icons

Target folder:
- aitom_family/product_price_block/icons/

Required files:
- aitom_family/product_price_block/icons/badges.md – optional badge icons.

Implementation notes:
- Price block normally icon-free; if badge uses icon (sale/sold out), define size/colour tokens and reference existing assets; otherwise note [NO ICONS].

STATUS: DONE

### ATOM: product_variant_picker
dimension: icons

Target folder:
- aitom_family/product_variant_picker/icons/

Required files:
- aitom_family/product_variant_picker/icons/dropdown.md – dropdown caret icon tokens.
- aitom_family/product_variant_picker/icons/status.md – optional status icons for availability.

Implementation notes:
- Dropdown variant uses caret icon with size/colour tokens; swatch/button variants typically icon-free unless showing status; document [OPTIONAL ICONS].

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: icons

Target folder:
- aitom_family/product_buy_buttons_block/icons/

Required files:
- aitom_family/product_buy_buttons_block/icons/notes.md – reuse button_single icons.

Implementation notes:
- Reuse button_single icon tokens; no additional icons at block level.

STATUS: DONE

### ATOM: product_description_block
dimension: icons

Target folder:
- aitom_family/product_description_block/icons/

Required files:
- aitom_family/product_description_block/icons/notes.md – [NO ICONS] unless inline media uses existing rules.

Implementation notes:
- Description text uses no icons; if inline icons allowed via rich text, refer to rich_text_block tokens; otherwise [NO ICONS].
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: product_collapsible_section
dimension: icons

Target folder:
- aitom_family/product_collapsible_section/icons/

Required files:
- aitom_family/product_collapsible_section/icons/chevron.md – chevron icon mapping.

Implementation notes:
- Chevron rotates on expand; tokens for size/colour/rotation; reference existing icon; allow swap via token; respect reduced motion for rotation.
- STATUS: DONE
- Implemented: `chevron.md`.

### ATOM: product_recommendations_section
dimension: icons

Target folder:
- aitom_family/product_recommendations_section/icons/

Required files:
- aitom_family/product_recommendations_section/icons/notes.md – card icons handled by product card atoms.

Implementation notes:
- Section itself has no unique icons; cards may include badge icons defined elsewhere. If “view all” CTA uses icon, reuse button tokens. Otherwise [NO ICONS].
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: wireframe_canvas
dimension: icons

Target folder:
- aitom_family/wireframe_canvas/icons/

Required files:
- aitom_family/wireframe_canvas/icons/toolbar.md – icons for grid toggle, snap toggle, zoom in/out.
- aitom_family/wireframe_canvas/icons/cursors.md – custom cursors for drag/resize/remote-user.

Implementation notes:
- Use system icon set for toolbar; specific "hand" or "grab" cursors for manipulation.
- Remote user cursors should be distinct (arrow with label) and color-coded.
- STATUS: DONE
- Implemented: `toolbar.md`, `cursors.md`.

### ATOM: blackboard
dimension: icons

Target folder:
- aitom_family/blackboard/icons/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: theme_layout_settings
dimension: icons

Target folder:
- aitom_family/theme_layout_settings/icons/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE (N/A).

### ATOM: theme_colour_schemes
dimension: icons

Target folder:
- aitom_family/theme_colour_schemes/icons/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE (N/A).

### ATOM: theme_typography_settings
dimension: icons

Target folder:
- aitom_family/theme_typography_settings/icons/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE (N/A).

### ATOM: theme_card_surface
dimension: icons

Target folder:
- aitom_family/theme_card_surface/icons/

Required files:
- aitom_family/theme_card_surface/icons/placeholders.md – default icon slots if any.

Implementation notes:
- Cards may wrap icons but don't define them.
- STATUS: DONE

### ATOM: accordion_item
dimension: icons

Target folder:
- aitom_family/accordion_item/icons/

Required files:
- aitom_family/accordion_item/icons/chevron.md – chevron-down icon ref.

Implementation notes:
- Use standard chevron; rotation handled by behaviour token.
- Status: ACTIVE

### ATOM: button_group
dimension: icons

Target folder:
- aitom_family/button_group/icons/

Required files:
- None. (Buttons own their icons).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: button_single
dimension: icons

Target folder:
- aitom_family/button_single/icons/

Required files:
- aitom_family/button_single/icons/slots.md – left/right icon slots.

Implementation notes:
- Support icon_left and icon_right props.
- Status: ACTIVE

### ATOM: heading_block
dimension: icons

Target folder:
- aitom_family/heading_block/icons/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: rich_text_block
dimension: icons

Target folder:
- aitom_family/rich_text_block/icons/

Required files:
- None. (Inline icons handled by fonts/unicode).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: image_media_block
dimension: icons

Target folder:
- aitom_family/image_media_block/icons/

Required files:
- aitom_family/image_media_block/icons/zoom.md – optional zoom/expand icon overlay.

Implementation notes:
- Status: ACTIVE

### ATOM: video_media_block
dimension: icons

Target folder:
- aitom_family/video_media_block/icons/

Required files:
- aitom_family/video_media_block/icons/play.md – play button overlay.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: icons

Target folder:
- aitom_family/layout_columns_grid/icons/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: icons

Target folder:
- aitom_family/layout_divider_block/icons/

Required files:
- None.

Implementation notes:
- N/A
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: layout_group_container
dimension: icons

Target folder:
- aitom_family/layout_group_container/icons/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: icons

Target folder:
- aitom_family/layout_spacer_block/icons/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: icons

Target folder:
- aitom_family/floating_pill_toolbar/icons/

Required files:
- aitom_family/floating_pill_toolbar/icons/tools.md – collection of tool icons (drag handle, close).

Implementation notes:
- STATUS: DONE
- Implemented: `tools.md`.

### ATOM: maybes_note
dimension: icons

Target folder:
- aitom_family/maybes_note/icons/

Required files:
- aitom_family/maybes_note/icons/pin.md – pin/unpin icon.
- aitom_family/maybes_note/icons/close.md – archive icon.

Implementation notes:
- STATUS: DONE

### ATOM: chat_card_v1
dimension: icons

Target folder:
- aitom_family/chat_card_v1/icons/

Required files:
- aitom_family/chat_card_v1/icons/flip.md – settings/back icon.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: icons

Target folder:
- aitom_family/chat_rail_shell/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: icons

Target folder:
- aitom_family/chat_rail_header_bar/icons/

Required files:
- aitom_family/chat_rail_header_bar/icons/actions.md – close/minimize rail.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: icons

Target folder:
- aitom_family/chat_message_list/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: icons

Target folder:
- aitom_family/chat_message_block/icons/

Required files:
- aitom_family/chat_message_block/icons/avatar.md – user/agent avatar placeholder.

Implementation notes:
- STATUS: DONE
- Implemented: `avatar.md`.

### ATOM: chat_message_action_bar
dimension: icons

Target folder:
- aitom_family/chat_message_action_bar/icons/

Required files:
- aitom_family/chat_message_action_bar/icons/actions.md – copy, retry, like, dislike.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: icons

Target folder:
- aitom_family/chat_safety_controls_bar/icons/

Required files:
- aitom_family/chat_safety_controls_bar/icons/warning.md – shield or alert icon.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: icons

Target folder:
- aitom_family/bottom_chat_input_bar/icons/

Required files:
- aitom_family/bottom_chat_input_bar/icons/send.md – send arrow (up/right).
- aitom_family/bottom_chat_input_bar/icons/attach.md – paperclip or plus.

Implementation notes:
- STATUS: DONE
- Implemented: `send.md`, `attach.md`.

### ATOM: chat_shortcuts_popover
dimension: icons

Target folder:
- aitom_family/chat_shortcuts_popover/icons/

Required files:
- aitom_family/chat_shortcuts_popover/icons/commands.md – icon per command.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: icons

Target folder:
- aitom_family/chat_upload_source_picker/icons/

Required files:
- aitom_family/chat_upload_source_picker/icons/sources.md – drive, local, link icons.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: icons

Target folder:
- aitom_family/chat_icon_band_popover/icons/

Required files:
- aitom_family/chat_icon_band_popover/icons/set.md – the selectable icons.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: icons

Target folder:
- aitom_family/surface_header_nano/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: icons

Target folder:
- aitom_family/surface_header_shell_micro/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: icons

Target folder:
- aitom_family/surface_header_shell_standard/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: icons

Target folder:
- aitom_family/surface_logo_centerpiece/icons/

Required files:
- aitom_family/surface_logo_centerpiece/icons/mark.md – brand logomark.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: icons

Target folder:
- aitom_family/app_header_appname_dropdown/icons/

Required files:
- aitom_family/app_header_appname_dropdown/icons/chevron.md – dropdown indicator.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: icons

Target folder:
- aitom_family/macro_temp_indicator/icons/

Required files:
- aitom_family/macro_temp_indicator/icons/thermometer.md – temp icon variants.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: icons

Target folder:
- aitom_family/main_menu_icon_button/icons/

Required files:
- aitom_family/main_menu_icon_button/icons/hamburger.md – menu trigger.

Implementation notes:
- STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: icons

Target folder:
- aitom_family/product_buy_buttons_block/icons/

Required files:
- aitom_family/product_buy_buttons_block/icons/cart.md – cart add/remove icons.

Implementation notes:
- STATUS: DONE
- Implemented: `cart.md`.

### ATOM: product_collapsible_section
dimension: icons

Target folder:
- aitom_family/product_collapsible_section/icons/

Required files:
- aitom_family/product_collapsible_section/icons/toggle.md – chevron/plus-minus.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: icons

Target folder:
- aitom_family/product_description_block/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: icons

Target folder:
- aitom_family/product_info_stack/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: icons

Target folder:
- aitom_family/product_media_gallery/icons/

Required files:
- aitom_family/product_media_gallery/icons/zoom.md – expand/close icons.
- aitom_family/product_media_gallery/icons/nav.md – arrow icons.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: icons

Target folder:
- aitom_family/product_price_block/icons/

Required files:
- None.

Implementation notes:
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: product_recommendations_section
dimension: icons

Target folder:
- aitom_family/product_recommendations_section/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: icons

Target folder:
- aitom_family/product_title_block/icons/

Required files:
- None.

Implementation notes:
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: product_variant_picker
dimension: icons

Target folder:
- aitom_family/product_variant_picker/icons/

Required files:
- aitom_family/product_variant_picker/icons/swatch.md – visual swatch support.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: icons

Target folder:
- aitom_family/section_blog_posts/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: icons

Target folder:
- aitom_family/section_collection_list/icons/

Required files:
- aitom_family/section_collection_list/icons/arrow.md – view all arrow.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: icons

Target folder:
- aitom_family/section_custom_markup/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: icons

Target folder:
- aitom_family/section_email_signup/icons/

Required files:
- aitom_family/section_email_signup/icons/envelope.md – email input icon.
- aitom_family/section_email_signup/icons/submit.md – arrow submit.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: icons

Target folder:
- aitom_family/section_featured_collection_grid/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: icons

Target folder:
- aitom_family/section_hero_banner/icons/

Required files:
- None.

Implementation notes:
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: section_image_with_text
dimension: icons

Target folder:
- aitom_family/section_image_with_text/icons/

Required files:
- None.

Implementation notes:
- STATUS: DONE
- Implemented: `notes.md` ([NO ICONS]).

### ATOM: section_media_collage
dimension: icons

Target folder:
- aitom_family/section_media_collage/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: icons

Target folder:
- aitom_family/section_multicolumn_features/icons/

Required files:
- aitom_family/section_multicolumn_features/icons/feature.md – icon slot.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: icons

Target folder:
- aitom_family/section_rich_text/icons/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: icons

Target folder:
- aitom_family/section_slideshow/icons/

Required files:
- aitom_family/section_slideshow/icons/controls.md – dot/arrow nav.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: icons

Target folder:
- aitom_family/lanes_calendar_grid_v1/icons/

Required files:
- aitom_family/lanes_calendar_grid_v1/icons/nav.md – calendar nav arrows.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: icons

Target folder:
- aitom_family/multi_feed_tile/icons/

Required files:
- aitom_family/multi_feed_tile/icons/status.md – status/health indicators.

Implementation notes:
- STATUS: DONE
- Implemented: `status.md`.
