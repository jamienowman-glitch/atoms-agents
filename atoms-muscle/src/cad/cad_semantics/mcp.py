"""
MCP Wrapper for CAD Semantics.
"""
import os
from typing import Optional

from mcp.server.fastmcp import FastMCP
from atoms_core.src.cad.models import CadIngestRequest, UnitKind
from atoms_muscle.src.cad.cad_ingest.service import get_cad_ingest_service
from .service import get_semantic_service

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_semantics")

@mcp.tool()
def run_cad_semantics(
    input_path: str,
    rule_version: str = "1.0.0",
    tenant_id: str = "default",
    env: str = "dev"
) -> dict:
    """
    Semanticize a CAD file: Ingest -> Classify -> Build Graph.

    Args:
        input_path: Path to local CAD file
        rule_version: Version of classification rules
        tenant_id: Tenant ID
        env: Environment
    """
    # Verify file
    if not os.path.exists(input_path):
        return {"error": f"File not found: {input_path}"}

    # Step 1: Ingest (Internal dependency)
    try:
        with open(input_path, "rb") as f:
            content = f.read()

        ingest_svc = get_cad_ingest_service()
        ingest_req = CadIngestRequest(
            file_uri=input_path,
            tenant_id=tenant_id,
            env=env
        )
        cad_model, _ = ingest_svc.ingest(content, ingest_req)

    except Exception as e:
        return {"error": f"Ingest failed: {str(e)}"}

    # Step 2: Semanticize
    try:
        sem_svc = get_semantic_service()
        sem_model, response = sem_svc.semanticize(
            cad_model=cad_model,
            rule_version=rule_version,
            cad_model_id=cad_model.id
        )

        # Stub artifact registration
        # artifact_id = sem_svc.register_artifact(cad_model.id, sem_model)
        # response.semantic_artifact_id = artifact_id

        return response.model_dump()

    except Exception as e:
        return {"error": f"Semantics failed: {str(e)}"}

if __name__ == "__main__":
    mcp.run()
