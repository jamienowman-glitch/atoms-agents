# UTM Templates Contract (Connector Factory)

## Purpose
Define a strict, drift-free schema for UTM templates with fixed locks (static params) and controlled dynamic variables. This is the only accepted schema for `utm_templates`.

## Table: `utm_templates`
Required columns:
1. `template_id` (PK, uuid)
2. `provider_slug` (text, indexed, not null)
   - Gatekeeper field; new slugs require human approval.
3. `content_type_slug` (text, not null)
   - Examples: `reel`, `checkout_flow`, `long_form`.
4. `static_params` (jsonb, not null)
   - Immutable key/value UTM parts set by admins.
   - Example: `{"utm_source":"tiktok","utm_medium":"social"}`.
5. `allowed_variables` (jsonb, not null)
   - JSON array of allowed placeholders.
   - Example: `["season","content_pool","product_type","variant"]`.
6. `pattern_structure` (text, not null)
   - Recipe string for concatenation.
   - Example: `{{year}}_{{content_pool}}_{{season}}_{{campaign_name}}`.
7. `is_approved` (boolean, not null, default false)
   - Agents may propose; only humans can approve.

## Builder Logic (Required)
- Only variables listed in `allowed_variables` may be used.
- If a variable is allowed but empty/null, the builder MUST drop that token and collapse separators so there are no double underscores or trailing separators.
  - Example: `2024__summer` becomes `2024_summer`.
- `static_params` are immutable. Agents cannot modify them.

## Example Record
```
provider_slug: "tiktok"
content_type_slug: "reel"
static_params: {"utm_source":"tiktok","utm_medium":"social"}
allowed_variables: ["year","content_pool","season","campaign_name"]
pattern_structure: "{{year}}_{{content_pool}}_{{season}}_{{campaign_name}}"
is_approved: true
```
