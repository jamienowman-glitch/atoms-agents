#!/bin/bash
if ! python3 -c "import flask" &> /dev/null; then
    echo "Installing flask..."
    pip3 install flask
fi

# Find local IP
IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "127.0.0.1")

echo "-----------------------------------------------------"
echo "  ATOM VIEWER RUNNING"
echo "  Open on Mobile: http://$IP:8080"
echo "  Open on Mac:    http://localhost:8080"
echo "-----------------------------------------------------"

python3 _atom_viewer/server.py
