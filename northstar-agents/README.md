# Northstar Agents

## Namespace & Packaging Rules
- The only valid import namespace is `northstar.*`.
- `src/` is a folder layout, not a package name. Do not import `src.*`.
- ModeCards must reference `northstar.*` entrypoints.

## Development

### Setup
```bash
make setup
```

### Verification
```bash
# Check environment health
python -m northstar doctor

# Run guardrails (lint, tests, policies)
make guardrails

# Verify all modes (smoke test)
python -m northstar verify-modes

# List available modes
python -m northstar list-modes
```
