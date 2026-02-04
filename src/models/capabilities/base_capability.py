"""Base capability definitions for atomic capabilities."""
import time
from typing import Any, Dict, List, Optional

from atoms_agents.src.logging.event_v2_logger import EventV2Logger, log_capability_invocation
from atoms_agents.src.transport.canvas_transport_bridge import get_transport


class _TransportAdapter:
    """Adapter to match EventV2Logger transport interface."""

    def __init__(self, transport: Any) -> None:
        self._transport = transport

    async def emit_sse(self, canvas_id: Optional[str], event_data: Dict[str, Any]) -> None:
        if canvas_id:
            await self._transport.emit_sse_event(canvas_id=canvas_id, event_data=event_data)

    async def emit_ws(self, thread_id: Optional[str], event_data: Dict[str, Any]) -> None:
        if thread_id:
            await self._transport.emit_ws_message(thread_id=thread_id, message_data=event_data)


_EVENT_LOGGER: Optional[EventV2Logger] = None


def get_event_logger() -> EventV2Logger:
    """Lazily create the EventV2Logger for capabilities."""
    global _EVENT_LOGGER
    if _EVENT_LOGGER is None:
        _EVENT_LOGGER = EventV2Logger(
            tenant_id="t_dev",
            project_id="proj_capabilities",
            transport_client=_TransportAdapter(get_transport()),
        )
    return _EVENT_LOGGER


class BaseCapability:
    """Base class for all capabilities."""

    CAPABILITY_ID = "capability"
    NAME = "Base Capability"
    DESCRIPTION = "Base capability. Override in subclasses."
    SUPPORTED_BACKENDS: List[str] = []

    def __init__(self, backend_map: Optional[Dict[str, Any]] = None) -> None:
        self.backend_map = backend_map or {}

    async def initialize(self, **kwargs: Any) -> bool:
        return True

    def get_mode_info(self) -> Dict[str, Any]:
        return {
            "capability_id": self.CAPABILITY_ID,
            "name": self.NAME,
            "description": self.DESCRIPTION,
            "supported_backends": self.SUPPORTED_BACKENDS,
        }

    async def execute(
        self,
        input_data: Dict[str, Any],
        *,
        backend: Optional[str] = None,
        actor_id: str = "system",
        canvas_id: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            output = await self._execute(input_data, backend=backend, **kwargs)
            duration_ms = (time.perf_counter() - start) * 1000
            await log_capability_invocation(
                logger=get_event_logger(),
                capability_id=self.CAPABILITY_ID,
                input_data=input_data,
                output_data=output,
                duration_ms=duration_ms,
                actor_id=actor_id,
                canvas_id=canvas_id,
            )
            return output
        except Exception as exc:
            duration_ms = (time.perf_counter() - start) * 1000
            await log_capability_invocation(
                logger=get_event_logger(),
                capability_id=self.CAPABILITY_ID,
                input_data=input_data,
                output_data=None,
                duration_ms=duration_ms,
                error=str(exc),
                actor_id=actor_id,
                canvas_id=canvas_id,
            )
            raise

    async def _execute(self, input_data: Dict[str, Any], backend: Optional[str] = None, **kwargs: Any) -> Dict[str, Any]:
        backend_impl = None
        if backend:
            backend_impl = self.backend_map.get(backend)
        if backend_impl is None and self.backend_map:
            backend_impl = next(iter(self.backend_map.values()))
        if backend_impl is None:
            raise ValueError("No backend configured for capability execution")

        if hasattr(backend_impl, "execute"):
            result = backend_impl.execute(input_data, **kwargs)
        elif hasattr(backend_impl, "generate"):
            result = backend_impl.generate(input_data.get("prompt") or input_data.get("text") or "", **kwargs)
        elif callable(backend_impl):
            result = backend_impl(input_data, **kwargs)
        else:
            raise ValueError("Backend does not support execute/generate/callable")

        if hasattr(result, "__await__"):
            result = await result
        return {"result": result}
