### ATOM: multi_feed_tile
Dimension: tracking
Target folder:
- aitom_family/multi_feed_tile/tracking/

Tasks:
- Define tracking events for tile interactions: `tile_click`, `cta_click`, and optional drag events; payload includes tile_id, tracking_key, mode, and CTA identifier when present.
- Specify payload constraints to exclude PII and full URLs; use IDs and counts only.
- Document event triggers per mode and ensure CTA clicks do not duplicate main tile click events.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: tracking

Target folder:
- aitom_family/floating_pill_toolbar/tracking/

Required files:
- aitom_family/floating_pill_toolbar/tracking/events.md – event names and payload fields.
- aitom_family/floating_pill_toolbar/tracking/spec_examples.md – sample payloads.
- aitom_family/floating_pill_toolbar/tracking/guardrails.md – consent and PII rules.

Implementation notes:
- Events: `toolbar_toggle`, `toolbar_drag_end` (with position/grid), `toolbar_gather_start`, `toolbar_gather_complete`, optional `toolbar_collision_avoidance`.
- Payload fields: toolbar_id/instance_id, expanded boolean, grid coords, expansion_direction, gather_anchor_id, tracking_id/view_id, context (UTMs/ref/click_id), consent flag. No tool names or message content.
- Rate-limit drag events to drop-only; avoid streaming positions; respect consent for non-essential diagnostics logging.

STATUS: DONE

### ATOM: maybes_note
dimension: tracking

Target folder:
- aitom_family/maybes_note/tracking/

Required files:
- aitom_family/maybes_note/tracking/events.md – maybes_created/updated/archived events and canvas layout save.
- aitom_family/maybes_note/tracking/spec_examples.md – sample payloads.
- aitom_family/maybes_note/tracking/guardrails.md – no PII/message text, asset_type enforcement.

Implementation notes:
- Events: maybes_created, maybes_updated, maybes_archived, maybes_canvas_layout_saved (bulk).
- Payload: maybes_id, asset_type="maybes_note", tenant_id, user_id, episode_id?, tracking_key, context (UTMs), origin_ref ids (surface/app/thread_id/message_id) if provided; no title/body text.
- Archive uses DELETE; bulk layout save includes array of {maybes_id, x, y, scale}; consent respected for non-essential analytics.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: tracking

Target folder:
- aitom_family/chat_rail_header_bar/tracking/

Required files:
- aitom_family/chat_rail_header_bar/tracking/events.md
- aitom_family/chat_rail_header_bar/tracking/spec_examples.md
- aitom_family/chat_rail_header_bar/tracking/guardrails.md

Implementation notes:
- Events: click_chat_minimize, click_chat_expand, click_chat_tools, click_chat_settings.
- Payload: chat_id, view_id, tenant_id, current_state, active_band, tracking_key, context (UTMs), consent flag. No labels or message content.

STATUS: DONE

### ATOM: chat_message_list
dimension: tracking

Target folder:
- aitom_family/chat_message_list/tracking/

Required files:
- aitom_family/chat_message_list/tracking/events.md – chat_scroll event definition.
- aitom_family/chat_message_list/tracking/guardrails.md – disallow message bodies.

Implementation notes:
- Event: chat_scroll (throttled) with chat_id, last_visible_message_id, scroll_position bucket, view_id, tracking_key, context; no message text.
- Optional load_more triggers handled upstream.

STATUS: DONE

### ATOM: chat_message_block
dimension: tracking

Target folder:
- aitom_family/chat_message_block/tracking/

Required files:
- aitom_family/chat_message_block/tracking/events.md – message_view event.
- aitom_family/chat_message_block/tracking/guardrails.md – PII/message body exclusions.

Implementation notes:
- Event: chat_message_view with message_id, chat_id, view_id, tracking_key, context; never log body text.
- Highlight state not tracked unless proxied elsewhere.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: tracking

Target folder:
- aitom_family/chat_message_action_bar/tracking/

Required files:
- aitom_family/chat_message_action_bar/tracking/events.md
- aitom_family/chat_message_action_bar/tracking/spec_examples.md
- aitom_family/chat_message_action_bar/tracking/guardrails.md

Implementation notes:
- Events: chat_message_save, chat_message_set_alert, chat_message_safety_review, chat_message_delete, chat_message_create_todo.
- Payload: message_id, chat_id, tenant_id, view_id, tracking_key, control_id (for mapping), context; no message content.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: tracking

Target folder:
- aitom_family/chat_safety_controls_bar/tracking/

Required files:
- aitom_family/chat_safety_controls_bar/tracking/events.md – chat_safety_control_toggle.
- aitom_family/chat_safety_controls_bar/tracking/guardrails.md.

Implementation notes:
- Payload: chat_id, control_id, previous_state, new_state, view_id, tracking_key, context, consent flag; no message text.
- Throttle to toggles only.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: tracking

