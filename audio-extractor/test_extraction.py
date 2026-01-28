
import asyncio
import os
import sys

# Add current dir to sys.path to find muscle
sys.path.append(os.path.dirname(__file__))

from audio_extractor_muscle import mcp

async def verify_tools():
    print("Verifying imports and tool registration...")
    try:
        tools = await mcp.list_tools()
        print(f"Tools available: {[t.name for t in tools]}")
        if "extract_audio" in [t.name for t in tools]:
            print("SUCCESS: Audio Muscle is ready.")
        else:
            print("FAILURE: Tool not registered.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(verify_tools())
