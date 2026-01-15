from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import boto3
import json

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes Bedrock ConverseStream.
    """
    try:
        model_id = inputs.get("model_id", "mistral.ministral-3-8b-instruct")
        user_msg = inputs.get("input_text", "Hello")
        
        client = boto3.client("bedrock-runtime", region_name="us-east-1")
        
        messages = [{"role": "user", "content": [{"text": user_msg}]}]
        
        # Threaded call for streaming response to avoid blocking loop
        # But boto3 invoke_stream returns a stream object we iterate.
        # We need to iterate it in a thread or use aasync wrapper if available (boto isn't async).
        
        full_text = ""
        
        def stream_worker():
            nonlocal full_text
            response = client.converse_stream(
                modelId=model_id,
                messages=messages
            )
            stream = response.get('stream')
            if stream:
                for event in stream:
                    if 'contentBlockDelta' in event:
                        text = event['contentBlockDelta']['delta']['text']
                        full_text += text
                        # Bridge to asyncio emit
                        asyncio.run_coroutine_threadsafe(
                             emit(text, {"action_type": "delta", "text": text, "framework": "bedrock"}),
                             asyncio.get_event_loop()
                        )
        
        await emit(f"Invoking Bedrock {model_id}...", {"event_type": "info"})
        await asyncio.to_thread(stream_worker)
        
        await emit(full_text, {"action_type": "write", "text": full_text})
        
        return {"status": "PASS", "final_output": full_text}

    except Exception as e:
        traceback.print_exc()
        await emit(f"Error in Bedrock: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
