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
    Executes Bedrock Knowledge Bases Mode.
    Retrieves information from a KB.
    """
    try:
        kb_id = inputs.get("kb_id", "MOCK_KB_ID")
        query = inputs.get("query", "Default Query")
        
        await emit(f"Initializing Bedrock KB Retrieval [{kb_id}] for: {query}", {"event_type": "info"})
        
        aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
        run_real = BOTO3_INSTALLED and aws_access_key and "MOCK" not in kb_id
        
        retrieved_results = []
        generated_answer = ""

        if run_real:
            try:
                client = boto3.client("bedrock-agent-runtime")
                
                # retrieveAndGenerate is a common pattern
                def invoke_kb():
                    return client.retrieve_and_generate(
                        input={'text': query},
                        retrieveAndGenerateConfiguration={
                            'type': 'KNOWLEDGE_BASE',
                            'knowledgeBaseConfiguration': {
                                'knowledgeBaseId': kb_id,
                                'modelArn': 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2' # Example
                            }
                        }
                    )
                
                response = await asyncio.to_thread(invoke_kb)
                generated_answer = response.get("output", {}).get("text", "")
                
                # Citations usually contain the chunks
                if "citations" in response:
                    for cit in response["citations"]:
                        for ref in cit.get("retrievedReferences", []):
                            retrieved_results.append(ref.get("content", {}).get("text", "N/A"))

            except Exception as e:
                print(f"[Bedrock] Real KB Error: {e}")
                run_real = False

        if not run_real:
             # MOCK EXECUTION
             await emit("Running in MOCK/OFFLINE KB Mode", {"event_type": "warning"})
             
             await asyncio.sleep(0.1)
             await emit("Retrieving relevant chunks...", {"event_type": "trace", "step": "RETRIEVAL"})
             
             # Mock Result
             retrieved_results = [
                 f"Chunk 1: Details about '{query}'...",
                 f"Chunk 2: More info regarding '{query}'..."
             ]
             generated_answer = f"Based on the knowledge base, here is the answer to '{query}': [Simulated Content]"
             
             for chunk in retrieved_results:
                 await emit(f"Retrieved: {chunk[:50]}...", {"event_type": "retrieval_chunk"})

        await emit(f"KB Execution Complete. Answer: {generated_answer}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "generated_answer": generated_answer,
            "retrieved_chunks": retrieved_results
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
