
import asyncio
import httpx
import json
import sys

# The public URL we are testing
BASE_URL = "https://app.squared-agents.app"
SSE_URL = f"{BASE_URL}/mcp/sse"

async def verify_mcp_connection():
    print(f"Testing connection to: {SSE_URL}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Connect to SSE and get the message endpoint
        print("1. Connecting to SSE endpoint...")
        try:
            async with client.stream("GET", SSE_URL) as response:
                if response.status_code != 200:
                    print(f"FAILED: SSE endpoint returned {response.status_code}")
                    print(response.headers)
                    sys.exit(1)
                
                print("   SSE Connected (200 OK). Waiting for endpoint event...")
                
                messages_url = None
                
                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line: continue
                    print(f"   Received: {line}")
                    
                    if line.startswith("data:"):
                        data_str = line[5:].strip()
                        try:
                            data = json.loads(data_str)
                            # Expecting: {"event": "endpoint", "data": "/mcp/messages"}
                            # Note: The server sends: json.dumps({"event": "endpoint", "data": "/mcp/messages"}) 
                            # inside the data field? 
                            # Let's check src/main.py: 
                            # yield json.dumps({"event": "endpoint", "data": "/mcp/messages"})
                            # So the line is "data: {"event": "endpoint", "data": "/mcp/messages"}"
                            
                            if "data" in data and "/mcp/messages" in data["data"]:
                                messages_url = f"{BASE_URL}{data['data']}"
                                print(f"   Found messages endpoint: {messages_url}")
                                break
                        except json.JSONDecodeError:
                            pass
                
                if not messages_url:
                    print("FAILED: Did not receive valid endpoint event from SSE stream")
                    sys.exit(1)

        except Exception as e:
            print(f"FAILED to connect to SSE: {e}")
            sys.exit(1)

    # Step 2: Send Initialize Request to the Messages Endpoint
    print("\n2. Sending Initialize Request...")
    init_msg = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "test-client", "version": "1.0"}
        }
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(messages_url, json=init_msg)
            if resp.status_code != 200:
                print(f"FAILED: POST to messages returned {resp.status_code}")
                print(resp.text)
                sys.exit(1)
                
            resp_data = resp.json()
            print(f"   Received response: {json.dumps(resp_data, indent=2)}")
            
            if "result" in resp_data:
                print("\nSUCCESS: MCP Connection Verified! Server is responding correctly.")
            else:
                print("\nFAILED: Invalid JSON-RPC response")
                sys.exit(1)
                
        except Exception as e:
            print(f"FAILED to send/receive message: {e}")
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(verify_mcp_connection())
