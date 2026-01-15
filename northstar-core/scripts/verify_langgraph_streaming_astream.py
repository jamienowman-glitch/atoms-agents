import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import streaming_astream

async def run_scenario():
    print("--- SCENARIO: LangGraph Streaming (Astream) ---")
    blackboard = Blackboard()
    
    events = []
    async def mock_emit(t, m): 
        print(f"[LANGGRAPH] {t}")
        if m.get("event_type") == "stream_chunk":
            events.append(m)

    inputs = {"count_to": 3}
    
    res = await streaming_astream.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    print(f"Captured {len(events)} stream chunks.")
    
    if res["status"] == "PASS" and res["final_count"] == 3 and len(events) == 3:
        print("SUCCESS: LangGraph Streaming Mode executed correctly.")
    else:
        print("FAIL: Streaming count or chunks mismatch.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
