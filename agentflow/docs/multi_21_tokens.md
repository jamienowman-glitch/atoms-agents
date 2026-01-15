 The slider “pairs/pages” (canonical)

Page A — Grid density (primary)
	•	Left slider → grid.cols_desktop
What it does: how many tiles per row on desktop.
	•	Right slider → grid.cols_mobile
What it does: how many tiles per row on mobile.

Optional extension later: add grid.cols_tablet as a third (not part of the 2-slider pair).

⸻

Page B — Tile gaps (horizontal vs vertical)
	•	Left slider → grid.gap_x
What it does: horizontal spacing between tiles.
	•	Right slider → grid.gap_y
What it does: vertical spacing between tiles.

⸻

Page C — Tile shape vs rounding
	•	Left slider (stepped) → grid.aspect_ratio
What it does: shape of each tile (1:1, 4:3, 16:9, 9:16).
	•	Right slider → grid.tile_radius
What it does: corner roundness of each tile.

⸻

Page D — Feed volume vs scroll behavior (the “how much content” page)
	•	Left slider → feed.query.limit
What it does: how many items the feed requests / renders (your “itemCount” becomes this).
	•	Right slider → layout.overflow_y (enum/stepped, not continuous)
What it does: whether the block area scrolls/clips/overflows (in your designer you can keep it as a stepped toggle, not a true slider).

If you don’t want overflow yet, keep Right slider unused for now and just ship feed.query.limit.

⸻

Page E — Absolute position (only if you’re in “freeform / absolute” mode)
	•	Left slider → layout.x
What it does: moves the block horizontally in canvas coordinates.
	•	Right slider → layout.y
What it does: moves the block vertically.

(You said this exists as a family; Multi-21 doesn’t have to expose this until it’s inside the real canvas.)

⸻

Page F — Padding (block interior breathing space)
	•	Left slider → layout.padding.left + layout.padding.right (linked)
What it does: horizontal padding around the grid inside the block.
	•	Right slider → layout.padding.top + layout.padding.bottom (linked)
What it does: vertical padding around the grid inside the block.

⸻

Page G — Animation (for “still vs scrolling”)
	•	Left slider/toggle → anim.enabled (bool / stepped)
What it does: animation on/off.
	•	Right slider/enum → anim.preset
What it does: which animation preset (this is where “still vs scrolling feed” lives).

If you don’t have a scrolling preset defined yet, you can still wire anim.enabled + anim.preset with whatever enum already exists, and add the scrolling preset later in the contract/registry.

⸻

2) Multi-21 tokens grouped + “what control it wants”

A) Feed (where items come from)
	•	feed.mode (enum: feed|manual)
Real world: whether items are pulled from a feed or manually curated.
	•	feed.source.kind (enum)
Real world: youtube/shopify/etc.
	•	feed.source.feed_id (select)
Real world: which saved feed you’re using.
	•	feed.query.limit (slider/number)
Real world: how many items to show.
	•	feed.query.sort (select)
Real world: newest/featured/manual.

B) Grid (how tiles lay out)
	•	grid.cols_mobile (slider)
	•	grid.cols_tablet (slider)
	•	grid.cols_desktop (slider)
	•	grid.gap_x (slider)
	•	grid.gap_y (slider)
	•	grid.tile_radius (slider)
	•	grid.aspect_ratio (select/stepped)

C) Tile visibility + behaviour
	•	tile.variant (select) generic|product|kpi|text|video
	•	tile.show_title (toggle)
	•	tile.show_meta (toggle)
	•	tile.show_badge (toggle)
	•	tile.show_cta_label (toggle)
	•	tile.show_cta_arrow (toggle)
	•	tile.primary_href (text/link)
	•	tile.secondary_href (text/link)
	•	tile.secondary_label (text)
	•	tile.utm.* (advanced text inputs)

D) Optional style/typography (shared system)

These are not “Multi-21 only”, but you will want them later:
	•	Color surface: style.background.color, style.overlay.color, text.color (color pickers)
	•	Typography surface: typography.title.*, typography.body.*, etc (sliders/selects)

⸻

3) What you have today (agentflow) → canonical tokens (the rename sweep)

From your recon, you currently have these “CURRENT KEYS” in ToolControlContext:

Current key	Canonical token path to rename to	Notes
colsDesktop	grid.cols_desktop	direct
colsMobile	grid.cols_mobile	direct
tileGap	grid.gap_x and grid.gap_y	today it’s one knob; rename to grid.gap_x and mirror into grid.gap_y until you split the sliders
tileRadius	grid.tile_radius	direct
itemCount	feed.query.limit	treat the mock generator as feed limit
align	(keep as UI-only for now) or later layout.justify_content	your current “align” is block alignment; it’s not in Multi-21 contract tokens as-is
tileVariant	tile.variant	direct
aspectRatio	grid.aspect_ratio	but convert values (square/portrait/landscape) → (1:1/9:16/16:9)
showTitle	tile.show_title	direct
showMeta	tile.show_meta	direct
showBadge	tile.show_badge	direct
showCtaLabel	tile.show_cta_label	direct
showCtaArrow	tile.show_cta_arrow	direct
previewMode	UI-only (NOT a token)	keep local; don’t rename into token space

That’s the clean “convention sweep”: same behaviour, same UI, just canonical names.

⸻

4) Pre-prompt to make Multi-21 “real” in agentflow (without moving repos yet)

This is the “instruction header” you can prepend to any implementation prompt so agents don’t go off-road:
	•	Do not change styling.
	•	Do not change behaviour.
	•	Only change names / mapping keys to canonical token paths.
	•	Keep mock data and the existing nice preview.
	•	No builder canvas work. No workbench. No chat rail changes.

⸻

5) Two individual prompts (Sweep 1 + Sweep 2)

PROMPT 1 — Sweep 1 (rename keys to canonical tokens, keep behaviour + styling)

ROLE: REPO-CONNECTED CODING AGENT
REPO: agentflow
MODE: IMPLEMENT
OUTPUT: PR (DO NOT MERGE)

SCOPE
Multi-21 ONLY: rename the current ToolControlContext keys and any related wiring to match canonical token paths.
KEEP BEHAVIOUR IDENTICAL. KEEP STYLING IDENTICAL. KEEP MOCK DATA.

HARD RULES
- Do NOT change UI layout, spacing, CSS classes, Tailwind classes, or visuals.
- Do NOT add new controls/pages/tools.
- Do NOT refactor architecture.
- Do NOT touch chat rail, canvas, or any other features.
- Do NOT invent new token names: use ONLY these canonical token paths:

Grid:
- grid.cols_desktop
- grid.cols_mobile
- grid.gap_x
- grid.gap_y
- grid.tile_radius
- grid.aspect_ratio

Feed:
- feed.query.limit

Tile:
- tile.variant
- tile.show_title
- tile.show_meta
- tile.show_badge
- tile.show_cta_label
- tile.show_cta_arrow

UI-only (do not convert to tokens):
- previewMode
- (any “designer frame” state)

TASKS
1) Replace the ToolControlContext state keys:
   - colsDesktop -> grid.cols_desktop
   - colsMobile -> grid.cols_mobile
   - tileRadius -> grid.tile_radius
   - itemCount -> feed.query.limit
   - tileVariant -> tile.variant
   - showTitle -> tile.show_title
   - showMeta -> tile.show_meta
   - showBadge -> tile.show_badge
   - showCtaLabel -> tile.show_cta_label
   - showCtaArrow -> tile.show_cta_arrow
   - aspectRatio -> grid.aspect_ratio (convert values: square/portrait/landscape => 1:1 / 9:16 / 16:9)

2) For tileGap:
   - Replace tileGap with grid.gap_x in state.
   - Mirror it into grid.gap_y in code (so behaviour stays the same) until Sweep 2 splits them.

3) Update all useToolState calls and initial state accordingly.
4) Update Multi21.tsx props mapping so it reads the renamed token paths.
5) Keep previewMode unchanged (still local).

VERIFICATION
- Running the Multi-21 designer view should look identical before/after.
- Sliders and toggles should still work exactly the same.
- No visual diffs except the internal key names.


⸻

PROMPT 2 — Sweep 2 (add the missing slider pages + split gaps, still keep styling)

ROLE: REPO-CONNECTED CODING AGENT
REPO: agentflow
MODE: IMPLEMENT
OUTPUT: PR (DO NOT MERGE)

