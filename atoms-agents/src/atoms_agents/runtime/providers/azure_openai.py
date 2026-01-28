import os
from typing import List, Dict, Any, Optional
from atoms_agents.runtime.gateway import LLMGateway, CapabilityToggleRequest


class AzureOpenAIGateway(LLMGateway):
    def _get_client(self, provider_config: Any) -> Any:
        try:
            from azure.identity import DefaultAzureCredential, get_bearer_token_provider
            from azure.ai.openai import AzureOpenAI
        except ImportError:
            raise ImportError(
                "azure-identity and azure-ai-openai are required for AzureOpenAIGateway"
            )

        # Config resolution
        # 1. Env vars (standard behavior)

        # Environment variable fallback
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2024-02-01")

        if not endpoint:
            raise ValueError("AZURE_OPENAI_ENDPOINT not set")

        token_provider = get_bearer_token_provider(
            DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
        )

        return AzureOpenAI(
            azure_endpoint=endpoint,
            azure_ad_token_provider=token_provider,
            api_version=api_version,
        )

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
        # Validate config present
        if not provider_config:
            return {"status": "FAIL", "reason": "Missing provider config"}
        client = self._get_client(provider_config)
        deployment_name = model_card.official_id_or_deployment

        extra_headers = {}
        if request_context:
            extra_headers = request_context.to_headers()

        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages,
            stream=stream,
            extra_headers=extra_headers,
        )

        if stream:
            # Simple stream collector for smoke test
            full_text = ""
            usage = {"input_tokens": 0, "output_tokens": 0, "total_tokens": 0}
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    full_text += chunk.choices[0].delta.content

            return {
                "role": "assistant",
                "content": full_text,
                "usage": usage,
                "finish_reason": "stop",
                "model_id": deployment_name
            }
        else:
            u = getattr(response, "usage", None)
            usage = {
                "input_tokens": u.prompt_tokens if u else 0,
                "output_tokens": u.completion_tokens if u else 0,
                "total_tokens": u.total_tokens if u else 0
            }
            return {
                "role": "assistant",
                "content": response.choices[0].message.content,
                "usage": usage,
                "finish_reason": response.choices[0].finish_reason,
                "model_id": deployment_name
            }

    def list_models(self) -> List[str]:
        return ["gpt-4o", "gpt-4o-mini"]

    def check_readiness(self) -> Any:
        from atoms_agents.runtime.gateway import ReadinessResult, ReadinessStatus

        # Check packages
        try:
            import azure.identity  # noqa
            import azure.ai.openai  # noqa
        except ImportError:
            return ReadinessResult(
                ReadinessStatus.MISSING_DEPS,
                "azure-identity/openai packages missing (run `make setup-azure`)",
                False,
            )

        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        if not endpoint:
            return ReadinessResult(
                ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                "AZURE_OPENAI_ENDPOINT not set",
                False,
            )

        # We don't verify token without calling, assume OK if endpoint + packages present
        return ReadinessResult(
            ReadinessStatus.READY, "Azure Endpoint config present", True
        )
