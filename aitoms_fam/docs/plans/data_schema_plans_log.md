## atom: lanes_calendar_grid_v1
dimension: data_schema
target_folder: aitom_family/lanes_calendar_grid_v1/data_schema/
tasks:
- Define TypeScript interfaces. `CellData`: { date: string, status: 'done' | 'planned' | 'empty', notes?: string }. `LaneData`: { id: string, label: string, cells: CellData[] }. `GridData`: { weekStartDate: string, lanes: LaneData[] }.
STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: data_schema

Target folder:
- aitom_family/floating_pill_toolbar/data_schema/

Required files:
- aitom_family/floating_pill_toolbar/data_schema/schema.md – toolbar fields and per-tool definitions.
- aitom_family/floating_pill_toolbar/data_schema/positioning.md – snap grid coordinates, viewport bounds, chat-rail exclusion metadata.
- aitom_family/floating_pill_toolbar/data_schema/state_derivations.md – derived flags for expanded, dragging, gather leader, collision adjustments.

Implementation notes:
- Fields: toolbar_id, instance_id, mode (collapsed/expanded), position {grid_x, grid_y, px_offset?}, snap_grid {cell, origin, bounds}, chat_rail_bounds ref, expansion_direction, tools [{id, icon_ref, state (enabled/disabled), badge_ref optional}], tracking_id/view_id.
- Include gather metadata: gather_anchor_id, gathered_at timestamp optional; store persisted position per instance.
- No PII; timestamps optional; content slots for labels optional; all media via refs/tokens.

STATUS: DONE

### ATOM: maybes_note
dimension: data_schema

Target folder:
- aitom_family/maybes_note/data_schema/

Required files:
- aitom_family/maybes_note/data_schema/schema.md – MaybesNote fields and optional extras.
- aitom_family/maybes_note/data_schema/api_mapping.md – mapping to /api/maybes endpoints including canvas-layout bulk payload.

Implementation notes:
- Fields: maybes_id (UUID), tenant_id, user_id, title?, body, colour_token, layout_x, layout_y, layout_scale, tags[], origin_ref {surface, app, thread_id, message_id}, is_pinned, is_archived, created_at, updated_at, episode_id?, nexus_doc_id?, tracking/view ids optional.
- API mapping: GET/POST/PATCH/DELETE /api/maybes; DELETE archives; POST /api/maybes/canvas-layout takes array of {maybes_id, x, y, scale}.
- Asset type fixed: "maybes_note"; tags free text; no Nexus writes unless nexus_doc_id used for mirroring later.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: data_schema

Target folder:
- aitom_family/chat_rail_header_bar/data_schema/

Required files:
- aitom_family/chat_rail_header_bar/data_schema/schema.md – header fields and control visibility.
- aitom_family/chat_rail_header_bar/data_schema/state_derivations.md – derived active states for bands and disable conditions.

Implementation notes:
- Fields: chat_id, app_label, current_state (nano/micro/standard/full), active_band (none/tools/settings), show_minimize, show_expand, tracking/view ids.
- Derived: can_minimise/can_expand booleans; active states for tools/settings icons; label truncation not stored as data.
- No PII; label is display string only.

STATUS: DONE

### ATOM: chat_message_list
dimension: data_schema

Target folder:
- aitom_family/chat_message_list/data_schema/

Required files:
- aitom_family/chat_message_list/data_schema/schema.md – list fields including messages refs and history flags.
- aitom_family/chat_message_list/data_schema/scroll_state.md – scroll position/auto-scroll flags (optional).

Implementation notes:
- Fields: chat_id, messages (array refs), has_more_history, unread_count (optional), auto_scroll_enabled flag; no message bodies.
- Scroll state optional: last_visible_message_id, is_user_scrolling flag; keep PII-free.

STATUS: DONE

### ATOM: chat_message_block
dimension: data_schema

Target folder:
- aitom_family/chat_message_block/data_schema/

Required files:
- aitom_family/chat_message_block/data_schema/schema.md – message fields and optional role_tag/avatar.
- aitom_family/chat_message_block/data_schema/derived_flags.md – is_new/highlight derived state.

Implementation notes:
- Fields: message_id, chat_id, author_role, author_label, body_text_ref, role_tag, timestamp, avatar_id, is_new; tracking/view ids.
- Derived highlight state driven by is_new/search; alignment determined by role/token; no body text stored here beyond ref.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: data_schema

Target folder:
- aitom_family/chat_message_action_bar/data_schema/

Required files:
- aitom_family/chat_message_action_bar/data_schema/schema.md – action availability flags.

Implementation notes:
- Fields: message_id, chat_id, can_save, can_alert, can_review, can_delete, can_create_todo (booleans), tracking/view ids.
- Action ids/event names not hardcoded; no message text or PII.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: data_schema

Target folder:
- aitom_family/chat_safety_controls_bar/data_schema/

Required files:
- aitom_family/chat_safety_controls_bar/data_schema/schema.md – controls array and states.

Implementation notes:
- Fields: chat_id, controls [{control_id, state}], safety_profile_id optional, tracking/view ids.
- States simple enums; no user content; control definitions referenced by ids.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: data_schema

Target folder:
- aitom_family/bottom_chat_input_bar/data_schema/

