

⸻

A) Global + Page Tokens (document-level)

A1) Page identity
	•	page.id
	•	page.name
	•	page.slug
	•	page.template_kind (landing/product/blog/brand_story/etc.)

A2) Page SEO + social
	•	seo.title
	•	seo.description
	•	seo.canonical_url
	•	seo.robots
	•	seo.og.title
	•	seo.og.description
	•	seo.og.image_url
	•	seo.schema_jsonld (optional; system-generated/assembled)

A3) Site/page tracking pixels (per tenant/surface/page)
	•	tracking.ga4.measurement_id
	•	tracking.meta_pixel.pixel_id
	•	tracking.tiktok_pixel.pixel_id
	•	tracking.pinterest_pixel.tag_id

A4) Default UTM tracking (inherits unless overridden)
	•	tracking.utm.default_source
	•	tracking.utm.default_medium
	•	tracking.utm.default_campaign
	•	tracking.utm.default_content
	•	tracking.utm.default_term

A5) Global layout/theme
	•	page.background.color
	•	page.background.image_url (optional)
	•	page.background.gradient (optional)
	•	page.max_width
	•	page.grid.columns
	•	page.grid.gutter_x
	•	page.grid.gutter_y

⸻

B) Universal Element Tokens (apply to every block/element)

B1) Transform / positioning (Figma/Photoshop-style)
	•	layout.position.mode (flow|absolute|fixed|sticky)
	•	layout.x
	•	layout.y
	•	layout.z_index

B2) Sizing
	•	layout.width
	•	layout.height
	•	layout.min_width
	•	layout.max_width
	•	layout.min_height
	•	layout.max_height

B3) Spacing
	•	layout.margin.top
	•	layout.margin.right
	•	layout.margin.bottom
	•	layout.margin.left
	•	layout.padding.top
	•	layout.padding.right
	•	layout.padding.bottom
	•	layout.padding.left

B4) Alignment + layout mode helpers
	•	layout.display (block|flex|grid|none)
	•	layout.flex_direction
	•	layout.wrap
	•	layout.grid_template_columns
	•	layout.justify_content
	•	layout.align_items
	•	layout.overflow_x
	•	layout.overflow_y
	•	layout.gap (generic, optional if you also use gap_x/y below)

B5) Responsive overrides (path-based)
	•	responsive.mobile.*
	•	responsive.tablet.*
	•	responsive.desktop.*

⸻

C) Universal Style Tokens (apply to every block/element)

C1) Surface / box style
	•	style.background.color
	•	style.background.opacity
	•	style.background.image_url (optional)
	•	style.border.width
	•	style.border.color
	•	style.border.style
	•	style.border.radius (or per-corner if needed later)
	•	style.shadow.kind (none|sm|md|lg|custom)
	•	style.shadow.value (if custom)

C2) Visibility + rendering
	•	style.opacity
	•	style.visibility (visible|hidden)
	•	style.overflow (visible|hidden|clip|scroll)
	•	style.blur (optional)

C3) Overlay + gradients (from old COLOR bucket, reshaped)
	•	style.overlay.color
	•	style.overlay.opacity
	•	style.text_gradient (if supported; otherwise omit until implemented)

⸻

D) Typography Tokens (shared system)

D1) Font selection + variable axes
	•	text.font.family
	•	text.font.variable_axes.weight (aka weight)
	•	text.font.variable_axes.slant (your “lean back” control)
	•	text.font.size
	•	text.font.line_height
	•	text.letter_spacing (allow “big” ranges as required)
	•	text.case (none|upper|lower|title)
	•	text.decoration (none|underline|strike)
	•	text.align (left|center|right|justify)

D2) Color + outline/fill separation
	•	text.color
	•	text.outline.width
	•	text.outline.color
	•	text.fill.color (only if separate from text.color in your renderer)

D3) Content slot
	•	content.text

D4) Typography “slots” (keep the old idea, but normalize)

Use these as named overrides for components like Multi-21:
	•	typography.base.*
	•	typography.title.*
	•	typography.subtitle.*
	•	typography.body.*
	•	typography.price.*
	•	typography.badge.*
	•	typography.quote.*
	•	typography.author.*
	•	typography.mobile.* (if you want explicit mobile typography slots)

(Each *. * means the same fields as D1–D2: family/size/weight/slant/line_height/letter_spacing/color/etc.)

⸻

E) Media Tokens (image/video) + SEO

E1) Source + type
	•	media.type (image|video)
	•	media.src
	•	media.poster_src
	•	media.autoplay
	•	media.loop
	•	media.controls

E2) Presentation
	•	media.fit (cover|contain|fill)
	•	media.focal_point.x
	•	media.focal_point.y
	•	media.aspect_ratio (1:1|4:3|16:9|9:16)

E3) SEO/export fields (explicit)
	•	media.alt_text
	•	media.filename

