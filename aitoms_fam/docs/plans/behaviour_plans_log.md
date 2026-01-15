## atom: lanes_calendar_grid_v1
dimension: behaviour
target_folder: aitom_family/lanes_calendar_grid_v1/behaviour/
tasks:
- Implement state management for the grid (Active, Planned, Empty) and selection logic for lanes and cells. Define interaction handlers for tap events (lane selection, cell detail trigger).
STATUS: DONE

### ATOM: app_header_appname_dropdown
dimension: behaviour

Target folder:
- aitom_family/app_header_appname_dropdown/behaviour/

Required files:
- aitom_family/app_header_appname_dropdown/behaviour/toggle.md – open/close behaviour, outside click handling.
- aitom_family/app_header_appname_dropdown/behaviour/states.md – default/hover/pressed/open/focus.
- aitom_family/app_header_appname_dropdown/behaviour/truncation.md – ellipsis/truncation rules for long names.

Implementation notes:
- Toggle on click/Enter/Space; outside click/escape closes; no default items—content provided externally.
- Track has_open_dropdown state; chevron rotation tied to open state.
- Truncation uses tokenized max width; no wrap; ensure hover/focus does not shift layout.

STATUS: DONE

### ATOM: maybes_note
dimension: behaviour

Target folder:
- aitom_family/maybes_note/behaviour/

Required files:
- aitom_family/maybes_note/behaviour/crud.md – list/create/update/archive flows mapped to /api/maybes.
- aitom_family/maybes_note/behaviour/canvas.md – drag/position/scale behaviour and bulk save to /api/maybes/canvas-layout.
- aitom_family/maybes_note/behaviour/states.md – default/pinned/archived and edit vs view states.

Implementation notes:
- Archive via DELETE endpoint (not hard delete); update via PATCH; create via POST; list via GET.
- Canvas: use layout_x/layout_y/layout_scale tokens; bulk save payload [{maybes_id, x, y, scale}]; treat archive as hidden.
- Keep origin_ref passthrough; tags free text; no Nexus writes unless explicit mirror token used later.
- Ensure drag/rescale respects canvas bounds and persists last position; pin state affects ordering only, not layout.

STATUS: DONE

### ATOM: chat_rail_header_bar
dimension: behaviour

Target folder:
- aitom_family/chat_rail_header_bar/behaviour/

Required files:
- aitom_family/chat_rail_header_bar/behaviour/toggles.md – minimise/expand/tools/settings toggle rules and band exclusivity.
- aitom_family/chat_rail_header_bar/behaviour/states.md – default/hover/pressed/active/disabled states for icons and label truncation.

Implementation notes:
- Minimise steps rail state down; expand steps up; disable when at bounds.
- Tools/settings toggles mutually exclusive; opening one closes the other; header persists in all rail states.
- Outside click closes bands via shell callback; label truncation does not trigger layout shifts.

STATUS: DONE

### ATOM: chat_message_list
dimension: behaviour

Target folder:
- aitom_family/chat_message_list/behaviour/

Required files:
- aitom_family/chat_message_list/behaviour/scrolling.md – auto-scroll to bottom rules and user override.
- aitom_family/chat_message_list/behaviour/state_rules.md – loading/empty/visible states and message alignment inheritance.

Implementation notes:
- Auto-scroll on load and when user is near bottom; pause auto-scroll when user scrolls up; provide resume threshold token.
- Works as independent scroll area; respects rail state visibility (hidden in nano, minimal in micro optional).
- No horizontal scroll; messages wrap within width tokens.

STATUS: DONE

### ATOM: chat_message_block
dimension: behaviour

Target folder:
- aitom_family/chat_message_block/behaviour/

Required files:
- aitom_family/chat_message_block/behaviour/alignment.md – agent vs human alignment rules and optional role tag placement.
- aitom_family/chat_message_block/behaviour/highlight.md – new/search highlight duration and reduced-motion handling.

Implementation notes:
- Agent messages left-aligned; human may right-align via token; optional avatar placement follows alignment.
- Highlight state uses tokenized overlay duration; reduced motion disables animations.
- Text wraps within max width; no interactive elements unless action bar attached.

STATUS: DONE

### ATOM: chat_message_action_bar
dimension: behaviour

Target folder:
- aitom_family/chat_message_action_bar/behaviour/

Required files:
- aitom_family/chat_message_action_bar/behaviour/actions.md – per-icon activation rules and availability flags.
- aitom_family/chat_message_action_bar/behaviour/states.md – hover/pressed/disabled focus handling and tap targets.

Implementation notes:
- Each icon triggers its action; disable if corresponding can_* flag false; debounce rapid clicks.
- Tap area meets minimum size regardless of icon art; focusable buttons; Enter/Space activates.
- Order configurable via tokens; no long-press variants.

STATUS: DONE

### ATOM: chat_safety_controls_bar
dimension: behaviour

Target folder:
- aitom_family/chat_safety_controls_bar/behaviour/

Required files:
- aitom_family/chat_safety_controls_bar/behaviour/toggles.md – control activation/toggle rules and state propagation.
- aitom_family/chat_safety_controls_bar/behaviour/focus.md – keyboard navigation and focus order.

Implementation notes:
- Controls toggle between OFF/ON (or multi-state if provided); emit state changes to shell; single row only.
- Arrow keys navigate; Enter/Space activates; ensure only appears in micro/standard/full.
- No horizontal overflow; convert to scroll or wrap per tokens if needed.

STATUS: DONE

### ATOM: bottom_chat_input_bar
dimension: behaviour

Target folder:
- aitom_family/bottom_chat_input_bar/behaviour/

Required files:
- aitom_family/bottom_chat_input_bar/behaviour/input_handling.md – enter/send vs shift+enter, multiline cap, focus/blur rules.
- aitom_family/bottom_chat_input_bar/behaviour/triggers.md – upload picker trigger, shortcuts popover trigger, send button behaviour.
- aitom_family/bottom_chat_input_bar/behaviour/keyboard_safe.md – mobile keyboard handling to keep controls visible.

Implementation notes:
- Enter sends, Shift+Enter newline (tokenized); input height capped with internal scroll; disabled state blocks send.
- Upload/agent button opens source picker; shortcut arrow opens popover; send button always visible—no horizontal scroll.
- Keyboard open on mobile shrinks message list not input; keep rail pinned above browser chrome; ensure focus ring and tab order upload→text→send.

STATUS: DONE

### ATOM: chat_shortcuts_popover
dimension: behaviour

Target folder:
- aitom_family/chat_shortcuts_popover/behaviour/

Required files:
- aitom_family/chat_shortcuts_popover/behaviour/open_close.md – trigger, outside click/escape close, return focus to input.
- aitom_family/chat_shortcuts_popover/behaviour/navigation.md – keyboard navigation between tokens and insertion action.

Implementation notes:
- Opens from shortcut arrow; closes on selection, outside click, or escape; re-focus input after insertion.
- Arrow keys move focus; Enter inserts token at cursor; reduced motion removes pop animations.

STATUS: DONE

### ATOM: chat_upload_source_picker
dimension: behaviour

Target folder:
- aitom_family/chat_upload_source_picker/behaviour/

Required files:
- aitom_family/chat_upload_source_picker/behaviour/selection.md – source selection rules, device picker invocation, future destination selection hook.
- aitom_family/chat_upload_source_picker/behaviour/open_close.md – trigger, outside click/escape, focus return to upload button.

Implementation notes:
- Selecting DEVICE invokes OS picker; proprietary sources return id; future destination selection stubbed via token.
- Only one view visible; highlight selection; close after selection; keyboard arrows move through options.
- No filenames/content stored; treat upload as primary ingestion path.

