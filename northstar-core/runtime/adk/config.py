from pydantic import BaseModel
import os

class AdkConfig(BaseModel):
    project_id: str
    region: str = "us-central1"

def load_adk_config() -> AdkConfig:
    """Loads ADK configuration from environment variables."""
    project_id = os.getenv("GCP_PROJECT_ID")
    if not project_id:
        raise RuntimeError("GCP_PROJECT_ID is not set; configure it in your environment.")
        
    return AdkConfig(
        project_id=project_id,
        region=os.getenv("ADK_REGION", "us-central1"),
    )
