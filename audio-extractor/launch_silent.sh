
#!/bin/bash

# Define project dir
PROJECT_DIR="/Users/jaynowman/dev/audio-extractor"
cd "$PROJECT_DIR"

# Activate venv
source venv/bin/activate

# install dependencies if needed (silent)
pip install -r requirements.txt > /dev/null 2>&1

# Kill existing instance if running (simple check)
pkill -f "python3 app.py"

# Start App in background
nohup python3 app.py > app.log 2>&1 &

# Wait a moment for server to start
sleep 2

# Open Browser
open "http://localhost:8000"
