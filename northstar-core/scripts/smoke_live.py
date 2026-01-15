"""
Live Smoke Test Suite for Northstar Core Runtimes.
Verifies connectivity to underlying models/services.

Usage:
  RUN_LIVE=1 python3 scripts/smoke_live.py
"""
import os
import sys
import time
import logging
from typing import Dict, Any, List, Callable
from dataclasses import dataclass

# Ensure root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Configure logging
logging.basicConfig(level=logging.ERROR) # Keep it quiet unless error

@dataclass
class TestResult:
    runtime: str
    status: str
    model: str
    latency: float
    message: str

def get_context() -> Dict[str, Any]:
    return {
        "tenant_id": "t_northstar",
        "env": "dev",
        "user_id": "smoke_tester",
        "surface_id": "smoke_cli",
        "session_id": "smoke_session_1"
    }

def test_bedrock() -> TestResult:
    start = time.time()
    runtime = "runtime/bedrock"
    try:
        from runtime.bedrock.client import run_bedrock
        from runtime.bedrock.types import BedrockRequest
        
        # Use a widely available model
        model_id = "amazon.titan-text-express-v1" 
        
        req = BedrockRequest(
            model_id=model_id,
            user_message="Hello, reply with one word.",
            tenant_id="t_northstar",
            surface_id="smoke_cli",
            session_id="smoke_session_1",
            context=get_context()
        )
        
        resp = run_bedrock(req)
        
        # Check for error in response
        if resp.raw and "error" in resp.raw:
            return TestResult(runtime, "FAIL", model_id, time.time() - start, str(resp.raw["error"]))
            
        return TestResult(runtime, "PASS", model_id, time.time() - start, "OK")
        
    except Exception as e:
        return TestResult(runtime, "FAIL", "N/A", time.time() - start, str(e))

def test_adk() -> TestResult:
    start = time.time()
    runtime = "runtime/adk"
    try:
        # Check env vars first
        if not os.getenv("GCP_PROJECT_ID"):
             return TestResult(runtime, "FAIL", "N/A", 0.0, "Missing GCP_PROJECT_ID")
        
        from runtime.adk.client import run_adk_agent
        from runtime.adk.types import AdkAgentRequest
        
        # Use a small Gemini model
        agent_id = "gemini-2.0-flash"
        
        req = AdkAgentRequest(
            agent_id=agent_id,
            user_message="Hello, reply with one word.",
            tenant_id="t_northstar",
            surface_id="smoke_cli",
            session_id="smoke_session_1",
            context=get_context()
        )
        
        resp = run_adk_agent(req)
        
        if resp.raw and "error" in resp.raw:
             return TestResult(runtime, "FAIL", agent_id, time.time() - start, str(resp.raw["error"]))

        return TestResult(runtime, "PASS", agent_id, time.time() - start, "OK")
        
    except Exception as e:
        return TestResult(runtime, "FAIL", "N/A", time.time() - start, str(e))

def test_orchestrator(name: str) -> TestResult:
    """Generic test for orchestrators that are currently skipped."""
    return TestResult(f"runtime/{name}", "SKIP", "N/A", 0.0, "No live flow defined / Deps not installed")

def main():
    if os.getenv("RUN_LIVE") != "1":
        print("❌ RUN_LIVE=1 is required to run this script.")
        print("This script makes REAL calls which may incur costs.")
        sys.exit(1)

    print("🚀 Starting Live Smoke Tests...\n")
    
    results: List[TestResult] = []
    
    # Run tests
    results.append(test_bedrock())
    results.append(test_adk())
    results.append(test_orchestrator("langgraph"))
    results.append(test_orchestrator("autogen"))
    results.append(test_orchestrator("crewai"))
    results.append(test_orchestrator("strands"))
    
    # Print Table
    print(f"{'RUNTIME':<25} | {'STATUS':<6} | {'MODEL':<25} | {'LATENCY':<8} | {'MESSAGE'}")
    print("-" * 100)
    
    for r in results:
        status_icon = "✅" if r.status == "PASS" else "⏭️" if r.status == "SKIP" else "❌"
        print(f"{r.runtime:<25} | {status_icon} {r.status:<4} | {r.model:<25} | {r.latency:.2f}s   | {r.message}")
        
    print("\nDone.")
    
    # Exit with failure if any FAIL
    if any(r.status == "FAIL" for r in results):
        sys.exit(1)

if __name__ == "__main__":
    main()
