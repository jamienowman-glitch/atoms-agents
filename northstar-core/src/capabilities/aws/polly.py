import boto3
from typing import Dict, Any

class Capability:
    capability_id = "aws.polly_tts"
    vendor = "aws"
    kind = "tts"
    cost_tier = "cheap"
    supports_streaming = "none"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        try:
            client = boto3.client("polly", region_name="us-east-1")
            
            # Synthesize generic hello
            response = client.synthesize_speech(
                Text="Hello world",
                OutputFormat="mp3",
                VoiceId="Joanna"
            )
            
            if "AudioStream" in response:
                payload = response["AudioStream"].read()
                return {
                    "status": "PASS",
                    "provider": "aws",
                    "capability_id": Capability.capability_id,
                    "evidence": f"Generated {len(payload)} bytes of MP3 audio."
                }
            
            return {
                "status": "FAIL",
                "provider": "aws",
                "capability_id": Capability.capability_id,
                "error": "No AudioStream in response"
            }
                
        except Exception as e:
            return {
                "status": "FAIL",
                "provider": "aws",
                "capability_id": Capability.capability_id,
                "error": str(e)
            }