STATUS: DONE

### ATOM: chat_icon_band_popover
dimension: behaviour

Target folder:
- aitom_family/chat_icon_band_popover/behaviour/

Required files:
- aitom_family/chat_icon_band_popover/behaviour/band_switching.md – tools vs settings exclusivity and interaction with shell.
- aitom_family/chat_icon_band_popover/behaviour/icon_actions.md – icon activation, active state, horizontal scroll behaviour.

Implementation notes:
- Only one band visible; opening closes the other; integrates with shell active_band state.
- Icons activate tool/setting actions; active_icon_id tracked; horizontal scroll on overflow with snap/free token; focusable buttons with arrow navigation.

STATUS: DONE

### ATOM: chat_rail_shell
dimension: behaviour

Target folder:
- aitom_family/chat_rail_shell/behaviour/

Required files:
- aitom_family/chat_rail_shell/behaviour/states.md – nano/micro/standard/full state machine, transitions, and button mapping.
- aitom_family/chat_rail_shell/behaviour/docking.md – dock/undock rules, drag constraints, persistence of position.
- aitom_family/chat_rail_shell/behaviour/mobile_anchoring.md – bottom anchoring, keyboard-safe behaviour, chat rail exclusion of OS chrome.
- aitom_family/chat_rail_shell/behaviour/bands.md – tools/settings band mutual exclusivity, toggle rules.
- aitom_family/chat_rail_shell/behaviour/scrolling.md – message list auto-scroll rules, scroll-to-bottom behaviour, state-based visibility.

Implementation notes:
- Define state transitions: minimise cycles down (full→standard→micro→nano→optional hide), expand cycles up; clicking nano preview jumps to standard.
- Mobile: rail pinned above browser chrome; input and controls stay visible with keyboard; no horizontal overflow allowed.
- Desktop: docked centered by default; undocked can be dragged (Photoshop-style) and stored per session; clamp to viewport bounds.
- Only one band open at a time; toggling tools/settings closes the other; header controls remain accessible in all states.
- Scroll behaviour snaps to bottom on load and when user near bottom; avoid forced scroll when user is reviewing history.

STATUS: DONE

### ATOM: macro_temp_indicator
dimension: behaviour

Target folder:
- aitom_family/macro_temp_indicator/behaviour/

Required files:
- aitom_family/macro_temp_indicator/behaviour/value_mapping.md – band mapping logic for colour application.
- aitom_family/macro_temp_indicator/behaviour/interaction.md – optional click handling; hover/focus/alert rules.

Implementation notes:
- Map numeric value to band tokens (blue/yellow/green/red); clamp outside 1–100.
- Optional click opens detail view; keyboard activation mirrors click; alert state optional when value exceeds threshold.
- Reduced motion: no blinking; use static emphasis tokens.

STATUS: DONE

### ATOM: main_menu_icon_button
dimension: behaviour

Target folder:
- aitom_family/main_menu_icon_button/behaviour/

Required files:
- aitom_family/main_menu_icon_button/behaviour/activation.md – click/tap/keyboard activation and toggle rules.
- aitom_family/main_menu_icon_button/behaviour/states.md – hover/pressed/focus/disabled.

Implementation notes:
- Enter/Space activates; optional toggle open/close; debounce rapid taps; support theme_variant for asset swap.
- Maintain min tap area regardless of icon size; no long-press special behaviour.

STATUS: DONE

### ATOM: surface_header_nano
dimension: behaviour

Target folder:
- aitom_family/surface_header_nano/behaviour/

Required files:
- aitom_family/surface_header_nano/behaviour/expansion.md – nano → micro/standard expansion trigger and animation.
- aitom_family/surface_header_nano/behaviour/states.md – nano_default/expanding.

Implementation notes:
- Press on icon triggers expansion; optional auto-open main menu; ensure state passes target_header_state.
- Respect safe-area offsets; reduced motion jumps to target without animation.

STATUS: DONE

### ATOM: surface_header_shell_micro
dimension: behaviour

Target folder:
- aitom_family/surface_header_shell_micro/behaviour/

Required files:
- aitom_family/surface_header_shell_micro/behaviour/state.md – micro default and transitions to/from standard.
- aitom_family/surface_header_shell_micro/behaviour/responsiveness.md – safe-area handling and scroll-linked compaction.

Implementation notes:
- Handle transitions between micro/standard based on scroll or explicit state; avoid layout jump.
- Ensure child atoms proxy interactions unchanged; compact state reduces padding/height per tokens.

STATUS: DONE

### ATOM: surface_header_shell_standard
dimension: behaviour

Target folder:
- aitom_family/surface_header_shell_standard/behaviour/

Required files:
- aitom_family/surface_header_shell_standard/behaviour/state.md – default/compact/scrolled behaviour.
- aitom_family/surface_header_shell_standard/behaviour/responsiveness.md – safe-area handling, width changes, truncation strategy.
- aitom_family/surface_header_shell_standard/behaviour/child_proxy.md – proxy events to sub-atoms (menu, dropdown, temp).

Implementation notes:
- Header fixed to top; remains above content; safe-area inset respected on mobile.
- Compact/scrolled states reduce padding/height via tokens; maintain logo centering.
- Proxy child events without altering payloads; macro temp value passed to indicator.

STATUS: DONE

### ATOM: surface_logo_centerpiece
dimension: behaviour

Target folder:
- aitom_family/surface_logo_centerpiece/behaviour/

Required files:
- aitom_family/surface_logo_centerpiece/behaviour/interaction.md – optional click handling; hover/focus rules.
- aitom_family/surface_logo_centerpiece/behaviour/states.md – default/hover/pressed/focus (if interactive).

Implementation notes:
- Default non-interactive; if click enabled, activate home/about; Enter/Space mirrors click; keep hit area tokenized.
- No drag; maintain aspect ratio; reduced motion removes hover fades if configured.

STATUS: DONE

### ATOM: chat_card_v1
dimension: behaviour

Target folder:
- aitom_family/chat_card_v1/behaviour/

Required files:
- aitom_family/chat_card_v1/behaviour/interaction_states.md – define default, hover, focus, pressed, unread, and active state transitions for the pill.
- aitom_family/chat_card_v1/behaviour/input_handling.md – map mouse/touch/keyboard interactions (click/tap to open, arrow key navigation, Enter/Space activation).
- aitom_family/chat_card_v1/behaviour/state_rules.md – describe unread toggling rules and how active selection is set/cleared.

Implementation notes:
- Specify that tapping/clicking the card opens the conversation and marks unread messages as read; long-press/secondary click can open a quick actions menu (mark read, mute) if supported by the host app.
- Define keyboard navigation for list context: Up/Down moves focus between cards; Enter/Space activates the focused card; Home/End jump to first/last; ensure focus ring respects the pill outline.
- Document hover/focus visual triggers (stroke intensity or subtle glow), pressed state (temporary fill with preserved contrast), unread indicator behaviour (dot and/or bold preview), and active state persistence for the currently open chat.
- Clarify event order: pointer down sets pressed; release on card fires open; escape or blur clears pressed; unread badge hidden when read event fires.
- Include timing tokens for transition ease/duration so motion can be tuned without code changes.

STATUS: DONE

### ATOM: section_hero_banner
dimension: behaviour

Target folder:
- aitom_family/section_hero_banner/behaviour/

Required files:
- aitom_family/section_hero_banner/behaviour/state_map.md – media states (image/video), overlay states, interactive elements.
- aitom_family/section_hero_banner/behaviour/interaction.md – CTA/button/link behaviour, keyboard focus order.
- aitom_family/section_hero_banner/behaviour/responsive.md – alignment and stacking rules across breakpoints.