Required files:
- aitom_family/bottom_chat_input_bar/data_schema/schema.md – input state fields.
- aitom_family/bottom_chat_input_bar/data_schema/behaviour_flags.md – enter/shift-enter config, disabled flags.

Implementation notes:
- Fields: chat_id, current_input_text_ref, placeholder_text_ref, is_disabled, shortcuts_enabled, tracking/view ids.
- Behaviour flags: send_on_enter (bool), multiline_cap, input_max_chars optional; no raw message text in analytics.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: data_schema

Target folder:
- aitom_family/chat_shortcuts_popover/data_schema/

Required files:
- aitom_family/chat_shortcuts_popover/data_schema/schema.md – tokens array and default order.

Implementation notes:
- Fields: chat_id, tokens [{id, display}], default_token_order optional, tracking/view ids.
- No PII; display strings limited to provided tokens (e.g., ², ³).

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: data_schema

Target folder:
- aitom_family/chat_upload_source_picker/data_schema/

Required files:
- aitom_family/chat_upload_source_picker/data_schema/schema.md – sources/destinations arrays and defaults.
- aitom_family/chat_upload_source_picker/data_schema/state.md – selection state and routing notes.

Implementation notes:
- Fields: chat_id, available_sources, available_destinations (optional), default_source, default_destination, tracking/view ids.
- State: selected_source_id, selected_destination_id optional; no filenames/contents; treat uploads as primary ingestion path.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: data_schema

Target folder:
- aitom_family/chat_icon_band_popover/data_schema/

Required files:
- aitom_family/chat_icon_band_popover/data_schema/schema.md – band_type, icons array, active icon.

Implementation notes:
- Fields: chat_id, band_type (tools/settings), icons [{icon_id, action_type}], active_icon_id optional, tracking/view ids.
- No PII; icon actions referenced by ids only.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: data_schema

Target folder:
- aitom_family/chat_rail_shell/data_schema/

Required files:
- aitom_family/chat_rail_shell/data_schema/schema.md – chat rail fields and state enum.
- aitom_family/chat_rail_shell/data_schema/positioning.md – dock/undock position data and safe-area insets.
- aitom_family/chat_rail_shell/data_schema/state_derivations.md – derived flags (is_docked, has_band_open, unread/badge).

Implementation notes:
- Fields: chat_id (required), state (nano/micro/standard/full), messages (array refs), active_band (none/tools/settings), app_label, is_docked (bool), position {x,y}, unread_count, tenant_id, view_id, safe_area_insets, tracking_key.
- Derived: next_state availability, has_band_open, has_history_loaded; ensure no message bodies stored here, only refs/ids.
- Store nano preview text as ref to latest message, not content; keep schema PII-free.

STATUS: DONE

### ATOM: chat_card_v1
dimension: data_schema

Target folder:
- aitom_family/chat_card_v1/data_schema/

Required files:
- aitom_family/chat_card_v1/data_schema/schema.md – define UI-facing schema fields and expected types for a chat card payload.
- aitom_family/chat_card_v1/data_schema/mapping_notes.md – document how upstream systems should populate fields (e.g., avatar_set sources, unread counts).
- aitom_family/chat_card_v1/data_schema/state_derivations.md – describe derived flags (e.g., unread boolean from count, active from selection).

Implementation notes:
- Specify fields: id, name/handle, role_label, last_message_preview, last_message_time, unread_count, is_unread (derived), is_group (boolean), avatar_set (ordered array of avatar refs), is_active, is_muted, is_pinned (optional), and optional presence/typing flags if applicable.
- Clarify required vs optional fields and defaults (e.g., unread_count defaults to 0; avatar_set must provide at least one entry).
- Define formats for avatar references (filename token, theme token) to align with icon plan; note that timestamps are display-ready strings, not raw dates.
- Describe how the view should handle missing data (fallback avatar, placeholder text) and how unread toggles when count changes.
- Mark which schema fields feed analytics (chat_id, is_group, unread_count) and which map to view tokens (role_label text, preview text).

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: data_schema
Target folder:
- aitom_family/wireframe_canvas/data_schema/

Tasks:
- Define schema for canvas: dimensions, grid spacing, snap enabled flag; elements include id, token/type, x/y positions, width/height, rotation (if any), z-index.
- Include agent/human ownership markers, last_updated timestamps, and versioning for SSE-delivered deltas; exclude PII and full URLs.
- Specify SSE payload shape for element deltas (id, x, y, w, h, z, version) and conflict resolution fields.

STATUS: DONE

### ATOM: blackboard
Dimension: data_schema
Target folder:
- aitom_family/blackboard/data_schema/

Tasks:
- Define schema for canvas and elements: canvas size, grid spacing, snap enabled flag; elements include id, type/token, x/y positions, width/height, rotation (if any), z-index.
- Include fields for agent/human ownership markers and last_updated timestamps while excluding PII; positions should be numerical and grid-relative.
- Specify payload format for SSE updates carrying element deltas (id, x, y, w, h, z, version) and conflict resolution metadata.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: data_schema
Target folder:
- aitom_family/multi_feed_tile/data_schema/

