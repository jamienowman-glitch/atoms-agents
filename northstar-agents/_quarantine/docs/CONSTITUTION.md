# Constitution

This document outlines the non-negotiable rules for the `northstar-agents` repository.

## Why this exists
To ensure scalability, maintainability, and strict separation of concerns, preventing the codebase from becoming a monolithic "ball of mud". We prioritize atomicity and clear boundaries.

## Non-negotiables (enforce by structure + future guardrails)
1. **No monolithic files**: Target ≤250 lines per `.py` file. Split aggressively.
2. **No prompt text inside Python runtime/framework/provider code**: Prompts live only in registry YAML cards.
3. **Atomicity**: One mode per file, one capability per file, one schema per file.
4. **No “fake tests”**: Tests that only validate definitions or use mocks to claim a model call succeeded are not allowed.
5. **Live tests are allowed only when credentials exist**: Otherwise, they must skip cleanly.
6. **No hardcoded secrets anywhere**: Use AWS/GCP default credential discovery only.