Implementation notes:
- Define media behaviour: image static; video autoplay/mute/loop tokens respecting consent; error fallback to poster.
- CTA/button interactions follow button_single; ensure focus order: heading → body → CTA(s). Overlay opacity changes only for interactive elements; no layout shift.
- Responsive: stack text/buttons on mobile, align per tokens; reduced motion disables autoplay/overlay animations.

STATUS: DONE

### ATOM: section_rich_text
dimension: behaviour

Target folder:
- aitom_family/section_rich_text/behaviour/

Required files:
- aitom_family/section_rich_text/behaviour/interaction.md – link/CTA behaviours.
- aitom_family/section_rich_text/behaviour/responsive.md – alignment/spacing adjustments per breakpoint.

Implementation notes:
- Body links follow rich_text_block behaviour; CTA uses button_single behaviour; ensure focus order heading → body → CTA.
- No container hover effects; reduced motion for underline animations if any.
- Alignment adjusts per breakpoint via tokens; ensure no reflow jitter.

STATUS: DONE

### ATOM: section_multicolumn_features
dimension: behaviour

Target folder:
- aitom_family/section_multicolumn_features/behaviour/

Required files:
- aitom_family/section_multicolumn_features/behaviour/interaction.md – column/card hover/focus and CTA clicks.
- aitom_family/section_multicolumn_features/behaviour/responsive.md – column stacking rules.
- aitom_family/section_multicolumn_features/behaviour/modes.md – handling clickable columns vs CTA-only columns.

Implementation notes:
- Define hover/focus on column surfaces (card surface tokens); CTAs use button behaviour; if entire column is clickable, ensure inner CTA is still separately focusable or treated as link with clear hit areas.
- Column stacking per breakpoint via layout_columns_grid tokens; avoid animated reflow; reduced motion disables hover lifts if used.
- Tracking hooks: feature_impression optional; feature_cta_click; no content logging.

STATUS: DONE

### ATOM: section_featured_collection_grid
dimension: behaviour

Target folder:
- aitom_family/section_featured_collection_grid/behaviour/

Required files:
- aitom_family/section_featured_collection_grid/behaviour/data_flow.md – loading/empty/error handling for collection data.
- aitom_family/section_featured_collection_grid/behaviour/interactions.md – card hover/focus/cta behaviour.
- aitom_family/section_featured_collection_grid/behaviour/responsive.md – grid stacking rules.

Implementation notes:
- Define behaviour for loading (skeleton tokens), empty states, and error fallback; item_limit tokens control render count.
- Cards use card surface states; CTAs follow button behaviour; optional “view all” CTA included.
- Responsive: grid columns collapse per tokens; avoid layout shift on load; reduced motion for hover/elevation.

STATUS: DONE

### ATOM: floating_pill_toolbar
dimension: behaviour

Target folder:
- aitom_family/floating_pill_toolbar/behaviour/

Required files:
- aitom_family/floating_pill_toolbar/behaviour/drag_and_snap.md – drag start/thresholds, snap grid rules, chat-rail exclusion.
- aitom_family/floating_pill_toolbar/behaviour/expand_collapse.md – tap vs drag logic, expansion direction rules toward centre, collision avoidance.
- aitom_family/floating_pill_toolbar/behaviour/gather_mode.md – long-press gather trigger, animation ordering, clustering offsets.
- aitom_family/floating_pill_toolbar/behaviour/states.md – collapsed/expanded/dragging/snapping/gathering/disabled/reduced-motion handling.

Implementation notes:
- Define pointer/touch drag start thresholds vs tap-to-toggle; ensure quick short movement toggles, longer movement cancels toggle.
- Snap grid: tokenized grid size and anchors; clamp drops to stay above chat rail; store per-toolbar position token.
- Expansion direction: left quadrants expand vertically (top-down or bottom-up), right expands leftward, centre chooses axis based on available space; collision avoidance nudges or flips axis.
- Gather: long-press duration token; all toolbars animate to pressed toolbar anchor with ordered arrival and primary highlighted; allow cancel on release.
- Reduced motion: disable animations and snap instantly while maintaining state changes; ensure focus/keyboard parity with pointer flows.

STATUS: DONE

### ATOM: section_collection_list
dimension: behaviour

Target folder:
- aitom_family/section_collection_list/behaviour/

Required files:
- aitom_family/section_collection_list/behaviour/data_flow.md – loading/empty handling for collections.
- aitom_family/section_collection_list/behaviour/interactions.md – card/CTA interactions.
- aitom_family/section_collection_list/behaviour/responsive.md – grid/list toggle behaviour.

Implementation notes:
- Define loading/empty placeholders; card hover/focus via card surface tokens; CTAs per button behaviour.
- Support optional grid vs list toggle token; ensure accessible focus order and no layout jump on mode switch (respect reduced motion).
- Tracking: card clicks/logs; no content logging.

STATUS: DONE

### ATOM: section_media_collage
dimension: behaviour

Target folder:
- aitom_family/section_media_collage/behaviour/

Required files:
- aitom_family/section_media_collage/behaviour/patterns.md – layout pattern behaviour and tile interactivity.
- aitom_family/section_media_collage/behaviour/interaction.md – tile hover/focus/pressed, video tile playback if present.
- aitom_family/section_media_collage/behaviour/responsive.md – stacking/collapse rules per breakpoint.

Implementation notes:
- Define tile interactivity: clickable/lightbox per token; hover overlays and focus rings; video tiles follow video_media_block playback rules.
- Pattern switching per breakpoint via tokens; ensure DOM order matches visual; reduced motion disables overlay animations and autoplay.
- Tracking hooks: tile_impression optional, tile_click with ids; no media URLs/content.

STATUS: DONE

### ATOM: section_image_with_text
dimension: behaviour

Target folder:
- aitom_family/section_image_with_text/behaviour/

Required files:
- aitom_family/section_image_with_text/behaviour/interaction.md – media hover/overlay, CTA behaviour.
- aitom_family/section_image_with_text/behaviour/responsive.md – side swap/stack rules per breakpoint.

Implementation notes:
- Media hover overlay optional; focus ring on CTA and linked media; click/tap navigates if media linked; Enter/Space activates.
- Side swap token flips media/text; ensure reading order remains logical; mobile stacks content; reduced motion disables overlay animations.

STATUS: DONE

### ATOM: section_slideshow
dimension: behaviour

Target folder:
- aitom_family/section_slideshow/behaviour/

Required files:
- aitom_family/section_slideshow/behaviour/controls.md – arrow/dot/keyboard controls.
- aitom_family/section_slideshow/behaviour/autoplay.md – autoplay/loop rules respecting consent/reduced motion.
- aitom_family/section_slideshow/behaviour/states.md – slide change states and transitions.

Implementation notes:
- Define autoplay interval, transition types (fade/slide) with tokenized durations/easing; stop autoplay on user interaction; respect prefers-reduced-motion and consent for autoplay.
- Controls: arrows/dots keyboard accessible; Enter/Space activates; left/right arrows navigate; roving tabindex for dots.
- Announce slide changes politely; avoid layout shift during transitions.

STATUS: DONE

### ATOM: section_blog_posts
dimension: behaviour

Target folder:
- aitom_family/section_blog_posts/behaviour/

Required files:
- aitom_family/section_blog_posts/behaviour/data_flow.md – loading/empty/error handling for posts.
- aitom_family/section_blog_posts/behaviour/interactions.md – card hover/focus/CTA clicks; view all CTA.
- aitom_family/section_blog_posts/behaviour/responsive.md – grid stacking rules.

