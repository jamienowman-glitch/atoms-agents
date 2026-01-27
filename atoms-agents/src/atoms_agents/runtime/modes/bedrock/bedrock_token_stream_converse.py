from typing import Dict, Any
from botocore.exceptions import ClientError, NoCredentialsError, NoRegionError

from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.result import ModeRunResult

def run(input_data: Dict[str, Any], ctx: RunContext) -> ModeRunResult:
    # 1. Check Dependencies
    try:
        import boto3
    except ImportError:
        return ModeRunResult(status="SKIP", reason="boto3 not installed")

    # 2. Check Input / Defaults
    model_id = input_data.get("modelId", "anthropic.claude-3-haiku-20240307-v1:0")

    # 3. Execution
    try:
        # Use session to ensure we pick up env vars/profile
        session = boto3.Session()
        if not session.get_credentials():
            return ModeRunResult(status="SKIP", reason="No AWS credentials found")

        client = session.client("bedrock-runtime", region_name=input_data.get("region", "us-east-1"))

        messages = [{"role": "user", "content": [{"text": "Hello (Smoke Test)"}]}]

        response = client.converse_stream(
            modelId=model_id,
            messages=messages,
            inferenceConfig={"maxTokens": 10}
        )

        # Consume stream to prove it works
        text_output = ""
        stream = response.get("stream")
        if stream:
            for event in stream:
                if "contentBlockDelta" in event:
                    text_output += event["contentBlockDelta"]["delta"]["text"]

        return ModeRunResult(
            status="PASS",
            reason="ConverseStream successful",
            output=text_output
        )

    except (NoCredentialsError, NoRegionError):
        return ModeRunResult(status="SKIP", reason="Missing AWS credentials or region")
    except ClientError as e:
        # If it's an AccessDenied or validation error, it's a FAIL (unless we want to treat un-enabled content as SKIP?)
        # Generally, if we have creds but can't run, it's a FAIL of the mode.
        return ModeRunResult(status="FAIL", reason=f"AWS ClientError: {e}")
    except Exception as e:
        return ModeRunResult(status="FAIL", reason=f"Unexpected error: {e}")
