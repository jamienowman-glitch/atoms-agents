
#!/bin/bash
cd "$(dirname "$0")"

echo "Checking dependencies..."
# Check if a venv exists, if not create one
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements if needed
echo "Installing/Updating requirements..."
pip install -r requirements.txt

# Get local IP
IP=$(ipconfig getifaddr en0)
echo "Starting Audio Extractor..."
echo "Local Access: http://$IP:8000"
echo "Laptop Access: http://localhost:8000"

# Open browser
open "http://localhost:8000"

# Run App
python3 app.py
