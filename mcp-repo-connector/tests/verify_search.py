import unittest
import sys
import os
import asyncio
import json

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from src.tools import read
from src.config import ConfigLoader, GlobalConfig, WorkspaceConfig

class TestSearch(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        # Setup dummy config
        self.tmp_dir = os.path.abspath("tests/dummy_repo")
        os.makedirs(self.tmp_dir, exist_ok=True)
        
        # Create some files
        with open(os.path.join(self.tmp_dir, "hello.py"), "w") as f:
            f.write("def hello():\n    print('Hello world')\n")
            
        with open(os.path.join(self.tmp_dir, "ignored.txt"), "w") as f:
            f.write("ignored content")
            
        # Mock ConfigLoader
        # We need to hack the singleton
        ConfigLoader._instance = GlobalConfig(
            workspaces={
                "test": WorkspaceConfig(root_path=self.tmp_dir)
            },
            enable_writes=False
        )
        
    async def test_search_and_fetch(self):
        # 1. Search
        hits = await read.search("Hello world", workspace_id="test")
        self.assertTrue(len(hits) > 0)
        hit = hits[0]
        
        self.assertEqual(hit["workspace_id"], "test")
        self.assertIn("hello.py", hit["path"])
        self.assertEqual(hit["line"], 2)
        
        # 2. Fetch using stable ID
        hit_id = hit["id"]
        # ID format: {ws}:{path}:{line}:{line}:{hash}
        print(f"Testing ID: {hit_id}")
        
        result = await read.fetch(hit_id)
        self.assertIn("def hello():", result["content"])
        self.assertIn("print('Hello world')", result["content"])
        
    async def asyncTearDown(self):
        import shutil
        if os.path.exists(self.tmp_dir):
            shutil.rmtree(self.tmp_dir)

if __name__ == "__main__":
    unittest.main()
