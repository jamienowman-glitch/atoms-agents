from typing import Any
from northstar.server.server import BuilderServer

def serve_builder(ctx: Any, port: int) -> None:
    """Start the interactive builder server."""
    server = BuilderServer(port=port)
    try:
        server.start()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.stop()
