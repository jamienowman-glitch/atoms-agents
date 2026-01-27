from typing import Dict, Any, AsyncGenerator, Optional
from atoms_agents.runtime.gateway import GatewayProvider, ReadinessCheck
from atoms_agents.registry.schemas import ModelCard
from atoms_agents.runtime.limits import RunLimits
from atoms_agents.runtime.context import AgentsRequestContext

class GenCastProvider(GatewayProvider):
    """
    Google GenCast Provider (Ensemble Forecasting).
    """
    def __init__(self, provider_id: str):
        self.provider_id = provider_id

    def check_readiness(self) -> ReadinessCheck:
        try:
            # import ai_models
            return ReadinessCheck(ready=True, reason="GenCast Lib Available (Stub)")
        except ImportError:
            return ReadinessCheck(ready=False, reason="ai-models-gencast lib missing")

    async def generate_stream(
        self,
        messages: list[Dict[str, Any]],
        model: ModelCard,
        run_config: Any,
        capability_toggles: list,
        limits: RunLimits,
        request_context: Optional[AgentsRequestContext] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:

        # Stub logic for Probabilistic Forecasting
        # Input: Lat/Lon/Date -> Output: Probability Distribution

        yield {
            "type": "content_delta",
            "content": "Running 14-day Ensemble Forecast...\n"
        }
        yield {
            "type": "content_delta",
            "content": "Forecast: 85% probability of wind > 20km/h at T2."
        }