Tasks:
- Formalize `MultiFeedTileData` schema: required `id`, `mode`, `title`, `tracking_key`; optional subtitles/labels, media_src/media_aspect, KPI fields (metric_value/label/change), product fields (product_id, price, currency), CTA (`cta_label`, `cta_href`), interaction flags (clickable, draggable).
- Enumerate allowed modes (image|video|kpi|product|text) and validate mode-specific required fields (e.g., CTA only for product).
- Note privacy guardrails: tracking_key and identifiers only; no PII or full external URLs stored in schema.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: data_schema

Target folder:
- aitom_family/theme_layout_settings/data_schema/

Required files:
- aitom_family/theme_layout_settings/data_schema/schema.md – fields for grid/gutter/margin per breakpoint, container width, safe-area flags, density presets.
- aitom_family/theme_layout_settings/data_schema/mapping_notes.md – how views consume these settings.

Implementation notes:
- Define schema fields: id, version, breakpoints {mobile/tablet/desktop} with grid_span defaults, outer_margin, gutter, container_max_width, section_padding_top/bottom, safe_area_enabled, full_bleed_allowed, density (compact/comfortable).
- Mark required vs optional and default values; include validation ranges; no PII.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: data_schema

Target folder:
- aitom_family/theme_colour_schemes/data_schema/

Required files:
- aitom_family/theme_colour_schemes/data_schema/schema.md – scheme list with token slots.
- aitom_family/theme_colour_schemes/data_schema/state_map.md – state colour mappings per scheme.

Implementation notes:
- Fields: scheme_id, name, surfaces (primary/secondary/overlay), text roles, strokes, accents, button fills/outline, focus, hover/pressed/disabled, error/success, opacity tokens; default_scheme_id.
- Include array of schemes; ensure serialization excludes actual hex outside tokens; no PII.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: data_schema

Target folder:
- aitom_family/theme_typography_settings/data_schema/

Required files:
- aitom_family/theme_typography_settings/data_schema/schema.md – preset definitions mapped to axis tokens and sizes.
- aitom_family/theme_typography_settings/data_schema/breakpoint_overrides.md – optional per-breakpoint scales.

Implementation notes:
- Fields: typography_theme_id, presets [{id, role, font_id, axis_tokens, size_px, line_height, tracking, text_transform, breakpoint_overrides}], default_preset_map per role.
- Include allowed ranges for overrides; no text content; no PII.

STATUS: DONE

### ATOM: theme_card_surface
dimension: data_schema

Target folder:
- aitom_family/theme_card_surface/data_schema/

Required files:
- aitom_family/theme_card_surface/data_schema/schema.md – surface variants and token references.
- aitom_family/theme_card_surface/data_schema/state_map.md – state token mapping per variant.

Implementation notes:
- Fields: surface_id, variant (default/on_accent/outline), padding_scale, radius_scale, stroke_weight, surface_token_refs (fill/stroke/focus/overlay), elevation_level, state_overrides for hover/pressed/focus/selected/disabled.
- No content fields; no PII.

STATUS: DONE

### ATOM: layout_group_container
dimension: data_schema

Target folder:
- aitom_family/layout_group_container/data_schema/

Required files:
- aitom_family/layout_group_container/data_schema/schema.md – container-level fields.
- aitom_family/layout_group_container/data_schema/mapping_notes.md – how children align.

Implementation notes:
- Fields: id, grid_span_mobile/tablet/desktop, full_bleed (bool), padding (top/bottom/left/right), gap, background_token_ref, stroke_token_ref, alignment, max_width_override, density (compact/comfortable), tracking_id/view_id.
- Children are referenced externally; include optional background_media_ref if supported. No PII.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: data_schema

Target folder:
- aitom_family/layout_columns_grid/data_schema/

Required files:
- aitom_family/layout_columns_grid/data_schema/schema.md – grid config fields.
- aitom_family/layout_columns_grid/data_schema/child_map.md – mapping of child spans/offsets.

Implementation notes:
- Fields: id, column_count per breakpoint, column_dividers_enabled, gutter_override, row_gap, equal_height (bool), alignment (top/center/stretch), children: [{id, span_mobile/tablet/desktop, offset_* optional}].
- Optional flags: wrap_on_mobile, divider_style. No content/PII stored.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: data_schema

Target folder:
- aitom_family/layout_spacer_block/data_schema/

Required files:
- aitom_family/layout_spacer_block/data_schema/schema.md – spacer size fields.

Implementation notes:
- Fields: id, size_token (xs–xl), breakpoint_overrides, density_modifier, tracking_id (optional). No PII.

STATUS: DONE

### ATOM: layout_divider_block
dimension: data_schema

Target folder:
- aitom_family/layout_divider_block/data_schema/

Required files:
- aitom_family/layout_divider_block/data_schema/schema.md – divider fields.
- aitom_family/layout_divider_block/data_schema/label.md – optional label fields.

Implementation notes:
- Fields: id, style (solid/dashed/dotted), stroke_weight_token, inset_token (per breakpoint), spacing_above/below tokens, divider_length (full/inset), optional label {text_ref, typography_token_ref}. No PII.

STATUS: DONE

### ATOM: heading_block
dimension: data_schema

Target folder:
- aitom_family/heading_block/data_schema/

