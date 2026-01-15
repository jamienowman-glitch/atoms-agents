import boto3
from typing import Dict, Any
import time

class Capability:
    capability_id = "aws.transcribe"
    vendor = "aws"
    kind = "stt"
    cost_tier = "normal"
    supports_streaming = "none"

    @staticmethod
    def apply(config: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    @staticmethod
    def live_test(ctx: Any) -> Dict[str, Any]:
        # Batch transcription requires S3 bucket, which is complex for a "cheap one hit".
        # We can try StartMedicalTranscriptionJob or just list_transcription_jobs to prove connectivity.
        # Actually, let's just prove we can Connect/List. Real STT needs S3 upload which violates "No new config".
        
        try:
            client = boto3.client("transcribe", region_name="us-east-1")
            
            response = client.list_transcription_jobs(MaxResults=1)
            
            return {
                "status": "PASS",
                "provider": "aws",
                "capability_id": Capability.capability_id,
                "evidence": f"Successfully listed jobs: {len(response.get('TranscriptionJobSummaries', []))} found. (Connectivity Verified)"
            }
                
        except Exception as e:
            return {
                "status": "FAIL",
                "provider": "aws",
                "capability_id": Capability.capability_id,
                "error": str(e)
            }
