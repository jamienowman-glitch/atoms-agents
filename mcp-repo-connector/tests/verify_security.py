
import os
import sys
import shutil
import tempfile
import unittest

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.security import Security, SecurityError
from src.config import WorkspaceConfig

class TestSecurity(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        self.config = WorkspaceConfig(root_path=self.tmp_dir)

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_sandbox_allowed(self):
        # File inside root
        path = os.path.join(self.tmp_dir, "foo.txt")
        self.assertTrue(Security.is_path_safe(path, self.config))

    def test_sandbox_denied_parent(self):
        # File outside root
        path = os.path.join(os.path.dirname(self.tmp_dir), "foo.txt")
        self.assertFalse(Security.is_path_safe(path, self.config))

    def test_denylist_env(self):
        path = os.path.join(self.tmp_dir, ".env")
        self.assertFalse(Security.is_path_safe(path, self.config))

    def test_denylist_keys(self):
        path = os.path.join(self.tmp_dir, "my_private.key")
        self.assertFalse(Security.is_path_safe(path, self.config))

    def test_denylist_secrets_dir(self):
        path = os.path.join(self.tmp_dir, "secrets", "passwords.txt")
        self.assertFalse(Security.is_path_safe(path, self.config))
        
    def test_allowed_subdir(self):
        # Config with allowed subdirs
        cfg = WorkspaceConfig(root_path=self.tmp_dir, allowed_subdirs=["public"])
        
        # Root generally not allowed if restricted to subdir? 
        # Implementation detail: validate_path logic uses allowed check if list present.
        
        valid = os.path.join(self.tmp_dir, "public", "file.txt")
        invalid = os.path.join(self.tmp_dir, "private", "file.txt")
        
        self.assertTrue(Security.is_path_safe(valid, cfg))
        self.assertFalse(Security.is_path_safe(invalid, cfg))


if __name__ == "__main__":
    unittest.main()
