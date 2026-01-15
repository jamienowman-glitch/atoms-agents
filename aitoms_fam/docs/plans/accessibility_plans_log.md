## atom: lanes_calendar_grid_v1
dimension: accessibility
target_folder: aitom_family/lanes_calendar_grid_v1/accessibility/
tasks:
- Ensure grid navigation via keyboard (arrow keys). Semantic roles (grid, row, gridcell). Aria labels for cells (e.g., "Monday, YouTube, Planned"). Ensure sufficient contrast for text and borders.
STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: accessibility

Target folder:
- aitom_family/floating_pill_toolbar/accessibility/

Required files:
- aitom_family/floating_pill_toolbar/accessibility/semantics.md – roles/aria for launcher and expanded toolbar.
- aitom_family/floating_pill_toolbar/accessibility/keyboard.md – keyboard/assistive interactions for drag, toggle, gather.
- aitom_family/floating_pill_toolbar/accessibility/motion.md – reduced-motion handling for expand/drag/gather.

Implementation notes:
- Collapsed launcher behaves as button with `aria-expanded`; expanded toolbar is a toolbar/menubar with tool buttons labelled via aria-label; ensure focus order across tools.
- Keyboard drag equivalent: arrow keys to move along snap grid with confirmation key; ensure chat rail exclusion still applies.
- Long-press gather: provide status text for screen readers (live region) when gather triggers/completes; respect reduced-motion by skipping animations and announcing state.
- Focus ring tokens must stay visible on black base; ensure draggable element is keyboard reachable and not trapped.

STATUS: DONE

### ATOM: maybes_note
dimension: accessibility

Target folder:
- aitom_family/maybes_note/accessibility/

Required files:
- aitom_family/maybes_note/accessibility/labels.md – labelling for title/body inputs and badges.
- aitom_family/maybes_note/accessibility/interaction.md – keyboard focus for edit/drag/pin/archive, and reduced motion for canvas actions.

Implementation notes:
- Ensure title/body editable areas have labels; pin/archive badges not colour-only; announce archived state.
- Keyboard: tab into title/body; drag handles (if exposed) operable via keyboard or alternative controls; focus ring visible; reduced motion removes animated drags/scales but preserves state updates.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: accessibility

Target folder:
- aitom_family/chat_rail_header_bar/accessibility/

Required files:
- aitom_family/chat_rail_header_bar/accessibility/roles_labels.md – toolbar semantics and icon ARIA labels.
- aitom_family/chat_rail_header_bar/accessibility/keyboard.md – keyboard activation and focus order.

Implementation notes:
- Header remains focusable in all states; icon labels: minimise/expand/tools/settings; Enter/Space activates; focus ring visible on dark base; label contributes to region label.

STATUS: DONE

### ATOM: chat_message_list
dimension: accessibility

Target folder:
- aitom_family/chat_message_list/accessibility/

Required files:
- aitom_family/chat_message_list/accessibility/live_region.md – live region settings for new messages.
- aitom_family/chat_message_list/accessibility/keyboard.md – scroll/focus guidance.

Implementation notes:
- Polite live region; avoid forcing focus on new messages; keyboard scroll via container; no horizontal scroll; announce new messages through message blocks.

STATUS: DONE

### ATOM: chat_message_block
dimension: accessibility

Target folder:
- aitom_family/chat_message_block/accessibility/

Required files:
- aitom_family/chat_message_block/accessibility/semantics.md – labeling of author and body, role tags.
- aitom_family/chat_message_block/accessibility/focus.md – focus behaviour when action bar present.

Implementation notes:
- Announce author + body; role tag included; focus not required unless action bar interaction; if focusable, ensure tab order before action bar.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: accessibility

Target folder:
- aitom_family/chat_message_action_bar/accessibility/

Required files:
- aitom_family/chat_message_action_bar/accessibility/aria.md – labels for each action.
- aitom_family/chat_message_action_bar/accessibility/keyboard.md – focus and activation rules.

Implementation notes:
- Toolbar role; buttons labelled (“Save message”, etc.); Enter/Space activates; focus ring visible; maintain tab order left-to-right.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: accessibility

Target folder:
- aitom_family/chat_safety_controls_bar/accessibility/

Required files:
- aitom_family/chat_safety_controls_bar/accessibility/aria.md – control labels and states.
- aitom_family/chat_safety_controls_bar/accessibility/keyboard.md – navigation and activation.

Implementation notes:
- Toolbar role with labelled buttons (“Safety review mode” etc.); arrow key navigation; Enter/Space toggles; focus ring tokens.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: accessibility

Target folder:
- aitom_family/bottom_chat_input_bar/accessibility/

Required files:
- aitom_family/bottom_chat_input_bar/accessibility/labels.md – aria labels for input, upload, send, shortcuts.
- aitom_family/bottom_chat_input_bar/accessibility/keyboard.md – tab order and Enter vs Shift+Enter behaviour.

Implementation notes:
- Tab order upload → text → send; input labeled (“Chat message input”); upload/send/shortcut buttons labelled; Enter sends unless Shift held; focus ring visible; maintain accessibility when keyboard open.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: accessibility

