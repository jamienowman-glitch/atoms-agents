### ATOM: multi_feed_tile
Dimension: layout
Target folder:
- aitom_family/multi_feed_tile/layout/

Tasks:
- Define base tile layout with container width 100% and configurable aspect ratio token (square/portrait/landscape) that adapts within 1–4 column grids.
- Specify internal spacing tokens for padding/gap, stacking order of media area vs text/CTA, and CTA as a separate zone in product mode.
- Document responsive behaviour delegated to parent grids while ensuring tile content scales fluidly without breakpoint logic.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: layout

Target folder:
- aitom_family/floating_pill_toolbar/layout/

Required files:
- aitom_family/floating_pill_toolbar/layout/structure.md – pill dimensions, radius, sub-pill positioning, z-index rules.
- aitom_family/floating_pill_toolbar/layout/spacing.md – icon spacing, padding, safe offset above chat rail, cluster offsets.
- aitom_family/floating_pill_toolbar/layout/grid_snap.md – snap grid size, anchor definitions, clamp behaviour to avoid chat rail.

Implementation notes:
- Define pill width/height tokens for collapsed and expanded states; radius tokens keep pill shape.
- Grid snapping tokens: grid cell size, viewport margins, chat rail exclusion zone, clamp behaviour; position stored as grid coordinates.
- Spacing tokens for icon gaps, pill padding, mini-pill offset; cluster/gather offset tokens that avoid overlaps and keep within 24-column safe area.
- Z-index tokens ensure toolbar sits above content but below system overlays; respect reduced-motion with no layout shift.

STATUS: DONE

### ATOM: maybes_note
dimension: layout

Target folder:
- aitom_family/maybes_note/layout/

Required files:
- aitom_family/maybes_note/layout/structure.md – note card structure for list/canvas.
- aitom_family/maybes_note/layout/spacing.md – padding, title/body spacing, badge positioning.
- aitom_family/maybes_note/layout/canvas.md – layout_x/layout_y/layout_scale usage on canvas and bulk save mapping.

Implementation notes:
- Define padding and radius tokens; max width for card; spacing between title/body; badge/pin positioning.
- Canvas: position using layout_x/layout_y; apply layout_scale; clamp within canvas bounds; allow list/grid embedding using 24-column spans when not on canvas.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: layout

Target folder:
- aitom_family/chat_rail_header_bar/layout/

Required files:
- aitom_family/chat_rail_header_bar/layout/structure.md – three-zone layout, padding, label centering.
- aitom_family/chat_rail_header_bar/layout/spacing.md – icon spacing/order tokens, min widths, truncation rules.

Implementation notes:
- Define header height token aligning with rail; symmetric padding; icon order/gap tokens; label center alignment with ellipsis when constrained; maintain alignment in nano/micro.

STATUS: DONE

### ATOM: chat_message_list
dimension: layout

Target folder:
- aitom_family/chat_message_list/layout/

Required files:
- aitom_family/chat_message_list/layout/structure.md – scroll container sizing within rail stack.
- aitom_family/chat_message_list/layout/spacing.md – padding and vertical spacing tokens.

Implementation notes:
- Occupies remaining height between header/band/safety/input; min/max heights per state; padding tokenized; no horizontal scroll; supports loading/empty placeholder alignment.

STATUS: DONE

### ATOM: chat_message_block
dimension: layout

Target folder:
- aitom_family/chat_message_block/layout/

Required files:
- aitom_family/chat_message_block/layout/structure.md – stacking of name/body/action bar, avatar alignment.
- aitom_family/chat_message_block/layout/spacing.md – gaps between elements, max width, highlight area.

Implementation notes:
- Define max text width within rail; gaps between name/body/action bar; avatar offset for agent/human; optional role tag alignment; highlight overlay non-shifting.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: layout

Target folder:
- aitom_family/chat_message_action_bar/layout/

Required files:
- aitom_family/chat_message_action_bar/layout/row.md – icon row spacing, padding, alignment under message body.

Implementation notes:
- Single row; equal spacing tokens; padding left/right aligned with message text; ensure tap target sizing and no wrap.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: layout

Target folder:
- aitom_family/chat_safety_controls_bar/layout/

Required files:
- aitom_family/chat_safety_controls_bar/layout/row.md – icon row spacing, padding, alignment above input.
- aitom_family/chat_safety_controls_bar/layout/overflow.md – behaviour when controls exceed width (wrap/scroll).

Implementation notes:
- Compact height token; center/right alignment; spacing tokens; define overflow strategy without horizontal scroll on input area.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: layout

Target folder:
- aitom_family/bottom_chat_input_bar/layout/

Required files:
- aitom_family/bottom_chat_input_bar/layout/structure.md – pill layout for upload/shortcut/input/send.
- aitom_family/bottom_chat_input_bar/layout/padding.md – internal padding and spacing to prevent overflow.

Implementation notes:
- Rounded pill height token; layout ensures send button always visible; input grows with cap and internal scroll; respects safe-area insets; horizontal padding tokens for icons and text.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: layout

Target folder:
- aitom_family/chat_shortcuts_popover/layout/

