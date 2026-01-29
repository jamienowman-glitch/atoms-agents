import logging
from mcp.server.fastmcp import FastMCP
from .service import AudioSeparationService
from atoms_core.src.audio.audio_separation.models import SeparationRequest
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_separation")

# Initialize Service
service = AudioSeparationService()

@mcp.tool()
@require_snax()
def run_audio_separation(
    tenant_id: str,
    env: str,
    artifact_id: str,
    model_name: str = "htdemucs",
    two_stems: str = None
) -> dict:
    """
    Separates audio into stems (drums, bass, vocals, other).
    """
    try:
        req = SeparationRequest(
            tenant_id=tenant_id,
            env=env,
            artifact_id=artifact_id,
            model_name=model_name,
            two_stems=two_stems
        )
        result = service.separate_audio(req)
        return result.model_dump()
    except Exception as e:
        logging.error(f"Error in run_audio_separation: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
