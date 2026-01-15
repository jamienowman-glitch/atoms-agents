import sys
import time
from typing import Optional, Tuple

from northstar.cli.doctor import check_aws_creds, check_gcp_creds
from northstar.core.connectivity import ConnectivityLedger
from northstar.registry.schemas import RunProfileCard

def verify_live(
    framework: str, 
    mode_id: Optional[str] = None, 
    allow_mutate: bool = False, 
    profile: Optional[RunProfileCard] = None, 
    allow_regression: bool = False
) -> None:
    print(f"Verifying LIVE capability for framework: {framework}")
    print(f"Mode: {mode_id if mode_id else 'ALL (or default)'}")
    print(f"Mutation Allowed: {allow_mutate}")
    print(f"Profile: {profile.profile_id if profile else 'None (defaults)'}")
    print("-" * 50)

    # Check Connectivity Ledger for regression
    ledger_status = ConnectivityLedger.check_status(framework)
    ever_passed = ledger_status.get("ever_passed", False)
    
    start_time = time.time()
    result = "FAIL"
    reason = "Unknown"

    try:
        if framework == "bedrock":
            result, reason = _verify_bedrock(allow_mutate)
        elif framework == "adk":
            result, reason = _verify_adk(allow_mutate)
        else:
            result = "SKIP"
            reason = f"Framework '{framework}' not supported for live verification"
    except Exception as e:
        result = "FAIL"
        reason = f"Exception: {str(e)}"

    duration = time.time() - start_time
    
    # Regression Check
    if result != "PASS" and ever_passed and not allow_regression:
        print("\n[CRITICAL REGRESSION] This framework previously passed live verification.")
        print(f"Current result: {result} ({reason})")
        print("Use --allow-regression to override if this is intentional.")
        sys.exit(1)

    if result == "PASS":
        ConnectivityLedger.record_pass(framework, mode_id)

    print("-" * 50)
    print(f"RESULT: {result}")
    print(f"REASON: {reason}")
    print(f"DURATION: {duration:.2f}s")
    
    if result == "FAIL":
        sys.exit(1)

def _verify_bedrock(allow_mutate: bool) -> Tuple[str, str]:
    # Check Pre-requisites
    if "LIVE READY" not in check_aws_creds():
        return "SKIP", "AWS Credentials not available"
    
    try:
        import boto3
        # control plane check
        bedrock = boto3.client("bedrock", region_name="us-east-1")
        # List models to verify access
        models = bedrock.list_foundation_models(byProvider="anthropic")
        summaries = models.get("modelSummaries")
        if not summaries:
             return "FAIL", "No Anthropic models found in Bedrock"
        
        # Test Converse (Execution)
        runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
        model_id = summaries[0]["modelId"]
        
        runtime.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": "Ping"}]}]
        )
        return "PASS", f"Successfully invoked {model_id}"

    except ImportError:
        return "FAIL", "boto3 not installed"
    except Exception as e:
        return "FAIL", str(e)

def _verify_adk(allow_mutate: bool) -> Tuple[str, str]:
    if "LIVE READY" not in check_gcp_creds():
        return "SKIP", "GCP Credentials not available"
        
    try:
        import google.auth
        import google.auth.transport.requests
        # Minimal check: get token
        creds, project = google.auth.default()
        creds.refresh(google.auth.transport.requests.Request())
        if creds.token:
             return "PASS", f"Successfully refreshed token for project {project}"
        return "FAIL", "Could not refresh token"
    except Exception as e:
        return "FAIL", str(e)
