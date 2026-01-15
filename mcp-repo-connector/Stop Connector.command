#!/bin/bash
echo "Stopping MCP Connector..."
pkill -f "python -m src.main"
echo "Stopped."
