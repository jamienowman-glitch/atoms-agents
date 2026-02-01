from typing import List, Dict, Any, Optional
import requests
from atoms_agents.runtime.gateway import LLMGateway, CapabilityToggleRequest, ReadinessResult, ReadinessStatus
from atoms_agents.runtime.auth_loader import require_key

class OpenRouterGateway(LLMGateway):
    """
    Gateway for OpenRouter (OpenAI-compatible).
    """
    BASE_URL = "https://openrouter.ai/api/v1"

    def _get_headers(self) -> Dict[str, str]:
        api_key = require_key("OPENROUTER_API_KEY")
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://atoms_agents.dev", # Required by OpenRouter
            "X-Title": "Northstar Agents"
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

        url = f"{self.BASE_URL}/chat/completions"
        headers = self._get_headers()

        payload = {
            "model": model_card.official_id_or_deployment,
            "messages": messages,
        }

        if limits and limits.max_output_tokens:
             payload["max_tokens"] = limits.max_output_tokens

        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            data = resp.json()

            choice = data["choices"][0]
            message = choice["message"]
            raw_usage = data.get("usage", {})

            usage = {
                "input_tokens": raw_usage.get("prompt_tokens", 0),
                "output_tokens": raw_usage.get("completion_tokens", 0),
                "total_tokens": raw_usage.get("total_tokens", 0)
            }

            return {
                "role": message["role"],
                "content": message["content"],
                "usage": usage,
                "finish_reason": choice.get("finish_reason"),
                "model_id": data.get("model", model_card.official_id_or_deployment)
            }

        except Exception as e:
             return {"status": "FAIL", "reason": f"OpenRouter Error: {str(e)}", "error": str(e)}

    def list_models(self) -> List[str]:
        try:
            headers = self._get_headers()
            resp = requests.get(f"{self.BASE_URL}/models", headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                return [m["id"] for m in data.get("data", [])]
        except Exception:
            pass
        return []

    def check_readiness(self) -> ReadinessResult:
        try:
            headers = self._get_headers()
            # Simple models check
            resp = requests.get(f"{self.BASE_URL}/models", headers=headers, timeout=10)
            if resp.status_code == 200:
                return ReadinessResult(ReadinessStatus.READY, "OpenRouter Connected", True)
            return ReadinessResult(ReadinessStatus.RateLimited, f"Status: {resp.status_code}", False)
        except Exception as e:
            return ReadinessResult(ReadinessStatus.MISSING_CREDS_OR_CONFIG, str(e), False)
