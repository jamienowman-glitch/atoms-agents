Backend integration cheat sheet (frontend)
-----------------------------------------

Use this when drafting plans or implementation to stay consistent with backend contracts.

- **Manifest / token graph**
  - Components keyed by `component_id`.
  - Content slots: `content_slots.<component>.<slot>`.
  - Tokens: `tokens.<domain>.<component>.<field>` (domains: typography, layout, colour, behaviour).
  - Patches: path-scoped set|delete|merge; no cross-family writes.

- **Chat scope**
  - Messages may include scope fields: `surface`, `app`, `federation`, `cluster`, `gang`, `agent` (legacy `kind`/`target_id` still accepted).
  - All scope fields are logged/tagged and forwarded to LLM calls.
  - Chat transports (HTTP/WS/SSE) carry scope with only populated keys.

- **Tiles API (planning)**
  - `GET /tiles?tenant=&env=&surface=&limit=&cursor=&types=` returns ordered tiles (PLAN-0AD schema).
  - Optional WS/SSE.
  - `strategy_lock_state` (pending|allowed|blocked|not_required) and actions included only when pre-cleared; revalidate lock before executing actions.
  - Events: `tiles.composed`, `tile.impression`, `tile.action`.
  - Payload fields: `tile_id`, `type`, `size_hint (S/M/L/XL)`, `title/summary/cta_ref`, `nexus_refs` preferred, `external_refs` allowed, `pinned`, `order`, timestamps, metadata {tenant_id, env, surface, origin, trace_id}.

- **Fonts helper**
  - Inputs: `font_id`, `preset_code`, optional `tracking`.
  - Outputs: `fontFamily`, `fontVariationSettings`, `letterSpacing`.
  - Tracking clamped per font bounds; presets define axis values (e.g., Roboto Flex).

- **Temperature & Strategy Lock**
  - Runtime loads latest approved plan per tenant/env (`temperature_plans_{TENANT_ID}`) or defaults → measure → emit `temperature_measurement` DatasetEvent.
  - Guarded actions: outbound sends, spend/budget, code/infra changes, credentials, destructive data writes, risk increases. Measurements/read-only flows are unguarded.

- **Reactive content**
  - Watcher consumes publish/ingest DatasetEvents (e.g., `content.published.youtube_video`) and emits `content.reactive.*` follow-ups with refs/trace; no manifest writes.

- **Design tools**
  - Slides/layers/clips: content stays in `content_slots`, styling/position in tokens.
  - Clusters scoped by capabilities (typography/layout/colour/copy/media); locks/pins may block writes.

- **Tool registry**
  - Tools: `tool_id`, `kind` (external_mcp|internal_engine|http_api|local_helper), schemas, firearms_class, allowed_clusters/gangs, cooldown/rate limits, transport config.
  - Tools do not bypass capabilities.

- **Auth/BYOK (planning)**
  - Tenant/user models and BYOK endpoints expect GSM-held secrets; no raw keys in logs.
  - JWT secret in GSM `auth-jwt-secret`.

- **UTMs / tracking context**
  - Canonical keys: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` plus house keys `ref`, `click_id`.
  - Read once from URL, store (cookie/localStorage) with expiry (7–30 days), and pass in a `context` bag on all tracking/analytics calls; backend logs UTMs on tracking and tile/chat events. Echo UTMs in API calls via context (not top-level) is OK.

- **Forms**
  - Required field: `email`. Optional: `first_name`, `last_name`. Allow `metadata`/`utm` object.
  - Hidden fields allowed for UTMs/referrer and anti-spam. Include honeypot + submit timestamp; flag sub-5s submissions.
  - Payload shape: `{form_id, email, first_name, last_name, metadata:{utm:{}, referrer, honeypot}, submitted_at}`. Backend strips/validates PII.

- **SEO/meta/schema**
  - Defaults from server manifest/cards; FE can override via tokens/props.
  - Expose tokens for `meta_title`, `meta_description`, `canonical_url`, `og:title/description/image`, and a JSON-LD slot (`ld_json`).
  - Supported schema types: `FAQPage`, `Article`, `VideoObject` via `<script type="application/ld+json">` blob. Use signed og:image URL if provided; otherwise standard HTTPS.

- **Embeds**
  - Allowed domains include YouTube; support privacy mode via youtube-nocookie.com toggle. CSP should allow these; no signed/short links needed for embeds.

- **Tracking / consent**
  - Atoms accept `tracking_id/view_id` and emit events with `chat_id/tile_id/form_id` plus UTMs when present.
  - Do not include message content or PII. Sinks: GA4 + internal DatasetEvents.
  - Non-essential events gated on consent (GDPR/CCPA); essential operational logs may fire without PII.

- **Builder tokens to expose**
  - UTM propagation toggle, hidden field key/value slots, SEO meta fields, JSON-LD blob slot, tracking context bag, consent gate toggle.

If frontend needs payload examples (chat message body, tiles response, font helper I/O) or scope/tag formats, request JSON shapes from backend.
