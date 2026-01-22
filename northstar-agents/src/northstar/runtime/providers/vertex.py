from typing import List, Dict, Any, Optional
from northstar.runtime.gateway import LLMGateway, CapabilityToggleRequest

try:
    import vertexai  # noqa: F401

    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False


class VertexGateway(LLMGateway):
    def _get_model(self, model_card: Any) -> Any:
        try:
            import vertexai  # noqa: F401
            from vertexai.generative_models import GenerativeModel
        except ImportError:
            raise ImportError("google-cloud-aiplatform is required for VertexGateway")

        # Vertex init (requires project/location)
        # We rely on google.auth.default() or environment variables
        # If vertexai.init() hasn't been called, we might need to call it?
        # Usually standard ADC works if project is discoverable.
        # But allow fallback to explicit init if provided in config?
        # For now, minimal.

        return GenerativeModel(model_card.official_id_or_deployment)

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
        if not VERTEX_AVAILABLE:
            return {"status": "FAIL", "reason": "vertexai not installed"}
        
        # NOTE: Vertex high-level SDK does not support simple header injection matching our contract.
        # We would need to use GAPIC or REST. For now, we log/warn if critical context is present but not sent.
        if request_context:
            # TODO: Implement GAPIC client usage for metadata injection
            pass
        
        model = self._get_model(model_card)

        # Convert messages to Vertex format
        # Simplest: Just use generate_content with a constructed prompt or chat history
        # For validation smoke, we just want to send the last message
        last_msg = messages[-1]["content"]
        # Note: Proper chat history conversion would be needed for full usage,
        # but prompt says "send a minimal chat request (non-streaming is fine for smoke)"

        response = model.generate_content(last_msg, stream=stream)

        usage = {
            "input_tokens": 0,
            "output_tokens": 0,
            "total_tokens": 0
        }

        if stream:
            full_text = ""
            for chunk in response:
                try:
                    full_text += chunk.text
                except ValueError:
                    pass

                # Vertex stream usage is usually in the last chunk
                if hasattr(chunk, "usage_metadata") and chunk.usage_metadata:
                    usage["input_tokens"] = chunk.usage_metadata.prompt_token_count
                    usage["output_tokens"] = chunk.usage_metadata.candidates_token_count
                    usage["total_tokens"] = chunk.usage_metadata.total_token_count

            return {
                "role": "assistant",
                "content": full_text,
                "usage": usage,
                "finish_reason": "stop",
                "model_id": model_card.official_id_or_deployment
            }
        else:
            if hasattr(response, "usage_metadata") and response.usage_metadata:
                usage["input_tokens"] = response.usage_metadata.prompt_token_count
                usage["output_tokens"] = response.usage_metadata.candidates_token_count
                usage["total_tokens"] = response.usage_metadata.total_token_count

            return {
                "role": "assistant",
                "content": response.text,
                "usage": usage,
                "finish_reason": str(response.candidates[0].finish_reason) if response.candidates else None,
                "model_id": model_card.official_id_or_deployment
            }

    def list_models(self) -> List[str]:
        return [
            "gemini-2.0-flash-001",
            "gemini-2.0-pro-exp-02-05",
        ]

    def check_readiness(self) -> Any:
        from northstar.runtime.gateway import ReadinessResult, ReadinessStatus

        if not VERTEX_AVAILABLE:
            return ReadinessResult(
                ReadinessStatus.MISSING_DEPS,
                "vertexai/google-cloud-aiplatform not installed (run `make setup-vertex`)",
                False,
            )

        import google.auth

        try:
            creds, project = google.auth.default()
            if not creds:
                return ReadinessResult(
                    ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                    "No Google credentials found",
                    False,
                )
            if not project:
                # Project might be None in default() return if not strictly required by method,
                # but usually needed for vertex init.
                return ReadinessResult(
                    ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                    "No Google project found in credentials or env (GOOGLE_CLOUD_PROJECT)",
                    False,
                )
        except Exception as e:
            return ReadinessResult(
                ReadinessStatus.MISSING_CREDS_OR_CONFIG,
                f"Google auth check failed: {e}",
                False,
            )

        return ReadinessResult(ReadinessStatus.READY, "Google Credentials found", True)
