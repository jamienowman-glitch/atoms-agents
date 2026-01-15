# Token Contract v1 (Authoritative)

## A) Global + Page Tokens (document-level)

### A1) Page identity
- `page.id`
- `page.name`
- `page.slug`
- `page.template_kind` (landing/product/blog/brand_story/etc.)

### A2) Page SEO + social
- `seo.title`
- `seo.description`
- `seo.canonical_url`
- `seo.robots`
- `seo.og.title`
- `seo.og.description`
- `seo.og.image_url`
- `seo.schema_jsonld` (optional; system-generated/assembled)

### A3) Site/page tracking pixels (per tenant/surface/page)
- `tracking.ga4.measurement_id`
- `tracking.meta_pixel.pixel_id`
- `tracking.tiktok_pixel.pixel_id`
- `tracking.pinterest_pixel.tag_id`

### A4) Default UTM tracking (inherits unless overridden)
- `tracking.utm.default_source`
- `tracking.utm.default_medium`
- `tracking.utm.default_campaign`
- `tracking.utm.default_content`
- `tracking.utm.default_term`

### A5) Global layout/theme
- `page.background.color`
- `page.background.image_url` (optional)
- `page.background.gradient` (optional)
- `page.max_width`
- `page.grid.columns`
- `page.grid.gutter_x`
- `page.grid.gutter_y`

## B) Universal Element Tokens (apply to every block/element)

### B1) Transform / positioning
- `layout.position.mode` (flow|absolute|fixed|sticky)
- `layout.x`
- `layout.y`
- `layout.z_index`

### B2) Sizing
- `layout.width`
- `layout.height`
- `layout.min_width`
- `layout.max_width`
- `layout.min_height`
- `layout.max_height`

### B3) Spacing
- `layout.margin.top`
- `layout.margin.right`
- `layout.margin.bottom`
- `layout.margin.left`
- `layout.padding.top`
- `layout.padding.right`
- `layout.padding.bottom`
- `layout.padding.left`

### B4) Alignment + layout mode helpers
- `layout.display` (block|flex|grid|none)
- `layout.flex_direction`
- `layout.wrap`
- `layout.grid_template_columns`
- `layout.justify_content`
- `layout.align_items`
- `layout.overflow_x`
- `layout.overflow_y`
- `layout.gap` (generic)

### B5) Responsive overrides (path-based)
- `responsive.mobile.*`
- `responsive.tablet.*`
- `responsive.desktop.*`

## C) Universal Style Tokens (apply to every block/element)

### C1) Surface / box style
- `style.background.color`
- `style.background.opacity`
- `style.background.image_url` (optional)
- `style.border.width`
- `style.border.color`
- `style.border.style`
- `style.border.radius`
- `style.shadow.kind` (none|sm|md|lg|custom)
- `style.shadow.value` (if custom)

### C2) Visibility + rendering
- `style.opacity`
- `style.visibility` (visible|hidden)
- `style.overflow` (visible|hidden|clip|scroll)
- `style.blur` (optional)

### C3) Overlay + gradients
- `style.overlay.color`
- `style.overlay.opacity`
- `style.text_gradient`

## D) Typography Tokens (shared system)

### D1) Font selection + variable axes
- `text.font.family`
- `text.font.variable_axes.weight`
- `text.font.variable_axes.slant`
- `text.font.size`
- `text.font.line_height`
- `text.letter_spacing`
- `text.case` (none|upper|lower|title)
- `text.decoration` (none|underline|strike)
- `text.align` (left|center|right|justify)

### D2) Color + outline/fill separation
- `text.color`
- `text.outline.width`
- `text.outline.color`
- `text.fill.color`

### D3) Content slot
- `content.text`

### D4) Typography “slots”
- `typography.base.*`
- `typography.title.*`
- `typography.subtitle.*`
- `typography.body.*`
- `typography.price.*`
- `typography.badge.*`
- `typography.quote.*`
- `typography.author.*`
- `typography.mobile.*`

## E) Media Tokens (image/video) + SEO

### E1) Source + type
- `media.type` (image|video)
- `media.src`
- `media.poster_src`
- `media.autoplay`
- `media.loop`
- `media.controls`

### E2) Presentation
- `media.fit` (cover|contain|fill)
- `media.focal_point.x`
- `media.focal_point.y`
- `media.aspect_ratio` (1:1|4:3|16:9|9:16)

### E3) SEO/export fields
- `media.alt_text`
- `media.filename`

### E4) Filters
- `media.filter.brightness`
- `media.filter.contrast`
- `media.filter.saturation`
- `media.filter.blur`
- `media.filter.hue_rotate`
- `media.filter.grayscale`

## F) Event + Analytics Instrumentation Tokens
- `tracking.analytics_event_name`
- `tracking.click_event`
- `tracking.impression_event`
- `tracking.conversion_goal_id`
- `tracking.experiment_id`

## G) Data Binding Tokens
- `data_binding.source`
- `data_binding.expr`
- `data_binding.fallback`
- `data_binding.merge_tags`

## H) Accessibility Tokens
- `a11y.label`
- `a11y.aria_role`
- `a11y.level`
- `a11y.tab_index`
- `a11y.keyboard_nav`

## I) Component-Specific Tokens

### I1) Multi-21 Feed Block (grid/tile renderer)
See `MULTI21_FEED_CONTRACT_v0.md`.

### I2) Button Block
- `button.label`
- `button.href`
- `button.variant` (primary|secondary|ghost)
- `button.icon`
- `button.utm.*`

### I3) Signup / Form Block
- `form.list_provider`
- `form.list_id`
- `form.fields[]`
- `form.behavior.mode`
- `form.behavior.delay_ms`
- `form.behavior.trigger`
- `form.success.message`
- `form.utm.*`

### I4) Guides / FAQ / How-To / Did-You-Know / Profile
- `faq.items[]`
- `howto.steps[]`
- `fact.title`, `fact.body`
- `profile.name`, `profile.bio`, etc.

### I5) Animation
- `anim.enabled`
- `anim.preset`
- `anim.trigger`
- `anim.duration_ms`
- `anim.delay_ms`
- `anim.easing`

### I6) Vector / Doodle Block
- `vector.mode`
- `vector.paths[]`
- `vector.stroke.width`
- `vector.stroke.color`
- `vector.fill.color`
- `vector.roughness`
- `vector.simplify`
- `vector.opacity`

## J) Graph/UI Node Pack Tokens
Namespace reserved for graph builder nodes (not website blocks).
- `content.agent_name.*`
- `content.framework_name.*`
- `content.connector_name.*`
- `content.connector_version.*`
- `content.bindings.*`