Target folder:
- aitom_family/bottom_chat_input_bar/tracking/

Required files:
- aitom_family/bottom_chat_input_bar/tracking/events.md – upload_open, shortcuts_open, send_attempt.
- aitom_family/bottom_chat_input_bar/tracking/spec_examples.md
- aitom_family/bottom_chat_input_bar/tracking/guardrails.md

Implementation notes:
- Payload fields: chat_id, view_id, tenant_id, input_length, success flag (for send), tracking_key, context; never log message text or filenames.
- Send attempts logged once per press; upload open from agent button; shortcuts open from arrow.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: tracking

Target folder:
- aitom_family/chat_shortcuts_popover/tracking/

Required files:
- aitom_family/chat_shortcuts_popover/tracking/events.md – chat_shortcut_token_insert.
- aitom_family/chat_shortcuts_popover/tracking/guardrails.md.

Implementation notes:
- Payload: chat_id, token_id, view_id, tracking_key, context; no input text.
- Event fires on insert only.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: tracking

Target folder:
- aitom_family/chat_upload_source_picker/tracking/

Required files:
- aitom_family/chat_upload_source_picker/tracking/events.md – upload_source_opened, upload_source_selected, future destination_selected.
- aitom_family/chat_upload_source_picker/tracking/guardrails.md.

Implementation notes:
- Payload: chat_id, source_id, destination_id (optional), view_id, tenant_id, tracking_key, context; never filenames or file contents.
- Treat upload as primary ingestion path; respect consent for non-essential analytics.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: tracking

Target folder:
- aitom_family/chat_icon_band_popover/tracking/

Required files:
- aitom_family/chat_icon_band_popover/tracking/events.md – chat_band_icon_click.
- aitom_family/chat_icon_band_popover/tracking/guardrails.md.

Implementation notes:
- Payload: chat_id, band_type, icon_id, view_id, tenant_id, tracking_key, context; no message content.
- Fire on activation only; do not stream hover.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: tracking

Target folder:
- aitom_family/chat_rail_shell/tracking/

Required files:
- aitom_family/chat_rail_shell/tracking/events.md – event definitions and payload fields.
- aitom_family/chat_rail_shell/tracking/spec_examples.md – sample payloads.
- aitom_family/chat_rail_shell/tracking/guardrails.md – consent and PII rules.

Implementation notes:
- Events: `chat_state_change`, `chat_open_from_nano_preview`, `chat_band_toggle`, optional `chat_dock_state_change`.
- Payload: chat_id, from_state/to_state, band_type, is_docked, position (grid/px), view_id, tenant_id, tracking_key, context (UTMs/ref/click_id), consent flag.
- No message bodies or text snippets; nano preview not logged; throttle to state changes only (no drag streams).

STATUS: DONE

### ATOM: section_media_collage
dimension: tracking

Target folder:
- aitom_family/section_media_collage/tracking/

Required files:
- aitom_family/section_media_collage/tracking/events.md
- aitom_family/section_media_collage/tracking/spec_examples.md
- aitom_family/section_media_collage/tracking/guardrails.md

Implementation notes:
- Events: collage_impression (optional), collage_tile_click, collage_tile_play (if video). Payload: section_id, tile_id, media_id, media_type, tracking_id/view_id, context (UTMs), consent flag. No media URLs/content.
- Avoid duplicate impressions; respect consent for video/autoplay tracking.

STATUS: DONE

### ATOM: section_image_with_text
dimension: tracking

Target folder:
- aitom_family/section_image_with_text/tracking/

Required files:
- aitom_family/section_image_with_text/tracking/events.md
- aitom_family/section_image_with_text/tracking/spec_examples.md
- aitom_family/section_image_with_text/tracking/guardrails.md

Implementation notes:
- Events: section_impression (optional), media_click (if linked), cta_click. Payload: section_id, media_id (if applicable), cta_id, swap_sides flag, tracking_id/view_id, context (UTMs), consent flag. No text content; avoid logging URLs (use ids/refs).
- Debounce impressions; gate non-essential events on consent.

STATUS: DONE

### ATOM: section_slideshow
dimension: tracking

Target folder:
- aitom_family/section_slideshow/tracking/

Required files:
- aitom_family/section_slideshow/tracking/events.md
- aitom_family/section_slideshow/tracking/spec_examples.md
- aitom_family/section_slideshow/tracking/guardrails.md

Implementation notes:
- Events: slideshow_impression, slide_change (from/to ids), slide_cta_click, autoplay_started/stopped. Payload: slideshow_id, slide_id(s), autoplay (bool), tracking_id/view_id, context (UTMs), consent flag. No slide content.
- Throttle slide_change events to real transitions; respect consent and reduced motion for autoplay logging.

STATUS: DONE

### ATOM: section_blog_posts
dimension: tracking

