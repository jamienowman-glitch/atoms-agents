import os
import tempfile
from unittest import mock
from northstar.core.connectivity import ConnectivityLedger

def test_connectivity_ledger_lifecycle():
    with tempfile.TemporaryDirectory() as tmpdir:
        ledger_path = os.path.join(tmpdir, "connectivity.json")
        
        with mock.patch("northstar.core.connectivity.LEDGER_PATH", ledger_path):
            # 1. Initial State
            assert ConnectivityLedger.check_status("bedrock")["ever_passed"] is False
            assert ConnectivityLedger.is_regressed("bedrock", current_available=False) is False
            
            # 2. Record Pass
            ConnectivityLedger.record_pass("bedrock", "test-mode")
            status = ConnectivityLedger.check_status("bedrock")
            assert status["ever_passed"] is True
            assert status["last_mode_id"] == "test-mode"
            
            # 3. Check Regression
            # If current_available is True, not regressed
            assert ConnectivityLedger.is_regressed("bedrock", current_available=True) is False
            
            # If current_available is False, IS regressed because it passed before
            assert ConnectivityLedger.is_regressed("bedrock", current_available=False) is True
