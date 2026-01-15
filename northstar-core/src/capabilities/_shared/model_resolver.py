import json
import os
from typing import Optional, Dict

BEDROCK_EVIDENCE = "docs/evidence/bedrock/latest_selection.json"
ADK_EVIDENCE = "docs/evidence/adk/latest_selection.json"

def _load_json(path: str) -> Dict[str, str]:
    if not os.path.exists(path):
        return {}
    try:
        with open(path, "r") as f:
            return json.load(f)
    except:
        return {}

def resolve_bedrock_model(kind: str = "text") -> str:
    """
    Resolves the latest proven Bedrock model ID from evidence.
    Kind: 'text', 'stream', 'vision'.
    Defaults to 'amazon.nova-2-lite-v1:0' (US Cross Region if possible) if unknown.
    """
    selection = _load_json(BEDROCK_EVIDENCE)
    
    # Try dynamic selection first
    if kind == "stream" and selection.get("stream"):
        return selection["stream"]
    if kind == "vision" and selection.get("vision"):
        return selection["vision"]
    if kind == "text" and selection.get("text"):
        return selection["text"]
    
    # Fallback if evidence missing (shouldn't happen if gate runs)
    # Use the global profile for Nova 2 as a safe default
    return "us.amazon.nova-2-lite-v1:0"

def resolve_adk_model(kind: str = "text") -> str:
    """
    Resolves latest proven ADK/Gemini model ID.
    """
    selection = _load_json(ADK_EVIDENCE)
    
    if kind == "vision" and selection.get("vision"):
        return selection["vision"]
    if kind == "text" and selection.get("text"):
        return selection["text"]
        
    return "gemini-2.5-flash"
