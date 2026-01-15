from pydantic import BaseModel
import os

class BedrockConfig(BaseModel):
    region: str = "us-east-1"
    endpoint_url: str | None = None

def load_bedrock_config() -> BedrockConfig:
    """Loads Bedrock configuration from environment variables."""
    region = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    
    # Strict check if neither env var is present? 
    # User prompt said: "from env, default to us-east-1 if missing"
    # BUT also said: "Raise a clear error if region is missing and no default is set."
    # AND "Required env var(s): AWS_REGION (optional, defaults to us-east-1)"
    # I will interpret this as: try ENV, fallback to default 'us-east-1'. 
    # If explicitly None (unlikely with default), raise error.
    
    if not region:
        region = "us-east-1"
        
    return BedrockConfig(
        region=region,
        endpoint_url=os.getenv("BEDROCK_ENDPOINT_URL")
    )