Target folder:
- aitom_family/chat_shortcuts_popover/accessibility/

Required files:
- aitom_family/chat_shortcuts_popover/accessibility/roles.md – menu semantics and focus return.
- aitom_family/chat_shortcuts_popover/accessibility/keyboard.md – navigation between tokens and insertion.

Implementation notes:
- Role menu with menuitems; arrow navigation; Enter inserts; escape/outside click closes; returns focus to input; announce opening/closing politely.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: accessibility

Target folder:
- aitom_family/chat_upload_source_picker/accessibility/

Required files:
- aitom_family/chat_upload_source_picker/accessibility/roles.md – popover labelling and option semantics.
- aitom_family/chat_upload_source_picker/accessibility/keyboard.md – option navigation and selection.

Implementation notes:
- Role listbox/menu with options; labelled (“Choose upload source”); arrow navigation; Enter selects; focus returns to trigger; ensure focus ring visible.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: accessibility

Target folder:
- aitom_family/chat_icon_band_popover/accessibility/

Required files:
- aitom_family/chat_icon_band_popover/accessibility/toolbar.md – toolbar semantics and labels.
- aitom_family/chat_icon_band_popover/accessibility/keyboard.md – horizontal navigation and activation.

Implementation notes:
- Role toolbar; buttons labelled per tool/setting; arrow navigation; Enter/Space activates; focus ring visible; band announce when shown/hidden.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: accessibility

Target folder:
- aitom_family/chat_rail_shell/accessibility/

Required files:
- aitom_family/chat_rail_shell/accessibility/semantics.md – landmark/region roles and labels per state.
- aitom_family/chat_rail_shell/accessibility/keyboard.md – tab order, keyboard controls for minimise/expand/bands, undocked move.
- aitom_family/chat_rail_shell/accessibility/motion.md – reduced-motion behaviour for state changes and scrolling.

Implementation notes:
- Treat rail as labelled region/landmark; announce state changes (“Chat expanded to full”); nano preview exposes latest message snippet.
- Tab order: minimise → tools → settings → expand; ensure focusable in all states; header persists.
- Keyboard move for undocked state (arrow keys) respects bounds; ensure input and send remain reachable; reduce motion removes animated transitions but keeps functionality.

STATUS: DONE

### ATOM: chat_card_v1
dimension: accessibility

Target folder:
- aitom_family/chat_card_v1/accessibility/

Required files:
- aitom_family/chat_card_v1/accessibility/roles_labels.md – define ARIA roles, aria-pressed/selected usage, and aria-label patterns.
- aitom_family/chat_card_v1/accessibility/keyboard.md – describe keyboard navigation order, focus styles, and activation keys.
- aitom_family/chat_card_v1/accessibility/descriptions.md – guidance for avatar alt text (single vs group) and unread state announcements.

Implementation notes:
- Recommend role=listitem when inside a list with an interactive button role nested, or role=button with aria-pressed/aria-selected when the list itself is presentational; be explicit about when to use each pattern.
- Define aria-label composition: include name/handle, role label, unread count (if >0), last message preview (truncated), and state (active/muted) while avoiding leaking PII beyond preview.
- Outline keyboard support: Tab/Shift+Tab for focus traversal; Up/Down for list movement when list container manages roving tabindex; Enter/Space to activate/open; Escape cancels press state.
- Provide focus styling rules aligned with colours/layout tokens (visible ring outside stroke without clipping the pill radius); ensure hover-only cues are mirrored for keyboard focus.
- Describe how to announce group avatars, e.g., “Group chat with 5 participants” plus lead names when available; specify handling for missing avatars.
- Note requirements for colour contrast and minimum touch target sizes; include guidance for reducing motion on prefers-reduced-motion.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: accessibility
Target folder:
- aitom_family/wireframe_canvas/accessibility/

Tasks:
- Assign role for canvas region (application/region) with descriptive labels; make controls (snap toggle, reset) keyboard focusable.
- Define keyboard navigation for moving selected elements (arrow keys for nudge with snap; modifiers for larger steps) and announce position changes via ARIA live regions.
- Provide focus outlines/high-contrast indicators on dark background; ensure remote updates are announced without stealing focus.

STATUS: DONE

### ATOM: blackboard
Dimension: accessibility
Target folder:
- aitom_family/blackboard/accessibility/

Tasks:
- Assign roles for canvas region (role="application" or "region") with labelled descriptions; ensure controls (snap toggle, reset) are keyboard focusable.
- Define keyboard navigation for moving selected elements (arrow keys for nudge with snap, modifiers for larger steps) and announce position changes via ARIA live regions.
- Provide focus outlines and high-contrast indicators on dark background; ensure remote updates do not steal focus while still being announced.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: accessibility
Target folder:
- aitom_family/multi_feed_tile/accessibility/

Tasks:
- Assign roles/tabindex for tile as button (or link) when clickable, and separate CTA as its own focusable control; ensure disabled state is non-focusable.
- Define keyboard interactions (Enter/Space activate tile, Tab/Shift+Tab navigate CTA separately) and focus outline tokens for dark backgrounds.
- Provide ARIA labeling: alt text for image/video media, descriptive labels for KPI values/changes, and aria-pressed/aria-grabbed when draggable with announcements for drag start/end.