Required files:
- aitom_family/chat_shortcuts_popover/layout/structure.md – popover sizing, token arrangement, anchor positioning.

Implementation notes:
- Compact pill/rect; token row with spacing; anchor relative to input arrow; avoid covering input; radius tokenized.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: layout

Target folder:
- aitom_family/chat_upload_source_picker/layout/

Required files:
- aitom_family/chat_upload_source_picker/layout/structure.md – popover width/height, list/grid option layout, anchor.
- aitom_family/chat_upload_source_picker/layout/overflow.md – scrolling behaviour when options exceed max.

Implementation notes:
- Tokenize width and row height; attach to input; ensure it doesn’t cover input send area; handle max visible options with scroll; radius/padding tokens.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: layout

Target folder:
- aitom_family/chat_icon_band_popover/layout/

Required files:
- aitom_family/chat_icon_band_popover/layout/structure.md – band height, padding, icon spacing, attachment to rail.
- aitom_family/chat_icon_band_popover/layout/scroll.md – horizontal scroll behaviour on mobile.

Implementation notes:
- Band spans rail width; attaches between header and messages; icons centered vertically; spacing tokens; define scroll snapping; ensure it doesn’t push input off-screen.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: layout

Target folder:
- aitom_family/chat_rail_shell/layout/

Required files:
- aitom_family/chat_rail_shell/layout/structure.md – vertical stack (header, band, list, safety, input), radius, padding.
- aitom_family/chat_rail_shell/layout/responsive.md – mobile anchoring, desktop docked/undocked sizing, max width.
- aitom_family/chat_rail_shell/layout/state_sizes.md – height/width tokens per state (nano/micro/standard/full) and safe-area offsets.

Implementation notes:
- Define corner radius, padding, header height, band height, message list min/max heights, safety bar and input bar spacing.
- Mobile: full-width minus safe-area, bottom anchored; ensure input/send never overflow horizontally; keyboard shrinks list area, not input.
- Desktop: center docked max width; undocked position tokens; clamp within viewport; provide state height ranges with smooth transitions.

STATUS: DONE
### ATOM: blackboard
Dimension: layout
Target folder:
- aitom_family/blackboard/layout/

Tasks:
- Define full-page canvas layout with black background, white wireframe grid, and snap spacing tokens; ensure responsive fit to viewport.
- Describe element positioning model (x/y, width/height, z-order) with grid-snapped coordinates and bounds within the canvas.
- Document overlay layout for controls (snap toggle, reset, coordinate readout) without obstructing grid interactions.

STATUS: DONE
### ATOM: wireframe_canvas
Dimension: layout
Target folder:
- aitom_family/wireframe_canvas/layout/

Tasks:
- Define full-viewport canvas layout with black background and white snap grid; set grid spacing tokens and ensure responsive resizing.
- Describe element positioning model (x/y, width/height, z-order) with grid-snapped coordinates, bounds within canvas, and optional zoom/pan controls.
- Plan overlay layout for controls (snap toggle, reset, coordinate readout) without blocking drag areas.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: layout

Target folder:
- aitom_family/theme_layout_settings/layout/

Required files:
- aitom_family/theme_layout_settings/layout/grid.md – define 24-column grid spans, margins, gutters per breakpoint.
- aitom_family/theme_layout_settings/layout/spacing.md – section padding, vertical rhythm, safe-area handling.
- aitom_family/theme_layout_settings/layout/full_bleed.md – rules/tokens for full-bleed sections.

Implementation notes:
- Specify tokens for grid_span_mobile/tablet/desktop defaults, outer_margin_*, gutter_*, container max width, safe_area_insets, section padding (top/bottom), and vertical gaps.
- Include guidance for density presets (compact/comfortable) and how they alter padding/gutters without breaking the 24-column contract.
- Document how full_bleed interacts with margins and maintains internal 24-column structure.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: layout

Target folder:
- aitom_family/theme_colour_schemes/layout/

Required files:
- aitom_family/theme_colour_schemes/layout/presentation.md – layout guidance for scheme picker UI (if surfaced).

Implementation notes:
- Minimal: if a scheme picker exists, define spacing/alignment tokens for swatches/labels; otherwise note [NO LAYOUT] beyond token references.
- Ensure any picker respects the 24-column spans and padding from theme_layout_settings.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: layout

Target folder:
- aitom_family/theme_typography_settings/layout/

Required files:
- aitom_family/theme_typography_settings/layout/presentation.md – layout for preset lists/sliders if exposed in UI.

Implementation notes:
- Provide spacing/alignment tokens for typography controls (lists/sliders) if surfaced; otherwise mark [NO LAYOUT] while referencing 24-column grid alignment.
- Keep padding consistent with theme_layout_settings tokens.

STATUS: DONE

### ATOM: theme_card_surface
dimension: layout

Target folder:
- aitom_family/theme_card_surface/layout/

Required files:
- aitom_family/theme_card_surface/layout/structure.md – padding, radius, stroke placement, elevation bounds.
- aitom_family/theme_card_surface/layout/spacing.md – gaps between media/text slots inside the shell.

