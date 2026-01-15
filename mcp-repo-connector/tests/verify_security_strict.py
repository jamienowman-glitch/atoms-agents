import unittest
import sys
import os
import shutil
import tempfile

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.security import Security
from src.config import ConfigLoader, GlobalConfig

class TestSecurityStrict(unittest.TestCase):
    def setUp(self):
        # Create a mock dev root
        self.tmp_dir = tempfile.mkdtemp()
        self.dev_root = os.path.join(self.tmp_dir, "dev")
        os.makedirs(self.dev_root)
        
        # Mock Config to point to this temp root
        ConfigLoader._instance = GlobalConfig(root_path=self.dev_root)
        
    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_within_root(self):
        # Safe paths
        self.assertTrue(Security.is_path_safe(os.path.join(self.dev_root, "project", "safe.txt")))
        self.assertTrue(Security.is_path_safe(os.path.join(self.dev_root, "safe.py")))

    def test_outside_root(self):
        # Path escape
        self.assertFalse(Security.is_path_safe(os.path.join(self.tmp_dir, "outside.txt")))
        self.assertFalse(Security.is_path_safe("/etc/passwd"))

    def test_denylist_exact(self):
        # .env
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, ".env")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "repo", ".env")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "repo", ".env.local")))

    def test_denylist_patterns(self):
        # Keys
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "private.key")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "id_rsa")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "cert.pem")))
        
        # Content match
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "my_credentials.json")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "api_token.txt")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "secret_config.yaml")))

    def test_denylist_directories(self):
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, ".aws", "config")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, ".ssh", "known_hosts")))
        self.assertFalse(Security.is_path_safe(os.path.join(self.dev_root, "gcloud", "credentials.db")))

if __name__ == "__main__":
    unittest.main()
