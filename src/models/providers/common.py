"""Shared helpers for provider implementations."""
import logging
import os
from typing import Optional

from atoms_agents.server.vault import VaultLoader

from atoms_agents.src.logging.event_v2_logger import EventV2, EventV2Logger, log_provider_inference
from atoms_agents.src.transport.canvas_transport_bridge import get_transport

logger = logging.getLogger("atoms_agents.providers")

_EVENT_LOGGER: Optional[EventV2Logger] = None


def get_event_logger() -> EventV2Logger:
    """Lazily instantiate the shared EventV2Logger."""
    global _EVENT_LOGGER
    if _EVENT_LOGGER is None:
        _EVENT_LOGGER = EventV2Logger(
            tenant_id=os.getenv("EVENT_TENANT_ID", "t_dev"),
            project_id=os.getenv("EVENT_PROJECT_ID", "proj_models"),
            transport_client=get_transport(),
        )
    return _EVENT_LOGGER


def load_vault_secret(*candidates: str) -> str:
    """Return the first non-empty secret from vault candidates."""
    for filename in candidates:
        if not filename:
            continue
        secret = VaultLoader.load_secret(filename)
        if secret:
            return secret
    return ""


def resolve_secret(env_var: str, *candidates: str) -> str:
    """Resolve secret from vault, falling back to env for compatibility."""
    secret = load_vault_secret(*candidates)
    if secret:
        return secret
    return os.getenv(env_var, "")


def require_secret(env_var: str, *candidates: str) -> str:
    """Load a secret and raise if missing."""
    secret = resolve_secret(env_var, *candidates)
    if not secret:
        raise EnvironmentError(f"{env_var} is required but missing from vault")
    return secret


async def publish_event_to_transport(
    event: EventV2,
    canvas_id: Optional[str] = None,
    thread_id: Optional[str] = None,
) -> None:
    """Emit the event to Canvas transport if endpoints are configured."""
    if not canvas_id and not thread_id:
        return

    transport = get_transport()
    payload = event.model_dump()

    if canvas_id:
        try:
            await transport.emit_sse_event(
                canvas_id=canvas_id,
                event_data=payload,
                thread_id=thread_id,
            )
        except Exception as exc:  # pragma: no cover - best effort
            logger.debug("SSE emit skipped: %s", exc)

    if thread_id:
        try:
            await transport.emit_ws_message(
                thread_id=thread_id,
                message_data={
                    "type": "provider_inference",
                    "event": payload,
                },
            )
        except Exception as exc:  # pragma: no cover - best effort
            logger.debug("WS emit skipped: %s", exc)


async def log_inference_event(
    provider_id: str,
    model_id: str,
    input_text: Optional[str] = None,
    output_text: Optional[str] = None,
    tokens_used: int = 0,
    cost: float = 0.0,
    error: Optional[str] = None,
    canvas_id: Optional[str] = None,
    thread_id: Optional[str] = None,
    actor_id: str = "system",
) -> EventV2:
    """Log the provider inference and optionally emit it over transport."""
    event = await log_provider_inference(
        logger=get_event_logger(),
        provider_id=provider_id,
        model_id=model_id,
        input_text=input_text,
        output_text=output_text,
        tokens_used=tokens_used,
        cost=cost,
        error=error,
        actor_id=actor_id,
        canvas_id=canvas_id,
    )
    await publish_event_to_transport(event, canvas_id=canvas_id, thread_id=thread_id)
    return event
