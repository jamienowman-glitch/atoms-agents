# Firearms Licenses Contract (Connector Factory)

## Purpose
Define the registry of explicit permissions required for sensitive capabilities. This is the only safety gate. No danger levels or parallel gating fields are allowed.

## Table: `firearms_licenses`
Required columns:
1. `license_key` (PK, text)
   - Immutable code used in logic checks (e.g., `AD_SPEND_EXECUTE`).
2. `category` (text, not null)
   - UI grouping (e.g., `financial`, `communication`, `system`).
3. `description` (text, not null)
   - Clear, human-readable permission description.

## Seed Data (Initial Licenses)
### Financial
- `AD_SPEND_EXECUTE` — Turning on paid ads
- `INVENTORY_ORDER` — Committing to supplier POs
- `REFUND_ISSUE` — Refunding customer transactions
- `PRICING_UPDATE` — Changing live product prices
- `DISCOUNT_CREATE` — Generating active promo codes

### Communication
- `CRM_BROADCAST` — Sending Emails/SMS/DMs to segments
- `CLIENT_VOICE` — Initiating phone calls to customers
- `SOCIAL_PUBLISH` — Posting public content to feeds
- `CLIENT_DM_REPLY` — Sending a direct message response

### System / Founder
- `CODE_DELETE` — Deleting/Overwriting code
- `PROD_DEPLOY` — Pushing changes to live environment
- `FOUNDER_HOTLINE` — Contacting the Founder via Phone/SMS
- `DATA_EXPORT` — Exporting customer PII

## Enforcement Note
All scope gating must be implemented through `requires_firearm` + `firearm_type_id` (or direct license checks where applicable). Do not add alternate risk fields.
