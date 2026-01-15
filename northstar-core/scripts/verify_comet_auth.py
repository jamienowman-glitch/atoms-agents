import os
import requests
import json

# Setup Key
KEY_PATH = os.path.expanduser("~/northstar-keys/comet_key.txt")
if not os.path.exists(KEY_PATH):
    print(f"[ERROR] Key file not found at {KEY_PATH}")
    exit(1)

with open(KEY_PATH, "r") as f:
    API_KEY = f.read().strip()

print(f"Loaded API Key: {API_KEY[:4]}...{API_KEY[-4:]} (Length: {len(API_KEY)})")

API_URL = "https://api.cometapi.com/v1/chat/completions"

def test_model(model_name):
    print(f"\nTesting Model: {model_name}...")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": "Hello, are you working?"}],
        "stream": False
    }
    
    try:
        resp = requests.post(API_URL, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"Success! Response: {data['choices'][0]['message']['content']}")
            return True
        else:
            print(f"Failed. Response: {resp.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

# Test Cheap Model First
if test_model("gpt-4o-mini"):
    print("\n[SUCCESS] gpt-4o-mini works!")
else:
    print("\n[FAIL] gpt-4o-mini failed.")

# Test User's Desired Model
if test_model("gpt-4o"):
    print("\n[SUCCESS] gpt-4o works!")
else:
    print("\n[FAIL] gpt-4o failed.")
