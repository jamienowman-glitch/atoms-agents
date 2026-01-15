from typing import Any, List, Dict
from northstar.runtime.gateway import LLMGateway

class NorthstarCrewAILLM:
    """
    Adapter to allow CrewAI to use Northstar LLMGateway.
    CrewAI expects an object with 'call' or 'predict' or standard LangChain interface.
    Assuming CrewAI >= 0.1.0 uses LiteLLM or LangChain.
    We need to mimic a LangChain ChatModel or similar.
    """
    def __init__(self, gateway: LLMGateway, provider_config: Any, model_card: Any):
        self.gateway = gateway
        self.provider_config = provider_config
        self.model_card = model_card
        self.model_name = model_card.model_id # CrewAI checks this

    def call(self, messages: List[Dict[str, str]], callbacks: Any = None) -> str:
        # LiteLLM style? Or standard invoke?
        # If CrewAI calls 'predict(messages)', we handle it.
        # We need to see how CrewAI calls it.
        # Usually it passes a list of dicts.
        
        # If passed as 'function_call', etc.
        # For simple smoke, we assume standard chat generation.
        
        response = self.gateway.generate(
            messages=messages,
            model_card=self.model_card,
            provider_config=self.provider_config,
            stream=False
        )
        return str(response["content"]) # Return string

    def invoke(self, input: Any, *args: Any, **kwargs: Any) -> Any:
        # LangChain compat
        # input might be string or list of messages
        messages = []
        if isinstance(input, str):
            messages = [{"role": "user", "content": input}]
        elif isinstance(input, list):
             # basic conversion if they are LangChain messages
             for m in input:
                 if hasattr(m, 'content') and hasattr(m, 'type'):
                     role = "user" if m.type == "human" else "assistant" if m.type == "ai" else "system"
                     messages.append({"role": role, "content": m.content})
                 elif isinstance(m, dict):
                     messages.append(m)
        
        content = self.call(messages)
        
        # Return LangChain-like AIMessage
        from dataclasses import dataclass
        @dataclass
        class AIMessage:
            content: str
            
        return AIMessage(content=content)

    def bind(self, *args: Any, **kwargs: Any) -> "NorthstarCrewAILLM":
        # Support tool binding (no-op for smoke)
        return self
