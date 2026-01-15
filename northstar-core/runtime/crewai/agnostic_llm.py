from typing import Any, List, Optional, Dict
from langchain_openai import ChatOpenAI
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_core.outputs import ChatResult, ChatGeneration
from src.core.model_gateway import ModelGateway, ChatMessage


class AgnosticCrewAILLM(ChatOpenAI):
    """
    Routes CrewAI LLM calls to Northstar Gateway via local Loopback.
    This bypasses CrewAI's restrictive object validation by acting as a standard OpenAI client.
    Requires 'main.py' (uvicorn) to be running on localhost:8000.
    """
    
    def __init__(self, gateway: ModelGateway, model_id: str):
        # We ignore 'gateway' object since we route via HTTP Loopback
        super().__init__(
            model=model_id, 
            api_key="sk-loopback",
            base_url="http://localhost:8000/v1",
            temperature=0
        )
        
    @property
    def _llm_type(self) -> str:
        return "agnostic_gateway"

        
    @property
    def _llm_type(self) -> str:
        return "agnostic_gateway"

    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        """
        Execute call via Gateway.
        """
        # Convert LangChain messages to Gateway ChatMessage
        gateway_msgs = []
        for m in messages:
            role = "user"
            if isinstance(m, HumanMessage): role = "user"
            elif isinstance(m, SystemMessage): role = "system"
            elif m.type == "ai": role = "assistant"
            else: role = "user" # Fallback
            
            gateway_msgs.append(ChatMessage(role=role, content=str(m.content)))
        
        # Call Sync
        result = self.gateway.chat_sync(gateway_msgs, model_id=self.model_id)
        
        # Return ChatResult
        from langchain_core.messages import AIMessage
        gen = ChatGeneration(message=AIMessage(content=result.content)) 
        return ChatResult(generations=[gen])

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {
            "model_id": self.model_id,
            "gateway_type": str(type(self.gateway))
        }

    def bind_tools(self, tools: List[Any], **kwargs: Any):
        """
        Disable native tool binding to force CrewAI to use ReAct / Prompting.
        Or act as a pass-through.
        """
        # Return self so that the 'bound' callable is still this LLM, 
        # which routes to _generate via Gateway.
        # We ignore the tools here because Agnostic Gateway currently 
        # handles tools via prompts or handled by the Agent framework (ReAct).
        return self
