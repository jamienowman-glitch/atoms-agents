import unittest
import sys
import os
import shutil
import tempfile
from unittest.mock import patch

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.discovery import Discovery
from src.tools import workspace
from src.config import ConfigLoader, GlobalConfig

class TestDiscovery(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        self.dev_root = os.path.join(self.tmp_dir, "dev")
        os.makedirs(self.dev_root)
        
        # Create dummy repos
        self.repo1 = os.path.join(self.dev_root, "repo-one")
        os.makedirs(os.path.join(self.repo1, ".git"))
        
        self.repo2 = os.path.join(self.dev_root, "repo-two")
        os.makedirs(os.path.join(self.repo2, ".git"))
        
        # Make a nested one (should be found if recursive logic works, but standard walk handles top level?)
        # My implementation uses os.walk so it SHOULD find duplicates deeply nested.
        self.repo3 = os.path.join(self.dev_root, "group", "repo-three")
        os.makedirs(os.path.join(self.repo3, ".git"))
        
        ConfigLoader._instance = GlobalConfig(root_path=self.dev_root)

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    async def test_scan_finds_repos(self):
        workspaces = Discovery.scan()
        ids = [ws.id for ws in workspaces]
        
        self.assertIn("dev-root", ids)
        self.assertIn("repo-one", ids)
        self.assertIn("repo-two", ids)
        self.assertIn("repo-three", ids)
        
        # Check tool output format
        res = await workspace.list()
        self.assertEqual(len(res), 4) # root + 3 repos
        
        root_ws = next(w for w in res if w["workspace_id"] == "dev-root")
        self.assertEqual(root_ws["kind"], "root")
        
        repo_ws = next(w for w in res if w["workspace_id"] == "repo-one")
        self.assertEqual(repo_ws["kind"], "repo")

if __name__ == "__main__":
    unittest.main()
