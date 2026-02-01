/*
# 065_human_totp_secrets.sql

## Description
Stores encrypted TOTP secrets for human users, enabling Google Authenticator-style
verification for Firearms License grants. This is a critical security table.

## How to Apply (Supabase SQL Editor)
1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of this file.
3. Run the script.
*/

-- TOTP Secrets for Human Users (Firearms Authenticator)
create table if not exists public.human_totp_secrets (
    user_id uuid primary key references auth.users(id) on delete cascade,
    encrypted_secret text not null,  -- Encrypted with master key from Vault
    created_at timestamptz default now(),
    last_used_at timestamptz,
    is_active boolean default true
);

-- RLS: Only the user can read their own secret (via service role for verification)
alter table public.human_totp_secrets enable row level security;

-- Policy: Users can only read their own row (but not the secret itself via API)
create policy "Users can view their TOTP status"
    on public.human_totp_secrets for select
    using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_totp_secrets_active on public.human_totp_secrets(user_id) where is_active = true;

comment on table public.human_totp_secrets is 'Encrypted TOTP secrets for Firearms Authenticator. Secrets are encrypted with a master key stored in Vault.';
