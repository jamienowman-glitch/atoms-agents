from mcp.server.fastmcp import FastMCP
from .service import Service

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_render")

# Initialize Service
service = Service()

@mcp.tool()
def run_video_render(input_path: str, **kwargs) -> dict:
    """
    Executes the Service logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
