from abc import ABC, abstractmethod
from typing import Any, List, Optional

class Blackboard(ABC):
    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        pass

    @abstractmethod
    def set(self, key: str, value: Any) -> None:
        pass

    @abstractmethod
    def delete(self, key: str) -> None:
        pass
    
    @abstractmethod
    def list_keys(self) -> List[str]:
        pass
