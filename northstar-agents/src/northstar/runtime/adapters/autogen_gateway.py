from typing import List, Dict, Any
from northstar.runtime.gateway import LLMGateway

class NorthstarAutoGenModelClient:
    """
    Adapter to allow AutoGen to use Northstar LLMGateway.
    Conforms to AutoGen's custom model client protocol (create).
    """
    def __init__(self, config: Dict[str, Any], gateway: LLMGateway, provider_config: Any, model_card: Any):
        self.gateway = gateway
        self.provider_config = provider_config
        self.model_card = model_card

    def create(self, params: Dict[str, Any]) -> Any:
        # AutoGen passes 'messages' in params
        messages = params.get("messages", [])
        
        # Call Gateway
        response = self.gateway.generate(
            messages=messages,
            model_card=self.model_card,
            provider_config=self.provider_config,
            stream=False # AutoGen custom clients usually sync for simplicity
        )
        
        # Return AutoGen expected format (ModelClientResponse)
        # Or just a simple object/dict that AutoGen understands.
        # AutoGen expects an object with choices[0].message.content or similar if using wrapper.
        # But for custom client, it expects what?
        # Typically: from types import SimpleNamespace; return SimpleNamespace(choices=[...], model=...)
        # We will return a dict mimicking OpenAI response structure as that's what AutoGen expects by default.
        
        return {
            "choices": [
                {
                    "message": {
                        "content": response["content"],
                        "role": response["role"]
                    }
                }
            ],
            "model": self.model_card.model_id
        }

    def message_retrieval(self, response: Any) -> List[str]:
        # Helper to extract content list
        return [response["choices"][0]["message"]["content"]]

    def cost(self, response: Any) -> float:
        return 0.0

    @staticmethod
    def get_usage(response: Any) -> Dict[str, Any]:
        return {}