Implementation notes:
- Define loading skeletons and empty state tokens; cards use card surface states; CTAs follow button behaviour.
- Grid columns collapse per breakpoint; avoid layout shift on load; reduced motion for hover/elevation.
- Tracking hooks: post_card_click, view_all_click; no titles in payload.

STATUS: DONE

### ATOM: section_email_signup
dimension: behaviour

Target folder:
- aitom_family/section_email_signup/behaviour/

Required files:
- aitom_family/section_email_signup/behaviour/form.md – submit/validation/anti-spam behaviours.
- aitom_family/section_email_signup/behaviour/states.md – default/focus/hover/pressed/loading/error/success.

Implementation notes:
- Define client validation (email), submit action, loading state, inline error/success messaging; include honeypot/timestamp hooks upstream.
- Focus ring for input/button; stack behaviour on mobile via tokens; respect reduced motion (no animated error flashes).
- Ensure no PII in analytics; mask input only via value, not logged.

STATUS: DONE

### ATOM: section_custom_markup
dimension: behaviour

Target folder:
- aitom_family/section_custom_markup/behaviour/

Required files:
- aitom_family/section_custom_markup/behaviour/safety.md – sanitization/sandbox expectations.
- aitom_family/section_custom_markup/behaviour/presentation.md – how padding/full-bleed tokens apply around custom content.

Implementation notes:
- Document that content is treated as injected HTML/Liquid; sanitization is upstream; this atom only applies spacing/background tokens.
- Define focus/selection behaviour if container is selectable; otherwise aria-hidden for container shell, leaving inner markup to define semantics.
- No interactions beyond contained content; respect reduced motion by not animating container.

STATUS: DONE

### ATOM: product_media_gallery
dimension: behaviour

Target folder:
- aitom_family/product_media_gallery/behaviour/

Required files:
- aitom_family/product_media_gallery/behaviour/media_switching.md – thumbnail-to-main media swapping rules.
- aitom_family/product_media_gallery/behaviour/interactions.md – hover/focus/pressed states for thumbs and main media; zoom/lightbox behaviour.
- aitom_family/product_media_gallery/behaviour/responsive.md – thumb placement/orientation per breakpoint.

Implementation notes:
- Define click/tap/keyboard activation on thumbnails (Enter/Space) to change main media; active state indicated via token.
- Optional zoom/lightbox: click on main media opens zoom/lightbox if enabled; close/cancel behaviour defined; disable animations under reduced motion.
- Thumbnails can be vertical (desktop) or horizontal (mobile) per tokens; swipe optional on mobile; video tiles follow video playback rules respecting consent.

STATUS: DONE

### ATOM: product_info_stack
dimension: behaviour

Target folder:
- aitom_family/product_info_stack/behaviour/

Required files:
- aitom_family/product_info_stack/behaviour/ordering.md – how child blocks order and optional visibility toggles behave.
- aitom_family/product_info_stack/behaviour/sticky.md – sticky alignment coordination with buy_buttons.

Implementation notes:
- Container itself is passive; it orchestrates child ordering and spacing tokens. Document optional hide/show toggles for sub-blocks.
- If sticky alignment is used (via buy_buttons), describe how the stack offsets and when it unsticks; respect reduced motion (no animated stickiness).
- Tracking hooks limited to view_id/tracking_id; no content.

STATUS: DONE

### ATOM: product_title_block
dimension: behaviour

Target folder:
- aitom_family/product_title_block/behaviour/

Required files:
- aitom_family/product_title_block/behaviour/interaction.md – linkable title behaviour.

Implementation notes:
- Title is static unless link enabled; hover/pressed/focus only in link mode. Keyboard activation Enter/Space when linkable.
- Optional underline/stroke changes in interactive mode; reduced motion for underline animations if any.

STATUS: DONE

### ATOM: product_price_block
dimension: behaviour

Target folder:
- aitom_family/product_price_block/behaviour/

Required files:
- aitom_family/product_price_block/behaviour/state_rules.md – on_sale/sold_out/compare-at handling.
- aitom_family/product_price_block/behaviour/badge.md – badge display rules.

Implementation notes:
- Compute state from data: on_sale => show compare-at + badge; sold_out => badge/label; formatting done upstream; behaviour limited to visual state.
- No hover behaviours unless badges are interactive (not typical); keep static otherwise.

STATUS: DONE

### ATOM: product_variant_picker
dimension: behaviour

Target folder:
- aitom_family/product_variant_picker/behaviour/

Required files:
- aitom_family/product_variant_picker/behaviour/controls.md – dropdown vs swatch/button interactions.
- aitom_family/product_variant_picker/behaviour/state_map.md – default/hover/focus/selected/disabled/error.
- aitom_family/product_variant_picker/behaviour/keyboard.md – arrow navigation for swatches/buttons.

Implementation notes:
- For swatches/buttons: arrow keys move focus, Enter/Space selects; aria-pressed/selected; disabled/out-of-stock non-focusable; hover/active state tokens.
- For dropdown: rely on native select or custom listbox; ensure focus ring on dark base; error state token if selection invalid.
- No PII; selection emits variant_select via tracking.

STATUS: DONE

### ATOM: product_buy_buttons_block
dimension: behaviour

Target folder:
- aitom_family/product_buy_buttons_block/behaviour/

Required files:
- aitom_family/product_buy_buttons_block/behaviour/state_map.md – default/hover/pressed/focus/disabled/loading per button.
- aitom_family/product_buy_buttons_block/behaviour/sticky.md – sticky mode behaviour.
- aitom_family/product_buy_buttons_block/behaviour/input.md – activation/submit rules.

Implementation notes:
- Buttons follow button_single behaviour; add optional loading/disabled based on variant availability or in-flight action.
- Sticky mode tokens: when enabled, block sticks within viewport; respect safe areas; reduced motion disables animated stick transitions.
- Click/Enter/Space triggers add-to-cart/buy-now; prevent double-submit via debounce/loading token.

STATUS: DONE

### ATOM: product_description_block
dimension: behaviour

Target folder:
- aitom_family/product_description_block/behaviour/

Required files:
- aitom_family/product_description_block/behaviour/links.md – link handling.
- aitom_family/product_description_block/behaviour/truncation.md – optional read-more behaviour.

Implementation notes:
- Rich text link behaviour mirrors rich_text_block; focus/hover states for links only.
- If truncation/read-more is enabled, define toggle control behaviour and focus handling; reduced motion for expand/collapse.
- Container itself non-interactive.

STATUS: DONE

### ATOM: product_collapsible_section
dimension: behaviour

Target folder:
- aitom_family/product_collapsible_section/behaviour/

Required files:
- aitom_family/product_collapsible_section/behaviour/toggle.md – expand/collapse behaviour (single/multi).
- aitom_family/product_collapsible_section/behaviour/states.md – default/hover/focus/pressed/expanded.
- aitom_family/product_collapsible_section/behaviour/animation.md – timing/ease respecting reduced motion.

Implementation notes:
- Header is a button: Enter/Space toggles; aria-expanded; chevron rotates via tokens; start_open token available.
- Single vs multi-open controlled via token; ensure body does not shift surrounding layout unexpectedly.
- Reduced motion disables animated height changes.

STATUS: DONE

### ATOM: product_recommendations_section
dimension: behaviour

Target folder:
- aitom_family/product_recommendations_section/behaviour/

