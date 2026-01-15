### ATOM: multi_feed_tile
Dimension: views
Target folder:
- aitom_family/multi_feed_tile/views/

Tasks:
- Define default view structure shared across modes with slots for media, headline/subtitle, KPI metrics, product price, and CTA where applicable.
- Outline mode-specific view rules (image/video/KPI/product/text) including overlays (play button), KPI metric emphasis, and CTA placement while keeping base chrome consistent.
- Plan placeholder/empty/errored views for missing media or data while keeping behaviour aligned with grid contexts.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: views

Target folder:
- aitom_family/floating_pill_toolbar/views/

Required files:
- aitom_family/floating_pill_toolbar/views/collapsed_expanded.md – visuals for collapsed badge, expanded pill with tool icons, focus/hover/pressed.
- aitom_family/floating_pill_toolbar/views/grid_and_snap.md – show grid anchors, drag path, snap positions avoiding chat rail.
- aitom_family/floating_pill_toolbar/views/gather.md – illustrate long-press gather clustering and primary highlight.

Implementation notes:
- Demonstrate mobile/desktop placement above chat rail; show expansion direction per quadrant (vertical vs horizontal) without going off-screen.
- Include collision-avoidance example with slight offset; show reduced-motion variant with no animation lines.
- Annotate icon mini-pills on the main pill; keep background black base.

STATUS: DONE

### ATOM: maybes_note
dimension: views

Target folder:
- aitom_family/maybes_note/views/

Required files:
- aitom_family/maybes_note/views/card.md – default/pinned/archived views in list/grid.
- aitom_family/maybes_note/views/canvas.md – canvas placement with drag/scale visual and bulk save cue.

Implementation notes:
- Show title/body on dark base, accent via colour_token; pinned badge; archived dimmed; canvas view with position/scale handles and multi-note layout.
- Indicate bulk layout save feedback without overlapping controls.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: views

Target folder:
- aitom_family/chat_rail_header_bar/views/

Required files:
- aitom_family/chat_rail_header_bar/views/default.md – header layout with label and icons on dark base.
- aitom_family/chat_rail_header_bar/views/active_states.md – active tools/settings state, disabled min/expand.

Implementation notes:
- Show label truncation, focus/hover/pressed for icons, active band underline/fill; mobile narrow vs desktop.

STATUS: DONE

### ATOM: chat_message_list
dimension: views

Target folder:
- aitom_family/chat_message_list/views/

Required files:
- aitom_family/chat_message_list/views/states.md – loading, empty, populated views with scroll indicator.

Implementation notes:
- Illustrate auto-scroll indicator, empty placeholder, loading skeleton; show alignment to rail stack.

STATUS: DONE

### ATOM: chat_message_block
dimension: views

Target folder:
- aitom_family/chat_message_block/views/

Required files:
- aitom_family/chat_message_block/views/agent_user.md – agent (left) and human (right) variants with avatar.
- aitom_family/chat_message_block/views/highlight.md – highlighted/new message example.

Implementation notes:
- Show name/body/role tag stacking; action bar placement; highlight overlay; wrap handling without bubbles.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: views

Target folder:
- aitom_family/chat_message_action_bar/views/

Required files:
- aitom_family/chat_message_action_bar/views/default.md – row of five icons with hover/pressed/disabled samples.

Implementation notes:
- Show spacing and tap area; demonstrate disabled icons; attach under message.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: views

Target folder:
- aitom_family/chat_safety_controls_bar/views/

Required files:
- aitom_family/chat_safety_controls_bar/views/default.md – control row with off/on states.
- aitom_family/chat_safety_controls_bar/views/overflow.md – handling when controls exceed width (wrap/scroll).

Implementation notes:
- Show active indicator; compact height; mobile overflow handling.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: views

Target folder:
- aitom_family/bottom_chat_input_bar/views/

Required files:
- aitom_family/bottom_chat_input_bar/views/default.md – pill with upload, shortcuts, input, send.
- aitom_family/bottom_chat_input_bar/views/mobile_keyboard.md – mobile view with keyboard showing and input pinned.

