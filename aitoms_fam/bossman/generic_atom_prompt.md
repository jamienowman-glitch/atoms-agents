Generic atom prompt (copy/paste)
--------------------------------

You are AITOM_IMPLEMENTOR for the aitoms_fam repo.

Rules
- Start by running: `cd /Users/jaynowman/dev/aitoms_fam && pwd && ls`
- Do not touch sibling repos (`../agentflow`, `../northstar-connectors`, `../northstar-engines`).
- Only work inside `aitom_family/<ATOM_ID>/…`.
- Do not edit `docs/plans/*.md` or `docs/registry/*` unless explicitly acting as ingest architect.

Plan reading
- For each plan log, locate the ACTIVE block for this atom:
  - `docs/plans/ingest_report.md`
  - `docs/plans/behaviour_plans_log.md`
  - `docs/plans/typography_plans_log.md`
  - `docs/plans/icons_plans_log.md`
  - `docs/plans/colours_plans_log.md`
  - `docs/plans/layout_plans_log.md`
  - `docs/plans/views_plans_log.md`
  - `docs/plans/data_schema_plans_log.md`
  - `docs/plans/tracking_plans_log.md`
  - `docs/plans/accessibility_plans_log.md`
  - `docs/plans/exposed_tokens_plans_log.md`
- Treat “Required files” + “Implementation notes” in each ACTIVE block as the spec. Do not invent extra dimensions.

Folders you may touch
- `aitom_family/<ATOM_ID>/behaviour/`
- `aitom_family/<ATOM_ID>/typography/`
- `aitom_family/<ATOM_ID>/icons/`
- `aitom_family/<ATOM_ID>/colours/`
- `aitom_family/<ATOM_ID>/layout/`
- `aitom_family/<ATOM_ID>/views/`
- `aitom_family/<ATOM_ID>/data_schema/`
- `aitom_family/<ATOM_ID>/tracking/`
- `aitom_family/<ATOM_ID>/accessibility/`
- `aitom_family/<ATOM_ID>/exposed_tokens/`
- Create only the files the plans demand. No extra top-level atoms or folders.

Status discipline
- Each plan log should have only one ACTIVE block per atom at a time.
- After implementing, mark statuses in plan logs: set completed block to DONE with any brief notes, and set the next planned block (if any) to ACTIVE. (If acting as implementor only, do not edit plan logs—just follow existing ACTIVE blocks.)

Implementation reminders (summaries)
- Typography: use Roboto Flex from `docs/registry/fonts.tsv`; expose axis tokens (wght, wdth, slnt, opsz, tracking); define named presets per atom.
- Icons: reference filenames from `/Users/jaynowman/dev/aitoms_fam/icons/`; keep swap tokens for future avatars; no business names in tokens/IDs.
- Colours: use tokens for surface, stroke, fills, text roles, states, unread; avoid inline hex repetition.
- Layout: tokenized padding, gaps, avatar sizes, radius, stroke; ellipsis/truncation rules; row gaps stable across states.
- Behaviour: click/tap/keyboard interactions; hover/focus/pressed/unread/active state handling; transition tokens.
- Views: default row/card view, density variants, state visuals.
- Data schema: UI-facing shape (id, name/handle, role_label, preview, time, unread_count, is_group, avatar_set, is_active, is_muted, etc.).
- Tracking: event names, payloads, guardrails; no message content in analytics.
- Accessibility: roles/labels, keyboard support, focus ring, aria-label composition, alt text for avatars.
- Exposed tokens: list what upper layers can override across typography, colours, layout, icons, behaviour/motion.

BOSSMAN output (after implementation)
```
Implementation summary for atom: <ATOM_ID>

Dimensions implemented:
  1. Behaviour
     - Files created/updated:
       • aitom_family/<ATOM_ID>/behaviour/...
  2. Typography
     - Files created/updated:
       • aitom_family/<ATOM_ID>/typography/...
  3. Icons
     - Files created/updated:
       • aitom_family/<ATOM_ID>/icons/...
  4. Colours
     - Files created/updated:
       • aitom_family/<ATOM_ID>/colours/...
  5. Layout
     - Files created/updated:
       • aitom_family/<ATOM_ID>/layout/...
  6. Views
     - Files created/updated:
       • aitom_family/<ATOM_ID>/views/...
  7. Data Schema
     - Files created/updated:
       • aitom_family/<ATOM_ID>/data_schema/...
  8. Tracking
     - Files created/updated:
       • aitom_family/<ATOM_ID>/tracking/...
  9. Accessibility
     - Files created/updated:
       • aitom_family/<ATOM_ID>/accessibility/...
  10. Exposed Tokens
      - Files created/updated:
        • aitom_family/<ATOM_ID>/exposed_tokens/...

Notes:
  - No other atoms were modified.
  - No plan or registry files were edited.
```

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
