
"""
Runtime Adapter Contract.
Defines the interface for all runtime adapters in northstar-core.
"""
from typing import Any, Dict, Protocol, runtime_checkable, TypedDict, AsyncIterator, Optional

class StreamChunk(TypedDict):
    """
    A single chunk of a streamed response.
    """
    chunk_kind: str # "token" | "event"
    text: str # The content delta
    delta: str # Deprecated: Alias for text (for backward compat)
    metadata: Optional[Dict[str, Any]]

@runtime_checkable
class RuntimeAdapter(Protocol):
    """
    Protocol for runtime adapters.
    
    Adapters must be thin wrappers around orchestration frameworks.
    They must NOT contain business logic, prompts, or governance rules.
    """
    
    def invoke(
        self, 
        card_id: str, 
        input_data: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes the runtime with a card reference and inputs.
        
        Args:
            card_id: The ID/path of the Card defining the behavior (data-only).
            input_data: The input payload for the execution.
            context: Request context (tenant_id, env, user_id, etc.).
            
        Returns:
            The execution result payload.
        """
        ...

    def invoke_stream(
        self,
        card_id: str,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AsyncIterator[StreamChunk]:
        """
        Invokes the runtime with a card reference and streams the response.

        Args:
            card_id: The ID/path of the Card defining the behavior (data-only).
            input_data: The input payload for the execution.
            context: Request context (tenant_id, env, user_id, etc.).

        Returns:
            An async iterator yielding StreamChunks.
        """
        ...
