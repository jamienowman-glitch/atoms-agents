import threading

class OperationCancelledError(Exception):
    pass

class CancellationToken:
    def __init__(self) -> None:
        self._cancelled_event = threading.Event()

    def cancel(self) -> None:
        """Signals that the operation should be cancelled."""
        self._cancelled_event.set()

    def is_cancelled(self) -> bool:
        """Returns True if cancellation has been requested."""
        return self._cancelled_event.is_set()

    def raise_if_cancelled(self) -> None:
        """Raises OperationCancelledError if cancellation has been requested."""
        if self.is_cancelled():
            raise OperationCancelledError("Operation cancelled")