STATUS: DONE

### ATOM: theme_layout_settings
dimension: accessibility

Target folder:
- aitom_family/theme_layout_settings/accessibility/

Required files:
- aitom_family/theme_layout_settings/accessibility/roles_labels.md – roles/labels for any layout controls/previews.
- aitom_family/theme_layout_settings/accessibility/keyboard.md – keyboard handling for layout toggles.

Implementation notes:
- If surfaced as controls (density/full-bleed), use role=button/toggle with aria-pressed; provide labels describing layout effect. Respect focus ring tokens and ensure safe-area visual hints have text equivalents.
- Ensure no animated layout shifts for reduced motion; maintain readable line lengths by default.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: accessibility

Target folder:
- aitom_family/theme_colour_schemes/accessibility/

Required files:
- aitom_family/theme_colour_schemes/accessibility/roles_labels.md – scheme selector roles/labels.
- aitom_family/theme_colour_schemes/accessibility/keyboard.md – navigation/selection rules.

Implementation notes:
- Scheme picker (if any) should be a radiogroup/listbox; label each scheme with name and contrast note; announce selection changes politely.
- Ensure focus outlines visible on dark base; avoid colour-only cues by adding text/selection markers.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: accessibility

Target folder:
- aitom_family/theme_typography_settings/accessibility/

Required files:
- aitom_family/theme_typography_settings/accessibility/roles_labels.md – labels for preset selection controls.
- aitom_family/theme_typography_settings/accessibility/keyboard.md – keyboard interactions for selecting presets.

Implementation notes:
- If presets shown in a list, use listbox/radiogroup semantics with clear labels (e.g., “Heading 1 – 32px”); announce selection changes.
- Ensure focus rings visible on dark base; respect reduced motion; allow larger text user prefs without clipping.

STATUS: DONE

### ATOM: theme_card_surface
dimension: accessibility

Target folder:
- aitom_family/theme_card_surface/accessibility/

Required files:
- aitom_family/theme_card_surface/accessibility/roles_labels.md – guidance for focus rings and state announcements.
- aitom_family/theme_card_surface/accessibility/focus.md – focus ring offsets with stroke/radius.

Implementation notes:
- Surface itself is not interactive unless wrapped; provide guidance for focus ring placement and contrast when parent makes it interactive.
- Ensure hover/focus states have non-colour cues (stroke/focus ring thickness); maintain contrast on dark/light variants.

STATUS: DONE

### ATOM: layout_group_container
dimension: accessibility

Target folder:
- aitom_family/layout_group_container/accessibility/

Required files:
- aitom_family/layout_group_container/accessibility/roles_labels.md – guidance for landmark usage and labeling.
- aitom_family/layout_group_container/accessibility/focus.md – focus ring/outline placement.

Implementation notes:
- If container acts as a landmark/section, provide role=region/section with aria-label guidance; otherwise keep non-focusable.
- Ensure focus outline tokens when container is selectable/editable; avoid colour-only cues.
- Respect reduced motion (no animated padding shifts).

STATUS: DONE

### ATOM: layout_columns_grid
dimension: accessibility

Target folder:
- aitom_family/layout_columns_grid/accessibility/

Required files:
- aitom_family/layout_columns_grid/accessibility/reading_order.md – guidance on DOM order vs visual order.
- aitom_family/layout_columns_grid/accessibility/focus.md – focus/outline rules if grid selectable in edit mode.

Implementation notes:
- Ensure reading order follows DOM; avoid reversing column order for accessibility unless aria-flowto is set (not recommended).
- Grid itself non-focusable unless edit-mode selection is enabled; if so, provide focus ring tokens and aria-label describing column count.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: accessibility

Target folder:
- aitom_family/layout_spacer_block/accessibility/

Required files:
- aitom_family/layout_spacer_block/accessibility/notes.md – aria-hidden guidance.

Implementation notes:
- Spacer should be aria-hidden and not focusable; confirm no semantic impact.

STATUS: DONE

### ATOM: layout_divider_block
dimension: accessibility

Target folder:
- aitom_family/layout_divider_block/accessibility/

Required files:
- aitom_family/layout_divider_block/accessibility/roles_labels.md – when divider is decorative vs labeled.
- aitom_family/layout_divider_block/accessibility/focus.md – focus handling if label is interactive.

Implementation notes:
- Decorative divider: aria-hidden, no role. Labeled divider: provide text and role=separator with aria-orientation="horizontal"; focusable only if label interactive.
- Ensure focus outline tokens visible on dark base; avoid colour-only cues.

STATUS: DONE

### ATOM: heading_block
dimension: accessibility

Target folder:
- aitom_family/heading_block/accessibility/

Required files:
- aitom_family/heading_block/accessibility/semantics.md – heading levels and aria-level overrides.
- aitom_family/heading_block/accessibility/focus.md – focus handling for linked headings.

Implementation notes:
- Use semantic heading tags with aria-level when structure requires; linked headings focusable with visible ring on dark base.
- Provide guidance to avoid headings used purely for style; ensure contrast remains if colour overrides occur.

