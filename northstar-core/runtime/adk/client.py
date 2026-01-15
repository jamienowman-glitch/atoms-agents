from .config import load_adk_config
from .types import AdkAgentRequest, AdkAgentResponse, AdkMessage
import vertexai
from vertexai.generative_models import GenerativeModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_adk_agent(req: AdkAgentRequest) -> AdkAgentResponse:
    """
    Runs an ADK Agent using the Vertex AI SDK.
    Uses 'GenerativeModel' for modern Gemini support.
    """
    cfg = load_adk_config()
    
    # Initialize Vertex AI
    vertexai.init(project=cfg.project_id, location=cfg.region)
    
    try:
        # Stub strategy: If agent_id contains "/", treat as Agent Resource.
        # Else treat as model name (e.g. "gemini-1.5-flash")
        
        if "/" in req.agent_id:
             logger.info(f"Invoking Agent Resource (Stub): {req.agent_id}")
             response_text = f"[Stub] Response from Agent {req.agent_id}"
             raw_resp = {"stub": True, "agent_id": req.agent_id}
             
        else:
            # Generative Model Fallback
            model = GenerativeModel(req.agent_id)
            chat_session = model.start_chat()
            
            # Send message
            resp = chat_session.send_message(req.user_message)
            response_text = resp.text
            # Candidates structure is different in GenerativeModel, keeping it simple
            raw_resp = {"text": resp.text}

        return AdkAgentResponse(
            messages=[
                AdkMessage(role="assistant", content=response_text)
            ],
            raw=raw_resp
        )

    except Exception as e:
        logger.error(f"ADK Agent Error: {e}")
        return AdkAgentResponse(
            messages=[
                AdkMessage(role="assistant", content=f"Error invoking agent: {str(e)}")
            ],
            raw={"error": str(e)}
        )

from runtime.contract import StreamChunk
from typing import AsyncIterator
import asyncio

async def run_adk_agent_stream(req: AdkAgentRequest) -> AsyncIterator[StreamChunk]:
    """
    Runs an ADK Agent with streaming enabled.
    """
    cfg = load_adk_config()
    
    # Initialize Vertex AI
    vertexai.init(project=cfg.project_id, location=cfg.region)
    
    try:
        # Stub strategy: If agent_id contains "/", treat as Agent Resource.
        # Else treat as model name (e.g. "gemini-1.5-flash")
        
        if "/" in req.agent_id:
             logger.info(f"Invoking Agent Resource (Stub Stream): {req.agent_id}")
             # Simulate streaming for stub
             stub_text = f"[Stub] Response from Agent {req.agent_id}"
             tokens = stub_text.split(" ")
             for token in tokens:
                 txt = token + " "
                 yield StreamChunk(chunk_kind="token", text=txt, delta=txt, metadata={"agent_id": req.agent_id})
                 await asyncio.sleep(0.05)
             
        else:
            # Generative Model Fallback
            model = GenerativeModel(req.agent_id)
            chat_session = model.start_chat()
            
            # Send message with stream=True
            responses = chat_session.send_message(req.user_message, stream=True)
            
            for response in responses:
                if response.text:
                    txt = response.text
                    yield StreamChunk(chunk_kind="token", text=txt, delta=txt, metadata={"raw_chunk": True})

    except Exception as e:
        logger.error(f"ADK Agent Stream Error: {e}")
        msg = f"Error: {str(e)}"
        yield StreamChunk(chunk_kind="event", text=msg, delta=msg, metadata={"error": True})
