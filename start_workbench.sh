#!/bin/bash

# Kill any existing processes on ports 8000 and 3000/5173
pkill -f "uvicorn engines.mcp_gateway.server:app"
pkill -f "vite"

# Navigate to repo root
cd /Users/jaynowman/dev

# 1. Start Backend with Shopify Enabled
echo "Starting Engines (Backend)..."
export ENABLED_CONNECTORS="shopify,shopify_dev"
export PYTHONPATH=$PYTHONPATH:/Users/jaynowman/dev/northstar-engines
cd northstar-engines
# Run in background
python3 -m uvicorn engines.mcp_gateway.server:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Frontend
echo "Starting Studio (Frontend)..."
cd ../ui
npm run dev -- --host &
FRONTEND_PID=$!

echo "---------------------------------------------------"
echo "Workbench is starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "---------------------------------------------------"
echo "ACCESS WORKBENCH HERE: http://localhost:5173/workbench"
echo "---------------------------------------------------"

# Wait for process 
wait $BACKEND_PID $FRONTEND_PID