STATUS: DONE

### ATOM: rich_text_block
dimension: accessibility

Target folder:
- aitom_family/rich_text_block/accessibility/

Required files:
- aitom_family/rich_text_block/accessibility/links.md – link focus/aria guidance.
- aitom_family/rich_text_block/accessibility/structure.md – semantic structure for lists/headings inside.

Implementation notes:
- Ensure links have visible focus styles and aria-labels if text is non-descriptive; lists use proper semantics; respect prefers-reduced-motion for link underlines if animated.
- Maintain contrast on dark base; no tab stops on non-interactive text.

STATUS: DONE

### ATOM: button_single
dimension: accessibility

Target folder:
- aitom_family/button_single/accessibility/

Required files:
- aitom_family/button_single/accessibility/roles_labels.md – aria role/label guidance including icon-only cases.
- aitom_family/button_single/accessibility/keyboard.md – activation keys and focus.

Implementation notes:
- role=button; Enter/Space activate; aria-pressed for toggle use cases; icon-only buttons require aria-label; focus ring outside stroke; ensure disabled not focusable.
- Respect reduced motion (no animated focus/hover requirements).

STATUS: DONE

### ATOM: button_group
dimension: accessibility

Target folder:
- aitom_family/button_group/accessibility/

Required files:
- aitom_family/button_group/accessibility/notes.md – tab order and grouping notes.

Implementation notes:
- Group is presentational; each button handles its accessibility; ensure tab order follows visual order; spacing does not trap focus.

STATUS: DONE

### ATOM: image_media_block
dimension: accessibility

Target folder:
- aitom_family/image_media_block/accessibility/

Required files:
- aitom_family/image_media_block/accessibility/alt_text.md – alt text requirements.
- aitom_family/image_media_block/accessibility/keyboard.md – focus/activation guidance for linked images.

Implementation notes:
- Alt text mandatory; if decorative and not linked, allow aria-hidden. Linked images focusable with visible ring; Enter/Space activates.
- Caption announced if present; ensure overlays don’t hide focus indicator.

STATUS: DONE

### ATOM: video_media_block
dimension: accessibility

Target folder:
- aitom_family/video_media_block/accessibility/

Required files:
- aitom_family/video_media_block/accessibility/media_controls.md – keyboard controls and captions.
- aitom_family/video_media_block/accessibility/focus.md – focus management for embedded player.

Implementation notes:
- Provide title/aria-label, captions/subtitles, keyboard controls for play/pause/seek where applicable; focus ring visible; respect prefers-reduced-motion (autoplay off unless muted/consented).
- Ensure controls reachable via keyboard; announce playback state changes if needed.

STATUS: DONE

### ATOM: accordion_item
dimension: accessibility

Target folder:
- aitom_family/accordion_item/accessibility/

Required files:
- aitom_family/accordion_item/accessibility/semantics.md – aria-expanded/controls usage on header.
- aitom_family/accordion_item/accessibility/keyboard.md – keyboard interactions.

Implementation notes:
- Header is a button with aria-expanded and aria-controls; Enter/Space toggles; focus ring visible. Body region labelled; ensure reduced-motion option for collapse/expand.
- Provide guidance for single vs multi-open mode announcements.

STATUS: DONE

### ATOM: section_hero_banner
dimension: accessibility

Target folder:
- aitom_family/section_hero_banner/accessibility/

Required files:
- aitom_family/section_hero_banner/accessibility/roles_labels.md – aria roles/labels for hero, media, CTAs.
- aitom_family/section_hero_banner/accessibility/keyboard.md – focus order and media controls.

Implementation notes:
- Provide section heading/aria-label; ensure focus order heading → body → CTAs; linked media focusable only if needed.
- Video: title/aria-label, captions/subtitles if available; focus ring visible; respect prefers-reduced-motion for autoplay.

STATUS: DONE

### ATOM: section_rich_text
dimension: accessibility

Target folder:
- aitom_family/section_rich_text/accessibility/

Required files:
- aitom_family/section_rich_text/accessibility/structure.md – heading semantics and rich text structure.
- aitom_family/section_rich_text/accessibility/links.md – link focus/aria.

Implementation notes:
- Use semantic heading and list elements; ensure link focus ring visible on dark base; CTA button accessible with aria-label if icon-only.
- Manage line lengths for readability; respect reduced motion for link effects.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: accessibility

Target folder:
- aitom_family/section_multicolumn_features/accessibility/

Required files:
- aitom_family/section_multicolumn_features/accessibility/roles_labels.md – roles/labels for feature columns/cards.
- aitom_family/section_multicolumn_features/accessibility/keyboard.md – focus handling for CTAs/clickable cards.

Implementation notes:
- Ensure DOM order matches reading order; each column’s CTA focusable; if entire column is clickable, use role=link/button with clear aria-label summarizing feature.
- Provide alt text for icons/images; focus rings via token on dark base.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: accessibility

Target folder:
- aitom_family/section_featured_collection_grid/accessibility/

Required files:
- aitom_family/section_featured_collection_grid/accessibility/roles_labels.md – section heading/labels, card semantics.
- aitom_family/section_featured_collection_grid/accessibility/keyboard.md – focus order, CTA handling.

