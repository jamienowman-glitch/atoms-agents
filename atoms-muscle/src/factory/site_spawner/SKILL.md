---
name: site-spawner
description: God Tool for spawning fully functional websites in 30 seconds.
---

# Site Spawner Skill

This skill allows you to "spawn" a complete website from scratch. It handles the entire lifecycle:
1.  **Buying a Domain** (via Cloudflare Registrar).
2.  **Creating a Code Repository** (via GitHub).
3.  **Deploying the Code** (via Cloudflare Pages).
4.  **Connecting the Domain** (DNS + SSL).
5.  **Injecting Analytics & SEO** (Mother Harness).

## Tools

### `create_site`
Spawns the site.

**Arguments**:
*   `name` (string, required): The project name (e.g., "summer-sale-2026"). used for the Repo name (`site-<name>`) and Pages project name.
*   `domain_strategy` (string, required):
    *   `"subdomain"`: Deploys to `<name>.pages.dev` (Free, instant).
    *   `"purchase"`: Buys a real .com domain (Cost money, takes ~10s).
*   `domain_name` (string, optional): The domain to buy (e.g., "mysummersale.com"). Required if strategy is `purchase`.
*   `template_id` (string, required): The template to use. Common options:
    *   `ecom/brutalist`
    *   `marketing/waiting-list`
    *   `blog/minimal`

## Usage Examples

**1. Fast Prototype (Free)**
> "Spin up a waiting list for Project X"
```json
{
  "name": "project-x-waitlist",
  "domain_strategy": "subdomain",
  "template_id": "marketing/waiting-list"
}
```

**2. Production Launch (Real Domain)**
> "Launch the store at my-cool-store.com"
```json
{
  "name": "my-cool-store",
  "domain_strategy": "purchase",
  "domain_name": "my-cool-store.com",
  "template_id": "ecom/brutalist"
}
```

## Failure Modes
*   **Domain Unavailable**: The tool will error if the domain is taken. Ask user for a different name.
*   **Repo Exists**: It will try to use the existing repo or fail.
