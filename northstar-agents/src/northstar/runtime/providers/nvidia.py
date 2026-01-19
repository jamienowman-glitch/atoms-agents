from typing import List, Dict, Any, Optional
import requests
from northstar.runtime.gateway import LLMGateway, CapabilityToggleRequest, ReadinessResult, ReadinessStatus
from northstar.runtime.auth_loader import require_key

class NvidiaGateway(LLMGateway):
    """
    Gateway for NVIDIA NIM / AI Foundation Models.
    Base URL: https://integrate.api.nvidia.com/v1
    """
    BASE_URL = "https://integrate.api.nvidia.com/v1"

    def _get_headers(self) -> Dict[str, str]:
        api_key = require_key("NVIDIA_API_KEY")
        # NVIDIA uses Bearer token usually
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
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
        
        # Determine URL: Standard is /chat/completions
        url = f"{self.BASE_URL}/chat/completions"
        headers = self._get_headers()
        
        payload = {
            "model": model_card.official_id_or_deployment,
            "messages": messages,
            "temperature": 0.5,
            "top_p": 1,
            "max_tokens": 1024,
        }
        
        if limits and limits.max_output_tokens:
             payload["max_tokens"] = limits.max_output_tokens

        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            data = resp.json()
            
            choice = data["choices"][0]
            message = choice["message"]
            usage = data.get("usage", {})
            
            return {
                "role": message["role"],
                "content": message["content"],
                "usage": usage
            }
            
        except Exception as e:
             return {"status": "FAIL", "reason": f"NVIDIA Error: {str(e)}", "error": str(e)}

    def check_readiness(self) -> ReadinessResult:
        try:
            headers = self._get_headers()
            resp = requests.get(f"{self.BASE_URL}/models", headers=headers, timeout=10)
            if resp.status_code == 200:
                return ReadinessResult(ReadinessStatus.READY, "NVIDIA Connected", True)
            return ReadinessResult(ReadinessStatus.RateLimited, f"Status: {resp.status_code}", False)
        except Exception as e:
            return ReadinessResult(ReadinessStatus.MISSING_CREDS_OR_CONFIG, str(e), False)
