/*
# 021_firearms_licenses.sql

## Description
Defines the firearms_licenses registry (explicit permissions required for sensitive actions).

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.
*/

create table if not exists public.firearms_licenses (
    license_key text primary key,
    category text not null,
    description text not null,
    created_at timestamptz default now()
);

-- Seed data (initial licenses)
insert into public.firearms_licenses (license_key, category, description)
values
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
on conflict (license_key) do nothing;