Required files:
- aitom_family/heading_block/data_schema/schema.md – heading fields.

Implementation notes:
- Fields: id, text_ref, level (h1–h6), alignment, max_width, underline_enabled, link {href, target, rel}, tracking_id/view_id, aria_level override optional. No PII/content stored beyond text_ref.

STATUS: DONE

### ATOM: rich_text_block
dimension: data_schema

Target folder:
- aitom_family/rich_text_block/data_schema/

Required files:
- aitom_family/rich_text_block/data_schema/schema.md – rich text fields.

Implementation notes:
- Fields: id, content_ref (structured rich text), max_width, alignment, paragraph_spacing_token, link_behaviour (target/rel), tracking_id/view_id. No raw PII.

STATUS: DONE

### ATOM: button_single
dimension: data_schema

Target folder:
- aitom_family/button_single/data_schema/

Required files:
- aitom_family/button_single/data_schema/schema.md – button fields.

Implementation notes:
- Fields: id, label_ref, href/action, variant (solid/outline), icon_left/icon_right ids, full_width_mobile (bool), disabled (bool), loading (bool), tracking_id/view_id, context tokens. No PII.

STATUS: DONE

### ATOM: button_group
dimension: data_schema

Target folder:
- aitom_family/button_group/data_schema/

Required files:
- aitom_family/button_group/data_schema/schema.md – group fields.

Implementation notes:
- Fields: id, orientation per breakpoint, alignment, buttons: [button_single-like objects with ids/labels/hrefs/variants/icons], gap_token, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: image_media_block
dimension: data_schema

Target folder:
- aitom_family/image_media_block/data_schema/

Required files:
- aitom_family/image_media_block/data_schema/schema.md – image fields.
- aitom_family/image_media_block/data_schema/tracking.md – tracking payload guidance.

Implementation notes:
- Fields: id, media_id/src_ref, alt, aspect_ratio_token, radius_token, stroke_token, padding_token, link {href,target,rel}, overlay_enabled, caption_ref, tracking_id/view_id. Avoid storing URLs in tracking.

STATUS: DONE

### ATOM: video_media_block
dimension: data_schema

Target folder:
- aitom_family/video_media_block/data_schema/

Required files:
- aitom_family/video_media_block/data_schema/schema.md – video fields.
- aitom_family/video_media_block/data_schema/tracking.md – tracking payload guidance.

Implementation notes:
- Fields: id, video_source (url/id/provider), poster_ref, aspect_ratio_token, radius_token, controls_enabled, autoplay, loop, mute, nocookie (privacy) toggle, caption_ref, tracking_id/view_id. No PII; avoid logging URLs in analytics.

STATUS: DONE

### ATOM: accordion_item
dimension: data_schema

Target folder:
- aitom_family/accordion_item/data_schema/

Required files:
- aitom_family/accordion_item/data_schema/schema.md – accordion fields.

Implementation notes:
- Fields: id, title_ref, body_ref, start_open (bool), mode (single/multi), icon_id token ref, tracking_id/view_id. No PII; content refs only.

STATUS: DONE

### ATOM: section_hero_banner
dimension: data_schema

Target folder:
- aitom_family/section_hero_banner/data_schema/

Required files:
- aitom_family/section_hero_banner/data_schema/schema.md – section fields.

Implementation notes:
- Fields: id, media {type:image|video, src_ref/media_id, poster_ref, autoplay/mute/loop flags}, overlay_token_ref, heading_ref, body_ref, ctas [{id,label_ref,href,variant,icon_ref}], alignment, padding tokens, max_width, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: section_rich_text
dimension: data_schema

Target folder:
- aitom_family/section_rich_text/data_schema/

Required files:
- aitom_family/section_rich_text/data_schema/schema.md – section fields.

Implementation notes:
- Fields: id, heading_ref, body_ref (rich text), cta {id,label_ref,href,variant}, alignment, max_width, padding tokens, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: data_schema

Target folder:
- aitom_family/section_multicolumn_features/data_schema/

Required files:
- aitom_family/section_multicolumn_features/data_schema/schema.md – section and feature items.

Implementation notes:
- Fields: id, heading_ref, body_ref, features: [{id, media_ref (icon/image), title_ref, body_ref, cta {id,label_ref,href,variant,icon_ref}, clickable (bool)}], column_count per breakpoint, card_surface_variant, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: data_schema

Target folder:
- aitom_family/section_featured_collection_grid/data_schema/

Required files:
- aitom_family/section_featured_collection_grid/data_schema/schema.md – section and collection references.
- aitom_family/section_featured_collection_grid/data_schema/states.md – loading/empty representation fields.

Implementation notes:
- Fields: id, collection_id/ref, item_limit, heading_ref, body_ref, view_all_cta {id,label_ref,href}, card_variant, columns per breakpoint, tracking_id/view_id, loading_placeholder token ref, empty_state {title_ref, body_ref, cta?}. No PII/prices in schema; product content handled upstream.

STATUS: DONE

### ATOM: section_collection_list
dimension: data_schema

Target folder:
- aitom_family/section_collection_list/data_schema/

Required files:
- aitom_family/section_collection_list/data_schema/schema.md – section and collection items.
- aitom_family/section_collection_list/data_schema/states.md – loading/empty fields.

