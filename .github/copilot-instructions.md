# Atoms-Fam Agentic Laws

Use the Atoms-Fam Agentic Laws located at the top of AGENTS.md as your primary operating directive. You are physically gated by the Atoms-Shield MCP server. If you attempt to write a secret to a file or use a non-chemical name, the tool will fail. Always ask for TOTP verification for Firearms actions.

## Priority Rules

1. **NEVER** write keys or secrets to `.env`, `.key`, or local files directly.
2. All secret writing **MUST** go through the `vault_write_secret` MCP tool.
3. Platform names **MUST** be a single capitalized word (e.g., "Shopify"). No underscores. No descriptive tags.
4. Dangerous actions require a **Firearms License**. Ask the human for a 6-digit TOTP code.
5. On every new task, read `AGENTS.md` and `SKILL.md` to ensure implementation matches the Northstar.

## Failure Consequences

- The Atoms-Shield MCP server will reject your request.
- You will receive a `CHEMICAL_NAME_ERROR` or `TOTP_ERROR` response.

## For Full Context

Read the full laws in `/AGENTS.md` at the root of this repository.
