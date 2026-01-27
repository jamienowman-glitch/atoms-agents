#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

matches="$(
  find "$ROOT" \
    -name '.env*' -type f \
    -not -path '*/.git/*' \
    -not -path '*/node_modules/*' \
    -not -path "$ROOT/_quarantine/*" \
    -print
)"

if [[ -n "${matches}" ]]; then
  echo ""
  echo "ERROR: .env files are forbidden in this monorepo (Vault Law)."
  echo ""
  echo "Delete these files:"
  echo "${matches}" | sed 's/^/  - /'
  echo ""
  echo "What to do instead:"
  echo "  - Read: ${ROOT}/AGENTS.md"
  echo "  - Use VaultLoader (absolute paths in /Users/jaynowman/northstar-keys/)"
  echo "  - Store config in Supabase registries / atoms-core APIs (no local .env)."
  echo ""
  exit 1
fi

