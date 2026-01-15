from typing import List, Dict, Any, Optional
from northstar.runtime.gateway import LLMGateway, CapabilityToggleRequest

try:
    import boto3  # noqa: F401

    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False


class BedrockGateway(LLMGateway):
    def _get_client(self, provider_config: Any) -> Any:
        try:
            import boto3
        except ImportError:
            raise ImportError("boto3 is required for BedrockGateway")

        # Standard boto3 session lookup
        return boto3.Session().client("bedrock-runtime")

    def generate(
        self,
        messages: List[Dict[str, str]],
        model_card: Any,
        provider_config: Any,
        stream: bool = False,
        capability_toggles: Optional[List[CapabilityToggleRequest]] = None,
        limits: Optional[Any] = None,
        request_context: Optional[Any] = None,
    ) -> Dict[str, Any]:
        # Check dependencies
        if not BOTO3_AVAILABLE:
            return {"status": "FAIL", "reason": "boto3 not installed"}

        client = self._get_client(provider_config)
        
        # Header Injection via Event Hook
        if request_context:
            headers = request_context.to_headers()
            
            def inject_header(request, **kwargs):
                for k, v in headers.items():
                    request.headers.add_header(k, v)
            
            # Register for 'before-call' specifically for Converse/ConverseStream if possible, or generally on client.
            # 'before-call.bedrock-runtime' captures all calls.
            client.meta.events.register("before-call.bedrock-runtime", inject_header)
        model_id = model_card.official_id_or_deployment

        # Convert standard messages to Bedrock Converse format
        # Standard: [{"role": "user", "content": "text"}]
        # Bedrock Converse: [{"role": "user", "content": [{"text": "text"}]}]
        bedrock_messages = []
        system_prompts = []

        for m in messages:
            if m["role"] == "system":
                system_prompts.append({"text": m["content"]})
            else:
                bedrock_messages.append(
                    {"role": m["role"], "content": [{"text": m["content"]}]}
                )

        if stream:
            response = client.converse_stream(
                modelId=model_id,
                messages=bedrock_messages,
                system=system_prompts,
                inferenceConfig={"maxTokens": 1024},
            )
            full_text = ""
            for event in response.get("stream", []):
                if "contentBlockDelta" in event:
                    full_text += event["contentBlockDelta"]["delta"]["text"]
            return {"role": "assistant", "content": full_text}
        else:
            response = client.converse(
                modelId=model_id,
                messages=bedrock_messages,
                system=system_prompts,
                inferenceConfig={"maxTokens": 1024},
            )
            return {
                "role": "assistant",
                "content": response["output"]["message"]["content"][0]["text"],
            }

    def check_readiness(self) -> Any:
        from northstar.runtime.gateway import ReadinessResult, ReadinessStatus

        if not BOTO3_AVAILABLE:
            return ReadinessResult(
                ReadinessStatus.MISSING_DEPS,
                "boto3 not installed (run `make setup-bedrock`)",
                False,
            )

        # Check AWS Credentials presence
        try:
            import boto3

            session = boto3.Session()
            term = session.get_credentials()
            if not term:
                return ReadinessResult(
                    ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                    "No AWS credentials found (check AWS_PROFILE or env vars)",
                    False,
                )
            if not session.region_name:
                return ReadinessResult(
                    ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                    "No AWS region configured",
                    False,
                )
        except Exception as e:
            return ReadinessResult(
                ReadinessStatus.MISSING_CREDS_OR_CONFIG, str(e), False
            )

        return ReadinessResult(ReadinessStatus.READY, "AWS Credentials found", True)