Implementation notes:
- Show multiline input capped; send visible; shortcut popover trigger; keyboard-safe layout on mobile.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: views

Target folder:
- aitom_family/chat_shortcuts_popover/views/

Required files:
- aitom_family/chat_shortcuts_popover/views/open.md – open popover with tokens displayed.

Implementation notes:
- Show token row, focus/hover example, anchor to input arrow; reduced-motion variant optional.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: views

Target folder:
- aitom_family/chat_upload_source_picker/views/

Required files:
- aitom_family/chat_upload_source_picker/views/options.md – source list/grid with hover/selected.

Implementation notes:
- Show Nexus/Maiybes/Device options; selected row highlight; attachment to input; mobile-safe width.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: views

Target folder:
- aitom_family/chat_icon_band_popover/views/

Required files:
- aitom_family/chat_icon_band_popover/views/tools.md – tools band example with scroll on mobile.
- aitom_family/chat_icon_band_popover/views/settings.md – settings band example with active icon.

Implementation notes:
- Illustrate single-band visibility, active icon styling, horizontal scroll handling, placement between header and list.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: views

Target folder:
- aitom_family/chat_rail_shell/views/

Required files:
- aitom_family/chat_rail_shell/views/states.md – visuals for nano/micro/standard/full on mobile/desktop.
- aitom_family/chat_rail_shell/views/docking.md – docked vs undocked positions and drag handles.
- aitom_family/chat_rail_shell/views/bands.md – tools/settings band examples and mutual exclusivity.

Implementation notes:
- Show bottom anchoring on mobile with keyboard-safe input; desktop centered dock and floating undocked.
- Illustrate state transitions, header controls, and single open band; show message list scrolling and auto-scroll indicator.
- Include collision-free widths ensuring send button remains visible (no horizontal scroll).

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: views
Target folder:
- aitom_family/wireframe_canvas/views/

Tasks:
- Define default canvas view (full-page grid) with overlays for controls and live coordinate display.
- Outline view states: empty canvas, element-selected, remote-update indicators; ensure grid remains visible in all states.
- Note future compact/minimap view as potential extension if needed.

STATUS: DONE

### ATOM: blackboard
Dimension: views
Target folder:
- aitom_family/blackboard/views/

Tasks:
- Define default canvas view (full-viewport grid) with optional overlays for controls and live coordinate display.
- Plan states for empty canvas, element-selected, and remote-update indicators; ensure snap-grid remains visible in all states.
- If no alternate views exist yet, keep default as primary and note future compact/minimap view as pending.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: views

Target folder:
- aitom_family/theme_layout_settings/views/

Required files:
- aitom_family/theme_layout_settings/views/default.md – describe how global layout settings present in builder (if any UI).

Implementation notes:
- Primary “view” is the applied layout across pages; if surfaced, outline a settings panel view showing grid/margin previews aligned to the 24-column spec.
- Keep any preview on black base; highlight gutters/margins with stroke tokens; note mobile/tablet/desktop previews side-by-side.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: views

Target folder:
- aitom_family/theme_colour_schemes/views/

Required files:
- aitom_family/theme_colour_schemes/views/scheme_picker.md – default view for selecting schemes.
- aitom_family/theme_colour_schemes/views/state_examples.md – examples of states on dark base (default/hover/pressed/disabled).

Implementation notes:
- Define a simple picker view: swatches or list with labels on black background; show hover/pressed/disabled state samples for buttons/links.
- Provide mobile/desktop layout guidance (24-column-aware) and how focus is shown.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: views

Target folder:
- aitom_family/theme_typography_settings/views/

Required files:
- aitom_family/theme_typography_settings/views/preset_list.md – default view for listing presets.
- aitom_family/theme_typography_settings/views/state_examples.md – examples of text roles on black base.

Implementation notes:
- Show preset samples (h1–body–label–button) on black background with white text; include compact/comfortable density examples.
- Provide guidance for mobile vs desktop presentation using 24-column spans; include focus/selection indication for chosen preset.

STATUS: DONE

### ATOM: theme_card_surface
dimension: views

Target folder:
- aitom_family/theme_card_surface/views/

