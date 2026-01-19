from typing import List, Dict, Any, Optional
import requests
from northstar.runtime.gateway import LLMGateway, CapabilityToggleRequest, ReadinessResult, ReadinessStatus
from northstar.runtime.auth_loader import require_key

class JulesClient:
    """REST Client for Jules API with API Key Auth fallback logic."""
    BASE_URL = "https://jules.googleapis.com/v1alpha"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.auth_mode = "query" 
    
    def _make_request(self, method: str, endpoint: str, json_data: Optional[Dict] = None) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/{endpoint}"
        try:
            return self._execute(method, url, json_data, self.auth_mode)
        except requests.exceptions.HTTPError as e:
            if e.response.status_code in [401, 403]:
                self.auth_mode = "header" if self.auth_mode == "query" else "query"
                return self._execute(method, url, json_data, self.auth_mode)
            raise
    
    def _execute(self, method: str, url: str, json_data: Optional[Dict], mode: str) -> Dict[str, Any]:
        params = {}
        headers = {"Content-Type": "application/json"}
        if mode == "query":
            params["key"] = self.api_key
        else:
            headers["x-goog-api-key"] = self.api_key
        resp = requests.request(method, url, params=params, headers=headers, json=json_data, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def create_session(self) -> str:
        resp = self._make_request("POST", "sessions", {})
        return resp["name"]

    def send_message(self, session_name: str, content: str) -> Dict[str, Any]:
        payload = {"userInput": {"text": content}}
        return self._make_request("POST", f"{session_name}:sendMessage", payload)

    def list_sessions(self) -> List[Dict[str, Any]]:
        resp = self._make_request("GET", "sessions")
        return resp.get("sessions", [])

class JulesGateway(LLMGateway):
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
        
        try:
            api_key = require_key("JULES_API_KEY")
            client = JulesClient(api_key)
            session_name = client.create_session()
            last_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), None)
            if not last_msg:
                return {"status": "FAIL", "reason": "No user message found"}
            resp = client.send_message(session_name, last_msg)
            responses = resp.get("responses", [])
            text = "".join([r["text"] for r in responses if "text" in r]) or str(resp)
            return {"role": "assistant", "content": text, "usage": {}}
        except Exception as e:
            msg = str(e)
            if "key=" in msg: msg = msg.split("key=")[0] + "key=***"
            return {"status": "FAIL", "reason": f"Jules Error: {msg}", "error": msg}

    def check_readiness(self) -> ReadinessResult:
        try:
            client = JulesClient(require_key("JULES_API_KEY"))
            client.list_sessions()
            return ReadinessResult(ReadinessStatus.READY, "Jules Connected", True)
        except Exception as e:
            msg = str(e)
            if "key=" in msg: msg = msg.split("key=")[0] + "key=***"
            return ReadinessResult(ReadinessStatus.MISSING_CREDS_OR_CONFIG, f"Jules Connect Failed: {msg}", False)
