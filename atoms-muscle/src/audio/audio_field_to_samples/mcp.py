from mcp.server.fastmcp import FastMCP
from .service import AudioFieldToSamplesService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_field_to_samples")

# Initialize Service
service = AudioFieldToSamplesService()

@mcp.tool()
@require_snax()
def run_audio_field_to_samples(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioFieldToSamplesService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
