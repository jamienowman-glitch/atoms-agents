from __future__ import annotations

from typing import Any, Dict, Optional

from atoms_agents.clients.mdx_runtime_client import MdxRuntimeClient
from atoms_agents.clients.strategy_lock_client import StrategyLockClient


async def ensure_strategy_lock_instance(
    client: StrategyLockClient,
    *,
    policy_key: str,
    provider_type: str = "manual",
    run_id: Optional[str] = None,
    scope: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Ensure a strategy lock instance exists when policy check blocks action."""
    check_payload: Dict[str, Any] = {"policy_key": policy_key}
    if run_id:
        check_payload["run_id"] = run_id
    check_result = await client.check(check_payload)

    if check_result.get("allowed"):
        return {"status": "allowed", "check": check_result, "instance": check_result.get("instance")}

    if check_result.get("reason") == "lock_required_missing":
        create_payload = {
            "policy_key": policy_key,
            "provider_type": provider_type,
            "scope": scope or {},
        }
        instance = await client.create_instance(create_payload)
        return {"status": "created", "check": check_result, "instance": instance}

    return {"status": "blocked", "check": check_result, "instance": check_result.get("instance")}


async def submit_strategy_lock_approval(
    client: StrategyLockClient,
    *,
    instance_id: str,
    actor_id: str,
    provider_type: Optional[str] = None,
    ticket_jwt: Optional[str] = None,
    reason: Optional[str] = None,
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"actor_id": actor_id}
    if provider_type:
        payload["provider_type"] = provider_type
    if ticket_jwt:
        payload["ticket_jwt"] = ticket_jwt
    if reason:
        payload["reason"] = reason
    return await client.approve_instance(instance_id, payload)


async def create_version_and_compile(
    client: MdxRuntimeClient,
    *,
    document_id: str,
    source_mdx: str,
    changelog: Optional[str] = None,
    strict_components: bool = False,
) -> Dict[str, Any]:
    version = await client.create_version(
        document_id,
        {
            "source_mdx": source_mdx,
            "changelog": changelog,
        },
    )
    compile_job = await client.compile(
        {
            "document_id": document_id,
            "version_id": version.get("version_id"),
            "strict_components": strict_components,
        }
    )
    return {"version": version, "compile_job": compile_job}


async def create_document_version_compile(
    client: MdxRuntimeClient,
    *,
    document_key: str,
    title: str,
    source_mdx: str,
    strict_components: bool = False,
) -> Dict[str, Any]:
    document = await client.create_document(
        {
            "document_key": document_key,
            "title": title,
            "status": "draft",
        }
    )
    result = await create_version_and_compile(
        client,
        document_id=document["document_id"],
        source_mdx=source_mdx,
        strict_components=strict_components,
    )
    return {"document": document, **result}
