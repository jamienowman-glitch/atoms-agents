import pytest
from unittest.mock import AsyncMock, MagicMock
from connectors.runtime import (
    ConnectorExecutor, RuntimeConfig, SecretResolver, GatingService, 
    BudgetService, DatasetService, StrategyViolationError, FirearmsViolationError
)
from connectors.models import ConnectorInstance, TemplateRef, ConnectorTemplate
from connectors.registry import Registry

# Mocks
class MockSecretResolver(SecretResolver):
    async def resolve_config(self, config, template):
        return {"resolved": "true"}

class MockGatingService(GatingService):
    def __init__(self):
        self.strategy_ok = True
        self.firearms_ok = True
    
    async def check_strategy_lock(self, ctx, action, inputs):
        return self.strategy_ok

    async def check_firearms(self, ctx, action, subject):
        return self.firearms_ok

class MockBudgetService(BudgetService):
    async def emit(self, event):
        pass

class MockDatasetService(DatasetService):
    async def emit(self, event):
        pass

class MockBackend:
    async def run(self, op_id, inputs, config):
        return {"status": "success", "op": op_id}

@pytest.fixture
def run_config():
    reg = MagicMock(spec=Registry)
    # Mock template setup
    tmplt = ConnectorTemplate(
        id="mock_provider",
        version="1.0.0",
        provider="Mock",
        auth_scheme={"type": "none", "fields": []},
        operations={
            "safe_op": {
                "description": "Safe",
                "inputs": {},
                "outputs": {},
                "strategy_lock_action": "mock:safe",
                "dataset_event": {"enabled": True},
                "usage_event": {"tool_type": "api", "default_cost": "0.01"}
            },
            "dangerous_op": {
                "description": "Dangerous",
                "inputs": {},
                "outputs": {},
                "strategy_lock_action": "mock:dangerous",
                "firearms_action": "mock:shoot",
                "dataset_event": {"enabled": True},
                "usage_event": {"tool_type": "api", "default_cost": "100.00"}
            }
        }
    )
    reg.get_template.return_value = tmplt
    
    gating = MockGatingService()
    cfg = RuntimeConfig(
        secrets=MockSecretResolver(),
        gating=gating,
        budget=AsyncMock(),
        dataset=AsyncMock(),
        registry=reg
    )
    cfg.register_provider("mock_provider", MockBackend())
    return cfg

@pytest.mark.asyncio
async def test_execution_success(run_config):
    executor = ConnectorExecutor(run_config)
    inst = ConnectorInstance(
        id="inst_1", tenant_id="t_test", env="dev", 
        template_ref=TemplateRef(id="mock_provider", version="1.0.0")
    )
    
    res = await executor.execute_operation(inst, "safe_op", {})
    assert res["status"] == "success"
    
    # Dataset Event
    run_config.dataset.emit.assert_called_once()
    evt = run_config.dataset.emit.call_args[0][0]
    assert evt.tenantId == "t_test"
    assert evt.agentId == "inst_1"
    
    # Budget Event
    run_config.budget.emit.assert_called_once()
    budget_evt = run_config.budget.emit.call_args[0][0]
    assert budget_evt.cost == "0.01"

@pytest.mark.asyncio
async def test_strategy_lock_block(run_config):
    run_config.gating.strategy_ok = False
    executor = ConnectorExecutor(run_config)
    inst = ConnectorInstance(
        id="inst_1", tenant_id="t_test", env="dev", 
        template_ref=TemplateRef(id="mock_provider", version="1.0.0")
    )
    
    with pytest.raises(StrategyViolationError):
        await executor.execute_operation(inst, "safe_op", {})

@pytest.mark.asyncio
async def test_firearms_block(run_config):
    run_config.gating.firearms_ok = False
    executor = ConnectorExecutor(run_config)
    inst = ConnectorInstance(
        id="inst_1", tenant_id="t_test", env="dev", 
        template_ref=TemplateRef(id="mock_provider", version="1.0.0")
    )
    
    # Safe op has no firearms action -> should pass even if 'firearms_ok' is False (as check isn't called)
    # But let's test the dangerous one
    with pytest.raises(FirearmsViolationError):
        await executor.execute_operation(inst, "dangerous_op", {})
