
import os
import sys
import asyncio
from flask import Flask, render_template, request, jsonify, send_file
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Initialize Flask
app = Flask(__name__, template_folder=".", static_folder="static")

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

async def run_extraction_muscle(video_path: str, add_to_library: bool = False):
    """
    Connects to the muscle process via MCP and requests extraction.
    """
    # Define server parameters
    server_params = StdioServerParameters(
        command=sys.executable,
        args=[os.path.join(os.path.dirname(__file__), "audio_extractor_muscle.py")],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize connection
            await session.initialize()
            
            # List tools to confirm (optional, good for debugging)
            # tools = await session.list_tools()
            
            # Call the tool
            result = await session.call_tool("extract_audio", arguments={"video_path": video_path, "add_to_library": add_to_library})
            return result

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "video" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["video"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = file.filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            # Run extraction async
            # fastmcp returns ToolResult, we need compatibility
            add_to_library = request.form.get("music_library") == "true"
            content = asyncio.run(run_extraction_muscle(filepath, add_to_library))
            
            # Parse result. FastMCP tools return a list of content blocks.
            # Our tool returns the path as a string in the text.
            output_path = content.content[0].text
            
            return jsonify({
                "status": "success", 
                "message": "Extraction complete", 
                "download_url": f"/download?path={output_path}"
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/download", methods=["GET"])
def download():
    path = request.args.get("path")
    if not path or not os.path.exists(path):
        return "File not found", 404
    
    return send_file(path, as_attachment=True)

if __name__ == "__main__":
    # Host 0.0.0.0 for local network access (PPWA)
    app.run(host="0.0.0.0", port=8000, debug=True)
