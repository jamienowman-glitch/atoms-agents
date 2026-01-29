import logging
import json
from mcp.server.fastmcp import FastMCP
from .service import AudioFxChainService
from atoms_core.src.audio.audio_fx_chain.models import FxChainRequest
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_fx_chain")

# Initialize Service
service = AudioFxChainService()

@mcp.tool()
@require_snax()
def run_audio_fx_chain(
    tenant_id: str,
    env: str,
    preset_id: str,
    artifact_id: str = None,
    asset_id: str = None,
    params_override: str = None, # JSON string
    dry_wet: float = 1.0,
    output_format: str = "wav"
) -> dict:
    """
    Applies an FX chain preset to audio.
    params_override should be a JSON string.
    """
    try:
        overrides = {}
        if params_override:
             try:
                 overrides = json.loads(params_override)
             except Exception:
                 return {"error": "Invalid params_override JSON"}

        req = FxChainRequest(
            tenant_id=tenant_id,
            env=env,
            artifact_id=artifact_id,
            asset_id=asset_id,
            preset_id=preset_id,
            params_override=overrides,
            dry_wet=dry_wet,
            output_format=output_format
        )
        result = service.apply_fx(req)
        return result.model_dump()
    except Exception as e:
        logging.error(f"Error in run_audio_fx_chain: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
