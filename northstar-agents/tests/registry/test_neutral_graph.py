import os
import pytest
from northstar.registry.loader import RegistryLoader
from northstar.registry.schemas.neutral import NeutralNodeCard
from northstar.registry.schemas.lenses import ContextLayerCard
from northstar.registry.schemas.graph import GraphDefinitionCard

class TestNeutralGraph:
    def test_load_neutral_graph(self):
        # Point to the directory containing our test data
        # In a real scenario, this would be the root of the registry
        # We will mock the load_cards_from_dir or just assume the loader 
        # can point to a specific file for testing logic if we refactor,
        # but here we'll use the _load_file method directly for unit testing.
        
        loader = RegistryLoader("/tmp") # Root path irrelevant for direct file load
        test_file = os.path.join(os.path.dirname(__file__), "../test_data/graph_lens_demo.yaml")
        
        cards = loader._load_file(test_file)
        
        assert len(cards) == 3
        
        neutral_node = next(c for c in cards if isinstance(c, NeutralNodeCard))
        context_lens = next(c for c in cards if isinstance(c, ContextLayerCard))
        graph_def = next(c for c in cards if isinstance(c, GraphDefinitionCard))
        
        # Verify Neutral Node
        assert neutral_node.node_id == "node.test.1"
        assert len(neutral_node.components) == 1
        assert neutral_node.components[0].ref_id == "agent.mock.writer"
        
        # Verify Context Lens
        assert context_lens.context_id == "ctx.test.brand"
        assert context_lens.voice_tone == "Professional"
        
        # Verify Graph Def
        assert graph_def.graph_id == "graph.test.flow"
        assert "ctx.test.brand" in graph_def.applied_lenses
        
        # --- PHASE 3 VERIFICATION: RUNTIME EXECUTION ---
        from northstar.runtime.node_executor import NodeExecutor
        from northstar.registry.schemas import RunProfileCard
        from northstar.runtime.context import AgentsRequestContext, ContextMode
        
        # Mock Context
        req_ctx = AgentsRequestContext(
            tenant_id="t1",
            mode=ContextMode.LAB,
            project_id="p1",
            request_id="r1",
            user_id="user"
        )
        
        # Initialize Executor (Mocking registry ctx as needed, but we have the loaded object)
        # We need a proper RegistryContext object to pass to executor
        from northstar.registry.loader import RegistryContext
        
        # Minimal mock of what RegistryContext needs for this test
        class MockRegistryCtx:
            pass
            
        mock_reg = MockRegistryCtx()
        
        # --- PHASE 5: SPINE-SYNC VERIFICATION ---
        from unittest.mock import MagicMock
        mock_mirror = MagicMock()
        mock_mirror.canvas_id = "canvas.test"
        mock_mirror.snapshot.return_value = []
        # Simulate tools found
        mock_mirror.get_tools.return_value = [{"name": "resize_box", "description": "Resizes a visual element"}]
        
        executor = NodeExecutor(mock_reg, canvas_mirror=mock_mirror) # Inject Mirror
        blackboard = {}
        profile = RunProfileCard(
            profile_id="test_profile", 
            name="Test Profile",
            persistence_backend="local",
            blackboard_backend="local",
            pii_strategy="redact",
            nexus_strategy="read_only", 
            allow_local_fallback=True
        )
        
        # Execute Neutral Node
        result = executor.execute_node(neutral_node, profile, blackboard, request_context=req_ctx)
        
        assert result.status == "PASS"
        assert result.reason == "Component Executed"
        
        # Verify Tool Ingestion (Event check)
        # Note: In ComponentRunner path, we didn't explicitly implement the NodeExecutor-level hook yet
        # The hook I added was in the LEGACY path of executing_node.
        # I need to ensure ComponentRunner also gets this mirror or the logic is shared.
        # For this test, let's verify if 'events' in result contains our mirror attachment info
        has_mirror_event = any(e.get("type") == "canvas_mirror_attached" for e in result.events)
        assert has_mirror_event, "Executor should have attached mirror and logged event"