Implementation notes:
- Section needs heading for navigation; product cards treated as links/buttons with aria-label summarizing product name/status (supplied upstream); ensure focus ring visible; no autoplay content in cards.
- Loading/empty states announced politely if shown.

STATUS: DONE

### ATOM: section_collection_list
dimension: accessibility

Target folder:
- aitom_family/section_collection_list/accessibility/

Required files:
- aitom_family/section_collection_list/accessibility/roles_labels.md – semantics for collection cards and section.
- aitom_family/section_collection_list/accessibility/keyboard.md – focus order and CTA handling.

Implementation notes:
- Provide section heading; collection cards as links/buttons with aria-label summarizing collection; focus ring visible on dark base.
- Grid/list toggle (if present) must be keyboard operable and labelled; loading/empty states announced politely.

STATUS: DONE

### ATOM: section_media_collage
dimension: accessibility

Target folder:
- aitom_family/section_media_collage/accessibility/

Required files:
- aitom_family/section_media_collage/accessibility/roles_labels.md – semantics for tiles and section.
- aitom_family/section_media_collage/accessibility/keyboard.md – focus and activation for tiles.

Implementation notes:
- Section needs heading; interactive tiles get role=link/button with aria-label summarizing media; non-interactive tiles should be aria-hidden.
- Ensure focus rings on overlays; alt text/poster required for media; avoid relying on position-only cues.

STATUS: DONE

### ATOM: section_image_with_text
dimension: accessibility

Target folder:
- aitom_family/section_image_with_text/accessibility/

Required files:
- aitom_family/section_image_with_text/accessibility/roles_labels.md – section/text/media semantics.
- aitom_family/section_image_with_text/accessibility/keyboard.md – focus and activation for media/CTA.

Implementation notes:
- Provide section heading; media alt text; if media linked, ensure focusable with visible ring; CTA button with clear label.
- Swap-side tokens must not break reading order; DOM order should follow logical reading; focus order matches.

STATUS: DONE

### ATOM: section_slideshow
dimension: accessibility

Target folder:
- aitom_family/section_slideshow/accessibility/

Required files:
- aitom_family/section_slideshow/accessibility/roles_labels.md – carousel/region semantics.
- aitom_family/section_slideshow/accessibility/keyboard.md – arrow/dot controls and autoplay handling.

Implementation notes:
- Use appropriate carousel semantics: region with aria-label; slides announced on change; controls keyboard operable (tab to arrows/dots, Enter/Space activate).
- Autoplay must be pausable; respect reduced motion; focus ring visible on controls/CTAs.

STATUS: DONE

### ATOM: section_blog_posts
dimension: accessibility

Target folder:
- aitom_family/section_blog_posts/accessibility/

Required files:
- aitom_family/section_blog_posts/accessibility/roles_labels.md – section and card semantics.
- aitom_family/section_blog_posts/accessibility/keyboard.md – focus order and CTA handling.

Implementation notes:
- Section heading required; cards as links/buttons with aria-label summarizing post title/metadata (passed via data); focus ring visible; loading/empty states announced politely.
- Ensure no autoplay content; respect reduced motion.

STATUS: DONE

### ATOM: section_email_signup
dimension: accessibility

Target folder:
- aitom_family/section_email_signup/accessibility/

Required files:
- aitom_family/section_email_signup/accessibility/form.md – label/aria guidance.
- aitom_family/section_email_signup/accessibility/keyboard.md – input and button focus/activation.

Implementation notes:
- Input must have label; aria-describedby for helper/error; aria-invalid on error; focus ring visible; Enter/Space submits via button; avoid auto-submit.
- Ensure helper/error messaging is announced politely; respect reduced motion.

STATUS: DONE

### ATOM: section_custom_markup
dimension: accessibility

Target folder:
- aitom_family/section_custom_markup/accessibility/

Required files:
- aitom_family/section_custom_markup/accessibility/guidance.md – instructions for markup authors.

Implementation notes:
- Require aria-label/description on the container; advise that injected markup must remain semantic and accessible; container itself should not trap focus unless needed.
- Note that responsibility for alt text/labels lies with provided markup; wrapper only provides structure/padding.

STATUS: DONE

### ATOM: product_media_gallery
dimension: accessibility

Target folder:
- aitom_family/product_media_gallery/accessibility/

Required files:
- aitom_family/product_media_gallery/accessibility/roles_labels.md – semantics for main media and thumbnails.
- aitom_family/product_media_gallery/accessibility/keyboard.md – thumb navigation/activation, zoom/lightbox.

Implementation notes:
- Main media described via alt/poster; thumbnails are buttons with aria-selected; keyboard navigation via arrow keys; Enter/Space activates. Focus ring visible; zoom/lightbox must be keyboard operable and labelled.
- Video follows media accessibility (captions, title/aria-label); respect reduced motion.

STATUS: DONE

### ATOM: product_info_stack
dimension: accessibility

Target folder:
- aitom_family/product_info_stack/accessibility/

Required files:
- aitom_family/product_info_stack/accessibility/structure.md – heading/order guidance.

