"""AWS Bedrock Model Snapshot Tool"""
import boto3
import json
import os
from pathlib import Path

# Paths
CORE_ROOT = Path(__file__).parent.parent.parent.parent
REGISTRY_MODELS = CORE_ROOT / "registry" / "models"
RAW_SNAPSHOT_FILE = REGISTRY_MODELS / "catalog.aws.bedrock.raw.json"

def main():
    """Fetches foundation models from AWS Bedrock and saves raw JSON."""
    print("Snapshotting AWS Bedrock models to JSON...")
    
    # Ensure region is set, default to us-east-1 if not in env
    region = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
    
    # Create client
    try:
        bedrock = boto3.client("bedrock", region_name=region)
        response = bedrock.list_foundation_models()
        models = response.get("modelSummaries", [])
        
        # Write to file
        with open(RAW_SNAPSHOT_FILE, "w") as f:
            json.dump(models, f, indent=2, default=str)
            
        print(f"Success! Wrote {len(models)} models to {RAW_SNAPSHOT_FILE}")
        
    except Exception as e:
        print(f"Error fetching models: {e}")
        raise

if __name__ == "__main__":
    main()
