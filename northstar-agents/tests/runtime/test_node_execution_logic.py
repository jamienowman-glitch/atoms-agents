import pytest
from unittest.mock import MagicMock, patch
from northstar.runtime.node_executor import NodeExecutor
from northstar.runtime.gateway import ReadinessResult, LLMGateway, ReadinessStatus
from northstar.registry.schemas import NodeCard, PersonaCard, TaskCard, ModelCard
from northstar.runtime.context import AgentsRequestContext, ContextMode
import uuid


@pytest.fixture
def mock_registry():
    registry = MagicMock()
    registry.personas.get.return_value = PersonaCard(
        "p1", "test persona", "role", "voice", "framework", "desc", "instructions"
    )
    registry.tasks.get.return_value = TaskCard(
        "t1", "test task", "goal", [], [], [], [], {}
    )
    registry.models.get.return_value = ModelCard("m1", "provider1", "model1")
    return registry

@pytest.fixture
def mock_context():
    return AgentsRequestContext(
        tenant_id="t_test",
        mode=ContextMode.LAB,
        project_id="p_test",
        request_id=str(uuid.uuid4()),
        trace_id=str(uuid.uuid4()),
        run_id=str(uuid.uuid4()),
        step_id="step_test"
    )


@pytest.fixture
def mock_gateway():
    gateway = MagicMock(spec=LLMGateway)
    gateway.check_readiness.return_value = ReadinessResult(
        ReadinessStatus.READY, "Ready", True
    )
    gateway.generate.return_value = {"content": "Test response", "status": "PASS"}
    return gateway


def test_node_execution_strict_resolution_fail(mock_registry, mock_context):
    executor = NodeExecutor(mock_registry)
    node = NodeCard(
        node_id="n1", name="test_node", kind="agent", persona_ref="p1", task_ref="t1"
    )

    # no provider/model in node, no override
    result = executor.execute_node(node, MagicMock(), {}, request_context=mock_context)

    assert result.status == "FAIL"
    assert "No provider specified" in result.reason


def test_node_execution_preflight_skip(mock_registry, mock_context):
    executor = NodeExecutor(mock_registry)
    node = NodeCard(
        node_id="n1",
        name="test_node",
        kind="agent",
        persona_ref="p1",
        task_ref="t1",
        provider_ref="bedrock",
        model_ref="model-id",
    )

    # Patch the class in the module where it is defined, because NodeExecutor imports it from there locally
    with patch("northstar.runtime.providers.bedrock.BedrockGateway") as MockGateway:
        instance = MockGateway.return_value
        instance.check_readiness.return_value = ReadinessResult(
            ReadinessStatus.MISSING_CREDS_OR_CONFIG, "Not configured", False
        )

        result = executor.execute_node(node, MagicMock(), {}, request_context=mock_context)

        assert result.status == "SKIP"
        assert "Provider not ready" in result.reason
        assert "Not configured" in result.reason


def test_node_execution_capability_passing(mock_registry, mock_gateway, mock_context):
    executor = NodeExecutor(mock_registry)
    node = NodeCard(
        node_id="n1",
        name="test_node",
        kind="agent",
        persona_ref="p1",
        task_ref="t1",
        provider_ref="bedrock",
        model_ref="model1",
        capability_ids=["cap1", "cap2"],
    )

    with patch(
        "northstar.runtime.providers.bedrock.BedrockGateway", return_value=mock_gateway
    ):
        result = executor.execute_node(node, MagicMock(), {}, request_context=mock_context)

        assert result.status == "PASS"

        # Verify generate called with capabilities
        args, kwargs = mock_gateway.generate.call_args
        toggles = kwargs.get("capability_toggles")
        assert toggles is not None
        assert len(toggles) == 2
        assert toggles[0].capability_id == "cap1"
        assert toggles[1].capability_id == "cap2"

        # Verify limits passed
        limits = kwargs.get("limits")
        assert limits is not None
        assert limits.max_calls == 1
