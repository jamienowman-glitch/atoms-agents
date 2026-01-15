import unittest
import time
from src.state import ServerState

class TestServerState(unittest.TestCase):
    def setUp(self):
        # Reset singleton state
        s = ServerState.get()
        s.write_enabled = False
        s.active_scopes = {"dev-root"}
        s.scope_locked = False
        
    def test_write_expiry(self):
        s = ServerState.get()
        s.enable_writes(duration_minutes=0.001) # 0.06 seconds
        self.assertTrue(s.write_enabled)
        
        time.sleep(0.1)
        # Should raise permission error now that it expired
        with self.assertRaises(PermissionError):
            s.check_write_permission()
        self.assertFalse(s.write_enabled)
        
    def test_scope_locking(self):
        s = ServerState.get()
        s.lock_scope()
        with self.assertRaises(PermissionError):
            s.set_scopes(["other"])
            
    def test_scope_checks(self):
        s = ServerState.get()
        s.active_scopes = {"repo-a"}
        self.assertTrue(s.is_scope_allowed("repo-a"))
        self.assertFalse(s.is_scope_allowed("repo-b"))

if __name__ == "__main__":
    unittest.main()
