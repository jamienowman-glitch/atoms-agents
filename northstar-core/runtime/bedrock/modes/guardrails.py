from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

# Try imports
try:
    import boto3
    BOTO3_INSTALLED = True
except ImportError:
    BOTO3_INSTALLED = False

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes Bedrock Guardrails Mode.
    Applies guardrails to checking input text.
    """
    try:
        input_text = inputs.get("input_text", "Safe text")
        guardrail_id = inputs.get("guardrail_id", "MOCK_GUARDRAIL")
        
        await emit(f"Initializing Bedrock Guardrail Check [{guardrail_id}] for text length: {len(input_text)}", {"event_type": "info"})
        
        aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
        run_real = BOTO3_INSTALLED and aws_access_key and "MOCK" not in guardrail_id
        
        status = "Pass"
        action = "NONE"
        
        if run_real:
            try:
                client = boto3.client("bedrock-runtime")
                
                # ApplyGuardrail API
                def apply_guard():
                    return client.apply_guardrail(
                        guardrailIdentifier=guardrail_id,
                        guardrailVersion="DRAFT",
                        source="INPUT",
                        content=[{"text": {"text": input_text}}]
                    )
                
                response = await asyncio.to_thread(apply_guard)
                action = response.get("action", "NONE")
                # If action is GUARDRAIL_INTERVENED, content was blocked/modified
                if action == "GUARDRAIL_INTERVENED":
                    status = "BLOCKED"

            except Exception as e:
                print(f"[Bedrock] Real Guardrail Error: {e}")
                run_real = False

        if not run_real:
             # MOCK EXECUTION
             await emit("Running in MOCK/OFFLINE Guardrail Mode", {"event_type": "warning"})
             
             await asyncio.sleep(0.1)
             
             # Mock Logic: Block if "unsafe" in text
             if "unsafe" in input_text.lower() or "block" in input_text.lower():
                 status = "BLOCKED"
                 action = "GUARDRAIL_INTERVENED"
                 await emit("Guardrail Intervened! Content blocked.", {"event_type": "alert", "severity": "high"})
             else:
                 await emit("Content passed guardrail check.", {"event_type": "success"})

        await emit(f"Guardrail Check Complete. Status: {status}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "guardrail_status": status,
            "action": action
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