Required files:
- aitom_family/theme_card_surface/views/surface_examples.md – examples of card states (default/hover/pressed/focus/selected) on dark and light variants.
- aitom_family/theme_card_surface/views/density_variants.md – compact vs comfortable padding examples.

Implementation notes:
- Present sample cards with placeholder media/text to showcase surface tokens; show both dark base and inverted variant.
- Include mobile/desktop alignment guidance; ensure focus ring and hover/pressed elevation are illustrated without layout shift.

STATUS: DONE

### ATOM: layout_group_container
dimension: views

Target folder:
- aitom_family/layout_group_container/views/

Required files:
- aitom_family/layout_group_container/views/default.md – default container view on black base.
- aitom_family/layout_group_container/views/full_bleed.md – view illustrating full-bleed vs contained.

Implementation notes:
- Show container wrapping child blocks with padding and optional background/stroke; include mobile/desktop examples aligned to 24-column grid.
- Illustrate full-bleed variant and standard contained variant; include spacing above/below.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: views

Target folder:
- aitom_family/layout_columns_grid/views/

Required files:
- aitom_family/layout_columns_grid/views/default.md – desktop/mobile grid views.
- aitom_family/layout_columns_grid/views/variants.md – examples for different column counts and with/without dividers.

Implementation notes:
- Depict 2–5 column desktop and 1–2 column mobile layouts with gutters/row gaps; show optional column dividers.
- Highlight equal-height vs natural-height variants and alignment options.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: views

Target folder:
- aitom_family/layout_spacer_block/views/

Required files:
- aitom_family/layout_spacer_block/views/sizes.md – visualization of spacer heights in context.

Implementation notes:
- Show spacer tokens (xs–xl) as vertical gaps on black base; include mobile/desktop representations and debug outline option.

STATUS: DONE

### ATOM: layout_divider_block
dimension: views

Target folder:
- aitom_family/layout_divider_block/views/

Required files:
- aitom_family/layout_divider_block/views/default.md – divider examples (full-width/inset, solid/dashed).
- aitom_family/layout_divider_block/views/labeled.md – optional labeled divider example.

Implementation notes:
- Illustrate divider across container and inset variants respecting 24-column grid; show stroke weights and optional label placement.
- Include mobile/desktop spacing differences; keep flat styling on black base.

STATUS: DONE

### ATOM: heading_block
dimension: views

Target folder:
- aitom_family/heading_block/views/

Required files:
- aitom_family/heading_block/views/default.md – heading display on mobile/desktop with alignment/max-width examples.
- aitom_family/heading_block/views/linked.md – view showing link state styling.

Implementation notes:
- Show heading levels with alignment options and max-width usage on black base; include link state focus/hover examples.
- Illustrate spacing above/below and optional underline/divider variant.

STATUS: DONE

### ATOM: rich_text_block
dimension: views

Target folder:
- aitom_family/rich_text_block/views/

Required files:
- aitom_family/rich_text_block/views/default.md – paragraphs/lists on black base with spacing.
- aitom_family/rich_text_block/views/link_states.md – link hover/focus examples.

Implementation notes:
- Show body copy with paragraph gaps, list styling, and max-width; include link state visuals; mobile/desktop examples respecting 24-column.

STATUS: DONE

### ATOM: button_single
dimension: views

Target folder:
- aitom_family/button_single/views/

Required files:
- aitom_family/button_single/views/variants.md – solid/outline examples with states.
- aitom_family/button_single/views/states.md – default/hover/pressed/focus/disabled/loading visuals.

Implementation notes:
- Display solid and outline buttons on black base, with state samples; include icon-left/right example and mobile full-width option.

STATUS: DONE

### ATOM: button_group
dimension: views

Target folder:
- aitom_family/button_group/views/

Required files:
- aitom_family/button_group/views/orientation.md – horizontal vs stacked examples.
- aitom_family/button_group/views/variants.md – primary/secondary combos.

Implementation notes:
- Show two-button group row on desktop and stacked on mobile; include primary/secondary mix; align to container spans.

STATUS: DONE

### ATOM: image_media_block
dimension: views

Target folder:
- aitom_family/image_media_block/views/

