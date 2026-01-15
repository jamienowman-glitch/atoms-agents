import boto3
from typing import Dict, Any

class Capability:
    capability_id = "bedrock.converse_stream_token"
    vendor = "bedrock"
    kind = "streaming"
    cost_tier = "cheap"
    supports_streaming = "token"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        """
        Executes a real ConverseStream call to Bedrock.
        """
        # Dynamic Resolution
        from src.capabilities._shared.model_resolver import resolve_bedrock_model
        model_id = resolve_bedrock_model("stream")
        
        try:
            client = boto3.client("bedrock-runtime", region_name="us-east-1")
            
            response = client.converse_stream(
                modelId=model_id,
                messages=[{"role": "user", "content": [{"text": "Hello"}]}],
                inferenceConfig={"maxTokens": 10}
            )
            
            stream = response.get("stream")
            chunk_count = 0
            text_acc = ""
            
            for event in stream:
                chunk_count += 1
                if "contentBlockDelta" in event:
                    text_acc += event["contentBlockDelta"]["delta"]["text"]
                if chunk_count > 5:
                    break # Stop early for cost/speed
                    
            if chunk_count > 0:
                return {
                    "status": "PASS",
                    "provider": "bedrock",
                    "capability_id": Capability.capability_id,
                    "model_id": model_id,
                    "evidence": f"Received {chunk_count}+ chunks. Text: {text_acc}..."
                }
            else:
                return {
                    "status": "FAIL",
                    "provider": "bedrock", 
                    "capability_id": Capability.capability_id,
                    "error": "Stream returned no events"
                }
                
        except Exception as e:
            return {
                "status": "FAIL",
                "provider": "bedrock",
                "capability_id": Capability.capability_id,
                "error": str(e)
            }