Target folder:
- aitom_family/section_blog_posts/tracking/

Required files:
- aitom_family/section_blog_posts/tracking/events.md
- aitom_family/section_blog_posts/tracking/spec_examples.md
- aitom_family/section_blog_posts/tracking/guardrails.md

Implementation notes:
- Events: blog_section_impression, blog_post_card_click, view_all_click, loading_state_shown (optional). Payload: section_id, blog_id, post_id (for card), tracking_id/view_id, context (UTMs), consent flag. No titles/content.
- Debounce impressions; avoid duplicate fires on scroll.

STATUS: DONE

### ATOM: section_email_signup
dimension: tracking

Target folder:
- aitom_family/section_email_signup/tracking/

Required files:
- aitom_family/section_email_signup/tracking/events.md
- aitom_family/section_email_signup/tracking/spec_examples.md
- aitom_family/section_email_signup/tracking/guardrails.md

Implementation notes:
- Events: form_impression (optional), form_submit, form_error, form_success. Payload: form_id, error_code (if any), tracking_id/view_id, context (UTMs), consent flag. Never include email or PII.
- Include anti-spam timing/debounce guidance; block double-submits in tracking.

STATUS: DONE

### ATOM: section_custom_markup
dimension: tracking

Target folder:
- aitom_family/section_custom_markup/tracking/

Required files:
- aitom_family/section_custom_markup/tracking/events.md
- aitom_family/section_custom_markup/tracking/guardrails.md

Implementation notes:
- Default: optional section_impression; otherwise [NO EVENTS]. Payload: section_id, tracking_id/view_id, context (UTMs), consent flag.
- Never log injected markup content; tracking stays structural only.

STATUS: DONE

### ATOM: product_media_gallery
dimension: tracking

Target folder:
- aitom_family/product_media_gallery/tracking/

Required files:
- aitom_family/product_media_gallery/tracking/events.md
- aitom_family/product_media_gallery/tracking/spec_examples.md
- aitom_family/product_media_gallery/tracking/guardrails.md

Implementation notes:
- Events: media_impression (optional), media_thumb_click, media_zoom_open, media_lightbox_open, media_play (for video). Payload: product_id, media_id, media_type, thumb_id, tracking_id/view_id, context (UTMs), consent flag. No URLs/content.
- Debounce impressions; respect consent for autoplay/video events.

STATUS: DONE

### ATOM: product_info_stack
dimension: tracking

Target folder:
- aitom_family/product_info_stack/tracking/

Required files:
- aitom_family/product_info_stack/tracking/events.md
- aitom_family/product_info_stack/tracking/guardrails.md

Implementation notes:
- Optional event: product_info_view. Payload: product_id, info_stack_id, tracking_id/view_id, context (UTMs), consent flag. No content; child atoms handle detailed tracking.

STATUS: DONE

### ATOM: product_title_block
dimension: tracking

Target folder:
- aitom_family/product_title_block/tracking/

Required files:
- aitom_family/product_title_block/tracking/events.md
- aitom_family/product_title_block/tracking/spec_examples.md
- aitom_family/product_title_block/tracking/guardrails.md

Implementation notes:
- Event: product_title_click (if link). Payload: product_id, title_id, tracking_id/view_id, context (UTMs), consent flag. Do not log title text.

STATUS: DONE

### ATOM: product_price_block
dimension: tracking

Target folder:
- aitom_family/product_price_block/tracking/

Required files:
- aitom_family/product_price_block/tracking/notes.md – typically [NO EVENTS]; optional price_view for QA.

Implementation notes:
- Default no tracking; if price_view needed, payload: product_id, tracking_id/view_id, context (UTMs); no price amounts.

STATUS: DONE

### ATOM: product_variant_picker
dimension: tracking

Target folder:
- aitom_family/product_variant_picker/tracking/

Required files:
- aitom_family/product_variant_picker/tracking/events.md
- aitom_family/product_variant_picker/tracking/spec_examples.md
- aitom_family/product_variant_picker/tracking/guardrails.md

Implementation notes:
- Event: variant_select. Payload: product_id, option_id, value_id, variant_id, is_available, tracking_id/view_id, context (UTMs), consent flag. No labels or user-entered data.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: tracking

Target folder:
- aitom_family/product_buy_buttons_block/tracking/

Required files:
- aitom_family/product_buy_buttons_block/tracking/events.md
- aitom_family/product_buy_buttons_block/tracking/spec_examples.md
- aitom_family/product_buy_buttons_block/tracking/guardrails.md

Implementation notes:
- Events: add_to_cart_click, buy_now_click. Payload: product_id, variant_id, button_id, tracking_id/view_id, context (UTMs), consent flag. Optional: availability state, loading state. No prices/PII.
- Debounce double clicks.

STATUS: DONE

### ATOM: product_description_block
dimension: tracking

Target folder:
- aitom_family/product_description_block/tracking/