E4) Filters (pseudo-Photoshop starter set)
	•	media.filter.brightness
	•	media.filter.contrast
	•	media.filter.saturation
	•	media.filter.blur
	•	media.filter.hue_rotate
	•	media.filter.grayscale

⸻

F) Event + Analytics Instrumentation Tokens (from old list, kept)

These are not permissions; they’re tracking hooks.
	•	tracking.analytics_event_name
	•	tracking.click_event
	•	tracking.impression_event
	•	tracking.conversion_goal_id
	•	tracking.experiment_id

⸻

G) Data Binding Tokens (from old list, kept)
	•	data_binding.source
	•	data_binding.expr
	•	data_binding.fallback
	•	data_binding.merge_tags

⸻

H) Accessibility Tokens (kept, clarified as ARIA/a11y only)
	•	a11y.label
	•	a11y.aria_role (renamed from ambiguous role)
	•	a11y.level (for headings / aria-level where relevant)
	•	a11y.tab_index
	•	a11y.keyboard_nav (if you actually wire behavior; otherwise omit until implemented)

⸻

I) Component-Specific Tokens

I1) Multi-21 Feed Block (grid/tile renderer)

Feed binding
	•	feed.mode (feed|manual)
	•	feed.source.kind (youtube|shopify_products|shopify_collections|events|blog|brand_stories|mixed|tenant_media|generated|kpi|notifications)
	•	feed.source.feed_id
	•	feed.query.limit
	•	feed.query.sort (newest|featured|manual)

Grid controls
	•	grid.cols_mobile
	•	grid.cols_tablet
	•	grid.cols_desktop
	•	grid.gap_x
	•	grid.gap_y
	•	grid.tile_radius
	•	grid.aspect_ratio (1:1|4:3|16:9|9:16)

Tile toggles / variant
	•	tile.variant (generic|product|kpi|text|video)
	•	tile.show_title
	•	tile.show_meta
	•	tile.show_badge
	•	tile.show_cta_label
	•	tile.show_cta_arrow

Tile links + CTA
	•	tile.primary_href
	•	tile.secondary_href
	•	tile.secondary_label
	•	tile.utm.* (optional per-tile override; otherwise inherit tracking.utm.* defaults)

Manual mode payload
	•	manual.items[] (ids or inline items; your choice later)

⸻

I2) Button Block
	•	button.label
	•	button.href
	•	button.variant (primary|secondary|ghost)
	•	button.icon (optional)
	•	button.utm.*

(Button colors should come from button.style.* using the universal style fields if you want overrides, e.g. button.style.background.color, button.style.text.color.)

⸻

I3) Signup / Form Block
	•	form.list_provider (klaviyo|manychat|custom)
	•	form.list_id
	•	form.fields[]
	•	form.behavior.mode (inline|popup|flyout)
	•	form.behavior.delay_ms
	•	form.behavior.trigger (exit_intent|scroll|time|click)
	•	form.success.message
	•	form.utm.*

⸻

I4) Guides / FAQ / How-To / Did-You-Know / Profile EEAT (schema-wrapped content)

FAQ
	•	faq.items[] (q/a)
	•	faq.schema.enabled

How-to
	•	howto.steps[]
	•	howto.schema.enabled

Did you know
	•	fact.title
	•	fact.body
	•	fact.schema.enabled

Profile / EEAT
	•	profile.name
	•	profile.bio
	•	profile.credentials[]
	•	profile.links[]
	•	profile.schema.enabled

⸻

I5) Animation (minimum viable; timeline later)
	•	anim.enabled
	•	anim.preset (none|typewriter|fade|slide|scale|weight_pulse|lean_back)
	•	anim.trigger (on_load|on_scroll|on_hover|on_viewport)
	•	anim.duration_ms
	•	anim.delay_ms
	•	anim.easing

⸻

I6) Vector / Doodle Block (LOCKED IN)
	•	vector.mode (freehand|shape|path)
	•	vector.paths[] (serialized path data)
	•	vector.stroke.width
	•	vector.stroke.color
	•	vector.fill.color
	•	vector.roughness (hand-drawn feel)
	•	vector.simplify (path smoothing)
	•	vector.opacity

⸻

J) “Graph/UI Node Pack” tokens (kept separate; do NOT mix with website blocks)

These are allowed only for graph builder nodes / connector nodes / agent nodes (not page blocks):
	•	content.agent_name.*
	•	content.framework_name.*
	•	content.connector_name.*
	•	content.connector_version.*
	•	content.bindings.*
	•	etc.

(Keep them in a separate schema namespace so they don’t contaminate website-builder tokens.)

⸻

Explicit deletions (gone from tokens)

Permissions/constraints (moved to graph/lens policy)
	•	constraints.allowed_blocks
	•	constraints.allowed_children
	•	constraints.allowed_edits
	•	constraints.allowed_fonts

Export capability flags (not permissions; keep as export metadata if you want later)
	•	export.email_safe
	•	export.vml_support