Required files:
- aitom_family/product_recommendations_section/behaviour/data_flow.md – loading/empty/error handling for recommendations.
- aitom_family/product_recommendations_section/behaviour/interactions.md – card/CTA interactions.
- aitom_family/product_recommendations_section/behaviour/responsive.md – grid stacking rules.

Implementation notes:
- Define loading skeletons/empty states; cards use card surface states; CTAs follow button behaviour.
- Grid columns collapse per breakpoint; avoid layout shift on load; reduced motion for hover/elevation.
- Tracking hooks: recommendation_click; no product names/prices in payload.

STATUS: DONE

### ATOM: heading_block
dimension: behaviour

Target folder:
- aitom_family/heading_block/behaviour/

Required files:
- aitom_family/heading_block/behaviour/interaction.md – linkable heading behaviours (hover/focus/pressed) and non-link static behaviour.
- aitom_family/heading_block/behaviour/state_rules.md – default/hover/pressed/focus/disabled (if heading disabled).

Implementation notes:
- Define when heading is interactive (link or button) vs static; hover/pressed apply only in interactive mode; focus ring for keyboard.
- Keyboard: Enter/Space activates if interactive; otherwise no focus.
- Note truncation/ellipsis behaviour tied to layout tokens; respect reduced motion (no animated underlines unless tokenized and optional).

STATUS: DONE

### ATOM: rich_text_block
dimension: behaviour

Target folder:
- aitom_family/rich_text_block/behaviour/

Required files:
- aitom_family/rich_text_block/behaviour/links.md – link hover/focus/active rules.
- aitom_family/rich_text_block/behaviour/list_handling.md – behaviour for lists/inline elements.

Implementation notes:
- Map link states (hover/active/focus) to tokens; ensure keyboard activation and focus ring on dark base.
- Lists and inline elements are static; no container hover. Respect reduced motion for underline animations if any.
- Ensure external link handling can add rel attributes; no PII.

STATUS: DONE

### ATOM: button_single
dimension: behaviour

Target folder:
- aitom_family/button_single/behaviour/

Required files:
- aitom_family/button_single/behaviour/state_map.md – default/hover/pressed/focus/disabled/loading.
- aitom_family/button_single/behaviour/input.md – click/tap/keyboard activation.
- aitom_family/button_single/behaviour/variants.md – solid/outline behaviour differences.

Implementation notes:
- Define pointer/keyboard activation (Enter/Space), prevent double-submit via optional loading state, and tokenize hover/pressed transitions.
- Solid vs outline variants share state map; focus ring outside stroke; reduced motion disables animated transitions.
- Include full-width-on-mobile toggle handling (layout-driven).

STATUS: DONE

### ATOM: button_group
dimension: behaviour

Target folder:
- aitom_family/button_group/behaviour/

Required files:
- aitom_family/button_group/behaviour/orientation.md – behaviour for row/column orientation switches.
- aitom_family/button_group/behaviour/input.md – per-button activation guidance.

Implementation notes:
- Group is non-interactive; each button handles its own states. Define how orientation switches on breakpoint/density without reflow jumps.
- Ensure tab order follows visual order; focus rings per button; reduced motion for orientation changes.

STATUS: DONE

### ATOM: image_media_block
dimension: behaviour

Target folder:
- aitom_family/image_media_block/behaviour/

Required files:
- aitom_family/image_media_block/behaviour/interaction.md – hover/overlay behaviours, click navigation/lightbox.
- aitom_family/image_media_block/behaviour/loading.md – lazy-load/placeholder guidance.

Implementation notes:
- Define hover overlay/scale tokens (optional), focus ring for linked images, click opens link/lightbox; keyboard activation with Enter/Space when focusable.
- Provide placeholder/fallback handling; respect reduced motion (no aggressive zoom).
- Note alt text requirement; disable hover effects on touch if needed via token.

STATUS: DONE

### ATOM: video_media_block
dimension: behaviour

Target folder:
- aitom_family/video_media_block/behaviour/

Required files:
- aitom_family/video_media_block/behaviour/playback.md – autoplay/mute/loop/control behaviours.
- aitom_family/video_media_block/behaviour/states.md – default/hover/focus/pressed/loading/error.
- aitom_family/video_media_block/behaviour/privacy.md – youtube-nocookie toggle handling.

Implementation notes:
- Define play/pause/stop triggers for click/keyboard; overlay play icon behaviour; handle poster visibility; error fallback.
- Autoplay must respect mute and consent; ensure focus management within embedded player; reduced motion disables autoplay unless forced.
- Tokenize overlays and control visibility; keep PII out of tracking.

STATUS: DONE

### ATOM: accordion_item
dimension: behaviour

Target folder:
- aitom_family/accordion_item/behaviour/

Required files:
- aitom_family/accordion_item/behaviour/toggle.md – expand/collapse behaviour and single vs multi-open mode.
- aitom_family/accordion_item/behaviour/states.md – default/hover/focus/pressed/disabled.
- aitom_family/accordion_item/behaviour/animation.md – expand/collapse timing respecting reduced motion.

Implementation notes:
- Header acts as button: click/Enter/Space toggles; set aria-expanded; single-open vs multi-open token.
- Hover/pressed on header only; body is static. Respect reduced motion by disabling height animations.
- Initial open state token; ensure toggle does not shift surrounding layout unexpectedly.

STATUS: DONE

### ATOM: layout_group_container
dimension: behaviour

Target folder:
- aitom_family/layout_group_container/behaviour/

Required files:
- aitom_family/layout_group_container/behaviour/state_rules.md – define default, hover/focus (if editable), and disabled/locked states.
- aitom_family/layout_group_container/behaviour/responsive.md – describe alignment and padding behaviour across breakpoints and full-bleed toggle.
- aitom_family/layout_group_container/behaviour/tracking_hooks.md – outline minimal tracking hooks for impressions/variant changes.

Implementation notes:
- Describe how container alignment (start/center/stretch), padding, and full-bleed toggles behave per breakpoint; ensure no animated layout shifts (respect reduced motion).
- If container is selectable/editable in builder, define focus ring and hover outline behaviour; otherwise mark as passive.
- Note density switching (compact/comfortable) effects on padding/gap tokens and how to avoid content jump.
- Tracking hooks should expose container_view_id/tracking_id without emitting child content.

STATUS: DONE

### ATOM: layout_columns_grid
dimension: behaviour

Target folder:
- aitom_family/layout_columns_grid/behaviour/

Required files:
- aitom_family/layout_columns_grid/behaviour/responsive_rules.md – how columns collapse/expand per breakpoint.
- aitom_family/layout_columns_grid/behaviour/interaction.md – edit-mode behaviours (hover outline, focus) if applicable.
- aitom_family/layout_columns_grid/behaviour/state_map.md – default/locked/disabled states.

Implementation notes:
- Define column count/span rules per breakpoint; specify wrapping/stacking and equal-height behaviour.
- If edit-mode affordances exist, outline hover/focus outlines without impacting layout; otherwise mark passive.
- Include density effects on row/column gaps; ensure changes are token-driven and respect reduced motion.

STATUS: DONE

### ATOM: layout_spacer_block
dimension: behaviour

Target folder:
- aitom_family/layout_spacer_block/behaviour/

Required files:
- aitom_family/layout_spacer_block/behaviour/size_rules.md – how spacer sizes map to density/breakpoints.
- aitom_family/layout_spacer_block/behaviour/accessibility.md – aria-hidden guidance.

Implementation notes:
- Spacer is non-interactive; ensure aria-hidden and not focusable.
- Define how spacer height tokens adjust for compact vs comfortable and optional mobile reduction.
- No tracking events; note [NO EVENTS].

STATUS: DONE

### ATOM: layout_divider_block
dimension: behaviour