Required files:
- aitom_family/product_description_block/tracking/notes.md – optional link click tracking.

Implementation notes:
- Default: no tracking. If link clicks tracked, payload: description_id, link_href (hashed/normalized), tracking_id/view_id, context (UTMs), consent flag. No text content.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: tracking

Target folder:
- aitom_family/product_collapsible_section/tracking/

Required files:
- aitom_family/product_collapsible_section/tracking/events.md
- aitom_family/product_collapsible_section/tracking/spec_examples.md
- aitom_family/product_collapsible_section/tracking/guardrails.md

Implementation notes:
- Event: product_collapsible_toggle. Payload: section_id, item_id, expanded (bool), tracking_id/view_id, context (UTMs), consent flag. No body content.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: tracking

Target folder:
- aitom_family/product_recommendations_section/tracking/

Required files:
- aitom_family/product_recommendations_section/tracking/events.md
- aitom_family/product_recommendations_section/tracking/spec_examples.md
- aitom_family/product_recommendations_section/tracking/guardrails.md

Implementation notes:
- Events: recommendation_impression, recommendation_click, view_all_click (if CTA). Payload: section_id, recommendation_id/product_id, source (algorithm/manual), tracking_id/view_id, context (UTMs), consent flag. No product names/prices.
- Debounce impressions; respect consent gating.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: tracking
Target folder:
- aitom_family/wireframe_canvas/tracking/

Tasks:
- Define events for element move, snap, resize, select/deselect, and canvas pan/zoom; payloads carry ids, positions, sizes, snap flag, and non-PII agent/human identifiers.
- Document SSE live update expectations and client acknowledgement/latency metrics without logging element content.
- Track control usage (snap toggle, reset) with boolean flags; avoid recording payloads beyond geometry IDs and counts.

STATUS: DONE

### ATOM: blackboard
Dimension: tracking
Target folder:
- aitom_family/blackboard/tracking/

Tasks:
- Define events for element move, snap, resize, select/deselect, and canvas pan/zoom; payloads carry ids, positions, sizes, grid snap flag, and user/agent identifiers (non-PII).
- Document SSE delivery expectations for live updates and client-side acknowledgement/latency metrics without logging content.
- Ensure CTA/control usage (snap toggle, reset) emit events with boolean flags only; avoid recording element payload contents beyond geometry ids.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: tracking

Target folder:
- aitom_family/theme_layout_settings/tracking/

Required files:
- aitom_family/theme_layout_settings/tracking/events.md – layout-related events.
- aitom_family/theme_layout_settings/tracking/spec_examples.md – sample payloads.
- aitom_family/theme_layout_settings/tracking/guardrails.md – consent/PII rules.

Implementation notes:
- Define events: layout_settings_applied, density_changed, full_bleed_toggled. Payload: layout_id, density, full_bleed, breakpoint, context (UTMs), tracking_id/view_id. No PII.
- Note consent gating for non-essential events; avoid logging exact pixel values beyond tokens if unnecessary.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: tracking

Target folder:
- aitom_family/theme_colour_schemes/tracking/

Required files:
- aitom_family/theme_colour_schemes/tracking/events.md
- aitom_family/theme_colour_schemes/tracking/spec_examples.md
- aitom_family/theme_colour_schemes/tracking/guardrails.md

Implementation notes:
- Events: colour_scheme_selected, colour_scheme_applied. Payload: scheme_id, previous_scheme_id, surface/context, tracking_id/view_id, consent flag, UTMs. No colour values or PII.
- Guard against emitting during initial hydration unless scheme changed.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: tracking

Target folder:
- aitom_family/theme_typography_settings/tracking/

Required files:
- aitom_family/theme_typography_settings/tracking/events.md
- aitom_family/theme_typography_settings/tracking/spec_examples.md
- aitom_family/theme_typography_settings/tracking/guardrails.md

Implementation notes:
- Events: typography_theme_selected, typography_preset_applied. Payload: typography_theme_id, preset_ids affected, breakpoint, density, tracking_id/view_id, UTMs, consent flag. No text content.
- Avoid firing on initial load unless user action changes theme.

STATUS: DONE

### ATOM: theme_card_surface
dimension: tracking

Target folder:
- aitom_family/theme_card_surface/tracking/

Required files:
- aitom_family/theme_card_surface/tracking/events.md
- aitom_family/theme_card_surface/tracking/spec_examples.md
- aitom_family/theme_card_surface/tracking/guardrails.md

Implementation notes:
- Events: card_surface_variant_selected, card_surface_state_previewed (for hover/focus demos). Payload: surface_id, variant, state, tracking_id/view_id, UTMs, consent flag.
- Do not log card content; focus on variant/state ids only.

STATUS: DONE

### ATOM: layout_group_container
dimension: tracking

Target folder:
- aitom_family/layout_group_container/tracking/