Implementation notes:
- Define tokens for internal padding (compact/comfortable), radius scale, stroke placement (inside/center/outside), and spacing between media and text slots.
- Ensure card width/height adapt to 24-column spans set by parent; no fixed pixel widths.
- Document how badges or overlays sit within padding without clipping radius.

STATUS: DONE

### ATOM: layout_group_container
dimension: layout

Target folder:
- aitom_family/layout_group_container/layout/

Required files:
- aitom_family/layout_group_container/layout/structure.md – container width, padding, radius, optional background/stroke treatment.
- aitom_family/layout_group_container/layout/spacing.md – internal gap between children and section margins.
- aitom_family/layout_group_container/layout/full_bleed.md – rules for full-bleed vs contained alignment.

Implementation notes:
- Define tokens for padding (top/bottom/left/right), gap between child blocks, radius (if used), stroke placement, and max-width alignment to the 24-column grid.
- Map how container spans across breakpoints (grid_span_* tokens) and how full_bleed toggles outer margins.
- Include vertical spacing tokens relative to neighbouring sections.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: layout

Target folder:
- aitom_family/layout_columns_grid/layout/

Required files:
- aitom_family/layout_columns_grid/layout/grid.md – column counts/spans per breakpoint, gutter and row gap tokens.
- aitom_family/layout_columns_grid/layout/dividers.md – optional column divider sizing/inset.
- aitom_family/layout_columns_grid/layout/alignment.md – vertical alignment rules for column content.

Implementation notes:
- Specify column_count per breakpoint, default spans, gutter overrides, row gap, and wrap behaviour; align to 24-column container width.
- Document optional column dividers (inset or full-width) and how they relate to gutters.
- Provide guidance for equal-height columns and alignment (top/center/stretch) with tokenized gaps.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: layout

Target folder:
- aitom_family/layout_spacer_block/layout/

Required files:
- aitom_family/layout_spacer_block/layout/sizes.md – spacer height presets and breakpoint/density adjustments.

Implementation notes:
- Define spacer size tokens (xs–xl) with mappings per breakpoint/density; note zero width and full 24-column span.
- Include optional minimum/maximum clamps to avoid excessive whitespace on small screens.

STATUS: DONE

### ATOM: layout_divider_block
dimension: layout

Target folder:
- aitom_family/layout_divider_block/layout/

Required files:
- aitom_family/layout_divider_block/layout/structure.md – stroke placement (full-width vs inset), thickness, radius (if any).
- aitom_family/layout_divider_block/layout/spacing.md – margins above/below divider and breakpoint adjustments.

Implementation notes:
- Define tokens for stroke thickness, inset margins per breakpoint, optional dashed/dotted style spacing, and alignment to 24-column grid.
- If a label slot exists, specify its placement and padding without breaking line continuity.

STATUS: DONE

### ATOM: heading_block
dimension: layout

Target folder:
- aitom_family/heading_block/layout/

Required files:
- aitom_family/heading_block/layout/structure.md – alignment, max-width, spacing.
- aitom_family/heading_block/layout/spacing.md – margins above/below and within sections.

Implementation notes:
- Define tokens for alignment (left/center/right), max_width (fraction/px), spacing above/below, optional underline inset; ensure alignment to 24-column spans.
- Include mobile/tablet/desktop variants for alignment/max_width if needed.

STATUS: DONE

### ATOM: rich_text_block
dimension: layout

Target folder:
- aitom_family/rich_text_block/layout/

Required files:
- aitom_family/rich_text_block/layout/structure.md – max-width, alignment, padding (if any).
- aitom_family/rich_text_block/layout/spacing.md – paragraph gap and margins.

Implementation notes:
- Tokens for max_width, alignment, spacing above/below, paragraph gap; respect 24-column container; allow compact/comfortable density adjustments.
- Lists should align with text block; avoid fixed pixel widths.

STATUS: DONE

### ATOM: button_single
dimension: layout

Target folder:
- aitom_family/button_single/layout/

Required files:
- aitom_family/button_single/layout/structure.md – padding, radius, min width, icon spacing.
- aitom_family/button_single/layout/responsive.md – full-width on mobile toggle.

Implementation notes:
- Tokens for padding X/Y, radius, stroke placement, icon gaps, min width, full-width toggle on mobile; align vertically centered label.
- Respect 24-column spans via parent; no hardcoded widths beyond tokens.

STATUS: DONE

### ATOM: button_group
dimension: layout

Target folder:
- aitom_family/button_group/layout/

Required files:
- aitom_family/button_group/layout/structure.md – orientation, gap, alignment.
- aitom_family/button_group/layout/responsive.md – stacking behaviour on mobile.

Implementation notes:
- Tokens for gap between buttons, orientation per breakpoint, alignment, shared padding/radius via button_single; stacking rules on small screens.
- Ensure group fits within 24-column container; no extra margins beyond tokens.

STATUS: DONE

### ATOM: image_media_block
dimension: layout

Target folder:
- aitom_family/image_media_block/layout/

Required files:
- aitom_family/image_media_block/layout/frame.md – aspect ratios, radius, stroke, padding/inset.
- aitom_family/image_media_block/layout/caption.md – caption placement and spacing.

