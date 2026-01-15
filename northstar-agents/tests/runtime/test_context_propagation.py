
import pytest
from unittest.mock import MagicMock, ANY
from northstar.runtime.node_executor import NodeExecutor
from northstar.runtime.context import AgentsRequestContext, ContextMode
from northstar.registry.schemas import NodeCard, RunProfileCard
from northstar.runtime.gateway import LLMGateway, ReadinessResult, ReadinessStatus

class MockGateway(LLMGateway):
    def __init__(self):
        self.received_context = None

    def generate(self, messages, model_card, provider_config, stream=False, capability_toggles=None, limits=None, request_context=None):
        self.received_context = request_context
        return {"role": "assistant", "content": "mock_response"}

    def check_readiness(self):
        return ReadinessResult(ReadinessStatus.READY, "Mock ready", True)

@pytest.fixture
def mock_registry():
    registry = MagicMock()
    
    # Mock Node
    node = NodeCard(
        node_id="test_node",
        name="Test Node",
        kind="agent",
        persona_ref="persona_test",
        task_ref="task_test",
        provider_ref="mock_provider",
        model_ref="mock_model",
        # inputs=[], # Inputs removed/changed in schema? Not present in view_file.
        # artifact_outputs=[], # Present
        # blackboard_writes=[], # Present
        # capabilities_ids=[], # Present
    )
    
    # Mock Profile
    profile = RunProfileCard(
        profile_id="test_profile",
        name="Test Profile",
        persistence_backend="local",
        blackboard_backend="local",
        pii_strategy="passthrough",
        nexus_strategy="disabled",
        allow_local_fallback=True
    )
    
    mock_persona = MagicMock()
    mock_persona.description = "You are a test agent."
    mock_persona.principles = []
    registry.personas.get.return_value = mock_persona

    mock_task = MagicMock()
    mock_task.goal = "Test the system."
    mock_task.acceptance_criteria = []
    mock_task.constraints = []
    registry.tasks.get.return_value = mock_task

    registry.models.get.return_value = MagicMock()
    registry.artifact_specs.get.return_value = None
    
    return registry, node, profile

def test_node_executor_fails_without_context(mock_registry):
    registry, node, profile = mock_registry
    executor = NodeExecutor(registry)
    
    with pytest.raises(ValueError, match="AgentsRequestContext is required"):
        executor.execute_node(node, profile, {})

def test_node_executor_propagates_context(mock_registry, monkeypatch):
    registry, node, profile = mock_registry
    
    # Mock gateway resolution to return our spy gateway
    mock_gateway = MockGateway()
    def mock_resolve(provider_id):
        return mock_gateway
    
    monkeypatch.setattr("northstar.runtime.node_executor.resolve_gateway", mock_resolve)
    
    executor = NodeExecutor(registry)
    
    ctx = AgentsRequestContext(
        tenant_id="t_test",
        mode=ContextMode.LAB,
        project_id="p_test",
        request_id="req_123",
        trace_id="trace_123",
        run_id="run_123",
        step_id="step_123"
    )
    
    result = executor.execute_node(node, profile, {}, request_context=ctx)
    
    assert result.status == "PASS", f"Execution failed: {result.reason} | Error: {getattr(result, 'error', 'N/A')}"
    assert mock_gateway.received_context == ctx
    assert mock_gateway.received_context.tenant_id == "t_test"

def test_context_to_headers():
    ctx = AgentsRequestContext(
        tenant_id="t_prod",
        mode=ContextMode.SAAS,
        project_id="p_prod",
        request_id="req_abc",
        trace_id="trace_abc",
        run_id="run_abc",
        step_id="step_abc",
        user_id="user_1"
    )
    
    headers = ctx.to_headers()
    assert headers["X-Tenant-Id"] == "t_prod"
    assert headers["X-Mode"] == "saas"
    assert headers["X-Project-Id"] == "p_prod"
    assert headers["X-User-Id"] == "user_1"
    assert "X-Actor-Id" not in headers  # Optional missing