Implementation notes:
- Fields: id, collections: [{collection_id/ref, title_ref, description_ref, image_ref}], heading_ref, body_ref, view_all_cta {id,label_ref,href}, layout_mode (grid/list), columns per breakpoint, card_variant, tracking_id/view_id, loading/empty placeholders. No PII.

STATUS: DONE

### ATOM: section_media_collage
dimension: data_schema

Target folder:
- aitom_family/section_media_collage/data_schema/

Required files:
- aitom_family/section_media_collage/data_schema/schema.md – collage pattern and tile data.

Implementation notes:
- Fields: id, pattern_id, tiles: [{id, media {type:image|video, src_ref/media_id, poster_ref}, alt_text_ref, caption_ref, clickable (bool), link {href,target,rel}, overlay_token_ref, aspect_ratio_token}], gaps/padding tokens, tracking_id/view_id. No PII; media refs only.

STATUS: DONE

### ATOM: section_image_with_text
dimension: data_schema

Target folder:
- aitom_family/section_image_with_text/data_schema/

Required files:
- aitom_family/section_image_with_text/data_schema/schema.md – media/text fields.

Implementation notes:
- Fields: id, media {src_ref/media_id, alt_text_ref, link {href,target,rel}, aspect_ratio_token, radius_token, overlay_token}, heading_ref, body_ref, cta {id,label_ref,href,variant,icon_ref}, swap_sides (bool), padding tokens, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: section_slideshow
dimension: data_schema

Target folder:
- aitom_family/section_slideshow/data_schema/

Required files:
- aitom_family/section_slideshow/data_schema/schema.md – slide definitions.
- aitom_family/section_slideshow/data_schema/settings.md – autoplay/controls settings.

Implementation notes:
- Fields: id, slides: [{slide_id, media {type:image|video, src_ref/media_id, poster_ref}, overlay_token_ref, heading_ref, body_ref, ctas [{id,label_ref,href,variant,icon_ref}]}], autoplay (bool), interval_ms, transition_type, transition_duration, controls_enabled, loop (bool), tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: section_blog_posts
dimension: data_schema

Target folder:
- aitom_family/section_blog_posts/data_schema/

Required files:
- aitom_family/section_blog_posts/data_schema/schema.md – blog/feed references and post cards.
- aitom_family/section_blog_posts/data_schema/states.md – loading/empty placeholders.

Implementation notes:
- Fields: id, blog_id/ref, item_limit, heading_ref, body_ref, view_all_cta {id,label_ref,href}, card_variant, columns per breakpoint, tracking_id/view_id, loading/empty placeholders. Posts themselves provided upstream; no titles/content stored here.

STATUS: DONE

### ATOM: section_email_signup
dimension: data_schema

Target folder:
- aitom_family/section_email_signup/data_schema/

Required files:
- aitom_family/section_email_signup/data_schema/schema.md – form fields/settings.

Implementation notes:
- Fields: id, heading_ref, body_ref, input {name (email), placeholder_ref}, helper_ref, success_ref, error_ref, cta {id,label_ref,href/action}, alignment, max_width, spacing tokens, tracking_id/view_id. No email values stored; PII must not be logged.

STATUS: DONE

### ATOM: section_custom_markup
dimension: data_schema

Target folder:
- aitom_family/section_custom_markup/data_schema/

Required files:
- aitom_family/section_custom_markup/data_schema/schema.md – markup payload references and safety flags.

Implementation notes:
- Fields: id, markup_ref (sanitized content), allowlists/denylists if applicable, padding tokens, full_bleed (bool), inherit_typography/colours flags, tracking_id/view_id. No raw unsanitized HTML stored here if possible; note that sanitization is upstream.

STATUS: DONE

### ATOM: product_media_gallery
dimension: data_schema

Target folder:
- aitom_family/product_media_gallery/data_schema/

Required files:
- aitom_family/product_media_gallery/data_schema/schema.md – gallery fields.
- aitom_family/product_media_gallery/data_schema/states.md – optional loading/empty fields.

Implementation notes:
- Fields: id, media_items [{media_id/src_ref, type:image|video, alt_text_ref/poster_ref, is_default}], thumbs_order, layout_mode (vertical/horizontal thumbs), aspect_ratio_token, zoom_enabled, lightbox_enabled, tracking_id/view_id. No URLs; refs only.

STATUS: DONE

### ATOM: product_info_stack
dimension: data_schema

Target folder:
- aitom_family/product_info_stack/data_schema/

Required files:
- aitom_family/product_info_stack/data_schema/schema.md – composition config.

Implementation notes:
- Fields: id, children_order (list of child atom refs), visibility flags for sub-blocks (title/price/variant_picker/buttons/description/collapsibles), spacing tokens, sticky_enabled (bool), tracking_id/view_id. No product content here.

STATUS: DONE

### ATOM: product_title_block
dimension: data_schema

Target folder:
- aitom_family/product_title_block/data_schema/

Required files:
- aitom_family/product_title_block/data_schema/schema.md – title fields.

Implementation notes:
- Fields: id, title_ref, subtitle_ref, alignment, max_width, link {href,target,rel, enabled}, tracking_id/view_id. No raw title in analytics.

STATUS: DONE

