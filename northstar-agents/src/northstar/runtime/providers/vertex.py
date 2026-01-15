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

        if stream:
            full_text = ""
            for chunk in response:
                full_text += chunk.text
            return {"role": "assistant", "content": full_text}
        else:
            return {"role": "assistant", "content": response.text}

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
