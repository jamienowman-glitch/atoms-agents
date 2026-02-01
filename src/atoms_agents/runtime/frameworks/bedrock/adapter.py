from typing import Tuple, Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode

def is_available() -> Tuple[bool, str]:
    try:
        import boto3
        import botocore  # noqa: F401
        if not boto3.Session().get_credentials():
             return False, "No AWS credentials found"
        return True, ""
    except ImportError:
        return False, "boto3 not installed"
    except Exception as e:
        return False, str(e)

def minimal_smoke(mode_id: str, input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    available, reason = is_available()
    if not available:
        raise SkipMode(reason)

    # Bedrock smoke logic
    # Just check if we can create client. Don't call API to save cost/time unless required.
    # Prompt: "calling STS GetCallerIdentity is acceptable"
    try:
        import boto3
        sts = boto3.client("sts")
        identity = sts.get_caller_identity()
        return {"status": "PASS", "mode_id": mode_id, "output": {"identity": identity["Arn"]}}
    except Exception as e:
        # If credentials exist but fail (e.g. expired), it's a FAIL or SKIP?
        # Prompt: "Otherwise raise SkipMode... with a clear reason."
        raise SkipMode(f"AWS Check Failed: {e}")