Target folder:
- aitom_family/layout_divider_block/behaviour/

Required files:
- aitom_family/layout_divider_block/behaviour/state_rules.md – default/hover/focus (only if label/interactive).
- aitom_family/layout_divider_block/behaviour/responsive.md – inset/margin adjustments per breakpoint.

Implementation notes:
- Divider is decorative by default; aria-hidden unless a label is present; non-interactive aside from optional labeled focus.
- Define hover/focus outline only when label is interactive; avoid layout shift when style changes.
- Specify how inset tokens adapt across breakpoints and respect full-bleed contexts.

STATUS: DONE

### ATOM: wireframe_canvas
Dimension: behaviour
Target folder:
- aitom_family/wireframe_canvas/behaviour/

Tasks:
- Define canvas states for idle, element-selected, dragging, snapping, remote-update, and conflicted states to support human + agent edits.
- Specify pointer/keyboard interactions: drag to move with snap-to-grid, arrow-key nudge, escape to cancel, and how SSE moves apply without stealing focus.
- Document collision/bounds rules, grid-lock toggle, and how token-addressable elements are the targets for agent actions.

STATUS: DONE

### ATOM: blackboard
Dimension: behaviour
Target folder:
- aitom_family/blackboard/behaviour/

Tasks:
- Define canvas state machine for idle, element-selected, dragging, snapping, and remote-update states to support both human and agent edits.
- Specify pointer/keyboard interactions for move/resnap (drag with snap-to-grid, arrow-key nudge, escape to cancel) and how SSE-delivered moves are applied without losing local focus.
- Document how element tokens (ID + position) are the actionable targets for agents; include collision rules, bounds checks, and optional grid-lock toggle.

STATUS: DONE

### ATOM: multi_feed_tile
Dimension: behaviour
Target folder:
- aitom_family/multi_feed_tile/behaviour/

Tasks:
- Define state map for default, hover, focus, pressed, disabled, and draggable states across modes (image, video, kpi, product, text) with consistent affordances.
- Specify pointer and keyboard interactions: tile click opens/selects, CTA click is isolated, Enter/Space activate focused tile, drag-and-drop optional via token gating.
- Document event payloads for tile clicks vs CTA clicks (tile_id, tracking_key, mode) and guard against firing when clickable is false.
- Outline mode-specific behaviours: video overlay play affordance, KPI metric emphasis without changing interaction, product CTA separate hit zone.

STATUS: ACTIVE

### ATOM: theme_layout_settings
dimension: behaviour

Target folder:
- aitom_family/theme_layout_settings/behaviour/

Required files:
- aitom_family/theme_layout_settings/behaviour/responsive_rules.md – define how grid, gutters, and margins adapt per breakpoint and safe-area changes.
- aitom_family/theme_layout_settings/behaviour/state_init.md – describe token hydration/initialization flow to prevent layout flash.
- aitom_family/theme_layout_settings/behaviour/density_switching.md – document how density or container width presets switch at runtime.

Implementation notes:
- Describe how layout tokens (outer margins, gutters, spans) activate per breakpoint and when full_bleed is toggled; ensure transitions are non-animated or respect reduced motion.
- Specify initialization guard so sections do not flash unstyled while tokens load; define a ready state before rendering content width.
- Document how density or container width can switch (e.g., user setting or template toggle) and how to broadcast layout change events for analytics without reflow flicker.

STATUS: DONE

### ATOM: theme_colour_schemes
dimension: behaviour

Target folder:
- aitom_family/theme_colour_schemes/behaviour/

Required files:
- aitom_family/theme_colour_schemes/behaviour/scheme_switching.md – rules for switching schemes and applying stateful colours.
- aitom_family/theme_colour_schemes/behaviour/state_mapping.md – map interaction states (hover/pressed/disabled/focus) to scheme tokens.
- aitom_family/theme_colour_schemes/behaviour/transitions.md – optional theme transition timing respecting reduced-motion.

Implementation notes:
- Define how scheme selection propagates to child atoms (token update broadcast) and how to avoid mid-frame flicker; include fallbacks if a scheme id is missing.
- Map hover/pressed/disabled/focus to semantic tokens so components can read consistent values; include error/success mapping if provided.
- Specify transition durations/ease tokens for scheme changes, disabled when prefers-reduced-motion is true.

STATUS: DONE

### ATOM: theme_typography_settings
dimension: behaviour

Target folder:
- aitom_family/theme_typography_settings/behaviour/

Required files:
- aitom_family/theme_typography_settings/behaviour/preset_switching.md – how typography presets switch per breakpoint or density.
- aitom_family/theme_typography_settings/behaviour/hydration.md – loading/ready behaviour to avoid FOIT/FOUT.
- aitom_family/theme_typography_settings/behaviour/accessibility_rules.md – behavioural hooks for dynamic font-size/line-height scaling.

Implementation notes:
- Describe how preset sets are applied on breakpoint changes without reflow jitter; include token-driven size/opsz adjustments.
- Define font loading behaviour (use existing registry fonts) and fallback handling to prevent FOIT; allow CSS font-display guidance via tokens.
- Provide rules for dynamic scaling (user zoom/preference) and how to clamp or re-run layout when type scale tokens change.

STATUS: DONE

### ATOM: theme_card_surface
dimension: behaviour

Target folder:
- aitom_family/theme_card_surface/behaviour/

Required files:
- aitom_family/theme_card_surface/behaviour/state_map.md – default/hover/pressed/focus/selected/disabled behaviours.
- aitom_family/theme_card_surface/behaviour/elevation_rules.md – how elevation/glow tokens apply per state.
- aitom_family/theme_card_surface/behaviour/focus_handling.md – focus ring behaviour and interactions with strokes.

Implementation notes:
- Define interaction states: hover raises elevation or brightens stroke; pressed darkens fill; focus adds ring outside stroke; selected locks active outline; disabled reduces opacity while preserving contrast.
- Specify motion tokens (duration/ease) for elevation/outline changes, with a reduced-motion override.
- Clarify hit areas vs content: surface state changes on whole card hover/focus, not on nested CTA hover; avoid layout shift on state change.

STATUS: DONE

### ATOM: wireframe_canvas
dimension: behaviour

Target folder:
- aitom_family/wireframe_canvas/behaviour/

Required files:
- aitom_family/wireframe_canvas/behaviour/manipulation.md – drag/drop, resize, and snap-to-grid logic.
- aitom_family/wireframe_canvas/behaviour/viewport.md – pan/zoom mechanics (or scroll) and infinite vs constrained bounds.
- aitom_family/wireframe_canvas/behaviour/realtime.md – handling SSE updates for remote element movement/cursors without full re-render.

Implementation notes:
- Implement specific snap-to-grid logic (e.g., 24px grid) for all drag/resize operations.
- Define selection state (single vs multi) and how keyboard (arrows) nudges selection.
- Realtime: distinct visual state for "being dragged by other" vs "local interaction".
- Respect reduced motion for viewport transitions.
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: blackboard
dimension: behaviour

Target folder:
- aitom_family/blackboard/behaviour/

Required files:
- aitom_family/blackboard/behaviour/gestures.md – global pan/zoom support (if enabled) and background click handling (clear selection).
- aitom_family/blackboard/behaviour/z_index.md – stacking context rules for the shell root.

Implementation notes:
- Acts as the click-catcher for "deselect all".
- If pan/zoom enabled (e.g. for wireframes or infinite canvas apps), it owns the viewport transform.
- Status: ACTIVE

### ATOM: theme_layout_settings
dimension: behaviour

Target folder:
- aitom_family/theme_layout_settings/behaviour/

