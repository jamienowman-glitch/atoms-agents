import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

import httpx

from northstar.runtime.context import AgentsRequestContext

logger = logging.getLogger(__name__)


class CanvasMirror:
    """
    Dumb canvas stream mirror.

    Subscribes to `/sse/canvas/{id}` and stores the raw StreamEvent payloads
    without interpretation. Prompt injection is only possible if a downstream
    GraphLens explicitly reads the mirrored buffer.
    """

    def __init__(
        self,
        base_url: str,
        ctx: AgentsRequestContext,
        canvas_id: str,
        *,
        capacity: int = 500,
        transport: Optional[httpx.AsyncBaseTransport] = None,
    ):
        if not ctx.project_id:
            raise ValueError("project_id is required for CanvasMirror")
        self.base_url = base_url.rstrip("/")
        self.ctx = ctx
        self.canvas_id = canvas_id
        self.capacity = capacity
        self._transport = transport
        self._events: List[Dict[str, Any]] = []
        self._task: Optional[asyncio.Task] = None
        self._stop_event = asyncio.Event()
        self._last_event_id: Optional[str] = None
        self._errors: List[str] = []

    @property
    def last_event_id(self) -> Optional[str]:
        return self._last_event_id

    @property
    def errors(self) -> List[str]:
        return list(self._errors)

    def snapshot(self) -> List[Dict[str, Any]]:
        """Return a shallow copy of mirrored events."""
        return list(self._events)

    async def start(self) -> None:
        """Start streaming in the current event loop."""
        if self._task and not self._task.done():
            return
        self._stop_event.clear()
        self._task = asyncio.create_task(self._consume())

    async def wait(self) -> None:
        """Await the underlying stream task without signalling stop."""
        if self._task:
            await self._task

    async def stop(self) -> None:
        """Signal stop and wait for the stream task to finish."""
        self._stop_event.set()
        if self._task:
            await self._task
            self._task = None

    async def _consume(self) -> None:
        url = f"{self.base_url}/sse/canvas/{self.canvas_id}"
        headers = self.ctx.to_headers()
        headers.setdefault("Accept", "text/event-stream")
        if self._last_event_id:
            headers["Last-Event-ID"] = self._last_event_id

        try:
            async with httpx.AsyncClient(timeout=None, transport=self._transport) as client:
                async with client.stream("GET", url, headers=headers) as resp:
                    resp.raise_for_status()
                    async for line in resp.aiter_lines():
                        if self._stop_event.is_set():
                            break
                        if not line or not line.startswith("data: "):
                            continue
                        payload = json.loads(line[6:])
                        self._append(payload)
                        if self._stop_event.is_set():
                            break
        except Exception as exc:  # pragma: no cover - captured for debugging
            logger.warning("CanvasMirror stream error: %s", exc)
            self._errors.append(str(exc))
        finally:
            self._task = None

    def _append(self, payload: Dict[str, Any]) -> None:
        """Store the payload, preserving only the most recent capacity entries."""
        event_id = payload.get("event_id") or payload.get("id")
        if event_id:
            self._last_event_id = event_id
        if len(self._events) >= self.capacity:
            self._events.pop(0)
        self._events.append(payload)
