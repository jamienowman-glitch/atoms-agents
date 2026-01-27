from typing import List, Callable, Dict
from .types import Event

EventHandler = Callable[[Event], None]

class EventEmitter:
    def __init__(self) -> None:
        self._listeners: Dict[str, List[EventHandler]] = {}
        self._history: List[Event] = []

    def on(self, event_type: str, handler: EventHandler) -> None:
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(handler)

    def emit(self, event: Event) -> None:
        self._history.append(event)
        if event.type in self._listeners:
            for handler in self._listeners[event.type]:
                try:
                    handler(event)
                except Exception as e:
                    # Prevent one handler from crashing others
                    # simplified error handling for core primitive
                    print(f"Error handling event {event.type}: {e}")

    def get_history(self) -> List[Event]:
        return list(self._history)

    def clear_history(self) -> None:
        self._history.clear()