Implementation notes:
- Tokens for aspect ratio options, object-fit, radius, stroke placement, padding inset, alignment within 24-column span; caption spacing below/overlay placement.
- Include mobile/desktop behaviour for aspect ratio and padding if needed.

STATUS: DONE

### ATOM: video_media_block
dimension: layout

Target folder:
- aitom_family/video_media_block/layout/

Required files:
- aitom_family/video_media_block/layout/frame.md – aspect ratio, radius, stroke, padding.
- aitom_family/video_media_block/layout/overlays.md – play icon/control bar positioning.

Implementation notes:
- Tokens for aspect ratio, radius, stroke, padding, play icon position, control bar inset; ensure fits 24-column spans.
- Provide responsive adjustments for small screens; keep overlays inside frame without clipping.

STATUS: DONE

### ATOM: accordion_item
dimension: layout

Target folder:
- aitom_family/accordion_item/layout/

Required files:
- aitom_family/accordion_item/layout/structure.md – header/body padding, divider placement, radius.
- aitom_family/accordion_item/layout/spacing.md – spacing between items and internal gaps.

Implementation notes:
- Tokens for header padding, body padding, gap between header and body, divider inset, radius; spacing above/below the item.
- Ensure expanded body doesn’t break 24-column alignment; handle mobile adjustments.

STATUS: DONE

### ATOM: section_hero_banner
dimension: layout

Target folder:
- aitom_family/section_hero_banner/layout/

Required files:
- aitom_family/section_hero_banner/layout/structure.md – media container, overlay, content block positioning.
- aitom_family/section_hero_banner/layout/spacing.md – padding top/bottom, gaps between heading/body/CTA.
- aitom_family/section_hero_banner/layout/responsive.md – stacking/alignment rules per breakpoint.

Implementation notes:
- Define aspect ratio tokens for background media, padding tokens, content max-width and alignment (left/center), spacing between text and CTAs; full-bleed toggle while retaining 24-column internal alignment.
- Mobile: stack content and buttons; adjust padding; ensure overlays don’t clip focus ring.

STATUS: DONE

### ATOM: section_rich_text
dimension: layout

Target folder:
- aitom_family/section_rich_text/layout/

Required files:
- aitom_family/section_rich_text/layout/structure.md – max-width, alignment within 24-column grid.
- aitom_family/section_rich_text/layout/spacing.md – vertical padding and gaps between heading/body/CTA.

Implementation notes:
- Tokens for max-width, alignment, padding top/bottom, spacing between elements; mobile adjustments for padding/line length; no hardcoded widths.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: layout

Target folder:
- aitom_family/section_multicolumn_features/layout/

Required files:
- aitom_family/section_multicolumn_features/layout/grid.md – column count/spans per breakpoint using layout_columns_grid.
- aitom_family/section_multicolumn_features/layout/spacing.md – gaps, padding, and optional divider placement.

Implementation notes:
- Define tokens for column counts (desktop/tablet/mobile), gaps (row/column), padding, alignment; reference layout_columns_grid spans.
- Optional column dividers inset; ensure equal-height option is tokenized; mobile stacking rules included.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: layout

Target folder:
- aitom_family/section_featured_collection_grid/layout/

Required files:
- aitom_family/section_featured_collection_grid/layout/grid.md – product grid columns/gaps per breakpoint.
- aitom_family/section_featured_collection_grid/layout/structure.md – section padding, heading/CTA alignment.
- aitom_family/section_featured_collection_grid/layout/states.md – loading/empty placeholders.

Implementation notes:
- Tokens for columns (desktop/tablet/mobile), gutter/row gaps, item_limit layout, padding top/bottom, heading/body/CTA alignment; loading skeleton layout; empty state spacing.
- Ensure cards align to 24-column grid; full-bleed optional.

STATUS: DONE

### ATOM: section_collection_list
dimension: layout

Target folder:
- aitom_family/section_collection_list/layout/

Required files:
- aitom_family/section_collection_list/layout/grid.md – collection card columns/gaps per breakpoint.
- aitom_family/section_collection_list/layout/structure.md – section padding, header alignment, optional list view.

Implementation notes:
- Tokens for columns, gaps, padding, header/body spacing, card aspect ratio/radius, optional list vs grid toggle; mobile stacking rules.
- Keep alignment to 24-column grid; ensure “view all” CTA placement defined.

STATUS: DONE

### ATOM: section_media_collage
dimension: layout

Target folder:
- aitom_family/section_media_collage/layout/

Required files:
- aitom_family/section_media_collage/layout/patterns.md – tile patterns and spans per breakpoint.
- aitom_family/section_media_collage/layout/spacing.md – gaps/padding between tiles and section padding.

Implementation notes:
- Define tokenized patterns (e.g., large tile span with supporting tiles), tile spans/offsets per breakpoint, gaps (row/column), section padding; ensure 24-column alignment.
- Include radius/stroke placement for tiles; mobile stacking rules to keep readability.

STATUS: DONE

### ATOM: section_image_with_text
dimension: layout

