from mcp.server.fastmcp import FastMCP
from .service import VoiceEnhanceBackend
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_voice_enhance")

# Initialize Service
service = VoiceEnhanceBackend()

@mcp.tool()
@require_snax()
def run_audio_voice_enhance(input_path: str, **kwargs) -> dict:
    """
    Executes the VoiceEnhanceBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
