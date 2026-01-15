from typing import Dict, Any
from botocore.exceptions import ClientError, NoCredentialsError, NoRegionError

from northstar.runtime.context import RunContext
from northstar.runtime.result import ModeRunResult

def run(input_data: Dict[str, Any], ctx: RunContext) -> ModeRunResult:
    # 1. Check Safety
    if not input_data.get("_allow_mutate"):
        return ModeRunResult(status="SKIP", reason="Mutation disabled (Knowledge Bases API blocked)")

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
            
        client = session.client("bedrock-agent", region_name=input_data.get("region", "us-east-1"))
        
        response = client.list_knowledge_bases(maxResults=1)
        
        return ModeRunResult(
            status="PASS", 
            reason="Knowledge Bases API access successful (list_knowledge_bases)", 
            output=str(response.get("knowledgeBaseSummaries", []))
        )

    except (NoCredentialsError, NoRegionError):
        return ModeRunResult(status="SKIP", reason="Missing AWS credentials or region")
    except ClientError as e:
        return ModeRunResult(status="FAIL", reason=f"AWS ClientError: {e}")
    except Exception as e:
        return ModeRunResult(status="FAIL", reason=f"Unexpected error: {e}")
