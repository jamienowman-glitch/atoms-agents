from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import sys

# Ensure we can import from src
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from atoms_agents.registry.loader import RegistryLoader, RegistryContext
from atoms_agents.runtime.gateway_resolution import resolve_gateway
from atoms_agents.registry.schemas import ModelCard

app = FastAPI(title="Atoms Workbench")

def get_registry() -> RegistryContext:
    # Path relative to src/atoms_agents/workbench/main.py
    # to src/atoms_agents/registry/cards
    current_dir = os.path.dirname(os.path.abspath(__file__))
    registry_path = os.path.join(current_dir, "../registry/cards")
    loader = RegistryLoader(root_path=registry_path)
    return loader.load_context()

@app.get("/registry/index")
def get_registry_index():
    ctx = get_registry()
    return {
        "agents": list(ctx.agents.keys()),
        "reasoning_profiles": list(ctx.reasoning_profiles.keys()),
        "licenses": list(ctx.licenses.keys()),
        "models": list(ctx.models.keys()),
        "personas": list(ctx.personas.keys()),
    }

class ChatRequest(BaseModel):
    agent_id: str
    message: str
    stream: bool = False

@app.post("/workbench/chat")
async def chat(request: ChatRequest):
    ctx = get_registry()
    agent = ctx.agents.get(request.agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{request.agent_id}' not found")

    # Resolve Model & Provider
    model_id = agent.model_id
    model_card = ctx.models.get(model_id)
    if not model_card:
        # Fallback if model not in registry but ID is known/valid
        # Assuming a default provider if not found is risky, but for proof of concept:
        provider_id = "jules"
        model_card = ModelCard(
            model_id=model_id,
            provider_id=provider_id,
            official_id=model_id,
            family_id="mock_family"
        )
    else:
        provider_id = model_card.provider_id

    try:
        gateway = resolve_gateway(provider_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gateway resolution failed: {str(e)}")

    # Compose Messages
    messages = []
    if agent.persona_id:
        persona = ctx.personas.get(agent.persona_id)
        if persona:
            # Simple prompt composition
            content = f"{persona.name}: {persona.description}"
            if persona.principles:
                content += f"\nPrinciples: {persona.principles}"
            messages.append({"role": "system", "content": content})

    if agent.reasoning_profile_id:
         profile = ctx.reasoning_profiles.get(agent.reasoning_profile_id)
         if profile:
             messages.append({"role": "system", "content": f"[Reasoning Method: {profile.method}] {profile.description}"})

    messages.append({"role": "user", "content": request.message})

    # Execute
    try:
        response = gateway.generate(
            messages=messages,
            model_card=model_card,
            provider_config={},
            stream=False # Force non-stream for simple API response
        )
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

    return {
        "response": response.get("content"),
        "agent_id": agent.agent_id,
        "model_id": model_id,
        "reasoning_profile": agent.reasoning_profile_id,
        "raw_response": response
    }
