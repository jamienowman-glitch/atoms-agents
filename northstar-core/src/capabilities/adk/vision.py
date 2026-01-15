import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from typing import Dict, Any
import base64

class Capability:
    capability_id = "adk.vision"
    vendor = "adk"
    kind = "vision"
    cost_tier = "cheap"
    supports_streaming = "none"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        from src.capabilities._shared.model_resolver import resolve_adk_model
        model_id = resolve_adk_model("vision")
        
        project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
        location = os.environ.get("GCP_REGION", "us-central1")

        try:
            vertexai.init(project=project_id, location=location)
            model = GenerativeModel(model_id)
            
            # 1x1 GIF
            tiny_gif_b64 = "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            image_part = Part.from_data(data=base64.b64decode(tiny_gif_b64), mime_type="image/gif")
            
            response = model.generate_content(
                ["Describe this image", image_part]
            )
            
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
