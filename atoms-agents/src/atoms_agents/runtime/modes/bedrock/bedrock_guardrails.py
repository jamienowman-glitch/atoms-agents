from typing import Dict, Any
from botocore.exceptions import ClientError, NoCredentialsError, NoRegionError

from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.result import ModeRunResult

def run(input_data: Dict[str, Any], ctx: RunContext) -> ModeRunResult:
    # 1. Check Safety
    if not input_data.get("_allow_mutate"):
        return ModeRunResult(status="SKIP", reason="Mutation disabled (Guardrails API blocked)")

    # 2. Check Dependencies
    try:
        import boto3
    except ImportError:
        return ModeRunResult(status="SKIP", reason="boto3 not installed")

    # 3. Execution
    try:
        session = boto3.Session()
        if not session.get_credentials():
            return ModeRunResult(status="SKIP", reason="No AWS credentials found")

        client = session.client("bedrock", region_name=input_data.get("region", "us-east-1"))
        # Note: 'bedrock' client has list_guardrails, 'bedrock-agent' has agents/KBs.

        response = client.list_guardrails(maxResults=1)

        return ModeRunResult(
            status="PASS",
            reason="Guardrails API access successful (list_guardrails)",
            output=str(response.get("guardrails", []))
        )

    except (NoCredentialsError, NoRegionError):
        return ModeRunResult(status="SKIP", reason="Missing AWS credentials or region")
    except ClientError as e:
        return ModeRunResult(status="FAIL", reason=f"AWS ClientError: {e}")
    except Exception as e:
        return ModeRunResult(status="FAIL", reason=f"Unexpected error: {e}")
