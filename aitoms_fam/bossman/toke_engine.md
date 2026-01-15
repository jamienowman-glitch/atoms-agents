

Atomic elements, tokens and specialist agents

This repo sits one layer above the atomic UI library (aitoms_fam).
At this level we don’t reinvent components – we orchestrate them.

1. Atomic elements as the only building blocks
	•	Every visible thing on screen is built from atoms defined in the atom library.
	•	Each atom lives in its own folder and is split into dimensions (for example: behaviour, typography, colours, layout, views, data_schema, tracking, accessibility, exposed_tokens).
	•	Atoms are agnostic: they don’t “know” which app or surface they’re in. They only expose:
	•	A data shape (what they need to render), and
	•	A set of exposed tokens (what can be changed from above).

This repo never edits the implementation of atoms. It only chooses which atoms to use and what values to feed into their tokens.

2. Tokens as the control surface

Every atom exposes a clear set of tokens that can be set at this layer, for example:
	•	Layout: grid span, padding, radius, density, alignment.
	•	Typography: preset name, Roboto Flex axis sets, sizes, tracking, case rules.
	•	Colours: surface/background tokens, text tokens, state colours.
	•	Behaviour: which states are enabled, what happens on click/hover, safe defaults.
	•	Tracking: event names, tracking keys, view IDs.
	•	Accessibility: labels, roles, keyboard rules.

Pages, views and templates in this repo are therefore just token graphs:
	•	“On this view, place these atoms on the 24-column grid,
and set these tokens for colour, type, layout, behaviour, tracking, etc.”

3. Specialist agents per dimension / token set

This repo is designed so that specialist agents can work safely and independently:
	•	A colour agent only sees and edits colour tokens (surface, text, state).
	•	A typography agent only sees type presets and font-axis tokens – it never changes the words themselves.
	•	A layout agent only adjusts spans, padding, density and layout sliders, all within the 24-column grid.
	•	A behaviour agent only touches behaviour/state tokens (what happens on click, which states exist).
	•	A tracking/analytics agent only edits event names, tracking keys, view IDs, never message bodies or PII.
	•	A copy agent is the only one allowed to change text content, and it does so through content fields, not style tokens.

Because tokens are exposed per dimension, each agent can be pointed at a very small, well-defined token surface instead of the whole UI. That’s how we get deep expertise and avoid agents trampling each other’s work.

4. Builder layer responsibilities

This repo’s job is to:
	•	Assemble views from atoms (using the 24-column grid and view templates).
	•	Bind data into the atoms’ data schemas.
	•	Set and update tokens via humans and agents (styling, layout, behaviour, tracking, accessibility).
	•	Keep a clear separation between:
	•	Implementation (lives in the atom repo), and
	•	Configuration / orchestration (lives here as cards, manifests and token values).

In short: atoms are the hardware; tokens are the dials; this repo is the control desk; agents are the operators.

Backend integration cheat sheet (frontend-facing)
- Manifest/token graph: components keyed by `component_id`; content slots `content_slots.<component>.<slot>`; tokens `tokens.<domain>.<component>.<field>` (domains: typography/layout/colour/behaviour). Patches are path-scoped set|delete|merge; no cross-family writes.
- Chat scope: messages may include scope fields surface/app/federation/cluster/gang/agent (legacy kind/target_id still accepted). Scope is logged/tagged and forwarded to LLM calls. Chat transports (HTTP/WS/SSE) include only populated scope keys.
- Tiles API (planning): `GET /tiles?tenant=&env=&surface=&limit=&cursor=&types=` returns ordered tiles (PLAN-0AD schema). Optional WS/SSE. `strategy_lock_state` (pending|allowed|blocked|not_required) + actions only when pre-cleared; revalidate lock before executing. Events: `tiles.composed`, `tile.impression`, `tile.action`. Fields: tile_id, type, size_hint (S/M/L/XL), title/summary/cta_ref, nexus_refs (preferred), external_refs (allowed), pinned, order, timestamps, metadata {tenant_id, env, surface, origin, trace_id}.
- Fonts helper: inputs font_id, preset_code, optional tracking; outputs fontFamily, fontVariationSettings, letterSpacing. Tracking clamped per font bounds; presets define axis values (e.g., Roboto Flex).
- Temperature & Strategy Lock: runtime loads latest approved plan per tenant/env (`temperature_plans_{TENANT_ID}`) or defaults → measure → emit `temperature_measurement` DatasetEvent. Guarded actions: outbound sends, spend/budget, code/infra changes, credentials, destructive data writes, risk increases. Measurements/read-only flows are unguarded.
- Reactive content: watcher consumes publish/ingest DatasetEvents (e.g., `content.published.youtube_video`) and emits `content.reactive.*` follow-ups with refs/trace; no manifest writes.
- Design tools: slides/layers/clips keep content in content_slots; styling/position in tokens. Clusters scoped by capabilities (typography/layout/colour/copy/media); locks/pins may block writes.
- Tool registry: tools have tool_id, kind (external_mcp|internal_engine|http_api|local_helper), schemas, firearms_class, allowed_clusters/gangs, cooldown/rate limits, transport config. Tools do not bypass capabilities.
- Auth/BYOK (planning): tenant/user models and BYOK endpoints expect GSM-held secrets; no raw keys in logs. JWT secret in GSM `auth-jwt-secret`.
- For payload JSON shapes (chat message, tiles response, font helper I/O) or scope/tag formats, ask backend for exact examples.

- UTMs/tracking context: canonical keys `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus house keys `ref`, `click_id`. Read once from URL, store (cookie/localStorage) with expiry (7–30 days), and pass via a `context` bag on all tracking/analytics calls; backend logs UTMs on tracking and tile/chat events. Echoing UTMs in API calls via context (not top-level) is OK.
- Forms: required field `email`; optional `first_name`, `last_name`; allow `metadata`/`utm` object. Hidden fields allowed for UTMs/referrer and anti-spam. Include honeypot + submit timestamp; flag sub-5s submissions. Payload shape: `{form_id, email, first_name, last_name, metadata:{utm:{}, referrer, honeypot}, submitted_at}`. Backend strips/validates PII.
- SEO/meta/schema: defaults from server manifest/cards; FE may override via tokens/props. Expose tokens for `meta_title`, `meta_description`, `canonical_url`, `og:title/description/image`, and a JSON-LD slot (`ld_json`). Supported schema types: `FAQPage`, `Article`, `VideoObject` via `<script type="application/ld+json">` blob. Use signed og:image URL if provided; otherwise standard HTTPS.
- Embeds: allowed domains include YouTube; support privacy mode via youtube-nocookie.com toggle. CSP should allow these; no signed/short links needed for embeds.
- Tracking/consent: atoms accept `tracking_id/view_id` and emit events with `chat_id/tile_id/form_id` plus UTMs when present. Do not include message content or PII. Sinks: GA4 + internal DatasetEvents. Non-essential events gated on consent (GDPR/CCPA); essential operational logs may fire without PII.
- Tokens to expose in builder: UTM propagation toggle, hidden field key/value slots, SEO meta fields, JSON-LD blob slot, tracking context bag, consent gate toggle.
