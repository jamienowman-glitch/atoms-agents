import json
import http.server
import socketserver
from pathlib import Path
from typing import Any, Optional
from northstar.server.api import APIHandler

STATIC_DIR = Path(__file__).parent.parent / "render" / "builder_static"

class BuilderHandler(http.server.SimpleHTTPRequestHandler):
    api_handler = APIHandler()

    def do_GET(self) -> None:
        if self.path.startswith("/api/"):
            self._handle_api("GET")
        else:
            # Serve static files
            if self.path == "/":
                self.path = "/index.html"
            
            # Map path to static dir
            # SimpleHTTPRequestHandler serves relative to CWD usually.
            # We need to serve from STATIC_DIR explicitly.
            file_path = STATIC_DIR / self.path.lstrip("/")
            if file_path.exists() and file_path.is_file():
                self.send_response(200)
                # Guess mime type or let simple handler do it?
                # Simpler: just read and send.
                if self.path.endswith(".html"):
                    self.send_header("Content-type", "text/html")
                elif self.path.endswith(".js"):
                    self.send_header("Content-type", "application/javascript")
                elif self.path.endswith(".css"):
                    self.send_header("Content-type", "text/css")
                self.end_headers()
                
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "File not found")

    def do_POST(self) -> None:
        if self.path.startswith("/api/"):
            length = int(self.headers.get("Content-Length", 0))
            if length > 0:
                body_raw = self.rfile.read(length)
                try:
                    body = json.loads(body_raw)
                except json.JSONDecodeError:
                    body = {}
            else:
                body = {}
            
            self._handle_api("POST", body)
        else:
            self.send_error(405, "Method not allowed")

    def _handle_api(self, method: str, body: Optional[dict[str, Any]] = None) -> None:
        resp = self.api_handler.dispatch(method, self.path, body)
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(resp).encode("utf-8"))

class BuilderServer:
    def __init__(self, port: int = 8765):
        self.port = port
        self.server: Optional[socketserver.TCPServer] = None

    def start(self) -> None:
        # Allow reuse address to prevent "Address already in use" during restarts
        socketserver.TCPServer.allow_reuse_address = True
        self.server = socketserver.TCPServer(("127.0.0.1", self.port), BuilderHandler)
        print(f"Builder server running at http://127.0.0.1:{self.port}")
        self.server.serve_forever()

    def stop(self) -> None:
        if self.server:
            self.server.shutdown()
            self.server.server_close()
