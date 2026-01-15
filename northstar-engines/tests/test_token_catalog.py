import pytest
from unittest.mock import MagicMock, AsyncMock
from engines.canvas_commands.catalog_service import TokenCatalogService
from engines.common.identity import RequestContext

@pytest.fixture
def mock_registry():
    return MagicMock()

@pytest.fixture
def mock_store():
    return MagicMock()

@pytest.fixture
def ctx():
    m = MagicMock(spec=RequestContext)
    m.tenant_id = "t1"
    return m

import asyncio
from unittest.mock import patch

def test_catalog_merging_sync(ctx, mock_registry, mock_store):
    async def run_test():
        # Setup with patch to avoid routing error during init
        with patch('engines.canvas_commands.catalog_service.CanvasCommandStoreService') as MockStoreCls:
            MockStoreCls.return_value = mock_store
            svc = TokenCatalogService(ctx)
        
        svc.registry = mock_registry
        # svc.cmd_store is already mock_store from patch return value
        
        # Mock Specs
        spec_a = MagicMock()
        spec_a.id = "token.a"
        spec_a.metadata = {}
        spec_a.schema = {"type": "string"}
        spec_a.controls = {"kind": "text"}
        spec_a.defaults = {"value": "default_a"}
        
        mock_registry.list_specs.return_value = MagicMock(specs=[spec_a])
        
        # Mock Commands
        mock_store.list_commands_since.return_value = [
            {"type": "set_token", "command_args": {"element_id": "canvas", "token_path": "token.a", "value": "val_canvas"}},
            {"type": "set_token", "command_args": {"element_id": "e1", "token_path": "token.a", "value": "val_e1"}},
            {"type": "set_tokens", "command_args": {"element_id": "e2", "updates": [{"token_path": "token.a", "value": "val_e2"}]}}
        ]
        
        # Test 1
        catalog_global = await svc.get_token_catalog("c1")
        assert len(catalog_global) == 1
        assert catalog_global[0].value == "val_canvas"
        
        # Test 2
        catalog_e1 = await svc.get_token_catalog("c1", element_id="e1")
        assert catalog_e1[0].value == "val_e1"
        assert catalog_e1[0].element_id == "e1"
        
        # Test 3
        catalog_e2 = await svc.get_token_catalog("c1", element_id="e2")
        assert catalog_e2[0].value == "val_e2"
        
        # Test 4
        catalog_e3 = await svc.get_token_catalog("c1", element_id="e3")
        assert catalog_e3[0].value == "val_canvas"
        assert catalog_e3[0].element_id is None

    asyncio.run(run_test())