Required files:
- aitom_family/image_media_block/views/default.md – image with aspect ratios/radius options.
- aitom_family/image_media_block/views/overlay.md – overlay/hover/focus examples with caption.

Implementation notes:
- Show image frames with different aspect ratios and radius/stroke options; include hover overlay with caption; mobile/desktop variants.

STATUS: DONE

### ATOM: video_media_block
dimension: views

Target folder:
- aitom_family/video_media_block/views/

Required files:
- aitom_family/video_media_block/views/default.md – poster + play icon state.
- aitom_family/video_media_block/views/playback_states.md – playing/paused/buffer/error visuals.

Implementation notes:
- Display poster with play icon, focus ring; show overlay/control bar on hover/focus; mobile/desktop examples; optional error state sample.

STATUS: DONE

### ATOM: accordion_item
dimension: views

Target folder:
- aitom_family/accordion_item/views/

Required files:
- aitom_family/accordion_item/views/default.md – collapsed/expanded states.
- aitom_family/accordion_item/views/group.md – multiple items stacked with dividers.

Implementation notes:
- Show collapsed vs expanded headers, chevron rotation, body content spacing; include hover/focus states on header; mobile/desktop alignment.

STATUS: DONE

### ATOM: section_hero_banner
dimension: views

Target folder:
- aitom_family/section_hero_banner/views/

Required files:
- aitom_family/section_hero_banner/views/default.md – hero with media overlay and text/buttons for desktop/mobile.
- aitom_family/section_hero_banner/views/states.md – media states (image/video), CTA states.

Implementation notes:
- Show hero with background image/video, overlay tint, headline/body, and CTA buttons; desktop alignment vs mobile stacked view; include focus/hover examples.

STATUS: DONE

### ATOM: section_rich_text
dimension: views

Target folder:
- aitom_family/section_rich_text/views/

Required files:
- aitom_family/section_rich_text/views/default.md – section layout with heading/body/CTA on desktop/mobile.
- aitom_family/section_rich_text/views/link_states.md – link/CTA state visuals.

Implementation notes:
- Display centered/left-aligned text block with padding and spacing; show link hover/focus and CTA states; respect max-width on black base.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: views

Target folder:
- aitom_family/section_multicolumn_features/views/

Required files:
- aitom_family/section_multicolumn_features/views/grid_examples.md – 2–5 column desktop, 1–2 column mobile.
- aitom_family/section_multicolumn_features/views/state_examples.md – hover/focus on cards/CTAs.

Implementation notes:
- Show feature columns with icon/image, heading, text, CTA; display different column counts; hover/focus states using card surface; include mobile stacking view.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: views

Target folder:
- aitom_family/section_featured_collection_grid/views/

Required files:
- aitom_family/section_featured_collection_grid/views/grid_examples.md – product grid layouts desktop/mobile.
- aitom_family/section_featured_collection_grid/views/states.md – loading/empty/card hover states.

Implementation notes:
- Show product cards in grid (2–4 columns desktop, 1–2 mobile) with loading skeleton and empty state; include CTA “view all”; hover/focus on cards/CTAs.

STATUS: DONE

### ATOM: section_collection_list
dimension: views

Target folder:
- aitom_family/section_collection_list/views/

Required files:
- aitom_family/section_collection_list/views/grid_examples.md – collection cards in grid/list variants.
- aitom_family/section_collection_list/views/states.md – empty/loading and hover/focus states.

Implementation notes:
- Depict collection cards grid (2–4 desktop, 1–2 mobile) and optional list view; include hover/focus on cards/CTAs, loading/empty placeholders, and header/CTA placement.

STATUS: DONE

### ATOM: section_media_collage
dimension: views

Target folder:
- aitom_family/section_media_collage/views/

Required files:
- aitom_family/section_media_collage/views/patterns.md – visual patterns for tiles on desktop/mobile.
- aitom_family/section_media_collage/views/states.md – hover/focus overlays and video tile states.

Implementation notes:
- Show collage patterns with large + small tiles, overlay captions, and hover/focus behaviour; include mobile stacked view and optional video tile overlay.

STATUS: DONE

