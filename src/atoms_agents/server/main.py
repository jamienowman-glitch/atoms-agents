import os
from datetime import datetime, timezone
from typing import Dict, Any, List

import uvicorn
from fastapi import Body, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from atoms_agents.registry.loader import RegistryLoader
from atoms_agents.registry.schemas import ModelCard
from atoms_agents.runtime.gateway_resolution import resolve_gateway

app = FastAPI()

# Global Registry
registry = None

@app.on_event("startup")
async def startup_event():
    global registry
    current_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(current_dir, "../../.."))
    root_dir = os.path.join(repo_root, "registry/cards")

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

def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _resolve_model_card(provider_id: str, model_ref: str) -> ModelCard:
    if model_ref in registry.models:
        return registry.models[model_ref]

    for model_card in registry.models.values():
        if model_card.provider_id == provider_id and model_card.official_id == model_ref:
            return model_card

    sanitized = (
        model_ref.strip().replace("/", "_").replace(":", "_").replace(" ", "_")
        or "default"
    )
    return ModelCard(
        model_id=f"adhoc.{provider_id}.{sanitized}",
        provider_id=provider_id,
        official_id=model_ref,
        family_id=f"{provider_id}.adhoc",
    )


def _normalize_messages(messages: Any) -> List[Dict[str, str]]:
    normalized: List[Dict[str, str]] = []
    for item in messages if isinstance(messages, list) else []:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role") or "user")
        content = str(item.get("content") or "")
        if not content.strip():
            continue
        normalized.append({"role": role, "content": content})
    return normalized


def _invoke(provider_id: str, model_ref: str, messages: List[Dict[str, str]]) -> Dict[str, Any]:
    provider_card = registry.providers.get(provider_id)
    if not provider_card:
        raise ValueError(f"Unknown provider_id: {provider_id}")

    model_card = _resolve_model_card(provider_id=provider_id, model_ref=model_ref)
    gateway = resolve_gateway(provider_id)

    result = gateway.generate(
        messages=messages,
        model_card=model_card,
        provider_config=provider_card,
        stream=False,
    )
    used_model_ref = model_card.official_id

    # Gemini AI Studio fallback path: avoid hard-fail when one model lane is throttled.
    if result.get("status") == "FAIL" and provider_id == "gemini":
        reason = str(result.get("reason") or "")
        if "429" in reason or "404" in reason:
            fallback_models = ["gemini-flash-latest", "gemini-2.0-flash-001", "gemini-2.5-flash"]
            for fallback in fallback_models:
                if fallback == used_model_ref:
                    continue
                fallback_card = _resolve_model_card(provider_id=provider_id, model_ref=fallback)
                fallback_result = gateway.generate(
                    messages=messages,
                    model_card=fallback_card,
                    provider_config=provider_card,
                    stream=False,
                )
                if fallback_result.get("status") != "FAIL":
                    result = fallback_result
                    used_model_ref = fallback_card.official_id
                    break

    return {"result": result, "provider_id": provider_id, "model_ref": used_model_ref}


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {"ok": True, "ts": _iso_now()}


@app.post("/api/chat/complete")
async def chat_complete(payload: Dict[str, Any] = Body(default_factory=dict)) -> Dict[str, Any]:
    provider_id = str(payload.get("provider_id") or "gemini")
    model_ref = str(payload.get("model_ref") or "gemini-flash-latest")
    messages = _normalize_messages(payload.get("messages"))
    if not messages:
        raise HTTPException(status_code=400, detail="messages required")

    try:
        invoke_payload = _invoke(provider_id=provider_id, model_ref=model_ref, messages=messages)
        result = invoke_payload["result"]
        if result.get("status") == "FAIL":
            raise HTTPException(status_code=502, detail=result.get("reason") or "Model request failed")
        return {
            "provider_id": invoke_payload["provider_id"],
            "model_ref": invoke_payload["model_ref"],
            "content": result.get("content", ""),
            "usage": result.get("usage", {}),
            "ts": _iso_now(),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.websocket("/workbench/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            provider_id = str(data.get("provider_id") or "gemini")
            model_ref = str(data.get("model_id") or data.get("model_ref") or "gemini-flash-latest")
            messages = _normalize_messages(data.get("messages"))
            if not messages:
                await websocket.send_json({"error": "Missing messages"})
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
                invoke_payload = _invoke(provider_id=provider_id, model_ref=model_ref, messages=messages)
                result = invoke_payload["result"]
                if result.get("status") == "FAIL":
                    await websocket.send_json({"error": result.get("reason", "Unknown error")})
                    continue

                await websocket.send_json(
                    {
                        "token": result.get("content", ""),
                        "provider_id": invoke_payload["provider_id"],
                        "model_ref": invoke_payload["model_ref"],
                    }
                )
                await websocket.send_json({"done": True})
            except Exception as exc:
                await websocket.send_json({"error": f"Execution Error: {str(exc)}"})
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