Required files:
- aitom_family/layout_group_container/tracking/events.md
- aitom_family/layout_group_container/tracking/spec_examples.md
- aitom_family/layout_group_container/tracking/guardrails.md

Implementation notes:
- Events: container_impression, container_variant_change (full_bleed/density), container_alignment_change. Payload: container_id, variant flags, breakpoint, tracking_id/view_id, context (UTMs), consent flag. No child content or PII.
- Guard against emitting on initial hydration unless user changes settings.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: tracking

Target folder:
- aitom_family/layout_columns_grid/tracking/

Required files:
- aitom_family/layout_columns_grid/tracking/events.md
- aitom_family/layout_columns_grid/tracking/spec_examples.md
- aitom_family/layout_columns_grid/tracking/guardrails.md

Implementation notes:
- Events: grid_impression, grid_layout_change (column_count/gutter/row_gap), grid_child_reordered (if enabled). Payload: grid_id, column_count, breakpoint, tracking_id/view_id, context (UTMs), consent flag. No child content.
- Avoid logging pixel values; use token names/ids.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: tracking

Target folder:
- aitom_family/layout_spacer_block/tracking/

Required files:
- aitom_family/layout_spacer_block/tracking/notes.md – note [NO EVENTS].

Implementation notes:
- Spacer does not emit analytics; document as [NO EVENTS] to prevent accidental hooks.

STATUS: DONE

### ATOM: layout_divider_block
dimension: tracking

Target folder:
- aitom_family/layout_divider_block/tracking/

Required files:
- aitom_family/layout_divider_block/tracking/notes.md – note [NO EVENTS] unless label interactions exist.

Implementation notes:
- Default: no tracking. If a labeled divider is interactive, optionally emit divider_label_clicked with divider_id, tracking_id/view_id, context (UTMs), consent flag; otherwise [NO EVENTS].

STATUS: DONE

### ATOM: heading_block
dimension: tracking

Target folder:
- aitom_family/heading_block/tracking/

Required files:
- aitom_family/heading_block/tracking/events.md
- aitom_family/heading_block/tracking/spec_examples.md
- aitom_family/heading_block/tracking/guardrails.md

Implementation notes:
- Events: heading_impression (optional), heading_click (when linked). Payload: heading_id, level, tracking_id/view_id, context (UTMs), consent flag. Do not log heading text.
- Avoid firing on load unless specifically requested for analytics; no PII.

STATUS: DONE

### ATOM: rich_text_block
dimension: tracking

Target folder:
- aitom_family/rich_text_block/tracking/

Required files:
- aitom_family/rich_text_block/tracking/events.md
- aitom_family/rich_text_block/tracking/spec_examples.md
- aitom_family/rich_text_block/tracking/guardrails.md

Implementation notes:
- Events: link_click within rich text. Payload: block_id, link_href (hashed/normalized), tracking_id/view_id, context (UTMs), consent flag. Do not send body text or full URL if disallowed; prefer route names.
- No impression events unless required; avoid PII.

STATUS: DONE

### ATOM: button_single
dimension: tracking

Target folder:
- aitom_family/button_single/tracking/

Required files:
- aitom_family/button_single/tracking/events.md
- aitom_family/button_single/tracking/spec_examples.md
- aitom_family/button_single/tracking/guardrails.md

Implementation notes:
- Event: button_click. Payload: button_id, variant, tracking_id/view_id, context (UTMs), consent flag. Optional: disabled/loading state at click time. No label text in payload.
- Include debounce guidance to prevent double submission.

STATUS: DONE

### ATOM: button_group
dimension: tracking

Target folder:
- aitom_family/button_group/tracking/

Required files:
- aitom_family/button_group/tracking/events.md
- aitom_family/button_group/tracking/spec_examples.md
- aitom_family/button_group/tracking/guardrails.md

Implementation notes:
- Events: button_click (per child) as in button_single; optionally button_group_impression. Payload includes group_id, button_id, variant, tracking_id/view_id, context (UTMs), consent flag. No labels.
- Note ordering/tab index should not affect payload content.

STATUS: DONE

### ATOM: image_media_block
dimension: tracking

Target folder:
- aitom_family/image_media_block/tracking/

Required files:
- aitom_family/image_media_block/tracking/events.md
- aitom_family/image_media_block/tracking/spec_examples.md
- aitom_family/image_media_block/tracking/guardrails.md

Implementation notes:
- Events: image_impression, image_click. Payload: image_id/media_id, link_target (hashed/normalized), tracking_id/view_id, context (UTMs), consent flag. Do not send URLs or alt text.
- Ensure impressions are gated to avoid duplicate fires.

STATUS: DONE

### ATOM: video_media_block
dimension: tracking

Target folder:
- aitom_family/video_media_block/tracking/