Implementation notes:
- Ensure logical heading order and focus order via child ordering; container not focusable. Note that sticky behaviour should not trap focus.

STATUS: DONE

### ATOM: product_title_block
dimension: accessibility

Target folder:
- aitom_family/product_title_block/accessibility/

Required files:
- aitom_family/product_title_block/accessibility/semantics.md – heading level/aria-level guidance.
- aitom_family/product_title_block/accessibility/focus.md – focus for linked titles.

Implementation notes:
- Use heading semantics with aria-level if needed; link mode must be focusable with visible ring; avoid using headings for styling only.

STATUS: DONE

### ATOM: product_price_block
dimension: accessibility

Target folder:
- aitom_family/product_price_block/accessibility/

Required files:
- aitom_family/product_price_block/accessibility/announcements.md – price/sale/sold-out labelling.

Implementation notes:
- Provide aria-label/visually hidden text for sale/sold-out; ensure strike-through still readable; no focus unless interactive badges exist.

STATUS: DONE

### ATOM: product_variant_picker
dimension: accessibility

Target folder:
- aitom_family/product_variant_picker/accessibility/

Required files:
- aitom_family/product_variant_picker/accessibility/roles_labels.md – semantics for dropdown/listbox/swatch buttons.
- aitom_family/product_variant_picker/accessibility/keyboard.md – navigation/selection rules.

Implementation notes:
- Dropdown uses native/select or ARIA listbox; swatch/button uses role=radiogroup with aria-checked; arrow keys navigate; Enter/Space select; out-of-stock marked disabled; focus ring visible.
- Provide aria-live updates for selection changes if needed.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: accessibility

Target folder:
- aitom_family/product_buy_buttons_block/accessibility/

Required files:
- aitom_family/product_buy_buttons_block/accessibility/roles_labels.md – buttons semantics.
- aitom_family/product_buy_buttons_block/accessibility/keyboard.md – activation and sticky behaviour notes.

Implementation notes:
- Buttons: role=button; Enter/Space activate; focus ring outside stroke; aria-pressed only if toggle. Sticky mode must not trap focus and should respect safe areas.

STATUS: DONE

### ATOM: product_description_block
dimension: accessibility

Target folder:
- aitom_family/product_description_block/accessibility/

Required files:
- aitom_family/product_description_block/accessibility/structure.md – rich text semantics.
- aitom_family/product_description_block/accessibility/links.md – link focus/aria guidance.

Implementation notes:
- Preserve semantic tags; links have visible focus and descriptive text; if truncation/read-more exists, ensure control is focusable and announces expand/collapse.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: accessibility

Target folder:
- aitom_family/product_collapsible_section/accessibility/

Required files:
- aitom_family/product_collapsible_section/accessibility/semantics.md – aria-expanded/controls on headers.
- aitom_family/product_collapsible_section/accessibility/keyboard.md – toggle keys.

Implementation notes:
- Header buttons with aria-expanded/controls; Enter/Space toggle; focus ring visible; announce open/close politely; reduced motion for animations.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: accessibility

Target folder:
- aitom_family/product_recommendations_section/accessibility/

Required files:
- aitom_family/product_recommendations_section/accessibility/roles_labels.md – section/card semantics.
- aitom_family/product_recommendations_section/accessibility/keyboard.md – focus order/CTA handling.

Implementation notes:
- Section heading required; recommendation cards as links/buttons with aria-label summarizing product; focus ring visible; loading/empty states announced politely.
- Ensure no autoplay; respect reduced motion.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: accessibility

Target folder:
- aitom_family/wireframe_canvas/accessibility/

Required files:
- aitom_family/wireframe_canvas/accessibility/keyboard.md – moving elements/selection with arrow keys.
- aitom_family/wireframe_canvas/accessibility/announcements.md – polite aria-live regions for remote updates.

Implementation notes:
- Canvas is a grid application; use role="application" or "grid" carefully.
- Elements must be focusable (tab index) and navigable.
- Remote changes (someone else moved an object) should be announced politely if relevant to focus.

STATUS: ACTIVE

### ATOM: blackboard
dimension: accessibility

Target folder:
- aitom_family/blackboard/accessibility/

Required files:
- aitom_family/blackboard/accessibility/landmarks.md – role="main" or "application".

Implementation notes:
- Ensures root is properly reachable.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: accessibility

Target folder:
- aitom_family/theme_layout_settings/accessibility/

Required files:
- aitom_family/theme_layout_settings/accessibility/zoom.md – ensures layout handles 200% zoom without breaking (WCAG).

Implementation notes:
- Defines reflow requirements.
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: accessibility

Target folder:
- aitom_family/theme_colour_schemes/accessibility/

Required files:
- aitom_family/theme_colour_schemes/accessibility/contrast.md – enforce WCAG AA/AAA contrast ratios for token pairs.

Implementation notes:
- CRITICAL for base legibility.
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: accessibility

Target folder:
- aitom_family/theme_typography_settings/accessibility/

Required files:
- aitom_family/theme_typography_settings/accessibility/sizing.md – minimum legible sizes.

Implementation notes:
- Don't go below 12px equivalent on mobile.
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: accessibility