Target folder:
- aitom_family/section_image_with_text/layout/

Required files:
- aitom_family/section_image_with_text/layout/structure.md – media/text spans per breakpoint, swap-side behaviour.
- aitom_family/section_image_with_text/layout/spacing.md – padding and gap between media and text.

Implementation notes:
- Tokens for media span vs text span per breakpoint, swap token, gap between media/text, padding top/bottom, media aspect/radius, text max-width; stack on mobile.
- Keep alignment to 24-column grid and logical reading order.

STATUS: DONE

### ATOM: section_slideshow
dimension: layout

Target folder:
- aitom_family/section_slideshow/layout/

Required files:
- aitom_family/section_slideshow/layout/frame.md – container width, padding, media aspect.
- aitom_family/section_slideshow/layout/controls.md – arrow/dot placement and spacing.

Implementation notes:
- Define tokens for container width (full/contained), padding top/bottom, content max-width, media aspect ratio; control placement/margins relative to 24-column grid.
- Account for mobile stacking and safe areas; avoid layout shift during transitions.

STATUS: DONE

### ATOM: section_blog_posts
dimension: layout

Target folder:
- aitom_family/section_blog_posts/layout/

Required files:
- aitom_family/section_blog_posts/layout/grid.md – post grid columns/gaps per breakpoint.
- aitom_family/section_blog_posts/layout/structure.md – section padding, heading/CTA alignment.
- aitom_family/section_blog_posts/layout/states.md – loading/empty layouts.

Implementation notes:
- Tokens for columns, gutters/row gaps, item_limit layout, padding, header/body/CTA alignment; loading skeleton layout; empty state spacing.
- Ensure cards align to 24-column grid; mobile stacking; optional full-bleed token if needed.

STATUS: DONE

### ATOM: section_email_signup
dimension: layout

Target folder:
- aitom_family/section_email_signup/layout/

Required files:
- aitom_family/section_email_signup/layout/form.md – input/button alignment and spacing.
- aitom_family/section_email_signup/layout/responsive.md – stacking rules on mobile.

Implementation notes:
- Define tokens for form max-width, alignment, gap between input/button, padding top/bottom, spacing for helper/error text; stack input/button on mobile; radius/stroke inheritance.
- Keep within 24-column grid; no hardcoded widths beyond tokens.

STATUS: DONE

### ATOM: section_custom_markup
dimension: layout

Target folder:
- aitom_family/section_custom_markup/layout/

Required files:
- aitom_family/section_custom_markup/layout/structure.md – padding, max-width, full-bleed toggle.

Implementation notes:
- Tokens for padding, max-width, full-bleed option, optional stroke; ensure internal content aligns to 24-column grid when constrained.
- Note that injected content handles its own internal layout; wrapper is minimal.

STATUS: DONE

### ATOM: product_media_gallery
dimension: layout

Target folder:
- aitom_family/product_media_gallery/layout/

Required files:
- aitom_family/product_media_gallery/layout/structure.md – main media + thumbnail rail layout (vertical/horizontal).
- aitom_family/product_media_gallery/layout/spacing.md – gaps/padding between media and thumbs; radius/stroke placement.
- aitom_family/product_media_gallery/layout/responsive.md – orientation/placement per breakpoint, swipe behaviour notes.

Implementation notes:
- Tokens for aspect ratio of main media, thumb size/spacing, orientation (vertical/horizontal), gap between main and thumbs, padding, radius/stroke; mobile stacking rules with horizontal thumb carousel.
- Ensure zoom/lightbox overlay does not shift layout; align to 24-column grid.

STATUS: DONE

### ATOM: product_info_stack
dimension: layout

Target folder:
- aitom_family/product_info_stack/layout/

Required files:
- aitom_family/product_info_stack/layout/stack.md – spacing between child blocks, padding, alignment.
- aitom_family/product_info_stack/layout/sticky.md – optional sticky offset tokens.

Implementation notes:
- Define tokens for vertical spacing between sub-blocks, container padding, alignment, optional dividers; sticky offset tokens if used; maintain 24-column alignment.

STATUS: DONE

### ATOM: product_title_block
dimension: layout

Target folder:
- aitom_family/product_title_block/layout/

Required files:
- aitom_family/product_title_block/layout/structure.md – alignment, max-width, spacing above/below.

Implementation notes:
- Tokens for alignment, max_width, spacing to adjacent blocks, optional underline inset; ensure 24-column alignment; mobile adjustments if needed.

STATUS: DONE

### ATOM: product_price_block
dimension: layout

Target folder:
- aitom_family/product_price_block/layout/

Required files:
- aitom_family/product_price_block/layout/structure.md – inline/stacked layout options.
- aitom_family/product_price_block/layout/spacing.md – gaps between price/compare/badges.

Implementation notes:
- Tokens for layout mode (inline/stacked), gap between price components and badges, spacing to neighbouring blocks; alignment tokens; ensure responsive wrapping without overlap.

STATUS: DONE

### ATOM: product_variant_picker
dimension: layout

Target folder:
- aitom_family/product_variant_picker/layout/

