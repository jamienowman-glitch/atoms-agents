
import sys
import os
import subprocess
import shutil
from pathlib import Path

# Add atoms-muscle to path if needed (though we are implementing a standalone muscle here)
# sys.path.append("/Users/jaynowman/dev/atoms-muscle/src")

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    # Fallback or installation instruction if mcp is not found
    # For this side project, we assume the environment has it or we might need a venv
    print("Error: 'mcp' module not found. Please pip install 'mcp'.", file=sys.stderr)
    sys.exit(1)

# Initialize FastMCP Server
mcp = FastMCP("Audio Extractor Muscle")

@mcp.tool()
def extract_audio(video_path: str, output_format: str = "mp3", add_to_library: bool = False) -> str:
    """
    Extracts audio from a video file and saves it as an MP3.
    Optionally adds the file to the Music (iTunes) library.
    Returns the path to the generated audio file.
    """
    video_path_obj = Path(video_path)
    if not video_path_obj.exists():
        raise FileNotFoundError(f"Video file not found: {video_path}")

    # Determine output path
    output_filename = f"{video_path_obj.stem}.{output_format}"
    output_path = video_path_obj.parent / output_filename
    
    # Check for ffmpeg
    ffmpeg_exe = shutil.which("ffmpeg")
    if not ffmpeg_exe:
         raise RuntimeError("ffmpeg not found in PATH. Please install ffmpeg.")

    # Construct command
    # ffmpeg -i input.mp4 -q:a 0 -map a output.mp3
    cmd = [
        ffmpeg_exe,
        "-y", # Overwrite output
        "-i", str(video_path_obj),
        "-q:a", "0", # Best variable bit rate
        "-map", "a", # Map audio streams only (avoids error if no video)
        str(output_path)
    ]
    
    try:
        # Run ffmpeg
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode() if e.stderr else str(e)
        raise RuntimeError(f"FFmpeg extraction failed: {error_msg}")

    if add_to_library:
        try:
            # AppleScript to add to Music/iTunes
            # Using osascript to tell application "Music"
            apple_script = f'tell application "Music" to add POSIX file "{output_path.absolute()}"'
            subprocess.run(["osascript", "-e", apple_script], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            # Don't fail the whole extraction if iTunes add fails, just log it? 
            # Or maybe we append to the returned string?
            print(f"Warning: Failed to add to Music library: {e}", file=sys.stderr)

    return str(output_path)

if __name__ == "__main__":
    mcp.run()