Target folder:
- aitom_family/theme_card_surface/accessibility/

Required files:
- aitom_family/theme_card_surface/accessibility/focus.md – ensure card focus ring allows keyboard operation.

Implementation notes:
- Whole-card clickable pattern vs nested buttons.
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: accordion_item
dimension: accessibility

Target folder:
- aitom_family/accordion_item/accessibility/

Required files:
- aitom_family/accordion_item/accessibility/aria.md – aria-expanded, aria-controls.

Implementation notes:
- Header is a button; controls the panel (region).
- Status: ACTIVE

### ATOM: button_group
dimension: accessibility

Target folder:
- aitom_family/button_group/accessibility/

Required files:
- aitom_family/button_group/accessibility/grouping.md – role="group", aria-label.

Implementation notes:
- Describe the purpose of the group if visual context is weak.
- Status: ACTIVE

### ATOM: button_single
dimension: accessibility

Target folder:
- aitom_family/button_single/accessibility/

Required files:
- aitom_family/button_single/accessibility/button.md – role="button", keyboard activation.

Implementation notes:
- Enter/Space triggers click.
- Disabled state must be aria-disabled (allows focus but announces).
- Status: ACTIVE

### ATOM: heading_block
dimension: accessibility

Target folder:
- aitom_family/heading_block/accessibility/

Required files:
- aitom_family/heading_block/accessibility/level.md – aria-level (h1-h6).

Implementation notes:
- Ensure hierarchy integrity.
- Status: ACTIVE

### ATOM: rich_text_block
dimension: accessibility

Target folder:
- aitom_family/rich_text_block/accessibility/

Required files:
- aitom_family/rich_text_block/accessibility/content.md – screen reader structure.

Implementation notes:
- Ensure semantic parsing (lists, emphasis).
- Status: ACTIVE

### ATOM: image_media_block
dimension: accessibility

Target folder:
- aitom_family/image_media_block/accessibility/

Required files:
- aitom_family/image_media_block/accessibility/alt.md – alt text requirements.

Implementation notes:
- Mandatory alt text prop.
- Status: ACTIVE

### ATOM: video_media_block
dimension: accessibility

Target folder:
- aitom_family/video_media_block/accessibility/

Required files:
- aitom_family/video_media_block/accessibility/captions.md – track element support.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: accessibility

Target folder:
- aitom_family/layout_columns_grid/accessibility/

Required files:
- None. (Visual layout).

Implementation notes:
- N/A
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: accessibility

Target folder:
- aitom_family/layout_divider_block/accessibility/

Required files:
- aitom_family/layout_divider_block/accessibility/separator.md – role="separator".

Implementation notes:
- Status: ACTIVE

### ATOM: layout_group_container
dimension: accessibility

Target folder:
- aitom_family/layout_group_container/accessibility/

Required files:
- aitom_family/layout_group_container/accessibility/landmarks.md – optional role="region" + aria-label.

Implementation notes:
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: accessibility

Target folder:
- aitom_family/layout_spacer_block/accessibility/

Required files:
- aitom_family/layout_spacer_block/accessibility/hidden.md – aria-hidden="true".

Implementation notes:
- Spacers are decorative.
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: accessibility

Target folder:
- aitom_family/floating_pill_toolbar/accessibility/

Required files:
- aitom_family/floating_pill_toolbar/accessibility/toolbar.md – role="toolbar", arrow nav.

Implementation notes:
- Manage focus within the toolbar.
- Status: ACTIVE

### ATOM: maybes_note
dimension: accessibility

Target folder:
- aitom_family/maybes_note/accessibility/

Required files:
- aitom_family/maybes_note/accessibility/drag.md – description of drag operation for screen readers.

Implementation notes:
- "Press Space to pick up, arrows to move, Space to drop."
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: chat_card_v1
dimension: accessibility

Target folder:
- aitom_family/chat_card_v1/accessibility/

Required files:
- aitom_family/chat_card_v1/accessibility/landmarks.md – role="article".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: accessibility

Target folder:
- aitom_family/chat_rail_shell/accessibility/

Required files:
- aitom_family/chat_rail_shell/accessibility/landmarks.md – role="complementary" or "region" aria-label="Chat".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: accessibility

Target folder:
- aitom_family/chat_rail_header_bar/accessibility/

Required files:
- aitom_family/chat_rail_header_bar/accessibility/heading.md – h2 or h3.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: accessibility

Target folder:
- aitom_family/chat_message_list/accessibility/

Required files:
- aitom_family/chat_message_list/accessibility/live.md – aria-live="polite".

Implementation notes:
- Announce new messages.
- Status: ACTIVE

### ATOM: chat_message_block
dimension: accessibility

Target folder:
- aitom_family/chat_message_block/accessibility/

Required files:
- aitom_family/chat_message_block/accessibility/group.md – group user/message.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: accessibility

Target folder:
- aitom_family/chat_message_action_bar/accessibility/

Required files:
- aitom_family/chat_message_action_bar/accessibility/desc.md – aria-label="Message actions".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: accessibility

Target folder:
- aitom_family/chat_safety_controls_bar/accessibility/