Required files:
- aitom_family/theme_layout_settings/behaviour/responsiveness.md – breakpoint logic (mobile/tablet/desktop) and safe-area adjustments.

Implementation notes:
- Not interactive itself, but defines how the grid reacts to resize events.
- Debounce resize recalculations.
- Status: ACTIVE

### ATOM: theme_colour_schemes
dimension: behaviour

Target folder:
- aitom_family/theme_colour_schemes/behaviour/

Required files:
- aitom_family/theme_colour_schemes/behaviour/transition.md – theme switching duration/easing.

Implementation notes:
- Defines the  duration for all themeable elements to prevent flashing.
- Respect prefers-reduced-motion (instant swap).
- Status: ACTIVE

### ATOM: theme_typography_settings
dimension: behaviour

Target folder:
- aitom_family/theme_typography_settings/behaviour/

Required files:
- aitom_family/theme_typography_settings/behaviour/fluidity.md – clamp() rules or breakpoint resize logic.

Implementation notes:
- Typography shouldn't "pop"; use fluid scaling or clean breakpoint shifts.
- Status: ACTIVE

### ATOM: theme_card_surface
dimension: behaviour

Target folder:
- aitom_family/theme_card_surface/behaviour/

Required files:
- aitom_family/theme_card_surface/behaviour/state_map.md – hover/pressed/focus/selected/disabled definitions.
- aitom_family/theme_card_surface/behaviour/elevation.md – shadow/glow rules per state.

Implementation notes:
- Defines the canonical interaction states for all cards. Hover lifts or glows; pressed insets.
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: accordion_item
dimension: behaviour

Target folder:
- aitom_family/accordion_item/behaviour/

Required files:
- aitom_family/accordion_item/behaviour/toggle.md – expand/collapse logic and animation state.

Implementation notes:
- Click/tap header to toggle.
- Support single vs multi-open via parent container token (if passed).
- Status: ACTIVE

### ATOM: button_group
dimension: behaviour

Target folder:
- aitom_family/button_group/behaviour/

Required files:
- aitom_family/button_group/behaviour/responsive.md – stacking logic (horizontal vs vertical) on mobile.

Implementation notes:
- Define breakpoint at which buttons stack.
- Status: ACTIVE

### ATOM: button_single
dimension: behaviour

Target folder:
- aitom_family/button_single/behaviour/

Required files:
- aitom_family/button_single/behaviour/states.md – hover/pressed/disabled/loading.

Implementation notes:
- Standard button states.
- Loading state disables interaction and shows spinner.
- Status: ACTIVE

### ATOM: heading_block
dimension: behaviour

Target folder:
- aitom_family/heading_block/behaviour/

Required files:
- aitom_family/heading_block/behaviour/links.md – optional anchor link behaviour.

Implementation notes:
- Headings are mostly static, but may link.
- Status: ACTIVE

### ATOM: rich_text_block
dimension: behaviour

Target folder:
- aitom_family/rich_text_block/behaviour/

Required files:
- aitom_family/rich_text_block/behaviour/links.md – inline link handling.

Implementation notes:
- Standard link behaviour (new tab vs same tab tokens).
- Status: ACTIVE

### ATOM: image_media_block
dimension: behaviour

Target folder:
- aitom_family/image_media_block/behaviour/

Required files:
- aitom_family/image_media_block/behaviour/interaction.md – click to expand/zoom or link.

Implementation notes:
- Optional lightbox behaviour or simple link.
- Status: ACTIVE

### ATOM: video_media_block
dimension: behaviour

Target folder:
- aitom_family/video_media_block/behaviour/

Required files:
- aitom_family/video_media_block/behaviour/playback.md – autoplay/mute/loop/controls.

Implementation notes:
- Respect data tokens for autoplay/mute.
- Status: ACTIVE

### ATOM: layout_columns_grid
dimension: behaviour

Target folder:
- aitom_family/layout_columns_grid/behaviour/

Required files:
- aitom_family/layout_columns_grid/behaviour/responsive.md – column collapse logic.

Implementation notes:
- Define how columns stack on mobile (1-col or 2-col).
- Status: ACTIVE

### ATOM: layout_divider_block
dimension: behaviour

Target folder:
- aitom_family/layout_divider_block/behaviour/

Required files:
- None.

Implementation notes:
- Static.
- Status: ACTIVE

### ATOM: layout_group_container
dimension: behaviour

Target folder:
- aitom_family/layout_group_container/behaviour/

Required files:
- None.

Implementation notes:
- Structural only.
- Status: ACTIVE

### ATOM: layout_spacer_block
dimension: behaviour

Target folder:
- aitom_family/layout_spacer_block/behaviour/

Required files:
- None.

Implementation notes:
- Static.
- Status: ACTIVE

### ATOM: floating_pill_toolbar
dimension: behaviour

Target folder:
- aitom_family/floating_pill_toolbar/behaviour/

Required files:
- aitom_family/floating_pill_toolbar/behaviour/drag.md – drag and drop positioning.
- aitom_family/floating_pill_toolbar/behaviour/expand.md – expand/collapse state.

Implementation notes:
- Complex drag physics (if draggable).
- Status: ACTIVE

### ATOM: maybes_note
dimension: behaviour

Target folder:
- aitom_family/maybes_note/behaviour/

Required files:
- aitom_family/maybes_note/behaviour/drag.md – sticky note drag logic.
- aitom_family/maybes_note/behaviour/edit.md – text editing mode.

Implementation notes:
- Canvas-like interaction (drag, pin).
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: chat_card_v1
dimension: behaviour

Target folder:
- aitom_family/chat_card_v1/behaviour/

Required files:
- aitom_family/chat_card_v1/behaviour/flip.md – settings/view toggle.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_shell
dimension: behaviour

Target folder:
- aitom_family/chat_rail_shell/behaviour/

Required files:
- aitom_family/chat_rail_shell/behaviour/resize.md – adjustable rail width.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_rail_header_bar
dimension: behaviour

Target folder:
- aitom_family/chat_rail_header_bar/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_list
dimension: behaviour

Target folder:
- aitom_family/chat_message_list/behaviour/

Required files:
- aitom_family/chat_message_list/behaviour/scroll.md – auto-scroll to bottom, sticky behaviour.
- aitom_family/chat_message_list/behaviour/virtualization.md – efficiency for long lists.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_block
dimension: behaviour

Target folder:
- aitom_family/chat_message_block/behaviour/

Required files:
- aitom_family/chat_message_block/behaviour/hover.md – action bar reveal.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_message_action_bar
dimension: behaviour

Target folder:
- aitom_family/chat_message_action_bar/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_safety_controls_bar
dimension: behaviour

Target folder:
- aitom_family/chat_safety_controls_bar/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: bottom_chat_input_bar
dimension: behaviour

Target folder:
- aitom_family/bottom_chat_input_bar/behaviour/

Required files:
- aitom_family/bottom_chat_input_bar/behaviour/expansion.md – multiline grow logic.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_shortcuts_popover
dimension: behaviour

Target folder:
- aitom_family/chat_shortcuts_popover/behaviour/

Required files:
- aitom_family/chat_shortcuts_popover/behaviour/trigger.md – "slash" command trigger.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_upload_source_picker
dimension: behaviour

Target folder:
- aitom_family/chat_upload_source_picker/behaviour/

Required files:
- aitom_family/chat_upload_source_picker/behaviour/file.md – OS file dialog vs internal picker.

Implementation notes:
- Status: ACTIVE

### ATOM: chat_icon_band_popover
dimension: behaviour