Required files:
- aitom_family/product_variant_picker/layout/structure.md – option group layout; dropdown vs swatch/button arrangements.
- aitom_family/product_variant_picker/layout/spacing.md – gaps between labels/options and between option values.

Implementation notes:
- Tokens for option group spacing, label alignment, control width, swatch size/gap/radius, dropdown padding/radius; responsive adjustments for mobile stacking.
- Align with 24-column grid; avoid overflow when many options.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: layout

Target folder:
- aitom_family/product_buy_buttons_block/layout/

Required files:
- aitom_family/product_buy_buttons_block/layout/structure.md – button arrangement, gap, padding.
- aitom_family/product_buy_buttons_block/layout/sticky.md – sticky offset/safe-area handling.

Implementation notes:
- Tokens for gap between buttons, alignment, padding, optional full-width on mobile, stacking rules; sticky offset and width constraints; align with 24-column grid.

STATUS: DONE

### ATOM: product_description_block
dimension: layout

Target folder:
- aitom_family/product_description_block/layout/

Required files:
- aitom_family/product_description_block/layout/structure.md – max-width, alignment.
- aitom_family/product_description_block/layout/spacing.md – spacing above/below and paragraph gaps (ref rich_text_block).

Implementation notes:
- Tokens for max_width, alignment, spacing to neighbours, paragraph gaps; mobile adjustments; 24-column alignment.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: layout

Target folder:
- aitom_family/product_collapsible_section/layout/

Required files:
- aitom_family/product_collapsible_section/layout/structure.md – header/body padding, radius, divider placement.
- aitom_family/product_collapsible_section/layout/spacing.md – spacing between items/sections.

Implementation notes:
- Tokens for header/body padding, radius, divider inset, spacing above/below each item, gap between header and body; stack behaviour on mobile; align to 24-column grid.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: layout

Target folder:
- aitom_family/product_recommendations_section/layout/

Required files:
- aitom_family/product_recommendations_section/layout/grid.md – columns/gaps per breakpoint.
- aitom_family/product_recommendations_section/layout/structure.md – padding, header alignment, CTA placement.
- aitom_family/product_recommendations_section/layout/states.md – loading/empty layout.

Implementation notes:
- Tokens for columns, gutters/row gaps, item_limit layout, padding top/bottom, alignment for heading/body/CTA; loading skeleton and empty state spacing; 24-column alignment; optional full-bleed.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: layout

Target folder:
- aitom_family/wireframe_canvas/layout/

Required files:
- aitom_family/wireframe_canvas/layout/grid_system.md – base unit definition (e.g., 24px), major/minor lines.
- aitom_family/wireframe_canvas/layout/layering.md – z-index rules for canvas, overlay, and toolbar layers.

Implementation notes:
- Defines the 24-column grid visually for the canvas content.
- Bounds management: does canvas grow efficiently? infinite vs logical page size.
- Z-index: Canvas < Elements < SelectionOverlay < UIControls < Toolbar.

STATUS: DONE

### ATOM: blackboard
dimension: layout

Target folder:
- aitom_family/blackboard/layout/

Required files:
- aitom_family/blackboard/layout/coords.md – if infinite, how (x,y) maps to screen; if fixed, fill viewport.

Implementation notes:
- Usually `position: fixed; inset: 0;`.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: layout

Target folder:
- aitom_family/theme_layout_settings/layout/

Required files:
- aitom_family/theme_layout_settings/layout/grid.md – DEFINES the 24-column grid, gutters, margins.
- aitom_family/theme_layout_settings/layout/spacing.md – Defines semantic spacing tokens (space_xs, space_md, etc.).

Implementation notes:
- THE SOURCE OF TRUTH for layout.
- Must align with bossman/24-grid.md.
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: layout

Target folder:
- aitom_family/theme_colour_schemes/layout/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: layout

Target folder:
- aitom_family/theme_typography_settings/layout/

Required files:
- None.

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: layout

Target folder:
- aitom_family/theme_card_surface/layout/

Required files:
- aitom_family/theme_card_surface/layout/box_model.md – padding, border-radius tokens.

