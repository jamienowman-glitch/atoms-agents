from typing import Any, Dict, List, Optional, Callable
import datetime

class Blackboard:
    """
    A first-class Blackboard primitive for managing shared state between Agents/Steps.
    Enforces explict read/write contracts and provides hooks for logging.
    """
    def __init__(self, name: str = "global", log_callback: Optional[Callable[[str, Any], None]] = None):
        self.name = name
        self._store: Dict[str, Any] = {}
        self._log_callback = log_callback

    def read(self, key: str) -> Any:
        """
        Reads a key from the blackboard.
        Raises KeyError if missing (Strict Enforcement).
        Emits BLACKBOARD_READ event.
        """
        if key not in self._store:
            raise KeyError(f"Blackboard '{self.name}': Key '{key}' not found. Dependency unsatisfied.")
        
        val = self._store[key]
        
        # Telemetry / Logging
        if self._log_callback:
            preview = str(val)[:50] + "..." if len(str(val)) > 50 else str(val)
            self._log_callback("BLACKBOARD_READ", f"Read '{key}' from '{self.name}': {preview}")
            
        return val

    def write(self, key: str, value: Any) -> None:
        """
        Writes a key to the blackboard.
        Emits BLACKBOARD_WRITE event.
        """
        self._store[key] = value
        
        # Telemetry / Logging
        if self._log_callback:
            preview = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
            self._log_callback("BLACKBOARD_WRITE", f"Wrote '{key}' to '{self.name}': {preview}")

    def get_all(self) -> Dict[str, Any]:
        return self._store.copy()
