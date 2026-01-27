from mcp.server.fastmcp import FastMCP
from .service import SubjectDetectionError

# Initialize FastMCP
mcp = FastMCP("muscle-image-image_core")

# Initialize Service
service = SubjectDetectionError()

@mcp.tool()
def run_image_core(input_path: str, **kwargs) -> dict:
    """
    Executes the SubjectDetectionError logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
