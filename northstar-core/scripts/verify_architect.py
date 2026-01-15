import requests
import json
import sys

try:
    url = "http://127.0.0.1:8000/api/builder/chat"
    payload = {
        "message": "I need a team to research and write a blog post about AI Agents.",
        "current_flow": [],
        "mode": "planning",
        "chat_history": "User: Hi\nArchitect: Hello! How can I help?"
    }
    
    print(f"Testing {url}...")
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    
    data = resp.json()
    print("Response Status:", resp.status_code)
    
    actions = data.get("actions", [])
    print(f"Action Count: {len(actions)}")
    
    has_visuals = any(a.get("cmd") in ["add_step", "add_agent"] for a in actions)
    
    if has_visuals:
        print("SUCCESS: Visual commands found.")
        for a in actions:
            print(f"- {a.get('cmd')}: {a.get('title') or a.get('agent_id')}")
    else:
        print("FAILURE: No visual commands found.")
        print("Thought:", data.get("thought"))
        print("Actions:", json.dumps(actions, indent=2))

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
