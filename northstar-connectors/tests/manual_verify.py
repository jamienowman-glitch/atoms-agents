import sys
import asyncio
import os

# Ensure src is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

try:
    from connectors.models import ConnectorInstance
    from connectors.registry import Registry
    from tests.test_schemas import test_shopify_template_schema, test_secret_safety_validation
    from tests.test_runtime_gating import test_execution_success, test_strategy_lock_block, test_firearms_block, run_config
    print("Imports successful")
except Exception as e:
    print(f"Import failed: {e}")
    sys.exit(1)

def run_sync_tests():
    print("Running synchronous schema tests...")
    try:
        test_shopify_template_schema()
        print("test_shopify_template_schema: PASS")
        test_secret_safety_validation()
        print("test_secret_safety_validation: PASS")
    except Exception as e:
        print(f"Schema test failed: {e}")
        # Print full stack
        import traceback
        traceback.print_exc()
        raise

async def run_async_tests():
    print("Running async runtime tests...")
    # Recreate the setup logic here without pytest fixture decoration
    from unittest.mock import AsyncMock, MagicMock
    from connectors.models import ConnectorTemplate
    from connectors.runtime import RuntimeConfig
    from tests.test_runtime_gating import MockGatingService, MockSecretResolver, MockBackend

    reg = MagicMock(spec=Registry)
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

    try:
        await test_execution_success(cfg)
        print("test_execution_success: PASS")
    except Exception as e:
        print(f"test_execution_success failed: {e}")
        import traceback
        traceback.print_exc()
    
    try:
        await test_strategy_lock_block(cfg)
        print("test_strategy_lock_block: PASS")
    except Exception as e:
        print(f"test_strategy_lock_block failed: {e}")
        import traceback
        traceback.print_exc()

    # Reset state from previous test
    gating.strategy_ok = True
    try:
        await test_firearms_block(cfg)
        print("test_firearms_block: PASS")
    except Exception as e:
        print(f"test_firearms_block failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_sync_tests()
    asyncio.run(run_async_tests())
