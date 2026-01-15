
import json
from typing import List, Dict, Any
from northstar.registry.schemas import ArtifactSpecCard
from northstar.core.paths import get_artifacts_dir

class ArtifactWriter:
    @staticmethod
    def write_artifacts(
        specs: List[ArtifactSpecCard], 
        content_map: Dict[str, Any] # map of spec_id -> content
    ) -> List[str]:
        written_paths = []
        artifacts_dir = get_artifacts_dir()
        
        for spec in specs:
            content = content_map.get(spec.artifact_spec_id)
            if content is None:
                continue
                
            # Determine filename
            # Simplification: use spec_id + extension based on kind
            ext = ".txt"
            if spec.artifact_kind == "markdown":
                ext = ".md"
            elif spec.artifact_kind == "json":
                ext = ".json"
            elif spec.artifact_kind == "code":
                ext = ".py" # Generic assumption for now, could check mime
                
            filename = f"{spec.artifact_spec_id}{ext}"
            path = artifacts_dir / filename
            
            with open(path, "w") as f:
                if spec.artifact_kind == "json" and not isinstance(content, str):
                    json.dump(content, f, indent=2)
                else:
                    f.write(str(content))
                    
            written_paths.append(str(path))
            
        return written_paths
