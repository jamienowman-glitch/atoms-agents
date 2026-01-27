from mcp.server.fastmcp import FastMCP
from .service import BatchRenderService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_batch_render")

# Initialize Service
service = BatchRenderService()

@mcp.tool()
def run_video_batch_render(input_path: str, **kwargs) -> dict:
    """
    Executes the BatchRenderService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
