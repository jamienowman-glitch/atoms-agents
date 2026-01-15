import json
import time
from datetime import datetime
from threading import Lock
from .config import ConfigLoader

class AuditLogger:
    _lock = Lock()
    
    @classmethod
    def log(cls, tool_name: str, params: dict, result: str = "success", error: str = None):
        config = ConfigLoader.get()
        entry = {
            "timestamp": datetime.now().isoformat(),
            "tool": tool_name,
            "params": params,
            "result": result,
            "error": error
        }
        
        with cls._lock:
            with open(config.audit_log_path, "a") as f:
                f.write(json.dumps(entry) + "\n")
