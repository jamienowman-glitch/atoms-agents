#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

echo "=== MCP Local Dev Connector ==="
echo "Initializing..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 not found."
    exit 1
fi

# Create venv if missing
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate

# Install requirements
if [ -f "requirements.txt" ]; then
    echo "Checking dependencies..."
    pip install -q -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "Error installing dependencies."
        exit 1
    fi
fi

# Check for cloudflared/ngrok
if ! command -v cloudflared &> /dev/null && ! command -v ngrok &> /dev/null; then
    echo "Warning: Neither 'cloudflared' nor 'ngrok' found in PATH."
    echo "To allow ChatGPT connection, install one via brew:"
    echo "  brew install cloudflared"
fi

# Kill existing instance on port 8000?
# Optional, but friendly.

echo "Starting server..."
open "http://localhost:8000/ui"

# Run server
# Use exec to replace shell
exec python -m src.main
