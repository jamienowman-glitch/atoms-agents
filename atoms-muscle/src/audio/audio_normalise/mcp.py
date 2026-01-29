import logging
from mcp.server.fastmcp import FastMCP
from .service import AudioNormaliseService
from atoms_core.src.audio.audio_normalise.models import NormaliseRequest
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_normalise")

# Initialize Service
service = AudioNormaliseService()

@mcp.tool()
@require_snax()
def run_audio_normalise(
    tenant_id: str,
    env: str,
    artifact_id: str = None,
    asset_id: str = None,
    target_lufs: float = -14.0,
    peak_ceiling_dbfs: float = -1.0,
    output_format: str = "wav"
) -> dict:
    """
    Normalizes audio to target LUFS and peak.
    """
    try:
        req = NormaliseRequest(
            tenant_id=tenant_id,
            env=env,
            artifact_id=artifact_id,
            asset_id=asset_id,
            target_lufs=target_lufs,
            peak_ceiling_dbfs=peak_ceiling_dbfs,
            output_format=output_format
        )
        result = service.normalise_asset(req)
        return result.model_dump()
    except Exception as e:
        logging.error(f"Error in run_audio_normalise: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