SCOPE
Multi-21 ONLY: expand the existing BottomControlsPanel slider system into the agreed slider “pages/pairs”
WITHOUT changing existing styling language. Keep the same look and interaction style (icon row switching).
No canvas, no chat rail.

HARD RULES
- Do NOT change the Multi-21 tile/card styling. Keep it “beautiful squares” as-is.
- Do NOT introduce emoji icons. Use the existing SVG/icon style already in the Multi-21 controls.
- Do NOT remove existing controls; only extend.
- Do NOT invent token names. Use ONLY:
  grid.cols_desktop, grid.cols_mobile, grid.cols_tablet
  grid.gap_x, grid.gap_y
  grid.tile_radius
  grid.aspect_ratio (1:1|4:3|16:9|9:16)
  feed.query.limit
  tile.variant
  tile.show_title, tile.show_meta, tile.show_badge, tile.show_cta_label, tile.show_cta_arrow
  anim.enabled, anim.preset (wire UI, can remain “stubbed” if preset list not final)

DELIVERABLES
1) Implement slider pages/pairs (icon-row switching, same behaviour pattern):
   Page A: grid.cols_desktop (L) + grid.cols_mobile (R)
   Page B: grid.gap_x (L) + grid.gap_y (R)  [split the old single gap]
   Page C: grid.aspect_ratio (L stepped) + grid.tile_radius (R)
   Page D: feed.query.limit (L) + (optional) anim.enabled/anim.preset (R) as stepped/enum controls
   Add grid.cols_tablet as either:
     - an “advanced” third control inside the density page, OR
     - a second density page variant.
   Keep the UI visually consistent with what exists.

2) Ensure Multi21.tsx uses:
   - gap_x for column gap and gap_y for row gap.
   - aspect_ratio maps to the existing aspect CSS classes.
   - tile_radius continues to control rounding.

3) Ensure variant + show toggles remain in Settings panel (or wherever they currently live),
   but now they must be using canonical token paths (tile.variant, tile.show_*).

4) Keep mock content generation:
   - feed.query.limit drives item generation count.
   - if tile.variant == video, allow a hardcoded single YouTube/video URL for preview ONLY (no backend work).

VERIFICATION
- You can switch slider pages via the icon row.
- Both gap sliders work independently.
- Aspect ratio steps through 1:1, 4:3, 16:9, 9:16.
- Visual styling remains unchanged (no “ugly boxes” regression).


⸻

What you said you’re missing (docs-wise)

Yes: you’re missing (or you can’t currently locate) the doc that states “this surface edits these token families” and the registry mapping for tool surfaces → tokens. But you asked me not to plan the next steps here, so I’m not going to expand that—just confirming: your instinct is correct that there’s a missing contract layer describing tool surfaces + their token bindings.

If you paste the current BottomControlsPanel.tsx (just that file) I can also rewrite the slider-pair list in exactly the same “icon order” you already have, so the pages match your muscle memory.

1) Multi-21 slider pairs (the “pages”) — quick list + what each does

Page A — Density
	•	Left: grid.cols → how many tiles per row (the “columns”)
	•	Right: feed.query.limit → how many tiles total (so “rows” is implied by limit ÷ cols)

Page B — Gaps
	•	Left: grid.gap_x → horizontal spacing between tiles
	•	Right: grid.gap_y → vertical spacing between tiles

Page C — Shape + Rounding
	•	Left (stepped): grid.aspect_ratio → tile shape (1:1 / 4:3 / 16:9 / 9:16)
	•	Right: grid.tile_radius → corner roundness

Page D — Tile visibility
	•	Left: tile.show_title → show/hide title
	•	Right: tile.show_meta → show/hide meta line

Page E — Badge + CTA
	•	Left: tile.show_badge → show/hide badge
	•	Right: tile.show_cta_label → show/hide CTA label
(CTA arrow can live as a third toggle on this page or swapped in as Right if you prefer)

Page F — Video behavior (only matters when tile.variant=video)
	•	Left: media.autoplay → autoplay video tiles
	•	Right: media.loop → loop video tiles
(media.controls can be a third toggle)

⸻

2) The “magnifying glass” selector — what it should do (so they build it right)