### ATOM: section_image_with_text
dimension: views

Target folder:
- aitom_family/section_image_with_text/views/

Required files:
- aitom_family/section_image_with_text/views/default.md – media left/right variants and mobile stacked.
- aitom_family/section_image_with_text/views/states.md – hover overlay on media, CTA states.

Implementation notes:
- Display left/right layout on desktop and stacked on mobile; show media overlay hover/focus, CTA state visuals, spacing/gaps.

STATUS: DONE

### ATOM: section_slideshow
dimension: views

Target folder:
- aitom_family/section_slideshow/views/

Required files:
- aitom_family/section_slideshow/views/default.md – slide with content, controls placement.
- aitom_family/section_slideshow/views/states.md – transition/autoplay indicators, control states.

Implementation notes:
- Show desktop/mobile slide layouts with overlay text, controls (arrows/dots), and CTA; illustrate focus/hover states and slide transition indicators.

STATUS: DONE

### ATOM: section_blog_posts
dimension: views

Target folder:
- aitom_family/section_blog_posts/views/

Required files:
- aitom_family/section_blog_posts/views/grid_examples.md – post grid desktop/mobile.
- aitom_family/section_blog_posts/views/states.md – loading/empty and card hover/focus.

Implementation notes:
- Show post cards grid (2–4 desktop, 1–2 mobile), with loading skeletons and empty state; highlight hover/focus on cards and CTA placement.

STATUS: DONE

### ATOM: section_email_signup
dimension: views

Target folder:
- aitom_family/section_email_signup/views/

Required files:
- aitom_family/section_email_signup/views/default.md – form layout desktop/mobile.
- aitom_family/section_email_signup/views/states.md – focus/hover/error/success/loading states.

Implementation notes:
- Display desktop side-by-side input/button and mobile stacked variant; show helper/error messages and state visuals on black base.

STATUS: DONE

### ATOM: section_custom_markup
dimension: views

Target folder:
- aitom_family/section_custom_markup/views/

Required files:
- aitom_family/section_custom_markup/views/default.md – container with padding/max-width/full-bleed examples.

Implementation notes:
- Illustrate minimal wrapper showing padding and full-bleed vs contained on black base; content is placeholder since markup is user-provided.

STATUS: DONE

### ATOM: product_media_gallery
dimension: views

Target folder:
- aitom_family/product_media_gallery/views/

Required files:
- aitom_family/product_media_gallery/views/default.md – desktop/mobile gallery layouts with thumbs.
- aitom_family/product_media_gallery/views/states.md – hover/focus/active thumbs, zoom/lightbox, video states.

Implementation notes:
- Show vertical thumbs on desktop and horizontal carousel on mobile; active thumb highlight; video overlay; zoom/lightbox depiction; focus rings on thumbs.

STATUS: DONE

### ATOM: product_info_stack
dimension: views

Target folder:
- aitom_family/product_info_stack/views/

Required files:
- aitom_family/product_info_stack/views/default.md – stack composition example with child atoms placeholders.

Implementation notes:
- Illustrate stacked product info blocks with spacing; no unique view beyond composition; placeholders for child atoms.

STATUS: DONE

### ATOM: product_title_block
dimension: views

Target folder:
- aitom_family/product_title_block/views/

Required files:
- aitom_family/product_title_block/views/default.md – title/subtitle on black base; link state example if applicable.

Implementation notes:
- Show title with spacing and optional link underline; mobile/desktop alignment if used.

STATUS: DONE

### ATOM: product_price_block
dimension: views

Target folder:
- aitom_family/product_price_block/views/

Required files:
- aitom_family/product_price_block/views/default.md – price/compare/badge layouts; inline vs stacked.
- aitom_family/product_price_block/views/states.md – sale/sold-out badge examples.

Implementation notes:
- Show price with compare-at strike and badge; inline and stacked layouts; high-contrast display on black base.

STATUS: DONE

### ATOM: product_variant_picker
dimension: views

Target folder:
- aitom_family/product_variant_picker/views/

Required files:
- aitom_family/product_variant_picker/views/control_examples.md – dropdown vs swatch/button views.
- aitom_family/product_variant_picker/views/states.md – selected/disabled/error states.

