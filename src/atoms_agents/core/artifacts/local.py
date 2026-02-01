import os
import uuid
from typing import List, Optional
from .models import ArtifactRef
from .store import ArtifactStore

class LocalArtifactStore(ArtifactStore):
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        if not os.path.exists(base_dir):
            os.makedirs(base_dir, exist_ok=True)
        self._artifacts: List[ArtifactRef] = []

    def save_artifact(self, content: bytes, artifact_type: str, name: Optional[str] = None) -> ArtifactRef:
        artifact_id = str(uuid.uuid4())
        filename = name or f"{artifact_id}"
        filepath = os.path.join(self.base_dir, filename)

        # Avoid collisions if name is reused/provided
        if os.path.exists(filepath) and name is None:
             # If auto-generated name collides (unlikely with uuid), we are in trouble.
             # But if user provided name, we overwrite? Let's overwrite for simplicity of this primitive.
             pass

        with open(filepath, "wb") as f:
            f.write(content)

        uri = f"file://{os.path.abspath(filepath)}"
        ref = ArtifactRef(id=artifact_id, type=artifact_type, uri=uri, metadata={"filename": filename})
        self._artifacts.append(ref)
        return ref

    def load_artifact(self, ref: ArtifactRef) -> bytes:
        if ref.uri.startswith("file://"):
            path = ref.uri[7:]
            with open(path, "rb") as f:
                return f.read()
        raise ValueError(f"Unsupported URI: {ref.uri}")

    def list_artifacts(self) -> List[ArtifactRef]:
        return list(self._artifacts)
