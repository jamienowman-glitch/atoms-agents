import json
import os
from typing import Protocol, List
from northstar.runtime.audit.events import AuditEvent

class AuditEmitter(Protocol):
    def emit(self, event: AuditEvent) -> None:
        ...

class ConsoleAuditEmitter:
    def emit(self, event: AuditEvent) -> None:
        # Simple print for debug, maybe rich logging later
        print(f"[AUDIT] {event.timestamp} | {event.event_type.value} | {event.node_id or 'Global'} | {event.payload}")

class JSONLFileEmitter:
    def __init__(self, filepath: str):
        self.filepath = filepath
        # Ensure dir exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    def emit(self, event: AuditEvent) -> None:
        with open(self.filepath, "a", encoding="utf-8") as f:
            f.write(json.dumps(event.to_dict()) + "\n")

class CompositeAuditEmitter:
    def __init__(self, emitters: List[AuditEmitter]):
        self.emitters = emitters

    def emit(self, event: AuditEvent) -> None:
        for emitter in self.emitters:
            try:
                emitter.emit(event)
            except Exception as e:
                print(f"Error emitting audit event: {e}")
