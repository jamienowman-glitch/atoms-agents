from .config import load_bedrock_config
from .types import BedrockRequest, BedrockResponse, BedrockMessage
import boto3
import json
import logging
from botocore.exceptions import ClientError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_bedrock(req: BedrockRequest) -> BedrockResponse:
    """
    Runs a model via Amazon Bedrock using the Converse API if possible, 
    or invokes a specific model payload if necessary (though Converse is now standard).
    """
    cfg = load_bedrock_config()
    
    # Initialize boto3
    client = boto3.client("bedrock-runtime", region_name=cfg.region, endpoint_url=cfg.endpoint_url)

    try:
        # Use Bedrock Converse API - standard text wrapper for most models (Nova, Claude 3, etc)
        # Ref: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html
        
        # Construct message list
        # Map user role (system messages usually handled separately in converse, but user can be sufficient for simple chat)
        messages = [{
            "role": "user",
            "content": [{"text": req.user_message}]
        }]
        
        # Optional: Add context as system prompt if provided? 
        # For this wiring shim, lets keep it simple. context is passed but we might not strictly need it 
        # for a basic "hello world" smoke test.
        # If context has 'system_instruction', use it.
        
        system = []
        if req.context and req.context.get("system_instruction"):
             system.append({"text": req.context["system_instruction"]})

        invoke_args = {
            "modelId": req.model_id,
            "messages": messages,
        }
        
        if system:
            invoke_args["system"] = system

        logger.info(f"Invoking Bedrock Convey API for model: {req.model_id}")
        
        response = client.converse(**invoke_args)
        
        # Parse Response
        # Structure: {'output': {'message': {'role': 'assistant', 'content': [{'text': '...'}]}}}
        
        output_message = response.get("output", {}).get("message", {})
        content_list = output_message.get("content", [])
        
        # Extract text content
        full_text = ""
        for block in content_list:
            if "text" in block:
                full_text += block["text"]
                
        return BedrockResponse(
            messages=[
                BedrockMessage(role="assistant", content=full_text)
            ],
            raw=response
        )

    except ClientError as e:
        logger.error(f"Bedrock ClientError: {e}")
        # Return structured error
        return BedrockResponse(
            messages=[
               BedrockMessage(role="assistant", content=f"AWS Bedrock Error: {e}") 
            ],
            raw={"error": str(e)}
        )
    except Exception as e:
        logger.error(f"Unexpected Bedrock Error: {e}")
        return BedrockResponse(
            messages=[
               BedrockMessage(role="assistant", content=f"Unexpected Error: {e}") 
            ],
            raw={"error": str(e)}
        )

from runtime.contract import StreamChunk
from typing import AsyncIterator
import asyncio

async def run_bedrock_stream(req: BedrockRequest) -> AsyncIterator[StreamChunk]:
    """
    Runs a model via Amazon Bedrock Converse API with streaming.
    """
    cfg = load_bedrock_config()
    client = boto3.client("bedrock-runtime", region_name=cfg.region, endpoint_url=cfg.endpoint_url)

    try:
        messages = [{
            "role": "user",
            "content": [{"text": req.user_message}]
        }]
        
        system = []
        if req.context and req.context.get("system_instruction"):
             system.append({"text": req.context["system_instruction"]})

        invoke_args = {
            "modelId": req.model_id,
            "messages": messages,
        }
        if system:
            invoke_args["system"] = system

        logger.info(f"Invoking Bedrock Convey API (Stream) for model: {req.model_id}")
        
        # Converse Stream API
        response = client.converse_stream(**invoke_args)
        stream = response.get("stream")
        
        if stream:
            for event in stream:
                # Event is a dict like {'messageStart': {}, 'contentBlockDelta': {'delta': {'text': '...'}}, ...}
                # We care about contentBlockDelta -> delta -> text
                
                if "contentBlockDelta" in event:
                    delta = event["contentBlockDelta"].get("delta", {})
                    if "text" in delta:
                        # Yield the text chunk
                        # Ideally this loop runs in an executor if the iterator blocks, 
                        # but boto3 stream iterators are sync. 
                        # We yield to satisfy AsyncIterator contract.
                        txt = delta["text"]
                        yield StreamChunk(chunk_kind="token", text=txt, delta=txt, metadata={"event": "delta"})
                        # Cooperate with event loop
                        await asyncio.sleep(0)  
                
                elif "messageStop" in event:
                    pass

    except ClientError as e:
        logger.error(f"Bedrock Stream ClientError: {e}")
        msg = f"AWS Bedrock Error: {e}"
        yield StreamChunk(chunk_kind="event", text=msg, delta=msg, metadata={"error": True})
    except Exception as e:
        logger.error(f"Unexpected Bedrock Stream Error: {e}")
        msg = f"Unexpected Error: {e}"
        yield StreamChunk(chunk_kind="event", text=msg, delta=msg, metadata={"error": True})
