# AGENTS.md — Atoms Site Templates

## Mission
This repo subtree is the **source of truth** for all marketing site templates.

## Laws
- Templates live here: `/Users/jaynowman/dev/atoms-site-templates/`.
- Live sites are **separate repos** outside `/Users/jaynowman/dev/` (e.g., `/Users/jaynowman/sites/<site>`).
- Deploy via the Press pipeline (clone → repo → Pages → DNS).
- No `.env` files. Use Vault (`/Users/jaynowman/northstar-keys/`) and host env vars.

## Structure
```
/atoms-site-templates/
├── dev-tools/
├── saas-templates/
├── ecom-site-templates/
└── event-site-templates/
```
