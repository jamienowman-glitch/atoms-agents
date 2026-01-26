#!/usr/bin/env python3
"""
The Harvester: Auto-populates registry usage from Cloud Providers.
Run via cron or manually to sync 'Live Cost'.

Requires:
- gcloud CLI authenticated
- aws CLI authenticated
"""
import subprocess
import json
import logging
import requests
from datetime import datetime
from typing import Dict, Any

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Budget Engine Endpoint (Local)
BUDGET_API_URL = "http://localhost:8000/budget/usage"  # Adjust port if needed

def run_command(command: list) -> str:
    """Run a shell command and return stdout."""
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed: {' '.join(command)}\nError: {e.stderr}")
        return ""

def harvest_gcp_cloud_run() -> float:
    """Fetch Cloud Run vCPU-seconds (Estimated from recent metrics)."""
    # Note: Real metric fetching requires Monitoring API. 
    # For MVP, we list services and estimate active instances.
    logger.info("Harvesting Google Cloud Run...")
    
    # List services
    data = run_command(["gcloud", "run", "services", "list", "--format=json"])
    if not data:
        return 0.0
        
    services = json.loads(data)
    count = len(services)
    logger.info(f"Found {count} Cloud Run services.")
    
    # Mocking 'Usage' based on service existence for now
    # In a real monitoring setup, we'd query:
    # gcloud logging read "resource.type=cloud_run_revision" ...
    return count * 1000.0 # Mock: 1000 vCPU seconds per service per scan

def harvest_aws_lambda() -> int:
    """Fetch AWS Lambda invocation counts (Estimated)."""
    logger.info("Harvesting AWS Lambda...")
    
    # List functions
    data = run_command(["aws", "lambda", "list-functions", "--output", "json"])
    if not data:
        return 0
        
    functions = json.loads(data).get("Functions", [])
    count = len(functions)
    logger.info(f"Found {count} Lambda functions.")
    
    return count * 500 # Mock: 500 invocations per function per scan

def push_usage(payload: Dict[str, Any]):
    """Push harvested data to Budget Engine."""
    # usage_event structure from engines/budget/models.py
    event = {
        "tenant_id": "t_northstar", # System Tenant
        "env": "prod",
        "provider": payload["provider"],
        "surface": "infra_harvester",
        "tool_id": payload["tool_id"],
        "cost": 0, # We calculate cost in the UI largely
        "metadata": {
            "harvested_value": payload["value"],
            "unit": payload["unit"]
        }
    }
    
    # In a real deployment, we'd POST to the API.
    # For this script, we just log what we WOULD have sent.
    logger.info(f"PUSHING DATAPOINT: {json.dumps(event, indent=2)}")

def main():
    logger.info("--- Starting Harvest ---")
    
    # 1. Harvest GCP
    gcp_usage = harvest_gcp_cloud_run()
    push_usage({
        "provider": "gcp", 
        "tool_id": "cloud_run_vcpu", 
        "value": gcp_usage,
        "unit": "vcpu_seconds"
    })
    
    # 2. Harvest AWS
    aws_usage = harvest_aws_lambda()
    push_usage({
        "provider": "aws", 
        "tool_id": "lambda_invocations", 
        "value": aws_usage,
        "unit": "count"
    })
    
    logger.info("--- Harvest Complete ---")

if __name__ == "__main__":
    main()