### ATOM: product_price_block
dimension: data_schema

Target folder:
- aitom_family/product_price_block/data_schema/

Required files:
- aitom_family/product_price_block/data_schema/schema.md – price fields.

Implementation notes:
- Fields: id, price_display (formatted string or parts), compare_at_display, currency_code, on_sale (bool), sold_out (bool), badges [{id, label_ref, variant}], alignment, tracking_id/view_id. No prices in analytics; formatted values for display only.

STATUS: DONE

### ATOM: product_variant_picker
dimension: data_schema

Target folder:
- aitom_family/product_variant_picker/data_schema/

Required files:
- aitom_family/product_variant_picker/data_schema/schema.md – variant options.
- aitom_family/product_variant_picker/data_schema/states.md – availability/error fields.

Implementation notes:
- Fields: id, options: [{option_id, name_ref, type (dropdown|buttons|swatches), values: [{value_id, label_ref, swatch_ref?, available (bool)}]}], selected_variant_id?, error_message_ref optional, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: data_schema

Target folder:
- aitom_family/product_buy_buttons_block/data_schema/

Required files:
- aitom_family/product_buy_buttons_block/data_schema/schema.md – button config.

Implementation notes:
- Fields: id, add_to_cart {label_ref, disabled, loading}, buy_now {label_ref, disabled, loading}, alignment, gap_token, full_width_mobile (bool), sticky_enabled (bool), sticky_offset_token, tracking_id/view_id. No prices or PII.

STATUS: DONE

### ATOM: product_description_block
dimension: data_schema

Target folder:
- aitom_family/product_description_block/data_schema/

Required files:
- aitom_family/product_description_block/data_schema/schema.md – description fields.
- aitom_family/product_description_block/data_schema/truncation.md – truncation settings.

Implementation notes:
- Fields: id, content_ref (rich text), max_width, truncation_enabled (bool), truncate_lines, read_more_label_ref, tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: data_schema

Target folder:
- aitom_family/product_collapsible_section/data_schema/

Required files:
- aitom_family/product_collapsible_section/data_schema/schema.md – accordion items.

Implementation notes:
- Fields: id, items: [{item_id, title_ref, body_ref}], start_open_ids?, mode (single/multi), tracking_id/view_id. No PII.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: data_schema

Target folder:
- aitom_family/product_recommendations_section/data_schema/

Required files:
- aitom_family/product_recommendations_section/data_schema/schema.md – recommendations config.
- aitom_family/product_recommendations_section/data_schema/states.md – loading/empty placeholders.

Implementation notes:
- Fields: id, source (algorithm/manual), product_ids/ref list, item_limit, heading_ref, body_ref, card_variant, columns per breakpoint, tracking_id/view_id, loading/empty placeholders. No product names/prices in schema; references only.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: data_schema

Target folder:
- aitom_family/wireframe_canvas/data_schema/

Required files:
- aitom_family/wireframe_canvas/data_schema/models.md – shape of Canvas, Element, and Presence objects.
- aitom_family/wireframe_canvas/data_schema/validation.md – rules for coordinates (integers vs floats), bounds checks.

Implementation notes:
- Schema must support arbitrary "props" bag for elements to allow extensibility.
- Coordinates should probably be integers (snapped) but wire protocol might allow floats.
- Presence: { userId, cursorX, cursorY, selection: [elementIds] }.

STATUS: ACTIVE

### ATOM: blackboard
dimension: data_schema

Target folder:
- aitom_family/blackboard/data_schema/

Required files:
- aitom_family/blackboard/data_schema/state.md – tracks global pan/zoom offsets or background config.

Implementation notes:
- May store { x, y, scale } if persisted.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: data_schema

Target folder:
- aitom_family/theme_layout_settings/data_schema/

Required files:
- aitom_family/theme_layout_settings/data_schema/config.md – schema for layout override object (density, max_width).

Implementation notes:
- Defines the shape of the layout configuration passed to the theme.
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: data_schema

Target folder:
- aitom_family/theme_colour_schemes/data_schema/

Required files:
- aitom_family/theme_colour_schemes/data_schema/theme_def.md – JSON schema for a colour theme.

Implementation notes:
- Defines { id, name, colors: { surface_... } }.
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: data_schema

Target folder:
- aitom_family/theme_typography_settings/data_schema/

Required files:
- aitom_family/theme_typography_settings/data_schema/type_def.md – JSON schema for typography config.

Implementation notes:
- Defines { id, base_size, scale_ratio, fonts: { ... } }.
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: data_schema

Target folder:
- aitom_family/theme_card_surface/data_schema/

Required files:
- None. (Visual only).

Implementation notes:
- N/A
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: accordion_item
dimension: data_schema

Target folder:
- aitom_family/accordion_item/data_schema/

Required files:
- aitom_family/accordion_item/data_schema/props.md – { title, content, children, isOpen, onToggle }.

Implementation notes:
- Status: ACTIVE

### ATOM: button_group
dimension: data_schema

Target folder:
- aitom_family/button_group/data_schema/

Required files:
- aitom_family/button_group/data_schema/props.md – { children, orientation, gap, alignment }.

Implementation notes:
- Status: ACTIVE

### ATOM: button_single
dimension: data_schema

