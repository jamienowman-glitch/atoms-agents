import os
import vertexai
from vertexai.generative_models import GenerativeModel
from typing import Dict, Any

class Capability:
    capability_id = "adk.text_generation"
    vendor = "adk"
    kind = "text"
    cost_tier = "cheap"
    supports_streaming = "none"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        from src.capabilities._shared.model_resolver import resolve_adk_model
        model_id = resolve_adk_model("text")
        
        # Use simple project determination or let init figure it out from env
        project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
        location = os.environ.get("GCP_REGION", "us-central1")

        try:
            vertexai.init(project=project_id, location=location)
            model = GenerativeModel(model_id)
            response = model.generate_content("Hello", generation_config={"max_output_tokens": 5})
            
            return {
                "status": "PASS",
                "provider": "adk",
                "capability_id": Capability.capability_id,
                "model_id": model_id,
                "evidence": f"Response: {response.text}"
            }
                
        except Exception as e:
             return {
                "status": "FAIL",
                "provider": "adk",
                "capability_id": Capability.capability_id,
                "error": str(e)
            }
