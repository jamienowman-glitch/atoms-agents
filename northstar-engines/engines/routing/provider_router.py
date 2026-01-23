import yaml
import logging
import json
import os
from typing import Dict, Any, Optional
from pathlib import Path

# Placeholder for actual model clients
class ModelClient:
    async def generate(self, provider: str, model: str, prompt: str) -> str:
        # In a real implementation, this would call the specific provider SDK
        # attempting to hit the API.
        # For simulation, we might raise exceptions based on provider to test fallback.
        pass

class ProviderRouter:
    def __init__(self, agents_path: Optional[str] = None):
        if not agents_path:
             agents_path = os.environ.get("NORTHSTAR_AGENTS_PATH", "../northstar-agents")

        self.agents_path = Path(agents_path).resolve()
        self.logger = logging.getLogger("routing")
        self.model_cards: Dict[str, Any] = {}
        self._load_model_cards()
        
    def _load_model_cards(self):
        models_dir = self.agents_path / "src" / "northstar" / "registry" / "cards" / "models"
        if not models_dir.exists():
            self.logger.warning(f"Model cards directory not found: {models_dir}")
            return

        for card_file in models_dir.glob("*.yaml"):
            try:
                with open(card_file, "r") as f:
                    card = yaml.safe_load(f)
                    if card and card.get("card_type") == "model":
                         # Store by model_id (e.g. 'molmo-2-free')
                         self.model_cards[card.get("model_id")] = card
            except Exception as e:
                self.logger.error(f"Failed to load model card {card_file}: {e}")

    def _load_card(self, card_id: str) -> Dict[str, Any]:
        # Assumes card_id format 'routing.card_name' maps to '.../routing/card_name.yaml'
        if "." in card_id:
            _, name = card_id.split(".", 1)
        else:
            name = card_id

        path = self.agents_path / "src" / "northstar" / "registry" / "cards" / "routing" / f"{name}.yaml"
        if not path.exists():
             raise FileNotFoundError(f"Routing card not found: {path}")
        
        with open(path, "r") as f:
            return yaml.safe_load(f)

    async def route_request(self, routing_card_id: str, prompt: str, agent_name: str = "Unknown") -> Dict[str, str]:
        """
        Determines the best provider/model for the given request.
        Returns a dict with 'provider' and 'model' keys.
        """
        try:
            card = self._load_card(routing_card_id)
        except FileNotFoundError:
            # Fallback if card not found (e.g. ad-hoc routing)
            self.logger.warning(f"Routing card {routing_card_id} not found, using default fallback.")
            # Default to a safe choice
            return {"provider": "google_vertex", "model": "gemini-1.5-flash"}

        rules = card.get("rules", [])
        strategy = card.get("strategy", "default")
        
        # Credit Hunter Logic
        # "If free_tier_hunter active, prioritize molmo or gemini-flash"
        # We check if strategy name implies cost saving
        if strategy == "cost_optimized" or "free_tier" in routing_card_id:
             free_model = self._find_free_model()
             if free_model:
                 provider = free_model.get("provider_id")
                 model_id = free_model.get("model_id")
                 self._log_decision(agent_name, provider, "SUCCESS", None, "free_tier_hunter")
                 return {"provider": provider, "model": model_id}

        last_error = None
        
        for rule in rules:
            if "attempt" in rule:
                attempt = rule["attempt"]
                provider = attempt["provider"]
                model = attempt["model"]
                
                try:
                    # In a real system, we might ping readiness here
                    self._log_decision(agent_name, provider, "SUCCESS", None, strategy)
                    return {"provider": provider, "model": model}
                    
                except Exception as e:
                    last_error = e
                    self._log_decision(agent_name, provider, "ERROR", None, strategy, error=str(e))
                    continue

            elif "on_error" in rule:
                if not last_error:
                    continue
                
                fallback = rule["on_error"]["fallback"]
                fallback_provider = fallback["provider"]
                fallback_model = fallback["model"]
                
                self._log_decision(agent_name, fallback_provider, "FALLBACK_ATTEMPT", last_error, strategy)
                return {"provider": fallback_provider, "model": fallback_model}
                    
        raise Exception("All routing attempts failed")

    def _find_free_model(self) -> Optional[Dict[str, Any]]:
        """Finds a suitable free model from loaded cards."""
        candidates = []
        for mid, card in self.model_cards.items():
            variant = str(card.get("variant", "")).lower()
            model_id = str(card.get("model_id", "")).lower()
            if "free" in variant or "free" in model_id:
                candidates.append(card)

        # Prioritize Molmo, then Gemini Flash
        for c in candidates:
            if "molmo" in c.get("model_id", "").lower():
                return c
        for c in candidates:
             if "gemini" in c.get("model_id", "").lower() and "flash" in c.get("model_id", "").lower():
                 return c

        # If no explicit "free" variant found, fallback to hardcoded safe defaults if present in catalog
        # or return the first candidate found
        return candidates[0] if candidates else None

    def _log_decision(self, agent_name: str, provider: str, status: str, caused_by_error: Optional[Exception], cost_tier: str, error: str = None):
        event = {
            "event": "ROUTING_DECISION",
            "agent_name": agent_name,
            "attempted": provider,
            "status": status,
            "cost_tier": cost_tier
        }
        if caused_by_error:
             if "RateLimit" in str(caused_by_error):
                 event["status"] = "RATE_LIMIT"
             event["fallback"] = provider
        
        # In a real system this goes to LogLens/Observability
        # print(json.dumps(event))