Target folder:
- aitom_family/button_single/data_schema/

Required files:
- aitom_family/button_single/data_schema/props.md – { label, icon_left, icon_right, variant, size, onClick, loading, disabled, href }.

Implementation notes:
- Status: ACTIVE

### ATOM: heading_block
dimension: data_schema

Target folder:
- aitom_family/heading_block/data_schema/

Required files:
- aitom_family/heading_block/data_schema/props.md – { content, level, alignment, link_url }.

Implementation notes:
- Status: ACTIVE

### ATOM: rich_text_block
dimension: data_schema

Target folder:
- aitom_family/rich_text_block/data_schema/

Required files:
- aitom_family/rich_text_block/data_schema/props.md – { html_content, markdown_content }.

Implementation notes:
- Status: ACTIVE

### ATOM: image_media_block
dimension: data_schema

Target folder:
- aitom_family/image_media_block/data_schema/

Required files:
- aitom_family/image_media_block/data_schema/props.md – { src, alt, width, height, aspect_ratio, caption, link_url }.

Implementation notes:
- Status: ACTIVE

### ATOM: video_media_block
dimension: data_schema

Target folder:
- aitom_family/video_media_block/data_schema/

Required files:
- aitom_family/video_media_block/data_schema/props.md – { src, poster, autoplay, loop, mute, controls }.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: data_schema

Target folder:
- aitom_family/layout_columns_grid/data_schema/

Required files:
- aitom_family/layout_columns_grid/data_schema/props.md – { columns_mobile, columns_tablet, columns_desktop, gap }.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: data_schema

Target folder:
- aitom_family/layout_divider_block/data_schema/

Required files:
- aitom_family/layout_divider_block/data_schema/props.md – { label, alignment, style (solid/dotted) }.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_group_container
dimension: data_schema

Target folder:
- aitom_family/layout_group_container/data_schema/

Required files:
- aitom_family/layout_group_container/data_schema/props.md – { padding, background_variant, id_ref }.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: data_schema

Target folder:
- aitom_family/layout_spacer_block/data_schema/

Required files:
- aitom_family/layout_spacer_block/data_schema/props.md – { size }.

Implementation notes:
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: data_schema

Target folder:
- aitom_family/floating_pill_toolbar/data_schema/

Required files:
- aitom_family/floating_pill_toolbar/data_schema/config.md – { tools: [{ icon, action, label }] }.

Implementation notes:
- Status: ACTIVE

### ATOM: maybes_note
dimension: data_schema

Target folder:
- aitom_family/maybes_note/data_schema/

Required files:
- aitom_family/maybes_note/data_schema/model.md – { note_id, content, color, x, y, pinned, archived }.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: chat_card_v1
dimension: data_schema

Target folder:
- aitom_family/chat_card_v1/data_schema/

Required files:
- aitom_family/chat_card_v1/data_schema/props.md – { title, agent_id, context_id }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: data_schema

Target folder:
- aitom_family/chat_rail_shell/data_schema/

Required files:
- aitom_family/chat_rail_shell/data_schema/props.md – { width, collapsed, onResize }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: data_schema

Target folder:
- aitom_family/chat_rail_header_bar/data_schema/

Required files:
- aitom_family/chat_rail_header_bar/data_schema/props.md – { title, actions }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: data_schema

Target folder:
- aitom_family/chat_message_list/data_schema/

Required files:
- aitom_family/chat_message_list/data_schema/props.md – { messages[], loading }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: data_schema

Target folder:
- aitom_family/chat_message_block/data_schema/

Required files:
- aitom_family/chat_message_block/data_schema/props.md – { message_id, role, content, timestamp }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: data_schema

Target folder:
- aitom_family/chat_message_action_bar/data_schema/

Required files:
- aitom_family/chat_message_action_bar/data_schema/props.md – { message_id, actions[] }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: data_schema

Target folder:
- aitom_family/chat_safety_controls_bar/data_schema/

Required files:
- aitom_family/chat_safety_controls_bar/data_schema/props.md – { status, message }.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: data_schema

Target folder:
- aitom_family/bottom_chat_input_bar/data_schema/

Required files:
- aitom_family/bottom_chat_input_bar/data_schema/props.md – { value, onChange, onSend, disabled }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: data_schema

Target folder:
- aitom_family/chat_shortcuts_popover/data_schema/

Required files:
- aitom_family/chat_shortcuts_popover/data_schema/props.md – { filter_text, onSelect }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: data_schema

Target folder:
- aitom_family/chat_upload_source_picker/data_schema/

Required files:
- aitom_family/chat_upload_source_picker/data_schema/props.md – { onSourceSelect }.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: data_schema

Target folder:
- aitom_family/chat_icon_band_popover/data_schema/

Required files:
- aitom_family/chat_icon_band_popover/data_schema/props.md – { icons[], onSelect }.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: data_schema

Target folder:
- aitom_family/surface_header_nano/data_schema/

Required files:
- aitom_family/surface_header_nano/data_schema/props.md – { title, onBack }.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: data_schema

Target folder:
- aitom_family/surface_header_shell_micro/data_schema/

Required files:
- aitom_family/surface_header_shell_micro/data_schema/props.md – { app_name, logo }.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: data_schema