You want a center-locked wheel (like iOS picker):
	•	There is a fixed center slot (the “selection window”).
	•	Items scroll left/right behind that window.
	•	Whatever is closest to center is selected.
	•	The selected item is magnified (scale up), neighbors slightly smaller, far items smaller/faded.
	•	When you stop dragging, it snaps so an item lands exactly centered.
	•	Optional: subtle haptic tick / click sound per item step.

Key implementation notes (non-code):
	•	Selection is driven by position, not click.
	•	Use snap points (one per item) so it always settles perfectly.
	•	The “middle stays middle” means: the track moves, the viewport doesn’t.

If they built “a scrolling row where the center changes” or “you swipe and the whole strip moves with no snap”, it’s the wrong interaction model.

⸻

3) Multi-21 token list (full list you’re using/need)

Feed
	•	feed.mode
	•	feed.source.kind
	•	feed.source.feed_id
	•	feed.query.limit
	•	feed.query.sort

Grid
	•	grid.cols
	•	grid.gap_x
	•	grid.gap_y
	•	grid.tile_radius
	•	grid.aspect_ratio

Tile
	•	tile.variant
	•	tile.show_title
	•	tile.show_meta
	•	tile.show_badge
	•	tile.show_cta_label
	•	tile.show_cta_arrow
	•	tile.primary_href
	•	tile.secondary_href
	•	tile.secondary_label
	•	tile.utm.*

Media (tile variant video / media tiles)
	•	media.type
	•	media.src
	•	media.poster_src
	•	media.autoplay
	•	media.loop
	•	media.controls
	•	media.fit
	•	media.focal_point.x
	•	media.focal_point.y
	•	media.aspect_ratio
	•	media.filter.* (brightness/contrast/saturation/blur/hue_rotate/grayscale)

Animation (optional)
	•	anim.enabled
	•	anim.preset
	•	anim.trigger
	•	anim.duration_ms
	•	anim.delay_ms
	•	anim.easing

⸻

4) Color tokens for Multi-21 (and good left/right slider pairings)

These are the ones you’ll actually want for KPI tiles + backgrounds:

Page: Tile surface
	•	Left: style.background.opacity → transparency of tile background
	•	Right: style.border.radius (or keep grid.tile_radius and use this for border width below)

Page: Border + shadow
	•	Left: style.border.width → tile border thickness
	•	Right: style.opacity (or style.shadow.kind as stepped selector)

Page: Overlay
	•	Left: style.overlay.opacity → overlay strength (great for KPI readability)
	•	Right: style.blur → blur amount (optional; only if you actually use it)

Non-slider (picker / select) color fields
	•	style.background.color (color picker)
	•	style.border.color (color picker)
	•	style.overlay.color (color picker)
	•	text.color (color picker)
	•	text.fill.color (color picker)
	•	text.outline.color (color picker)

If you really insist on “color on sliders”, the only sane slider form is opacity, not hue. Hue sliders are almost always a UX mess on mobile.

⸻

5) Typography tokens (and good left/right slider pairings)

Core “always useful” sliders

Page: Size + leading
	•	Left: text.font.size
	•	Right: text.font.line_height

Page: Weight + tracking
	•	Left: text.font.variable_axes.weight
	•	Right: text.letter_spacing

Page: Slant + case (case is stepped)
	•	Left: text.font.variable_axes.slant
	•	Right (stepped): text.case (none/upper/lower/title)

Page: Align + decoration (both stepped)
	•	Left (stepped): text.align (left/center/right/justify)
	•	Right (stepped): text.decoration (none/underline/strike)

Typography “slots” (if you want per-role styling)

These are usually edited via dropdown (“which slot am I editing?”) then the same sliders above apply:
	•	typography.title.*
	•	typography.body.*
	•	typography.badge.*
	•	typography.price.*
	•	etc.

If you want an immediate Multi-21-specific approach:
	•	Treat Title and Meta as two “targets”:
	•	Title edits map to typography.title.*
	•	Meta edits map to typography.body.* (or typography.subtitle.*)
	•	Badge edits map to typography.badge.*

⸻

If you tell me one thing: do you want the density page to be (cols + limit) permanently, or later switch to (cols + rows)?
I’ll keep the list aligned so you don’t have to rename again.