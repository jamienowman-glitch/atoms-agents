import os
import json
import time
from typing import Dict, Any, Optional

LEDGER_PATH = ".northstar/state/connectivity.json"
MODE_LEDGER_PATH = ".northstar/state/modes.json"

class ConnectivityLedger:
    @staticmethod
    def _get_ledger_path() -> str:
        return os.path.abspath(LEDGER_PATH)

    @staticmethod
    def load() -> Dict[str, Any]:
        path = ConnectivityLedger._get_ledger_path()
        if not os.path.exists(path):
            return {}
        try:
            with open(path, "r") as f:
                data: Dict[str, Any] = json.load(f)
                return data
        except Exception:
            return {}

    @staticmethod
    def save(data: Dict[str, Any]) -> None:
        path = ConnectivityLedger._get_ledger_path()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    @staticmethod
    def record_pass(framework: str, mode_id: Optional[str] = None) -> None:
        data = ConnectivityLedger.load()
        if framework not in data:
            data[framework] = {
                "ever_passed": False,
                "history": []
            }

        data[framework]["ever_passed"] = True
        data[framework]["last_pass_ts"] = time.time()
        if mode_id:
            data[framework]["last_mode_id"] = mode_id

        ConnectivityLedger.save(data)

    @staticmethod
    def check_status(framework: str) -> Dict[str, Any]:
        data = ConnectivityLedger.load()
        status: Dict[str, Any] = data.get(framework, {"ever_passed": False})
        return status

    @staticmethod
    def is_regressed(framework: str, current_available: bool) -> bool:
        if current_available:
            return False

        status = ConnectivityLedger.check_status(framework)
        # If it ever passed, but now is not available, it's a regression
        ever_passed: bool = status.get("ever_passed", False)
        return ever_passed

class ModeLedger:
    @staticmethod
    def _get_ledger_path() -> str:
        return os.path.abspath(MODE_LEDGER_PATH)

    @staticmethod
    def load() -> Dict[str, Any]:
        path = ModeLedger._get_ledger_path()
        if not os.path.exists(path):
            return {}
        try:
            with open(path, "r") as f:
                data: Dict[str, Any] = json.load(f)
                return data
        except Exception:
            return {}

    @staticmethod
    def save(data: Dict[str, Any]) -> None:
        path = ModeLedger._get_ledger_path()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    @staticmethod
    def record_pass(mode_id: str, framework: str) -> None:
        data = ModeLedger.load()
        data[mode_id] = {
            "ever_passed": True,
            "last_pass_ts": time.time(),
            "framework": framework,
            "notes": "Automated pass"
        }
        ModeLedger.save(data)

    @staticmethod
    def is_regressed(mode_id: str) -> bool:
        """
        Check if a mode is considered regressed.
        A mode is regressed if it is NOT passing now (context dependent) call,
        BUT it has passed in the past.
        This function just tells you if it has passed in the past.
        Caller determines if current run failed/skipped.
        """
        data = ModeLedger.load()
        if mode_id not in data:
            return False
        val: bool = data[mode_id].get("ever_passed", False)
        return val
