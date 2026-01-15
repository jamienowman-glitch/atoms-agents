from pydantic import BaseModel
from typing import Literal, Dict, Optional, List

class AdkAgentRequest(BaseModel):
    tenant_id: str
    surface_id: str
    agent_id: str
    session_id: str
    user_message: str
    context: Optional[Dict] = None

class AdkMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class AdkAgentResponse(BaseModel):
    messages: List[AdkMessage]
    raw: Dict  # raw Vertex response
