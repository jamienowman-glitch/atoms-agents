import os
import unittest
from unittest.mock import patch, MagicMock

# Mocking pydantic if missing in test environment (though we installed it)
# But we need to make sure imports work.

from engines.nexus.vector_explorer.service import VectorExplorerService
from engines.nexus.vector_explorer.lance_store import LanceExplorerVectorStore
from engines.nexus.vector_explorer.vector_store import VertexExplorerVectorStore
from engines.cost.vertex_guard import verify_vertex_budget
from engines.nexus.lance_store import LanceVectorStore
from engines.nexus.schemas import SpaceKey, Scope

class TestVectorExplorerWiring(unittest.TestCase):

    def test_default_wiring(self):
        with patch.dict(os.environ, {}, clear=True):
            # Ensure ENABLE_VERTEX_LEGACY is not set
            if "ENABLE_VERTEX_LEGACY" in os.environ:
                del os.environ["ENABLE_VERTEX_LEGACY"]

            # We need to mock runtime_config or ensure it doesn't crash
            with patch("engines.nexus.vector_explorer.service.FirestoreVectorCorpusRepository"):
                service = VectorExplorerService(
                    repository=MagicMock(),
                    embedder=MagicMock(),
                    event_logger=MagicMock(),
                    budget_service=MagicMock()
                )
                self.assertIsInstance(service._vector_store, LanceExplorerVectorStore)

    def test_legacy_wiring(self):
        with patch.dict(os.environ, {"ENABLE_VERTEX_LEGACY": "true"}):
            with patch("engines.nexus.vector_explorer.service.FirestoreVectorCorpusRepository"):
                service = VectorExplorerService(
                    repository=MagicMock(),
                    embedder=MagicMock(),
                    event_logger=MagicMock(),
                    budget_service=MagicMock()
                )
                self.assertIsInstance(service._vector_store, VertexExplorerVectorStore)

    def test_lance_path_structure(self):
        store = LanceVectorStore(root_uri="/tmp/test_root")
        key = SpaceKey(
            scope=Scope.TENANT,
            tenant_id="t_123",
            env="prod",
            project_id="proj",
            surface_id="surf",
            space_id="space"
        )
        uri = store._get_table_uri(key)
        # Expected: /tmp/test_root/t_123/prod_proj_surf_space.lance
        self.assertEqual(uri, "/tmp/test_root/t_123/prod_proj_surf_space.lance")

    def test_vertex_guard_blocks(self):
        # Default: blocked
        with patch.dict(os.environ, {}, clear=True):
             with self.assertRaisesRegex(RuntimeError, "Cost Kill Switch Active"):
                 verify_vertex_budget("t_blocked", "prod")

    def test_vertex_guard_allows_global(self):
        with patch.dict(os.environ, {"ALLOW_BILLABLE_VERTEX": "1"}):
             # Should not raise
             verify_vertex_budget("t_any", "prod")

    def test_vertex_guard_allows_tenant(self):
        with patch.dict(os.environ, {"HIGH_BUDGET_TENANTS": "t_rich,t_wealthy"}):
             # Should not raise
             verify_vertex_budget("t_rich", "prod")
             verify_vertex_budget("t_wealthy", "prod")

             with self.assertRaisesRegex(RuntimeError, "Cost Kill Switch Active"):
                 verify_vertex_budget("t_poor", "prod")

if __name__ == "__main__":
    unittest.main()