Required files:
- aitom_family/video_media_block/tracking/events.md
- aitom_family/video_media_block/tracking/spec_examples.md
- aitom_family/video_media_block/tracking/guardrails.md

Implementation notes:
- Events: video_impression, video_play, video_pause, video_complete, video_error. Payload: video_id/source, autoplay (bool), muted (bool), tracking_id/view_id, context (UTMs), consent flag. No full URLs or captions in payload.
- Respect consent before autoplay tracking; avoid spamming play/pause events (debounce).

STATUS: DONE

### ATOM: accordion_item
dimension: tracking

Target folder:
- aitom_family/accordion_item/tracking/

Required files:
- aitom_family/accordion_item/tracking/events.md
- aitom_family/accordion_item/tracking/spec_examples.md
- aitom_family/accordion_item/tracking/guardrails.md

Implementation notes:
- Event: accordion_toggle. Payload: item_id, expanded (bool), mode (single/multi), tracking_id/view_id, context (UTMs), consent flag. Do not include body text.
- Optionally log initial open state when rendered if required.

STATUS: DONE

### ATOM: section_hero_banner
dimension: tracking

Target folder:
- aitom_family/section_hero_banner/tracking/

Required files:
- aitom_family/section_hero_banner/tracking/events.md
- aitom_family/section_hero_banner/tracking/spec_examples.md
- aitom_family/section_hero_banner/tracking/guardrails.md

Implementation notes:
- Events: hero_impression (optional), hero_cta_click, hero_media_play (if video). Payload: hero_id, cta_id (for clicks), media_id (for play), autoplay/muted flags, tracking_id/view_id, context (UTMs), consent flag. No text content.
- Guard against duplicate impressions; respect consent for autoplay/video tracking.

STATUS: DONE

### ATOM: section_rich_text
dimension: tracking

Target folder:
- aitom_family/section_rich_text/tracking/

Required files:
- aitom_family/section_rich_text/tracking/events.md
- aitom_family/section_rich_text/tracking/spec_examples.md
- aitom_family/section_rich_text/tracking/guardrails.md

Implementation notes:
- Events: rich_text_section_impression (optional), rich_text_cta_click, rich_text_link_click. Payload: section_id, cta_id or link_href (hashed/normalized), tracking_id/view_id, context (UTMs), consent flag. No body text.
- Avoid logging full URLs; prefer route ids.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: tracking

Target folder:
- aitom_family/section_multicolumn_features/tracking/

Required files:
- aitom_family/section_multicolumn_features/tracking/events.md
- aitom_family/section_multicolumn_features/tracking/spec_examples.md
- aitom_family/section_multicolumn_features/tracking/guardrails.md

Implementation notes:
- Events: feature_impression (per column optional), feature_cta_click, feature_card_click (if whole card clickable). Payload: section_id, feature_id, cta_id (if CTA), clickable flag, tracking_id/view_id, context (UTMs), consent flag. No text content.
- Debounce impressions to avoid flooding.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: tracking

Target folder:
- aitom_family/section_featured_collection_grid/tracking/

Required files:
- aitom_family/section_featured_collection_grid/tracking/events.md
- aitom_family/section_featured_collection_grid/tracking/spec_examples.md
- aitom_family/section_featured_collection_grid/tracking/guardrails.md

Implementation notes:
- Events: collection_grid_impression, product_card_click, view_all_click, loading_state_shown (optional). Payload: section_id, collection_id, product_id (for card click), card_variant, item_limit, tracking_id/view_id, context (UTMs), consent flag. No product names/prices.
- Ensure no duplicate impressions on scroll; gate by consent.

STATUS: DONE

### ATOM: section_collection_list
dimension: tracking

Target folder:
- aitom_family/section_collection_list/tracking/

Required files:
- aitom_family/section_collection_list/tracking/events.md
- aitom_family/section_collection_list/tracking/spec_examples.md
- aitom_family/section_collection_list/tracking/guardrails.md

Implementation notes:
- Events: collection_list_impression, collection_card_click, view_all_collections_click, layout_mode_toggle (if grid/list). Payload: section_id, collection_id, layout_mode, tracking_id/view_id, context (UTMs), consent flag. No collection names.
- Debounce impressions; respect consent gating.

STATUS: ACTIVE

### ATOM: wireframe_canvas
dimension: tracking

Target folder:
- aitom_family/wireframe_canvas/tracking/

Required files:
- aitom_family/wireframe_canvas/tracking/events.md – interaction events (element_drag, transform, delete).
- aitom_family/wireframe_canvas/tracking/performance.md – metering render fps or lag events.

Implementation notes:
- High-frequency events (drag) should NOT be logged per-frame. Log "drag_start" and "drag_end" with delta.
- Log viewport_pan/zoom only on settle.
- No content logging (text inside elements).

STATUS: ACTIVE

### ATOM: blackboard
dimension: tracking