Implementation notes:
- Defines internal spacing of cards.
- Status: DONE
- Implemented: aitom_family/theme_card_surface/layout/* according to this plan.

STATUS: DONE

### ATOM: accordion_item
dimension: layout

Target folder:
- aitom_family/accordion_item/layout/

Required files:
- aitom_family/accordion_item/layout/spacing.md – internal padding/gap.

Implementation notes:
- padding_sm, gap_xs.
- Status: ACTIVE

### ATOM: button_group
dimension: layout

Target folder:
- aitom_family/button_group/layout/

Required files:
- aitom_family/button_group/layout/gap.md – gap between buttons.

Implementation notes:
- gap_sm (or responsive).
- Status: ACTIVE

### ATOM: button_single
dimension: layout

Target folder:
- aitom_family/button_single/layout/

Required files:
- aitom_family/button_single/layout/dimensions.md – min-height, padding, radius.

Implementation notes:
- padding_x_md, padding_y_sm, radius_pill.
- Status: ACTIVE

### ATOM: heading_block
dimension: layout

Target folder:
- aitom_family/heading_block/layout/

Required files:
- aitom_family/heading_block/layout/margins.md – top/bottom margins.

Implementation notes:
- margin_bottom_sm.
- Status: ACTIVE

### ATOM: rich_text_block
dimension: layout

Target folder:
- aitom_family/rich_text_block/layout/

Required files:
- aitom_family/rich_text_block/layout/measure.md – max-width for readability.

Implementation notes:
- max_width_prose.
- Status: ACTIVE

### ATOM: image_media_block
dimension: layout

Target folder:
- aitom_family/image_media_block/layout/

Required files:
- aitom_family/image_media_block/layout/aspect_ratio.md – ratio enforcement.

Implementation notes:
- ratio_16_9, ratio_4_3, etc.
- Status: ACTIVE

### ATOM: video_media_block
dimension: layout

Target folder:
- aitom_family/video_media_block/layout/

Required files:
- aitom_family/video_media_block/layout/aspect_ratio.md – ratio enforcement.

Implementation notes:
- ratio_16_9 default.
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: layout

Target folder:
- aitom_family/layout_columns_grid/layout/

Required files:
- aitom_family/layout_columns_grid/layout/grid.md – column spans and gaps.
- aitom_family/layout_columns_grid/layout/gutter.md – gutter width.

Implementation notes:
- grid_gap_md.
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: layout

Target folder:
- aitom_family/layout_divider_block/layout/

Required files:
- aitom_family/layout_divider_block/layout/spacing.md – vertical margin.

Implementation notes:
- margin_y_md.
- Status: ACTIVE

### ATOM: layout_group_container
dimension: layout

Target folder:
- aitom_family/layout_group_container/layout/

Required files:
- aitom_family/layout_group_container/layout/padding.md – container padding.

Implementation notes:
- padding_md.
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: layout

Target folder:
- aitom_family/layout_spacer_block/layout/

Required files:
- aitom_family/layout_spacer_block/layout/height.md – Spacer height tokens.

Implementation notes:
- space_sm, space_md, space_lg, space_xl.
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: layout

Target folder:
- aitom_family/floating_pill_toolbar/layout/

Required files:
- aitom_family/floating_pill_toolbar/layout/position.md – fixed positioning (z-index, bottom offsets).

Implementation notes:
- z_index_overlay.
- Status: ACTIVE

### ATOM: maybes_note
dimension: layout

Target folder:
- aitom_family/maybes_note/layout/

Required files:
- aitom_family/maybes_note/layout/dimensions.md – default width/height on canvas.

Implementation notes:
- width_card_sm.
- Status: DONE
- Implemented: aitom_family/maybes_note/layout/* according to this plan.

STATUS: DONE

### ATOM: chat_card_v1
dimension: layout

Target folder:
- aitom_family/chat_card_v1/layout/

Required files:
- aitom_family/chat_card_v1/layout/dimensions.md – width/height/padding.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: layout

Target folder:
- aitom_family/chat_rail_shell/layout/

Required files:
- aitom_family/chat_rail_shell/layout/grid.md – column span usage.
- aitom_family/chat_rail_shell/layout/width.md – fixed vs fluid width.

Implementation notes:
- min-width-rail, max-width-rail.
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: layout

Target folder:
- aitom_family/chat_rail_header_bar/layout/

Required files:
- aitom_family/chat_rail_header_bar/layout/height.md – fixed height container.

Implementation notes:
- height_header_sm.
- Status: ACTIVE

### ATOM: chat_message_list
dimension: layout

Target folder:
- aitom_family/chat_message_list/layout/

Required files:
- aitom_family/chat_message_list/layout/padding.md – internal padding.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: layout

Target folder:
- aitom_family/chat_message_block/layout/

Required files:
- aitom_family/chat_message_block/layout/spacing.md – margin-bottom.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: layout

Target folder:
- aitom_family/chat_message_action_bar/layout/

Required files:
- aitom_family/chat_message_action_bar/layout/position.md – absolute vs relative position.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: layout

Target folder:
- aitom_family/chat_safety_controls_bar/layout/

Required files:
- aitom_family/chat_safety_controls_bar/layout/spacing.md – padding/margin.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: layout

Target folder:
- aitom_family/bottom_chat_input_bar/layout/

Required files:
- aitom_family/bottom_chat_input_bar/layout/position.md – sticky bottom.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: layout

Target folder:
- aitom_family/chat_shortcuts_popover/layout/

Required files:
- aitom_family/chat_shortcuts_popover/layout/popover.md – max-height, overflow-y.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: layout

Target folder:
- aitom_family/chat_upload_source_picker/layout/

Required files:
- aitom_family/chat_upload_source_picker/layout/grid.md – icon grid layout.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: layout

Target folder:
- aitom_family/chat_icon_band_popover/layout/

Required files:
- aitom_family/chat_icon_band_popover/layout/grid.md – icon strip layout.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: layout

Target folder:
- aitom_family/surface_header_nano/layout/

Required files:
- aitom_family/surface_header_nano/layout/height.md – height_header_xs.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: layout

Target folder:
- aitom_family/surface_header_shell_micro/layout/

Required files:
- aitom_family/surface_header_shell_micro/layout/height.md – height_header_sm.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: layout

Target folder:
- aitom_family/surface_header_shell_standard/layout/

Required files:
- aitom_family/surface_header_shell_standard/layout/height.md – height_header_md.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: layout

Target folder:
- aitom_family/surface_logo_centerpiece/layout/

Required files:
- aitom_family/surface_logo_centerpiece/layout/size.md – responsive scaling.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: layout

Target folder:
- aitom_family/app_header_appname_dropdown/layout/

Required files:
- aitom_family/app_header_appname_dropdown/layout/spacing.md – padding.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: layout

Target folder:
- aitom_family/macro_temp_indicator/layout/

Required files:
- aitom_family/macro_temp_indicator/layout/size.md – fixed width/height.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: layout

Target folder:
- aitom_family/main_menu_icon_button/layout/

Required files:
- None.

Implementation notes:
- Status: DONE
- Implemented: aitom_family/main_menu_icon_button/layout/* according to this plan (No files required).

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: layout

Target folder:
- aitom_family/product_buy_buttons_block/layout/

Required files:
- aitom_family/product_buy_buttons_block/layout/width.md – full width vs auto.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: layout

Target folder:
- aitom_family/product_collapsible_section/layout/

Required files:
- aitom_family/product_collapsible_section/layout/padding.md – internal content padding.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: layout

Target folder:
- aitom_family/product_description_block/layout/

Required files:
- aitom_family/product_description_block/layout/spacing.md – margin-bottom.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: layout

Target folder:
- aitom_family/product_info_stack/layout/

Required files:
- aitom_family/product_info_stack/layout/gap.md – vertical rhythm.

Implementation notes:
- gap_md.
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: layout

Target folder:
- aitom_family/product_media_gallery/layout/

Required files:
- aitom_family/product_media_gallery/layout/grid.md – thumbnail layout.
- aitom_family/product_media_gallery/layout/main.md – hero image constraints.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: layout

Target folder:
- aitom_family/product_price_block/layout/

Required files:
- aitom_family/product_price_block/layout/inline.md – flex alignment.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: layout

Target folder:
- aitom_family/product_recommendations_section/layout/

Required files:
- aitom_family/product_recommendations_section/layout/grid.md – card grid.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: layout

Target folder:
- aitom_family/product_title_block/layout/

Required files:
- aitom_family/product_title_block/layout/spacing.md – margin-bottom.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: layout

Target folder:
- aitom_family/product_variant_picker/layout/

Required files:
- aitom_family/product_variant_picker/layout/wrap.md – swatch wrapping.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: layout

Target folder:
- aitom_family/section_blog_posts/layout/

Required files:
- aitom_family/section_blog_posts/layout/grid.md – post grid spacing.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: layout

Target folder:
- aitom_family/section_collection_list/layout/

Required files:
- aitom_family/section_collection_list/layout/grid.md – collection card grid.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: layout

Target folder:
- aitom_family/section_custom_markup/layout/

Required files:
- aitom_family/section_custom_markup/layout/container.md – width constraint.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: layout

Target folder:
- aitom_family/section_email_signup/layout/

Required files:
- aitom_family/section_email_signup/layout/align.md – center vs left align.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: layout

Target folder:
- aitom_family/section_featured_collection_grid/layout/

Required files:
- aitom_family/section_featured_collection_grid/layout/grid.md – product card grid.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: layout

Target folder:
- aitom_family/section_hero_banner/layout/

Required files:
- aitom_family/section_hero_banner/layout/height.md – min-height / aspect ratio.

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: layout

Target folder:
- aitom_family/section_image_with_text/layout/

Required files:
- aitom_family/section_image_with_text/layout/split.md – 50/50 split or 60/40.

Implementation notes:
- grid_span_6 (text), grid_span_6 (image) on desktop (12-col mindset mapped to 24).
- Status: ACTIVE

### ATOM: section_media_collage
dimension: layout

Target folder:
- aitom_family/section_media_collage/layout/

Required files:
- aitom_family/section_media_collage/layout/mosaic.md – complex grid spans.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: layout

Target folder:
- aitom_family/section_multicolumn_features/layout/

Required files:
- aitom_family/section_multicolumn_features/layout/grid.md – 3-4 column features.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: layout

Target folder:
- aitom_family/section_rich_text/layout/

Required files:
- aitom_family/section_rich_text/layout/width.md – narrower read width.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: layout

Target folder:
- aitom_family/section_slideshow/layout/

Required files:
- aitom_family/section_slideshow/layout/ratio.md – slide aspect ratio.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: layout

Target folder:
- aitom_family/lanes_calendar_grid_v1/layout/

Required files:
- aitom_family/lanes_calendar_grid_v1/layout/grid.md – 7-column calendar grid.
- aitom_family/lanes_calendar_grid_v1/layout/cell.md – min-height for cells.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: layout

Target folder:
- aitom_family/multi_feed_tile/layout/

Required files:
- aitom_family/multi_feed_tile/layout/tile.md – aspect ratio or flexible height.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
