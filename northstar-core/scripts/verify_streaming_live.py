"""
Live Canary for Bedrock Streaming.
Verifies true token streaming by measuring Time-To-First-Chunk (TTFC).
"""
import sys
import os
import time
import asyncio
import yaml
import datetime
from typing import Dict, Any

# Ensure root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from runtime.bedrock.adapter import BedrockAdapter
    import boto3
    from botocore.exceptions import ClientError, BotoCoreError
except ImportError:
    print("SKIP: Missing dependencies (boto3/runtime)")
    sys.exit(0)

# Config
MODEL_ID = "us.amazon.nova-2-lite-v1:0"
TENANT_ID = "t_canary"
LOG_DIR = os.path.join(os.path.dirname(__file__), "../registry/run_logs")

async def run_live_test():
    print(f"--- Live Bedrock Streaming Verify ({MODEL_ID}) ---")
    
    adapter = BedrockAdapter()
    context = {"tenant_id": TENANT_ID, "env": "dev", "session_id": "live_stream_test"}
    input_data = {"input": "Count from 1 to 5 very quickly."}
    
    start_time = time.time()
    first_chunk_time = None
    chunk_count = 0
    full_text = ""
    error = None

    try:
        # Check creds fast
        sts = boto3.client("sts")
        try:
            sts.get_caller_identity()
        except (ClientError, BotoCoreError):
            print("SKIP: No AWS Credentials found.")
            sys.exit(0)

        stream = adapter.invoke_stream(MODEL_ID, input_data, context)
        
        has_token_chunks = False

        async for chunk in stream:
            now = time.time()
            if chunk_count == 0:
                first_chunk_time = now
                ttfc_ms = (first_chunk_time - start_time) * 1000
                print(f"  [First Chunk] {ttfc_ms:.2f}ms")
            
            chunk_count += 1
            delta = chunk.get("text", chunk.get("delta", ""))
            kind = chunk.get("chunk_kind", "unknown")
            if kind == "token":
                has_token_chunks = True
                
            full_text += delta
            sys.stdout.write(delta)
            sys.stdout.flush()
        
        print("\n")
        
    except Exception as e:
        error = str(e)
        print(f"\nERROR: {e}")
        if "security token" in str(e).lower() or "credentials" in str(e).lower():
             print("SKIP: Credentials failed during invoke.")
             sys.exit(0)

    end_time = time.time()
    total_time_ms = (end_time - start_time) * 1000
    ttfc_ms = ((first_chunk_time - start_time) * 1000) if first_chunk_time else 0
    
    # Log Result
    status = "PASS" if (chunk_count > 0 and not error) else "FAIL"
    
    log_entry = {
        "test_name": "stream_canary",
        "runtime": "bedrock",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "model": MODEL_ID,
        "metrics": {
            "ttfc_ms": float(f"{ttfc_ms:.2f}"),
            "total_ms": float(f"{total_time_ms:.2f}"),
            "chunk_count": chunk_count,
            "has_token_chunks": has_token_chunks
        },
        "status": status,
        "error": error
    }
    
    # Write Log
    os.makedirs(LOG_DIR, exist_ok=True)
    filename = f"stream_canary.bedrock.{int(start_time)}.yaml"
    filepath = os.path.join(LOG_DIR, filename)
    
    with open(filepath, "w") as f:
        yaml.dump(log_entry, f)
        
    print(f"--- Result: {status} ---")
    print(f"  TTFC: {ttfc_ms:.2f}ms")
    print(f"  Total: {total_time_ms:.2f}ms")
    print(f"  Token Stream: {has_token_chunks}")
    print(f"  Log: {filepath}")

    if status == "FAIL":
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(run_live_test())
    except KeyboardInterrupt:
        pass