Target folder:
- aitom_family/blackboard/tracking/

Required files:
- aitom_family/blackboard/tracking/events.md – viewport_pan, viewport_zoom events (debounced).

Implementation notes:
- Log basic usage of the canvas area.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: tracking

Target folder:
- aitom_family/theme_layout_settings/tracking/

Required files:
- None.

Implementation notes:
- Layout changes (density toggle) might be logged but usually via a higher-level setting event.
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: tracking

Target folder:
- aitom_family/theme_colour_schemes/tracking/

Required files:
- aitom_family/theme_colour_schemes/tracking/events.md – theme_change events.

Implementation notes:
- Log which theme ID is active.
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: tracking

Target folder:
- aitom_family/theme_typography_settings/tracking/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: tracking

Target folder:
- aitom_family/theme_card_surface/tracking/

Required files:
- None.

Implementation notes:
- Interaction tracking (clicks) happens at the semantic level (product_card_click), not generic card surface.
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: accordion_item
dimension: tracking

Target folder:
- aitom_family/accordion_item/tracking/

Required files:
- aitom_family/accordion_item/tracking/events.md – accordion_toggle (item_id, expanded).

Implementation notes:
- No content logging.
- Status: ACTIVE

### ATOM: button_group
dimension: tracking

Target folder:
- aitom_family/button_group/tracking/

Required files:
- None. (Bubbles up to button_single).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: button_single
dimension: tracking

Target folder:
- aitom_family/button_single/tracking/

Required files:
- aitom_family/button_single/tracking/events.md – button_click (button_id, context).

Implementation notes:
- No label text logging.
- Status: ACTIVE

### ATOM: heading_block
dimension: tracking

Target folder:
- aitom_family/heading_block/tracking/

Required files:
- aitom_family/heading_block/tracking/events.md – heading_click (if linked) (heading_id).

Implementation notes:
- No heading text.
- Status: ACTIVE

### ATOM: rich_text_block
dimension: tracking

Target folder:
- aitom_family/rich_text_block/tracking/

Required files:
- aitom_family/rich_text_block/tracking/events.md – link_click (href_hash).

Implementation notes:
- Hash external URLs.
- Status: ACTIVE

### ATOM: image_media_block
dimension: tracking

Target folder:
- aitom_family/image_media_block/tracking/

Required files:
- aitom_family/image_media_block/tracking/events.md – media_click (media_id).

Implementation notes:
- Status: ACTIVE

### ATOM: video_media_block
dimension: tracking

Target folder:
- aitom_family/video_media_block/tracking/

Required files:
- aitom_family/video_media_block/tracking/events.md – video_play, video_pause, video_complete (video_id).

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: tracking

Target folder:
- aitom_family/layout_columns_grid/tracking/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: tracking

Target folder:
- aitom_family/layout_divider_block/tracking/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_group_container
dimension: tracking

Target folder:
- aitom_family/layout_group_container/tracking/

Required files:
- aitom_family/layout_group_container/tracking/events.md – container_impression (container_id).

Implementation notes:
- Optional impression tracking.
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: tracking

Target folder:
- aitom_family/layout_spacer_block/tracking/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: tracking

Target folder:
- aitom_family/floating_pill_toolbar/tracking/

Required files:
- aitom_family/floating_pill_toolbar/tracking/events.md – tool_click (tool_icon_ref), toolbar_drag.

Implementation notes:
- Status: ACTIVE

### ATOM: maybes_note
dimension: tracking

Target folder:
- aitom_family/maybes_note/tracking/

Required files:
- aitom_family/maybes_note/tracking/events.md – note_create, note_update, note_archive (note_id).

Implementation notes:
- No note content logging.
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: chat_card_v1
dimension: tracking

Target folder:
- aitom_family/chat_card_v1/tracking/

Required files:
- aitom_family/chat_card_v1/tracking/events.md – card_flip.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: tracking

Target folder:
- aitom_family/chat_rail_shell/tracking/

Required files:
- aitom_family/chat_rail_shell/tracking/events.md – rail_resize, rail_toggle.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: tracking

Target folder:
- aitom_family/chat_rail_header_bar/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: tracking

Target folder:
- aitom_family/chat_message_list/tracking/

Required files:
- aitom_family/chat_message_list/tracking/events.md – scroll_depth.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: tracking

Target folder:
- aitom_family/chat_message_block/tracking/

Required files:
- aitom_family/chat_message_block/tracking/events.md – message_view (impression).

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: tracking

Target folder:
- aitom_family/chat_message_action_bar/tracking/

Required files:
- aitom_family/chat_message_action_bar/tracking/events.md – action_click.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: tracking

Target folder:
- aitom_family/chat_safety_controls_bar/tracking/

Required files:
- aitom_family/chat_safety_controls_bar/tracking/events.md – safety_alert_click.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: tracking

Target folder:
- aitom_family/bottom_chat_input_bar/tracking/

