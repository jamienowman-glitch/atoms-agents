import boto3
import base64
from typing import Dict, Any

class Capability:
    capability_id = "bedrock.vision"
    vendor = "bedrock" 
    kind = "vision"
    cost_tier = "normal"
    supports_streaming = "none"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        from src.capabilities._shared.model_resolver import resolve_bedrock_model
        model_id = resolve_bedrock_model("vision")
        
        # Tiny 1x1 GIF for cheap test
        tiny_gif = b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
        
        try:
            client = boto3.client("bedrock-runtime", region_name="us-east-1")
            
            response = client.converse(
                modelId=model_id,
                messages=[{
                    "role": "user", 
                    "content": [
                        {"text": "Describe this image"},
                        {"image": {
                            "format": "gif",
                            "source": {"bytes": tiny_gif}
                        }}
                    ]
                }],
                inferenceConfig={"maxTokens": 10}
            )
            
            output_text = response["output"]["message"]["content"][0]["text"]
            
            return {
                "status": "PASS",
                "provider": "bedrock",
                "capability_id": Capability.capability_id,
                "model_id": model_id,
                "evidence": f"Output: {output_text}"
            }
                
        except Exception as e:
            return {
                "status": "FAIL",
                "provider": "bedrock",
                "capability_id": Capability.capability_id,
                "error": str(e)
            }
