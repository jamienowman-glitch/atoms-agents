from pydantic import BaseModel
from typing import Literal, Dict, Optional, List

class BedrockRequest(BaseModel):
    tenant_id: str
    surface_id: str
    model_id: str
    session_id: str
    user_message: str
    context: Optional[Dict] = None

class BedrockMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class BedrockResponse(BaseModel):
    messages: List[BedrockMessage]
    raw: Dict  # full AWS response
