
import requests
import json
import time

URL = "http://localhost:8000/api/builder/chat"

def chat(msg, flow_state=[]):
    print(f"\n\033[96mUser: {msg}\033[0m")
    try:
        start = time.time()
        resp = requests.post(URL, json={"message": msg, "current_flow": flow_state})
        resp.raise_for_status()
        data = resp.json()
        latency = time.time() - start
        
        print(f"\033[93mCo-Pilot ({latency:.1f}s): {data.get('thought')}\033[0m")
        if data.get("actions"):
            for act in data["actions"]:
                print(f"  [ACTION] {act}")
        return data.get("actions", [])
    except Exception as e:
        print(f"\033[91mError: {e}\033[0m")
        return []

def run_human_session():
    print("\033[92m=== Starting 'Messy Human' Simulation ===\033[0m")
    state = []
    
    # 1. Messy, vague request with typo
    actions = chat("yo mate i need a thing for triathlon coaching pls", state)
    state = apply_actions(state, actions)
    
    # 2. Correction using slang
    actions = chat("nah actually change that first bit to be a debate between experts", state)
    state = apply_actions(state, actions)
    
    # 3. Specific technical request but casual
    actions = chat("ok cool now add a crew to write the daily workout plan pdfs", state)
    state = apply_actions(state, actions)

    # 4. The Loop (Phase 6 Verification)
    actions = chat("and gimme a review loop so i can reject it if its bad", state)
    state = apply_actions(state, actions)
    
    print("\n\033[92m=== Simulation Complete ===\033[0m")
    print("Final State:")
    print(json.dumps(state, indent=2))

def apply_actions(state, actions):
    # Minimal mock state updater for the test context
    if not actions: return state
    new_state = list(state)
    for act in actions:
        if act['cmd'] == 'add_step':
            new_state.append({'id': act['id'], 'framework': act['framework'], 'agents': [], 'io': {}})
        elif act['cmd'] == 'add_agent':
            # find step
            for s in new_state:
                if s['id'] == act['step_id']:
                    s['agents'].append(act['agent_id'])
        elif act['cmd'] == 'set_io':
             for s in new_state:
                if s['id'] == act['step_id']:
                    s['io'][act['type']] = act['block']
    
    print(f"   \033[92m-> State Updated. Current Flow Steps: {len(new_state)}\033[0m")
    return new_state

if __name__ == "__main__":
    run_human_session()