Target folder:
- aitom_family/surface_header_shell_standard/data_schema/

Required files:
- aitom_family/surface_header_shell_standard/data_schema/props.md – { navigation[], actions[] }.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: data_schema

Target folder:
- aitom_family/surface_logo_centerpiece/data_schema/

Required files:
- aitom_family/surface_logo_centerpiece/data_schema/props.md – { variant, href }.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: data_schema

Target folder:
- aitom_family/app_header_appname_dropdown/data_schema/

Required files:
- aitom_family/app_header_appname_dropdown/data_schema/props.md – { current_app, apps[], onSelect }.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: data_schema

Target folder:
- aitom_family/macro_temp_indicator/data_schema/

Required files:
- aitom_family/macro_temp_indicator/data_schema/props.md – { value, min, max, label }.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: data_schema

Target folder:
- aitom_family/main_menu_icon_button/data_schema/

Required files:
- aitom_family/main_menu_icon_button/data_schema/props.md – { onClick, isOpen }.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: product_buy_buttons_block
dimension: data_schema

Target folder:
- aitom_family/product_buy_buttons_block/data_schema/

Required files:
- aitom_family/product_buy_buttons_block/data_schema/props.md – { product_id, variant_id, available }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: data_schema

Target folder:
- aitom_family/product_collapsible_section/data_schema/

Required files:
- aitom_family/product_collapsible_section/data_schema/props.md – { title, content, initially_open }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: data_schema

Target folder:
- aitom_family/product_description_block/data_schema/

Required files:
- aitom_family/product_description_block/data_schema/props.md – { html_content, truncate_lines }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: data_schema

Target folder:
- aitom_family/product_info_stack/data_schema/

Required files:
- aitom_family/product_info_stack/data_schema/props.md – { blocks[] }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: data_schema

Target folder:
- aitom_family/product_media_gallery/data_schema/

Required files:
- aitom_family/product_media_gallery/data_schema/props.md – { media[], active_media_id }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: data_schema

Target folder:
- aitom_family/product_price_block/data_schema/

Required files:
- aitom_family/product_price_block/data_schema/props.md – { price, compare_at_price, currency }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: data_schema

Target folder:
- aitom_family/product_recommendations_section/data_schema/

Required files:
- aitom_family/product_recommendations_section/data_schema/props.md – { product_id, limit, strategy }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: data_schema

Target folder:
- aitom_family/product_title_block/data_schema/

Required files:
- aitom_family/product_title_block/data_schema/props.md – { title, vendor, sku }.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: data_schema

Target folder:
- aitom_family/product_variant_picker/data_schema/

Required files:
- aitom_family/product_variant_picker/data_schema/props.md – { options[], selected_options, onSelect }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: data_schema

Target folder:
- aitom_family/section_blog_posts/data_schema/

Required files:
- aitom_family/section_blog_posts/data_schema/props.md – { blog_handle, limit, show_date, show_author }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: data_schema

Target folder:
- aitom_family/section_collection_list/data_schema/

Required files:
- aitom_family/section_collection_list/data_schema/props.md – { collections[], title }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: data_schema

Target folder:
- aitom_family/section_custom_markup/data_schema/

Required files:
- aitom_family/section_custom_markup/data_schema/props.md – { html, scripts_allowed }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: data_schema

Target folder:
- aitom_family/section_email_signup/data_schema/

Required files:
- aitom_family/section_email_signup/data_schema/props.md – { heading, subheading, button_label }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: data_schema

Target folder:
- aitom_family/section_featured_collection_grid/data_schema/

Required files:
- aitom_family/section_featured_collection_grid/data_schema/props.md – { collection_handle, rows, columns }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: data_schema

Target folder:
- aitom_family/section_hero_banner/data_schema/

Required files:
- aitom_family/section_hero_banner/data_schema/props.md – { image_desktop, image_mobile, heading, subtext, button_link }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: data_schema

Target folder:
- aitom_family/section_image_with_text/data_schema/

Required files:
- aitom_family/section_image_with_text/data_schema/props.md – { image, heading, text, button_label, layout (left/right) }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: data_schema

Target folder:
- aitom_family/section_media_collage/data_schema/

Required files:
- aitom_family/section_media_collage/data_schema/props.md – { blocks[] }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: data_schema

Target folder:
- aitom_family/section_multicolumn_features/data_schema/

Required files:
- aitom_family/section_multicolumn_features/data_schema/props.md – { columns[], heading }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: data_schema

Target folder:
- aitom_family/section_rich_text/data_schema/

Required files:
- aitom_family/section_rich_text/data_schema/props.md – { heading, text, alignment }.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: data_schema

Target folder:
- aitom_family/section_slideshow/data_schema/

Required files:
- aitom_family/section_slideshow/data_schema/props.md – { slides[], autoplay_speed }.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: data_schema

Target folder:
- aitom_family/lanes_calendar_grid_v1/data_schema/

Required files:
- aitom_family/lanes_calendar_grid_v1/data_schema/props.md – { start_date, events[] }.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: data_schema

Target folder:
- aitom_family/multi_feed_tile/data_schema/

Required files:
- aitom_family/multi_feed_tile/data_schema/props.md – { title, metrics[], status }.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
