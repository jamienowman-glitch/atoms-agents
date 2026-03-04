import asyncio
from unittest.mock import AsyncMock

from atoms_agents.clients.mdx_runtime_client import MdxRuntimeClient
from atoms_agents.clients.strategy_lock_client import StrategyLockClient
from atoms_agents.clients.strategy_mdx_helpers import (
    create_document_version_compile,
    ensure_strategy_lock_instance,
    submit_strategy_lock_approval,
)


def test_strategy_lock_client_routes():
    client = StrategyLockClient("http://localhost:8000", api_key="token")
    client._request = AsyncMock(return_value={"ok": True})

    asyncio.run(client.check({"policy_key": "deploy_gate"}))
    asyncio.run(client.upsert_policy_binding({"policy_key": "deploy_gate", "enabled": True}))

    assert client._request.await_count == 2
    first_call = client._request.await_args_list[0]
    second_call = client._request.await_args_list[1]

    assert first_call.args[0] == "POST"
    assert first_call.args[1] == "strategy-lock/check"
    assert second_call.args[0] == "PUT"
    assert second_call.args[1] == "strategy-lock/policy/bindings"


def test_mdx_client_routes():
    client = MdxRuntimeClient("http://localhost:8000")
    client._request = AsyncMock(return_value={"job_id": "job_1", "status": "succeeded"})

    asyncio.run(client.compile({"document_id": "doc_1"}))
    asyncio.run(client.get_compile_job("job_1"))

    compile_call = client._request.await_args_list[0]
    get_call = client._request.await_args_list[1]

    assert compile_call.args == ("POST", "mdx/compile")
    assert get_call.args == ("GET", "mdx/compile/job_1")


def test_helper_creates_lock_instance_when_required():
    class _FakeStrategyClient:
        async def check(self, _payload):
            return {"allowed": False, "reason": "lock_required_missing"}

        async def create_instance(self, payload):
            return {"instance_id": "inst_1", **payload}

    result = asyncio.run(
        ensure_strategy_lock_instance(
            _FakeStrategyClient(),
            policy_key="deploy_gate",
            provider_type="jas_totp",
            run_id="run_9",
            scope={"lane": "prod"},
        )
    )

    assert result["status"] == "created"
    assert result["instance"]["policy_key"] == "deploy_gate"
    assert result["instance"]["provider_type"] == "jas_totp"


def test_helper_submits_approval():
    class _FakeStrategyClient:
        async def approve_instance(self, instance_id, payload):
            return {"instance_id": instance_id, **payload, "status": "approved"}

    result = asyncio.run(
        submit_strategy_lock_approval(
            _FakeStrategyClient(),
            instance_id="inst_approve",
            actor_id="u_test",
            provider_type="manual",
            reason="ship it",
        )
    )

    assert result["instance_id"] == "inst_approve"
    assert result["status"] == "approved"
    assert result["actor_id"] == "u_test"


def test_helper_document_version_compile_flow():
    class _FakeMdxClient:
        async def create_document(self, payload):
            return {"document_id": "doc_1", **payload}

        async def create_version(self, document_id, payload):
            return {"version_id": "ver_1", "document_id": document_id, **payload}

        async def compile(self, payload):
            return {"job_id": "job_1", "status": "succeeded", **payload}

    result = asyncio.run(
        create_document_version_compile(
            _FakeMdxClient(),
            document_key="strategy-plan",
            title="Strategy Plan",
            source_mdx="# Plan\n<Hero />",
            strict_components=False,
        )
    )

    assert result["document"]["document_key"] == "strategy-plan"
    assert result["version"]["document_id"] == "doc_1"
    assert result["compile_job"]["document_id"] == "doc_1"
