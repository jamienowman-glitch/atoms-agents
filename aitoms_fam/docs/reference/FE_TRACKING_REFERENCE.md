# FE TRACKING / FORMS / SEO REFERENCE

Reference payloads and implementation notes for FE/BE alignment.

## Form submit (UTMs, anti-spam, hidden fields)
```json
{
  "form_id": "signup_newsletter",
  "email": "user@example.com",
  "first_name": "Ada",
  "last_name": "Lovelace",
  "metadata": {
    "utm": {
      "utm_source": "newsletter",
      "utm_medium": "email",
      "utm_campaign": "spring_launch",
      "utm_content": "cta_button",
      "utm_term": "",
      "ref": "home_hero",
      "click_id": "clk_123"
    },
    "referrer": "https://example.com/",
    "honeypot": ""
  },
  "submitted_at": "2024-01-01T12:00:00Z"
}
```
- Required: `email`. Optional: `first_name`, `last_name`. `metadata.utm` + `referrer` allowed. Include honeypot + `submitted_at`; flag/reject sub-5s submits.

## Chat tracking event
```json
{
  "event": "chat_card_open",
  "chat_id": "chat_123",
  "is_group": false,
  "unread_count_before": 3,
  "unread_count_after": 0,
  "role_label": "SUPPORT",
  "tracking_id": "view_chat_list",
  "context": {
    "utm_source": "search",
    "utm_medium": "cpc",
    "utm_campaign": "brand",
    "utm_content": "ad_variant_b",
    "utm_term": "keyword",
    "ref": "lp1",
    "click_id": "gclid123"
  },
  "input_method": "mouse",
  "consent_granted": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```
- Context carries UTMs/refs; omit message content/PII in analytics.

## Tile impression/action
```json
{
  "event": "tile.impression",
  "tile_id": "tile_abc",
  "type": "promo",
  "size_hint": "M",
  "tracking_id": "view_home",
  "context": {
    "utm_source": "email",
    "utm_medium": "newsletter",
    "utm_campaign": "spring_launch",
    "ref": "march_drop",
    "click_id": "clk_789"
  },
  "metadata": { "tenant_id": "t1", "env": "prod", "surface": "home" },
  "timestamp": "2024-01-01T12:00:00Z"
}
```
- Revalidate `strategy_lock_state` before actions; include `tile_id/type/size_hint/tracking_id`.

## SEO / JSON-LD slots
```json
{
  "meta_title": "FAQ – Product",
  "meta_description": "Answers to common questions.",
  "canonical_url": "https://example.com/faq",
  "og": {
    "title": "FAQ – Product",
    "description": "Answers to common questions.",
    "image": "https://cdn.example.com/og/faq.png"
  },
  "ld_json": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is it?",
        "acceptedAnswer": { "@type": "Answer", "text": "It’s a service…" }
      }
    ]
  }
}
```
- Tokens/props should expose meta/og/canonical + JSON-LD blob per view; defaults from server manifest, override per surface.

## Implementation notes
- UTMs: canonical keys `utm_source|utm_medium|utm_campaign|utm_content|utm_term` plus `ref`, `click_id`. Capture from URL once, store (cookie/localStorage) 7–30d, pass via `context` on events/API calls.
- Forms: include honeypot + `submitted_at`; allow hidden UTMs/referrer; backend strips/validates PII.
- Tracking: require `tracking_id/view_id`; include `chat_id/tile_id/form_id` as relevant; omit PII/message content.
- SEO/Schema: support JSON-LD slot; server provides defaults, FE can override.
- Embeds: support youtube-nocookie toggle; CSP allow YouTube; signed URLs not needed unless provided.
- Consent: gate non-essential analytics until consent (GDPR/CCPA); operational logs can proceed without PII.
