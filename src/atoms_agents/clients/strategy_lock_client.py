from __future__ import annotations

from typing import Any, Dict, Optional

from atoms_agents.clients.http_base import BaseHttpClient


class StrategyLockClient(BaseHttpClient):
    """Async client wrapper for atoms-core Strategy Lock APIs."""

    async def create_definition(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", "strategy-lock/definitions", json_data=payload)

    async def list_definitions(self) -> Dict[str, Any]:
        return await self._request("GET", "strategy-lock/definitions")

    async def create_instance(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", "strategy-lock/instances", json_data=payload)

    async def list_instances(self, *, policy_key: Optional[str] = None, run_id: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if policy_key:
            params["policy_key"] = policy_key
        if run_id:
            params["run_id"] = run_id
        return await self._request("GET", "strategy-lock/instances", params=params or None)

    async def approve_instance(self, instance_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", f"strategy-lock/instances/{instance_id}/approve", json_data=payload)

    async def reject_instance(self, instance_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", f"strategy-lock/instances/{instance_id}/reject", json_data=payload)

    async def release_instance(self, instance_id: str) -> Dict[str, Any]:
        return await self._request("POST", f"strategy-lock/instances/{instance_id}/release")

    async def check(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", "strategy-lock/check", json_data=payload)

    async def upsert_provider_binding(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("PUT", "strategy-lock/providers/bindings", json_data=payload)

    async def upsert_policy_binding(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("PUT", "strategy-lock/policy/bindings", json_data=payload)
