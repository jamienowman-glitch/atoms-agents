from typing import List, Dict, Any, Protocol
from dataclasses import dataclass

@dataclass
class ChatMessage:
    role: str
    content: str
    
@dataclass
class ChatResult:
    content: str
    model_id: str
    usage: Dict[str, int]

class ModelGateway(Protocol):
    """
    Abstract interface for Model Providers (Bedrock, ADK, OpenAI).
    Injected into Runtimes to allow agnostic execution.
    """
    def chat_sync(self, messages: List[ChatMessage], system: str = None, **kwargs) -> ChatResult:
        ...

    async def chat(self, messages: List[ChatMessage], system: str = None, **kwargs) -> ChatResult:
        ...
