import json as jsonlib
from typing import Any, Dict, Optional
from urllib import error, request

from atoms_agents.engines_boundary.action_envelope import ActionEnvelope
from atoms_agents.engines_boundary.errors import parse_safety_error
from atoms_agents.runtime.context import AgentsRequestContext


class EnginesBoundaryClient:
    def __init__(self, base_url: str = "http://localhost:8010") -> None:
        self.base_url = base_url.rstrip("/")

    def _full_url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def _build_headers(self, ctx: AgentsRequestContext) -> Dict[str, str]:
        headers = dict(ctx.to_headers())
        headers.setdefault("Accept", "application/json")
        headers.setdefault("Content-Type", "application/json")
        return headers

    def _parse_body(self, raw: bytes) -> Dict[str, Any]:
        if not raw:
            return {}
        try:
            decoded = raw.decode("utf-8")
            return jsonlib.loads(decoded) if decoded else {}
        except Exception:
            return {}

    def request_json(
        self,
        method: str,
        path: str,
        ctx: AgentsRequestContext,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        body_bytes: Optional[bytes] = None
        method_upper = method.upper()
        if json is not None:
            body_bytes = jsonlib.dumps(json).encode("utf-8")

        req = request.Request(
            self._full_url(path),
            data=None if method_upper == "GET" else body_bytes,
            method=method_upper,
            headers=self._build_headers(ctx),
        )

        try:
            with request.urlopen(req) as resp:
                return self._parse_body(resp.read())
        except error.HTTPError as exc:
            payload = self._parse_body(exc.read())
            if exc.code in (403, 409):
                raise parse_safety_error(exc.code, payload)
            raise

    def post_envelope(
        self, path: str, envelope: ActionEnvelope, ctx: AgentsRequestContext
    ) -> Dict[str, Any]:
        return self.request_json("POST", path, ctx, json=envelope.to_json())