Required files:
- aitom_family/bottom_chat_input_bar/tracking/events.md – input_focus, input_send.

Implementation notes:
- Do not log input content.
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: tracking

Target folder:
- aitom_family/chat_shortcuts_popover/tracking/

Required files:
- aitom_family/chat_shortcuts_popover/tracking/events.md – shortcut_use (command_id).

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: tracking

Target folder:
- aitom_family/chat_upload_source_picker/tracking/

Required files:
- aitom_family/chat_upload_source_picker/tracking/events.md – source_select (source_type).

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: tracking

Target folder:
- aitom_family/chat_icon_band_popover/tracking/

Required files:
- aitom_family/chat_icon_band_popover/tracking/events.md – icon_select (icon_id).

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: tracking

Target folder:
- aitom_family/surface_header_nano/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: tracking

Target folder:
- aitom_family/surface_header_shell_micro/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: tracking

Target folder:
- aitom_family/surface_header_shell_standard/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: tracking

Target folder:
- aitom_family/surface_logo_centerpiece/tracking/

Required files:
- aitom_family/surface_logo_centerpiece/tracking/events.md – logo_click.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: tracking

Target folder:
- aitom_family/app_header_appname_dropdown/tracking/

Required files:
- aitom_family/app_header_appname_dropdown/tracking/events.md – app_switch (target_app_id).

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: tracking

Target folder:
- aitom_family/macro_temp_indicator/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: tracking

Target folder:
- aitom_family/main_menu_icon_button/tracking/

Required files:
- aitom_family/main_menu_icon_button/tracking/events.md – menu_toggle.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: product_buy_buttons_block
dimension: tracking

Target folder:
- aitom_family/product_buy_buttons_block/tracking/

Required files:
- aitom_family/product_buy_buttons_block/tracking/events.md – add_to_cart (product_id, variant_id).

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: tracking

Target folder:
- aitom_family/product_collapsible_section/tracking/

Required files:
- aitom_family/product_collapsible_section/tracking/events.md – section_toggle (title).

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: tracking

Target folder:
- aitom_family/product_description_block/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: tracking

Target folder:
- aitom_family/product_info_stack/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: tracking

Target folder:
- aitom_family/product_media_gallery/tracking/

Required files:
- aitom_family/product_media_gallery/tracking/events.md – media_view (media_id).

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: tracking

Target folder:
- aitom_family/product_price_block/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: tracking

Target folder:
- aitom_family/product_recommendations_section/tracking/

Required files:
- aitom_family/product_recommendations_section/tracking/events.md – rec_click (product_id).

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: tracking

Target folder:
- aitom_family/product_title_block/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: tracking

Target folder:
- aitom_family/product_variant_picker/tracking/

Required files:
- aitom_family/product_variant_picker/tracking/events.md – variant_select (option_name, value).

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: tracking

Target folder:
- aitom_family/section_blog_posts/tracking/

Required files:
- aitom_family/section_blog_posts/tracking/events.md – article_click (article_id).

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: tracking

Target folder:
- aitom_family/section_collection_list/tracking/

Required files:
- aitom_family/section_collection_list/tracking/events.md – collection_click (collection_id).

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: tracking

Target folder:
- aitom_family/section_custom_markup/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: tracking

Target folder:
- aitom_family/section_email_signup/tracking/

Required files:
- aitom_family/section_email_signup/tracking/events.md – signup_submit (placement).

Implementation notes:
- No email logging.
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: tracking

Target folder:
- aitom_family/section_featured_collection_grid/tracking/

Required files:
- aitom_family/section_featured_collection_grid/tracking/events.md – product_click (product_id).

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: tracking

Target folder:
- aitom_family/section_hero_banner/tracking/

Required files:
- aitom_family/section_hero_banner/tracking/events.md – hero_cta_click (link_url).

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: tracking

Target folder:
- aitom_family/section_image_with_text/tracking/

Required files:
- aitom_family/section_image_with_text/tracking/events.md – cta_click.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: tracking

Target folder:
- aitom_family/section_media_collage/tracking/

Required files:
- aitom_family/section_media_collage/tracking/events.md – block_click.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: tracking

Target folder:
- aitom_family/section_multicolumn_features/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: tracking

Target folder:
- aitom_family/section_rich_text/tracking/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: tracking

Target folder:
- aitom_family/section_slideshow/tracking/

Required files:
- aitom_family/section_slideshow/tracking/events.md – slide_change (index).

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: tracking

Target folder:
- aitom_family/lanes_calendar_grid_v1/tracking/

Required files:
- aitom_family/lanes_calendar_grid_v1/tracking/events.md – month_change, event_click.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: tracking

Target folder:
- aitom_family/multi_feed_tile/tracking/

Required files:
- aitom_family/multi_feed_tile/tracking/events.md – tile_click.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
