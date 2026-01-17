# Contributing to Northstar Agents

Welcome! We enforce a strict, agentic architecture. Please read this before contributing.

## Core Principles

1.  **One Mode = One File**: Every agent mode MUST be a single, self-contained Python file in `src/northstar/runtime/modes/...`.
2.  **No Monoliths**: Files MUST strictly adhere to the 250-line limit.
3.  **Strict Namespace**: Only import from `northstar.*`. Never `src.*`.
4.  **No Secrets in Code**: Never use `.env` files or hardcode secrets. Use environment variables.
5.  **Strict Interfaces**: Use `RunContext` for all IO (Artifacts, Blackboard, PII).

## Development Workflow

1.  **Setup**:
    ```bash
    ./scripts/setup_dev.sh
    ```

2.  **Make Changes**:
    - Create a new mode in `src/northstar/runtime/modes/<framework>/<mode_name>.py`.
    - Register it in `src/northstar/registry/cards/framework_modes/`.

3.  **Verify**:
    ```bash
    make guardrails  # Static analysis, lint, types, tests
    make test        # Unit tests
    ```
    *Note: Pre-commit hooks will run these automatically on commit.*

4.  **Commit**:
    - Ensure your commit message is descriptive.
    - If guardrails fail, fix them before pushing.

## Verification
- Use `python -m northstar verify-modes` to smoke test all modes.
- Use `python -m northstar verify-live --framework <fw>` for live checks.