Required files:
- aitom_family/chat_safety_controls_bar/accessibility/alert.md – role="alert".

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: accessibility

Target folder:
- aitom_family/bottom_chat_input_bar/accessibility/

Required files:
- aitom_family/bottom_chat_input_bar/accessibility/form.md – role="form" aria-label="Message input".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: accessibility

Target folder:
- aitom_family/chat_shortcuts_popover/accessibility/

Required files:
- aitom_family/chat_shortcuts_popover/accessibility/menu.md – role="menu".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: accessibility

Target folder:
- aitom_family/chat_upload_source_picker/accessibility/

Required files:
- aitom_family/chat_upload_source_picker/accessibility/dialog.md – role="dialog".

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: accessibility

Target folder:
- aitom_family/chat_icon_band_popover/accessibility/

Required files:
- aitom_family/chat_icon_band_popover/accessibility/grid.md – role="grid" or "listbox".

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: accessibility

Target folder:
- aitom_family/surface_header_nano/accessibility/

Required files:
- aitom_family/surface_header_nano/accessibility/landmarks.md – role="banner".

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: accessibility

Target folder:
- aitom_family/surface_header_shell_micro/accessibility/

Required files:
- aitom_family/surface_header_shell_micro/accessibility/landmarks.md – role="banner".

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: accessibility

Target folder:
- aitom_family/surface_header_shell_standard/accessibility/

Required files:
- aitom_family/surface_header_shell_standard/accessibility/landmarks.md – role="banner".

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: accessibility

Target folder:
- aitom_family/surface_logo_centerpiece/accessibility/

Required files:
- aitom_family/surface_logo_centerpiece/accessibility/link.md – aria-label="Home".

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: accessibility

Target folder:
- aitom_family/app_header_appname_dropdown/accessibility/

Required files:
- aitom_family/app_header_appname_dropdown/accessibility/menu.md – aria-haspopup="true".

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: accessibility

Target folder:
- aitom_family/macro_temp_indicator/accessibility/

Required files:
- aitom_family/macro_temp_indicator/accessibility/meter.md – role="meter" or "status".

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: accessibility

Target folder:
- aitom_family/main_menu_icon_button/accessibility/

Required files:
- aitom_family/main_menu_icon_button/accessibility/label.md – aria-label="Open menu".

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: product_buy_buttons_block
dimension: accessibility

Target folder:
- aitom_family/product_buy_buttons_block/accessibility/

Required files:
- aitom_family/product_buy_buttons_block/accessibility/button.md – disabled state announcement.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: accessibility

Target folder:
- aitom_family/product_collapsible_section/accessibility/

Required files:
- aitom_family/product_collapsible_section/accessibility/aria.md – aria-expanded/aria-controls.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: accessibility

Target folder:
- aitom_family/product_description_block/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: accessibility

Target folder:
- aitom_family/product_info_stack/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: accessibility

Target folder:
- aitom_family/product_media_gallery/accessibility/

Required files:
- aitom_family/product_media_gallery/accessibility/alt.md – image alt text requirements.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: accessibility

Target folder:
- aitom_family/product_price_block/accessibility/

Required files:
- aitom_family/product_price_block/accessibility/price.md – "Sale price" vs "Original price" labels.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: accessibility

Target folder:
- aitom_family/product_recommendations_section/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: accessibility

Target folder:
- aitom_family/product_title_block/accessibility/

Required files:
- aitom_family/product_title_block/accessibility/heading.md – h1 typically.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: accessibility

Target folder:
- aitom_family/product_variant_picker/accessibility/

Required files:
- aitom_family/product_variant_picker/accessibility/group.md – radiogroup or listbox role.

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: accessibility

Target folder:
- aitom_family/section_blog_posts/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: accessibility

Target folder:
- aitom_family/section_collection_list/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: accessibility

Target folder:
- aitom_family/section_custom_markup/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: accessibility

Target folder:
- aitom_family/section_email_signup/accessibility/

Required files:
- aitom_family/section_email_signup/accessibility/form.md – label association.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: accessibility

Target folder:
- aitom_family/section_featured_collection_grid/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: accessibility

Target folder:
- aitom_family/section_hero_banner/accessibility/

Required files:
- aitom_family/section_hero_banner/accessibility/heading.md – h2 typically.

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: accessibility

Target folder:
- aitom_family/section_image_with_text/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: accessibility

Target folder:
- aitom_family/section_media_collage/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: accessibility

Target folder:
- aitom_family/section_multicolumn_features/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: accessibility

Target folder:
- aitom_family/section_rich_text/accessibility/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: accessibility

Target folder:
- aitom_family/section_slideshow/accessibility/

Required files:
- aitom_family/section_slideshow/accessibility/controls.md – pause/play/next with labels.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: accessibility

Target folder:
- aitom_family/lanes_calendar_grid_v1/accessibility/

Required files:
- aitom_family/lanes_calendar_grid_v1/accessibility/grid.md – role="grid".

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: accessibility

Target folder:
- aitom_family/multi_feed_tile/accessibility/

Required files:
- aitom_family/multi_feed_tile/accessibility/tile.md – focusable card pattern.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
