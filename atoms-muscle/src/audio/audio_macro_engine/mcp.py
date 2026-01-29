import logging
import json
from mcp.server.fastmcp import FastMCP
from .service import AudioMacroEngineService
from atoms_core.src.audio.audio_macro_engine.models import MacroRequest
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_macro_engine")

# Initialize Service
service = AudioMacroEngineService()

@mcp.tool()
@require_snax()
def run_audio_macro(
    tenant_id: str,
    env: str,
    artifact_id: str,
    macro_id: str,
    knob_overrides: str = None, # JSON string
    output_format: str = "wav"
) -> dict:
    """
    Executes an Audio Macro on an artifact.
    knob_overrides should be a JSON string.
    """
    try:
        overrides = {}
        if knob_overrides:
             try:
                 overrides = json.loads(knob_overrides)
             except Exception:
                 return {"error": "Invalid knob_overrides JSON"}

        req = MacroRequest(
            tenant_id=tenant_id,
            env=env,
            artifact_id=artifact_id,
            macro_id=macro_id,
            knob_overrides=overrides,
            output_format=output_format
        )
        result = service.execute_macro(req)
        return result.model_dump()
    except Exception as e:
        logging.error(f"Error in run_audio_macro: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
