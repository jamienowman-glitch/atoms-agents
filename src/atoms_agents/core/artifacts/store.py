from abc import ABC, abstractmethod
from typing import List, Optional
from .models import ArtifactRef

class ArtifactStore(ABC):
    @abstractmethod
    def save_artifact(self, content: bytes, artifact_type: str, name: Optional[str] = None) -> ArtifactRef:
        """Saves content and returns a reference."""
        pass

    @abstractmethod
    def load_artifact(self, ref: ArtifactRef) -> bytes:
        """Loads content from a reference."""
        pass

    @abstractmethod
    def list_artifacts(self) -> List[ArtifactRef]:
        """Lists all stored artifacts."""
        pass
