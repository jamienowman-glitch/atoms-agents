import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.bedrock.modes import guardrails

async def run_scenario():
    print("--- SCENARIO: Bedrock Guardrails ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[BEDROCK] {t}")
    
    # 1. Safe Case
    print("\nCase 1: Safe Input")
    inputs_safe = {"input_text": "This is purely safe content.", "guardrail_id": "MOCK_G"}
    res_safe = await guardrails.run({}, {}, inputs_safe, blackboard, mock_emit)
    
    # 2. Unsafe Case
    print("\nCase 2: Unsafe Input")
    inputs_unsafe = {"input_text": "This content is very unsafe and should block.", "guardrail_id": "MOCK_G"}
    res_unsafe = await guardrails.run({}, {}, inputs_unsafe, blackboard, mock_emit)
    
    print(f"\nResult Safe: {res_safe['guardrail_status']}")
    print(f"Result Unsafe: {res_unsafe['guardrail_status']}")
    
    if res_safe['guardrail_status'] == "Pass" and res_unsafe['guardrail_status'] == "BLOCKED":
        print("SUCCESS: Bedrock Guardrails Mode executed correctly.")
    else:
        print("FAIL: Bedrock Guardrails Mode failed logic.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