Implementation notes:
- Show option groups with labels and controls; swatch/button selected/disabled, dropdown example; mobile stacking; focus/hover highlights.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: views

Target folder:
- aitom_family/product_buy_buttons_block/views/

Required files:
- aitom_family/product_buy_buttons_block/views/default.md – buttons side-by-side desktop / stacked mobile.
- aitom_family/product_buy_buttons_block/views/states.md – loading/disabled examples.

Implementation notes:
- Show add-to-cart and buy-now buttons with state visuals; sticky option noted separately; black/white variants.

STATUS: DONE

### ATOM: product_description_block
dimension: views

Target folder:
- aitom_family/product_description_block/views/

Required files:
- aitom_family/product_description_block/views/default.md – rich text layout with spacing.
- aitom_family/product_description_block/views/truncation.md – optional read-more depiction.

Implementation notes:
- Show full text with paragraph spacing; optional truncated view with “read more”; link states on black base.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: views

Target folder:
- aitom_family/product_collapsible_section/views/

Required files:
- aitom_family/product_collapsible_section/views/default.md – collapsed/expanded items.
- aitom_family/product_collapsible_section/views/group.md – multiple items stacked with dividers.

Implementation notes:
- Similar to accordion_item but scoped to product content; show headers with chevron and expanded body; mobile/desktop spacing.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: views

Target folder:
- aitom_family/product_recommendations_section/views/

Required files:
- aitom_family/product_recommendations_section/views/grid_examples.md – recommendations grid desktop/mobile.
- aitom_family/product_recommendations_section/views/states.md – loading/empty and card hover/focus.

Implementation notes:
- Show recommendation cards grid (2–4 desktop, 1–2 mobile) with loading skeleton/empty state; hover/focus on cards/CTAs; include section heading/CTA placement.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: views

Target folder:
- aitom_family/wireframe_canvas/views/

Required files:
- aitom_family/wireframe_canvas/views/canvas_root.md – the main composition view.
- aitom_family/wireframe_canvas/views/minimap.md – optional navigator view.

Implementation notes:
- Main view wraps the canvas Interaction Layer and Rendering Layer.
- Toolbars may be distinct atoms but are composed here.
- Viewport state (x, y, zoom) managed at this level.

STATUS: DONE

### ATOM: blackboard
dimension: views

Target folder:
- aitom_family/blackboard/views/

Required files:
- aitom_family/blackboard/views/shell.md – the top-level view wrapper.

Implementation notes:
- The entry point for the "Blackboard" or "Canvas" route.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: views

Target folder:
- aitom_family/theme_layout_settings/views/

Required files:
- None. (Abstract setting).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: views

Target folder:
- aitom_family/theme_colour_schemes/views/

Required files:
- None. (Abstract setting).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: views

Target folder:
- aitom_family/theme_typography_settings/views/

Required files:
- None. (Abstract setting).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: views

Target folder:
- aitom_family/theme_card_surface/views/

Required files:
- aitom_family/theme_card_surface/views/card_shell.md – the view component corresponding to the card surface.