Target folder:
- aitom_family/chat_icon_band_popover/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_nano
dimension: behaviour

Target folder:
- aitom_family/surface_header_nano/behaviour/

Required files:
- aitom_family/surface_header_nano/behaviour/reveal.md – slide/fade active state.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_micro
dimension: behaviour

Target folder:
- aitom_family/surface_header_shell_micro/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_header_shell_standard
dimension: behaviour

Target folder:
- aitom_family/surface_header_shell_standard/behaviour/

Required files:
- aitom_family/surface_header_shell_standard/behaviour/sticky.md – scroll behaviour.

Implementation notes:
- Status: ACTIVE

### ATOM: surface_logo_centerpiece
dimension: behaviour

Target folder:
- aitom_family/surface_logo_centerpiece/behaviour/

Required files:
- aitom_family/surface_logo_centerpiece/behaviour/home.md – click to navigate home.

Implementation notes:
- Status: ACTIVE

### ATOM: app_header_appname_dropdown
dimension: behaviour

Target folder:
- aitom_family/app_header_appname_dropdown/behaviour/

Required files:
- aitom_family/app_header_appname_dropdown/behaviour/toggle.md – menu open/close.

Implementation notes:
- Status: ACTIVE

### ATOM: macro_temp_indicator
dimension: behaviour

Target folder:
- aitom_family/macro_temp_indicator/behaviour/

Required files:
- aitom_family/macro_temp_indicator/behaviour/update.md – live polling or ws update.

Implementation notes:
- Status: ACTIVE

### ATOM: main_menu_icon_button
dimension: behaviour

Target folder:
- aitom_family/main_menu_icon_button/behaviour/

Required files:
- aitom_family/main_menu_icon_button/behaviour/trigger.md – toggle drawer.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE

### ATOM: product_buy_buttons_block
dimension: behaviour

Target folder:
- aitom_family/product_buy_buttons_block/behaviour/

Required files:
- aitom_family/product_buy_buttons_block/behaviour/cart.md – add to cart logic, shake on error.

Implementation notes:
- Status: ACTIVE

### ATOM: product_collapsible_section
dimension: behaviour

Target folder:
- aitom_family/product_collapsible_section/behaviour/

Required files:
- aitom_family/product_collapsible_section/behaviour/toggle.md – expand/collapse state.

Implementation notes:
- Status: ACTIVE

### ATOM: product_description_block
dimension: behaviour

Target folder:
- aitom_family/product_description_block/behaviour/

Required files:
- aitom_family/product_description_block/behaviour/truncate.md – read more/less toggle.

Implementation notes:
- Status: ACTIVE

### ATOM: product_info_stack
dimension: behaviour

Target folder:
- aitom_family/product_info_stack/behaviour/

Required files:
- None. (Structural).

Implementation notes:
- Status: ACTIVE

### ATOM: product_media_gallery
dimension: behaviour

Target folder:
- aitom_family/product_media_gallery/behaviour/

Required files:
- aitom_family/product_media_gallery/behaviour/gallery.md – swipe/zoom/thumbnail selection.

Implementation notes:
- Status: ACTIVE

### ATOM: product_price_block
dimension: behaviour

Target folder:
- aitom_family/product_price_block/behaviour/

Required files:
- aitom_family/product_price_block/behaviour/update.md – reactive price update on variant change.

Implementation notes:
- Status: ACTIVE

### ATOM: product_recommendations_section
dimension: behaviour

Target folder:
- aitom_family/product_recommendations_section/behaviour/

Required files:
- aitom_family/product_recommendations_section/behaviour/fetch.md – lazy load recommendations.

Implementation notes:
- Status: ACTIVE

### ATOM: product_title_block
dimension: behaviour

Target folder:
- aitom_family/product_title_block/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: product_variant_picker
dimension: behaviour

Target folder:
- aitom_family/product_variant_picker/behaviour/

Required files:
- aitom_family/product_variant_picker/behaviour/select.md – option selection logic (pills/dropdown).

Implementation notes:
- Status: ACTIVE

### ATOM: section_blog_posts
dimension: behaviour

Target folder:
- aitom_family/section_blog_posts/behaviour/

Required files:
- aitom_family/section_blog_posts/behaviour/grid.md – responsive stacking.

Implementation notes:
- Status: ACTIVE

### ATOM: section_collection_list
dimension: behaviour

Target folder:
- aitom_family/section_collection_list/behaviour/

Required files:
- aitom_family/section_collection_list/behaviour/slider.md – optional carousel on mobile.

Implementation notes:
- Status: ACTIVE

### ATOM: section_custom_markup
dimension: behaviour

Target folder:
- aitom_family/section_custom_markup/behaviour/

Required files:
- aitom_family/section_custom_markup/behaviour/sandbox.md – script execution policy.

Implementation notes:
- Status: ACTIVE

### ATOM: section_email_signup
dimension: behaviour

Target folder:
- aitom_family/section_email_signup/behaviour/

Required files:
- aitom_family/section_email_signup/behaviour/submit.md – form submission / success state.

Implementation notes:
- Status: ACTIVE

### ATOM: section_featured_collection_grid
dimension: behaviour

Target folder:
- aitom_family/section_featured_collection_grid/behaviour/

Required files:
- aitom_family/section_featured_collection_grid/behaviour/load_more.md – pagination/infinite load.

Implementation notes:
- Status: ACTIVE

### ATOM: section_hero_banner
dimension: behaviour

Target folder:
- aitom_family/section_hero_banner/behaviour/

Required files:
- aitom_family/section_hero_banner/behaviour/parallax.md – optional scroll effect.

Implementation notes:
- Status: ACTIVE

### ATOM: section_image_with_text
dimension: behaviour

Target folder:
- aitom_family/section_image_with_text/behaviour/

Required files:
- aitom_family/section_image_with_text/behaviour/reverse.md – stacking order on mobile.

Implementation notes:
- Status: ACTIVE

### ATOM: section_media_collage
dimension: behaviour

Target folder:
- aitom_family/section_media_collage/behaviour/

Required files:
- aitom_family/section_media_collage/behaviour/layout.md – masonry or grid fit.

Implementation notes:
- Status: ACTIVE

### ATOM: section_multicolumn_features
dimension: behaviour

Target folder:
- aitom_family/section_multicolumn_features/behaviour/

Required files:
- aitom_family/section_multicolumn_features/behaviour/stack.md – responsive stack.

Implementation notes:
- Status: ACTIVE

### ATOM: section_rich_text
dimension: behaviour

Target folder:
- aitom_family/section_rich_text/behaviour/

Required files:
- None.

Implementation notes:
- Status: ACTIVE

### ATOM: section_slideshow
dimension: behaviour

Target folder:
- aitom_family/section_slideshow/behaviour/

Required files:
- aitom_family/section_slideshow/behaviour/autoplay.md – slide transition logic.

Implementation notes:
- Status: ACTIVE

### ATOM: lanes_calendar_grid_v1
dimension: behaviour

Target folder:
- aitom_family/lanes_calendar_grid_v1/behaviour/

Required files:
- aitom_family/lanes_calendar_grid_v1/behaviour/nav.md – date navigation (prev/next).
- aitom_family/lanes_calendar_grid_v1/behaviour/drop.md – drag event onto day slot.

Implementation notes:
- Status: ACTIVE

### ATOM: multi_feed_tile
dimension: behaviour

Target folder:
- aitom_family/multi_feed_tile/behaviour/

Required files:
- aitom_family/multi_feed_tile/behaviour/hover.md – tile expansion or menu reveal.

Implementation notes:
- Status: ACTIVE

STATUS: ACTIVE
