import os
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List
from atoms_agents.registry.loader import RegistryLoader
from atoms_agents.server.factory import GatewayFactory
from atoms_agents.server.vault import VaultLoader
from atoms_agents.registry.schemas import ManifestCard, PersonaCard, TaskCard, ModelCard, ProviderConfigCard, ReasoningProfileCard

app = FastAPI()

# Global Registry
registry = None

@app.on_event("startup")
async def startup_event():
    global registry
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.join(base_dir, "../../../../atoms-agents/registry/cards")
    root_dir = os.path.abspath(root_dir)

    print(f"Loading registry from: {root_dir}")
    loader = RegistryLoader(root_dir)
    registry = loader.load_context()
    print(f"Registry loaded. {len(registry.models)} models found.")

@app.get("/registry/index")
async def get_registry_index():
    if not registry:
        return {"error": "Registry not loaded"}

    return {
        "providers": [{ "id": k, "name": v.name } for k, v in registry.providers.items()],
        "models": [{ "id": k, "name": v.official_id, "provider_id": v.provider_id } for k, v in registry.models.items()],
        "personas": [{ "id": k, "name": v.name } for k, v in registry.personas.items()],
        "manifests": [{ "id": k, "name": v.name } for k, v in registry.manifests.items()],
        "reasoning_profiles": [{ "id": k, "name": v.name } for k, v in registry.reasoning_profiles.items()],
        "firearms_licenses": [{ "id": k, "name": v.name } for k, v in registry.firearms_licenses.items()],
        "agents": [{ "id": k, "name": v.name } for k, v in registry.agents.items()],
    }

@app.websocket("/workbench/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            provider_id = data.get("provider_id")
            model_id = data.get("model_id")
            messages = data.get("messages", [])

            if not provider_id or not model_id:
                await websocket.send_json({"error": "Missing provider_id or model_id"})
                continue

            provider_card = registry.providers.get(provider_id)
            model_card = registry.models.get(model_id)

            if not provider_card or not model_card:
                await websocket.send_json({"error": "Invalid provider or model ID"})
                continue

            manifest_id = data.get("manifest_id")
            persona_id = data.get("persona_id")

            system_instructions = []
            if manifest_id and (m := registry.manifests.get(manifest_id)):
                system_instructions.append(f"Manifest: {m.system_prompt}")

            if persona_id and (p := registry.personas.get(persona_id)):
                system_instructions.append(f"Persona: {p.name}. {p.description}")

            if system_instructions:
                messages.insert(0, {"role": "system", "content": "\n".join(system_instructions)})

            try:
                gateway = GatewayFactory.get_gateway(provider_id)
            except Exception as e:
                await websocket.send_json({"error": f"Gateway Error: {str(e)}"})
                continue

            try:
                result = gateway.generate(
                    messages=messages,
                    model_card=model_card,
                    provider_config=provider_card,
                    stream=False
                )

                if result.get("status") == "FAIL":
                    await websocket.send_json({"error": result.get("reason", "Unknown error")})
                else:
                    content = result.get("content", "")
                    await websocket.send_json({"token": content})
                    await websocket.send_json({"done": True})

            except Exception as e:
                 await websocket.send_json({"error": f"Execution Error: {str(e)}"})

    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
