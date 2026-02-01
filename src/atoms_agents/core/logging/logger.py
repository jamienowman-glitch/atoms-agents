import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional

class StructuredLogger:
    def __init__(self, log_dir: str) -> None:
        self.log_dir = log_dir
        if not os.path.exists(log_dir):
            os.makedirs(log_dir, exist_ok=True)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        self.log_file = os.path.join(log_dir, f"run_{timestamp}.jsonl")

    def _write(self, level: str, message: str, extra: Optional[Dict[str, Any]] = None) -> None:
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
            **(extra or {})
        }
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")

    def info(self, message: str, **kwargs: Any) -> None:
        self._write("INFO", message, kwargs)

    def warn(self, message: str, **kwargs: Any) -> None:
        self._write("WARN", message, kwargs)

    def error(self, message: str, **kwargs: Any) -> None:
        self._write("ERROR", message, kwargs)

    def debug(self, message: str, **kwargs: Any) -> None:
        self._write("DEBUG", message, kwargs)
