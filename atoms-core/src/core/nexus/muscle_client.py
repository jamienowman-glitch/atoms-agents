
import httpx
import os

class MuscleClient:
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("MUSCLE_URL", "http://localhost:8000")

    def ingest_video(self, bucket: str, key: str):
        """Call Remote Muscle to process video."""
        url = f"{self.base_url}/muscle/ingest/video"
        payload = {"bucket": bucket, "key": key}
        
        try:
            with httpx.Client(timeout=300.0) as client: # Long timeout for video processing
                resp = client.post(url, json=payload)
                resp.raise_for_status()
                return resp.json()
        except Exception as e:
            print(f"Muscle Call Failed: {e}")
            raise
