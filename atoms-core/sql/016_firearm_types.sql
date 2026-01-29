-- 016_firearm_types.sql
-- Purpose: Registry for capabilities requiring explicit permission.
-- Legacy note: File named 016_firearm_types.sql but creates table firearms_licenses per 2024 standards.

CREATE TABLE IF NOT EXISTS firearms_licenses (
    license_key text PRIMARY KEY,
    category text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Seed Data (Locked Definitions)
INSERT INTO firearms_licenses (license_key, category, description) VALUES
-- Financial
('AD_SPEND_EXECUTE', 'financial', 'Turning on paid ads'),
('INVENTORY_ORDER', 'financial', 'Committing to supplier POs'),
('REFUND_ISSUE', 'financial', 'Refunding customer transactions'),
('PRICING_UPDATE', 'financial', 'Changing live product prices'),
('DISCOUNT_CREATE', 'financial', 'Generating active promo codes'),
-- Communication
('CRM_BROADCAST', 'communication', 'Sending Emails/SMS/DMs to segments'),
('CLIENT_VOICE', 'communication', 'Initiating phone calls to customers'),
('SOCIAL_PUBLISH', 'communication', 'Posting public content to feeds'),
('CLIENT_DM_REPLY', 'communication', 'Sending a direct message response'),
-- System / Founder
('CODE_DELETE', 'system', 'Deleting/Overwriting code'),
('PROD_DEPLOY', 'system', 'Pushing changes to live environment'),
('FOUNDER_HOTLINE', 'system', 'Contacting the Founder via Phone/SMS'),
('DATA_EXPORT', 'system', 'Exporting customer PII')
ON CONFLICT (license_key) DO UPDATE
SET category = EXCLUDED.category, description = EXCLUDED.description;
