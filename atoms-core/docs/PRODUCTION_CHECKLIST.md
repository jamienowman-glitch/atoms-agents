# Production Checklist: Supabase Hardening

> **Context**: You are moving to Production. Default "Dev" settings are dangerous/loose.

## 1. Authentication (The "Strict" Mode)
**Location**: Supabase Dashboard -> Authentication -> Providers -> Email

- [ ] **Confirm Email**: [ENABLE]
    -   *Why*: Prevents fake accounts / bots.
    -   *Constraint*: You **MUST** configure a Custom SMTP (Step 2) before doing this, or you will hit the 3 emails/hour limit essentially instantly.

- [ ] **Secure Password Policy**: [ENABLE]
    -   Min Length: 8+ (Recommended 12)
    -   Require Special Char, Number, Uppercase.

## 2. SMTP (Email Delivery)
**Location**: Supabase Dashboard -> Project Settings -> Authentication -> SMTP Settings

- [ ] **Custom SMTP**: [REQUIRED]
    -   *Provider*: Resend, SendGrid, or AWS SES.
    -   *Reason*: The default Supabase SMTP is for testing only (Rate limit: 3/hr).
    -   *Risk*: If you skip this and enable "Confirm Email", you will lock yourself out.

## 3. URL Configuration
**Location**: Supabase Dashboard -> Authentication -> URL Configuration

- [ ] **Site URL**: Set to your production URL (e.g., `https://atoms.app`).
- [ ] **Redirect URLs**: Add `http://localhost:3001/**` (for dev) and `https://atoms.app/**` (for prod).

## 4. Row Level Security (RLS)
**Location**: Supabase Dashboard -> Table Editor -> Database

- [ ] **RLS Enabled**: Verify ALL tables (`surfaces`, `projects`, `leads`) have RLS enabled.
- [ ] **Policies**: Verify policies exist (e.g., `Users can only see their own data`).
