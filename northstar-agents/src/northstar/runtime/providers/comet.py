from typing import List, Dict, Any, Optional
import requests
from northstar.runtime.gateway import LLMGateway, CapabilityToggleRequest, ReadinessResult, ReadinessStatus
from northstar.runtime.auth_loader import require_key

class CometGateway(LLMGateway):
    """
    Gateway for Comet (assuming OpenAI-compatible for now, or specific)
    Note: 'Comet API' might refer to 'Opik' or specific Comet LLM endpoints.
    Assuming standard OpenAI-compat base if not specified, but usually it's used for tracking.
    If this is 'Comet' as in a model provider, let's assume OpenAI compat
    or check if user meant something else.
    Given context of "Models", we treat it as an OpenAI wrapper.
    """
    # Placeholder Base URL - adjusting to a likely endpoint or user configurable
    BASE_URL = "https://api.comet.com/v1" # Hypothetical

    def _get_headers(self) -> Dict[str, str]:
        api_key = require_key("COMET_API_KEY")
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def generate(
        self,
        messages: List[Dict[str, str]],
        model_card: Any,
        provider_config: Any,
        stream: bool = False,
        capability_toggles: Optional[List[CapabilityToggleRequest]] = None,
        limits: Optional[Any] = None,
        request_context: Optional[Any] = None,
    ) -> Dict[str, Any]:
        
        # Checking if we simulate or have real endpoint
        # For this exercise, we implement the structure.
        
        url = f"{self.BASE_URL}/chat/completions"
        headers = self._get_headers()
        
        payload = {
            "model": model_card.official_id_or_deployment,
            "messages": messages,
        }
        
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            data = resp.json()
            return {
                "role": "assistant",
                "content": data["choices"][0]["message"]["content"],
                "usage": data.get("usage", {})
            }
        except Exception as e:
             return {"status": "FAIL", "reason": f"Comet Error: {str(e)}", "error": str(e)}

    def check_readiness(self) -> ReadinessResult:
        try:
            # Check key
            require_key("COMET_API_KEY")
            return ReadinessResult(ReadinessStatus.READY, "Comet Key Present", True)
        except Exception as e:
            return ReadinessResult(ReadinessStatus.MISSING_CREDS_OR_CONFIG, str(e), False)