Implementation notes:
- A generic wrapper view that accepts children.
- Status: DONE
- Implemented: aitom_family/theme_card_surface/views/* according to this plan.

STATUS: DONE

### ATOM: accordion_item
dimension: views

Target folder:
- aitom_family/accordion_item/views/

Required files:
- aitom_family/accordion_item/views/item.md – main view component.

Implementation notes:
- Status: ACTIVE

### ATOM: button_group
dimension: views

Target folder:
- aitom_family/button_group/views/

Required files:
- aitom_family/button_group/views/group.md – container view.

Implementation notes:
- Status: ACTIVE

### ATOM: button_single
dimension: views

Target folder:
- aitom_family/button_single/views/

Required files:
- aitom_family/button_single/views/button.md – button view.

Implementation notes:
- Status: ACTIVE

### ATOM: heading_block
dimension: views

Target folder:
- aitom_family/heading_block/views/

Required files:
- aitom_family/heading_block/views/heading.md – heading view.

Implementation notes:
- Status: ACTIVE

### ATOM: rich_text_block
dimension: views

Target folder:
- aitom_family/rich_text_block/views/

Required files:
- aitom_family/rich_text_block/views/block.md – rich text view.

Implementation notes:
- Status: ACTIVE

### ATOM: image_media_block
dimension: views

Target folder:
- aitom_family/image_media_block/views/

Required files:
- aitom_family/image_media_block/views/image.md – image view.

Implementation notes:
- Status: ACTIVE

### ATOM: video_media_block
dimension: views

Target folder:
- aitom_family/video_media_block/views/

Required files:
- aitom_family/video_media_block/views/video.md – video view.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: views

Target folder:
- aitom_family/layout_columns_grid/views/

Required files:
- aitom_family/layout_columns_grid/views/grid.md – grid container view.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: views

Target folder:
- aitom_family/layout_divider_block/views/

Required files:
- aitom_family/layout_divider_block/views/divider.md – divider view.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_group_container
dimension: views

Target folder:
- aitom_family/layout_group_container/views/

Required files:
- aitom_family/layout_group_container/views/container.md – wrapper view.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: views

Target folder:
- aitom_family/layout_spacer_block/views/

Required files:
- aitom_family/layout_spacer_block/views/spacer.md – spacer view.

Implementation notes:
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: views

Target folder:
- aitom_family/floating_pill_toolbar/views/

Required files:
- aitom_family/floating_pill_toolbar/views/toolbar.md – main toolbar view.

Implementation notes:
- Status: ACTIVE

### ATOM: maybes_note
dimension: views

Target folder:
- aitom_family/maybes_note/views/

Required files:
- aitom_family/maybes_note/views/card.md – card view.

Implementation notes:
- Status: DONE
- Implemented: aitom_family/maybes_note/views/* according to this plan.

STATUS: DONE

### ATOM: chat_card_v1
dimension: views

Target folder:
- aitom_family/chat_card_v1/views/

Required files:
- aitom_family/chat_card_v1/views/main.md – primary card view.
- aitom_family/chat_card_v1/views/settings.md – back-of-card view.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: views

Target folder:
- aitom_family/chat_rail_shell/views/

Required files:
- aitom_family/chat_rail_shell/views/container.md – collapsible rail.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: views

Target folder:
- aitom_family/chat_rail_header_bar/views/

Required files:
- aitom_family/chat_rail_header_bar/views/bar.md – header view.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: views

Target folder:
- aitom_family/chat_message_list/views/

Required files:
- aitom_family/chat_message_list/views/list.md – virtualized list.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: views

Target folder:
- aitom_family/chat_message_block/views/

Required files:
- aitom_family/chat_message_block/views/message.md – message row.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: views

Target folder:
- aitom_family/chat_message_action_bar/views/

Required files:
- aitom_family/chat_message_action_bar/views/bar.md – action strip.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: views

Target folder:
- aitom_family/chat_safety_controls_bar/views/

Required files:
- aitom_family/chat_safety_controls_bar/views/bar.md – alert bar.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: views

Target folder:
- aitom_family/bottom_chat_input_bar/views/

Required files:
- aitom_family/bottom_chat_input_bar/views/bar.md – input container.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: views

Target folder:
- aitom_family/chat_shortcuts_popover/views/

Required files:
- aitom_family/chat_shortcuts_popover/views/menu.md – command list.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: views

Target folder:
- aitom_family/chat_upload_source_picker/views/

Required files:
- aitom_family/chat_upload_source_picker/views/picker.md – source options.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: views

Target folder:
- aitom_family/chat_icon_band_popover/views/

Required files:
- aitom_family/chat_icon_band_popover/views/band.md – icon strip.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: views

Target folder:
- aitom_family/surface_header_nano/views/

Required files:
- aitom_family/surface_header_nano/views/header.md – nano header.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: views

Target folder:
- aitom_family/surface_header_shell_micro/views/

Required files:
- aitom_family/surface_header_shell_micro/views/header.md – micro header.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: views

Target folder:
- aitom_family/surface_header_shell_standard/views/

Required files:
- aitom_family/surface_header_shell_standard/views/header.md – standard header.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: views

Target folder:
- aitom_family/surface_logo_centerpiece/views/

Required files:
- aitom_family/surface_logo_centerpiece/views/logo.md – logo component.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: views

Target folder:
- aitom_family/app_header_appname_dropdown/views/

Required files:
- aitom_family/app_header_appname_dropdown/views/dropdown.md – switcher.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: views

Target folder:
- aitom_family/macro_temp_indicator/views/

Required files:
- aitom_family/macro_temp_indicator/views/indicator.md – pill view.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: views

Target folder:
- aitom_family/main_menu_icon_button/views/

Required files:
- aitom_family/main_menu_icon_button/views/button.md – trigger view.

Implementation notes:
- Status: DONE
- Implemented: aitom_family/main_menu_icon_button/views/* according to this plan.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: views

Target folder:
- aitom_family/product_buy_buttons_block/views/

Required files:
- aitom_family/product_buy_buttons_block/views/buttons.md – main CTA component.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: views

Target folder:
- aitom_family/product_collapsible_section/views/

Required files:
- aitom_family/product_collapsible_section/views/accordion.md – collapsible view.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: views

Target folder:
- aitom_family/product_description_block/views/

Required files:
- aitom_family/product_description_block/views/text.md – description component.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: views

Target folder:
- aitom_family/product_info_stack/views/

Required files:
- aitom_family/product_info_stack/views/stack.md – info container.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: views

Target folder:
- aitom_family/product_media_gallery/views/

Required files:
- aitom_family/product_media_gallery/views/gallery.md – main gallery component.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: views

Target folder:
- aitom_family/product_price_block/views/

Required files:
- aitom_family/product_price_block/views/price.md – price component.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: views

Target folder:
- aitom_family/product_recommendations_section/views/

Required files:
- aitom_family/product_recommendations_section/views/section.md – recs carousel/grid.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: views

Target folder:
- aitom_family/product_title_block/views/

Required files:
- aitom_family/product_title_block/views/title.md – title component.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: views

Target folder:
- aitom_family/product_variant_picker/views/

Required files:
- aitom_family/product_variant_picker/views/picker.md – variant selector.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: views

Target folder:
- aitom_family/section_blog_posts/views/

Required files:
- aitom_family/section_blog_posts/views/section.md – blog grid.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: views

Target folder:
- aitom_family/section_collection_list/views/

Required files:
- aitom_family/section_collection_list/views/section.md – collections grid/slider.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: views

Target folder:
- aitom_family/section_custom_markup/views/

Required files:
- aitom_family/section_custom_markup/views/embed.md – html embed.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: views

Target folder:
- aitom_family/section_email_signup/views/

Required files:
- aitom_family/section_email_signup/views/section.md – signup section.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: views

Target folder:
- aitom_family/section_featured_collection_grid/views/

Required files:
- aitom_family/section_featured_collection_grid/views/section.md – product grid.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: views

Target folder:
- aitom_family/section_hero_banner/views/

Required files:
- aitom_family/section_hero_banner/views/hero.md – hero component.

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: views

Target folder:
- aitom_family/section_image_with_text/views/

Required files:
- aitom_family/section_image_with_text/views/section.md – split layout.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: views

Target folder:
- aitom_family/section_media_collage/views/

Required files:
- aitom_family/section_media_collage/views/collage.md – media grid.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: views

Target folder:
- aitom_family/section_multicolumn_features/views/

Required files:
- aitom_family/section_multicolumn_features/views/features.md – feature columns.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: views

Target folder:
- aitom_family/section_rich_text/views/

Required files:
- aitom_family/section_rich_text/views/section.md – text block.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: views

Target folder:
- aitom_family/section_slideshow/views/

Required files:
- aitom_family/section_slideshow/views/slider.md – slides component.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: views

Target folder:
- aitom_family/lanes_calendar_grid_v1/views/

Required files:
- aitom_family/lanes_calendar_grid_v1/views/calendar.md – month view.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: views

Target folder:
- aitom_family/multi_feed_tile/views/

Required files:
- aitom_family/multi_feed_tile/views/tile.md – card view.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
