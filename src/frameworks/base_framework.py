"""Base framework definitions for atomic modes."""
import time
from typing import Any, Dict, List, Optional

from atoms_agents.src.logging.event_v2_logger import EventV2Logger, log_framework_execution
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
    """Lazily create the EventV2Logger for frameworks."""
    global _EVENT_LOGGER
    if _EVENT_LOGGER is None:
        _EVENT_LOGGER = EventV2Logger(
            tenant_id="t_dev",
            project_id="proj_frameworks",
            transport_client=_TransportAdapter(get_transport()),
        )
    return _EVENT_LOGGER


class BaseFramework:
    """Base class for all framework modes."""

    FRAMEWORK_ID = "framework"
    MODE_ID = "base"
    NAME = "Base Framework"
    DESCRIPTION = "Base framework mode. Override in subclasses."
    SUPPORTED_BACKENDS: List[str] = []

    def __init__(self, model_backend: Optional[Any] = None, capabilities: Optional[Dict[str, Any]] = None) -> None:
        self.model_backend = model_backend
        self.capabilities = capabilities or {}

    async def initialize(self, **kwargs: Any) -> bool:
        return True

    def get_mode_info(self) -> Dict[str, Any]:
        return {
            "framework_id": self.FRAMEWORK_ID,
            "mode_id": self.MODE_ID,
            "name": self.NAME,
            "description": self.DESCRIPTION,
            "supported_backends": self.SUPPORTED_BACKENDS,
        }

    async def execute(
        self,
        input_data: Dict[str, Any],
        *,
        actor_id: str = "system",
        canvas_id: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            result = await self._execute(input_data, **kwargs)
            duration_ms = (time.perf_counter() - start) * 1000
            await log_framework_execution(
                logger=get_event_logger(),
                framework_id=self.FRAMEWORK_ID,
                framework_mode_id=self.MODE_ID,
                models_used=[str(self.model_backend)] if self.model_backend else [],
                capabilities_used=list(self.capabilities.keys()),
                duration_ms=duration_ms,
                status="success",
                actor_id=actor_id,
                canvas_id=canvas_id,
            )
            return result
        except Exception as exc:
            duration_ms = (time.perf_counter() - start) * 1000
            await log_framework_execution(
                logger=get_event_logger(),
                framework_id=self.FRAMEWORK_ID,
                framework_mode_id=self.MODE_ID,
                models_used=[str(self.model_backend)] if self.model_backend else [],
                capabilities_used=list(self.capabilities.keys()),
                duration_ms=duration_ms,
                status="failed",
                error=str(exc),
                actor_id=actor_id,
                canvas_id=canvas_id,
            )
            raise

    async def _execute(self, input_data: Dict[str, Any], **kwargs: Any) -> Dict[str, Any]:
        if not self.model_backend:
            raise ValueError("model_backend is required for framework execution")

        prompt = input_data.get("prompt") or input_data.get("input") or ""
        if hasattr(self.model_backend, "generate"):
            output = await self.model_backend.generate(prompt, **kwargs)
            return {"output": output}
        if callable(self.model_backend):
            result = self.model_backend(prompt, **kwargs)
            if hasattr(result, "__await__"):
                result = await result
            return {"output": result}
        raise ValueError("model_backend does not support generate() or callable execution")
