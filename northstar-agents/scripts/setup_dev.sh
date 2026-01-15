#!/bin/bash
set -e

echo "=== Northstar Agents Developer Setup ==="

# 1. Check for Python 3.12
if ! command -v python3.12 &> /dev/null; then
    echo "[WARN] python3.12 not found in PATH. Make sure it is installed."
    # We continue, as 'python' might be 3.12, handled by Makefile
fi

# 2. Run Make Setup
echo "--- Running make setup ---"
make setup

# 3. Install Pre-commit hooks
echo "--- Installing pre-commit hooks ---"
# Check if pre-commit is installed (it should be via make setup -> dev dependencies)
if [ ! -f .venv/bin/pre-commit ]; then
    echo "[ERROR] pre-commit not found in .venv. Did make setup fail?"
    exit 1
fi

.venv/bin/pre-commit install

echo ""
echo "=== Setup Complete! ==="
echo "Active Virtual Environment: source .venv/bin/activate"
echo "Run Tests: make test"
echo "Run Guardrails: make guardrails"
