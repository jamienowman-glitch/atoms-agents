
import requests
import json
import time
import subprocess
import sys
import os

BASE_URL = "http://localhost:8020"

def run_test():
    print("Checking health...")
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health: {resp.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    print("\n1. Uploading Asset...")
    files = {'file': open('examples/dummy.mp4', 'rb')}
    resp = requests.post(f"{BASE_URL}/assets", files=files)
    if resp.status_code != 200:
        print(f"Upload failed: {resp.text}")
        return
    asset_data = resp.json()
    asset_id = asset_data['asset_id']
    print(f"Asset Uploaded: {asset_id}")

    print("\n2. Creating Timeline...")
    timeline_payload = {
        "asset_id": asset_id,
        "clips": [
             {
                 "asset_id": asset_id,
                 "start_ms": 0,
                 "end_ms": 2000,
                 "track": "primary"
             },
             {
                 "asset_id": asset_id,
                 "start_ms": 2000,
                 "end_ms": 4000,
                 "track": "primary"
             }
        ],
        "aspect_profile": "social_4_3_h264"
    }
    resp = requests.post(f"{BASE_URL}/timeline/simple", json=timeline_payload)
    if resp.status_code != 200:
        print(f"Timeline creation failed: {resp.text}")
        return
    proj_data = resp.json()
    project_id = proj_data['project_id']
    print(f"Timeline Created: {project_id}")
    print(f"Summary: {proj_data.get('timeline_summary')}")

    print("\n3. Rendering...")
    render_payload = {
        "project_id": project_id,
        "profile": "social_4_3_h264"
    }
    resp = requests.post(f"{BASE_URL}/render/simple", json=render_payload)
    if resp.status_code != 200:
        print(f"Render failed: {resp.text}")
        # Print server logs if possible? No easy way here.
        return
    render_data = resp.json()
    print(f"Render Success: {render_data}")
    
    # Check if output exists
    out_path = render_data.get("output_path")
    if os.path.exists(out_path):
        print(f"Output file verified at {out_path}")
        size = os.path.getsize(out_path)
        print(f"Size: {size} bytes")
    else:
        print(f"Output file NOT FOUND at {out_path}")

if __name__ == "__main__":
    # Wait for server to start if we just launched it
    time.sleep(2)
    run_test()
