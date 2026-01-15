
import sys
import json
from dataclasses import asdict
from typing import Dict, Any, Optional
from northstar.registry.schemas import ModelCard

def list_models(models: Dict[str, Any], provider_filter: Optional[str] = None) -> None:
    print(f"{'MODEL ID':<30} {'PROVIDER':<15} {'DEPLOYMENT/ID'}")
    print("-" * 60)
    for m in models.values():
        if isinstance(m, ModelCard):
            if provider_filter and m.provider_id != provider_filter:
                continue
            print(f"{m.model_id:<30} {m.provider_id:<15} {m.model_or_deployment_id}")

def show_model(models: Dict[str, Any], model_id: str) -> None:
    if model_id not in models:
        print(f"Model '{model_id}' not found.")
        sys.exit(1)
    
    model = models[model_id]
    print(json.dumps(asdict(model), indent=2))
