import uuid
from dataclasses import dataclass
from typing import Optional, Any
from atoms_agents.runtime.gateway import LLMGateway
from atoms_agents.runtime.limits import RunLimits
from atoms_agents.registry.schemas import ModelCard

@dataclass
class CertificationResult:
    success: bool
    provider_id: str
    model_id: str
    nonce: str
    response_content: str
    reason: str
    latency_ms: float = 0.0

class Certifier:
    def __init__(self, registry: Any):
        self.registry = registry

    def certify(self, provider_id: str, model_id: str, profile_name: Optional[str] = None) -> CertificationResult:
        import time

        # 1. Resolve Gateway
        gateway: LLMGateway
        if provider_id == "bedrock":
            from atoms_agents.runtime.providers.bedrock import BedrockGateway
            gateway = BedrockGateway()
        elif provider_id == "vertex":
            from atoms_agents.runtime.providers.vertex import VertexGateway
            gateway = VertexGateway()
        elif provider_id == "azure_openai":
            from atoms_agents.runtime.providers.azure_openai import AzureOpenAIGateway
            gateway = AzureOpenAIGateway()
        else:
            return CertificationResult(False, provider_id, model_id, "", "", f"Unknown provider: {provider_id}")

        # 2. Check Readiness
        readiness = gateway.check_readiness()
        if not readiness.is_ready:
            return CertificationResult(False, provider_id, model_id, "", "", f"Not Ready: {readiness.reason} ({readiness.status.value})")

        # 3. Prepare Nonce & Messages
        nonce = str(uuid.uuid4())
        messages = [
            {"role": "system", "content": "You are a certification assistant. Your only job is to echo the inputs provided exactly."},
            {"role": "user", "content": f"NONCE={nonce}\nReply with the nonce only."}
        ]

        # 4. Resolve Model Card
        model_card = self.registry.models.get(model_id)
        if not model_card:
            # Ephemeral
            model_card = ModelCard(model_id, provider_id, model_id)

        # 5. Invoke with Limits
        start = time.time()
        limits = RunLimits(max_calls=1, max_output_tokens=32, timeout_seconds=10.0)

        try:
            response = gateway.generate(
                messages,
                model_card,
                None,
                limits=limits
            )
        except Exception as e:
            return CertificationResult(False, provider_id, model_id, nonce, "", str(e), (time.time() - start) * 1000)

        latency = (time.time() - start) * 1000

        if response.get("status") == "FAIL":
             return CertificationResult(False, provider_id, model_id, nonce, "", response.get("reason", "Gateway failed"), latency)

        content = response.get("content", "")

        # 6. Verify Nonce
        if nonce in content:
            return CertificationResult(True, provider_id, model_id, nonce, content, "Nonce verified", latency)
        else:
            return CertificationResult(False, provider_id, model_id, nonce, content, "Nonce NOT found in response", latency)
