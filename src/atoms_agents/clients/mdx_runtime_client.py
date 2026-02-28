from __future__ import annotations

from typing import Any, Dict

from atoms_agents.clients.http_base import BaseHttpClient


class MdxRuntimeClient(BaseHttpClient):
    """Async client wrapper for atoms-core MDX runtime APIs."""

    async def create_document(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", "mdx/documents", json_data=payload)

    async def get_document(self, document_id: str) -> Dict[str, Any]:
        return await self._request("GET", f"mdx/documents/{document_id}")

    async def create_version(self, document_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", f"mdx/documents/{document_id}/versions", json_data=payload)

    async def list_versions(self, document_id: str) -> Dict[str, Any]:
        return await self._request("GET", f"mdx/documents/{document_id}/versions")

    async def compile(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", "mdx/compile", json_data=payload)

    async def get_compile_job(self, job_id: str) -> Dict[str, Any]:
        return await self._request("GET", f"mdx/compile/{job_id}")

    async def upsert_component_binding(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("PUT", "mdx/components/bindings", json_data=payload)
