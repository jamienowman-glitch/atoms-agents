"""
Unified Entry Point for Junior Agent Security.
Handles both CLI (MCP) and GUI (Dashboard) modes.
"""
import sys
import uvicorn
import webbrowser
import threading
import time
import argparse
from .mcp_server import mcp

def run_dashboard():
    """Runs the Dashboard server."""
    from .dashboard.app import app
    uvicorn.run(app, host="127.0.0.1", port=9090, log_level="error")

def run_gui_mode():
    """
    Simulates the Desktop App experience.
    Stars dashboard in background thread and opens browser.
    """
    print("🛡️ Junior Agent Security Sidecar Starting...")
    print("   Launch Mode: Desktop (Dashboard)")
    
    # Start Dashboard Server in Thread
    t = threading.Thread(target=run_dashboard, daemon=True)
    t.start()
    
    # Open Browser
    time.sleep(1) # Give server time to start
    print("   Opening Dashboard at http://localhost:9090")
    webbrowser.open("http://localhost:9090")
    
    # Keep main thread alive (or maybe run MCP here too?)
    # If we run MCP here, it blocks stdio, which might confuse the user if they ran it from term.
    # But if double-clicked, stdio goes nowhere usually.
    # Let's just keep it alive for the Dashboard.
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping...")

def main():
    parser = argparse.ArgumentParser(description="Junior Agent Security Sidecar")
    subparsers = parser.add_subparsers(dest="command")
    
    # Subcommand: call (for CLI usage like setup)
    call_parser = subparsers.add_parser("call", help="Call an MCP tool directly")
    call_parser.add_argument("tool", help="Tool name")
    call_parser.add_argument("--secret", help="TOTP secret (for verification)")
    call_parser.add_argument("--code", help="TOTP code")
    
    # Subcommand: mcp (for IDE integration)
    mcp_parser = subparsers.add_parser("mcp-serve", help="Run MCP Server (Stdio)")
    
    args, unknown = parser.parse_known_args()
    
    # If no args -> GUI Mode (Double Click behavior)
    if not args.command:
        run_gui_mode()
        return

    # MCP Mode
    if args.command == "mcp-serve":
        mcp.run()
        return
        
    # Call Mode (CLI wrappers for tools)
    if args.command == "call":
        if args.tool == "setup_totp_generate":
            result = mcp.call_tool("setup_totp_generate", {})
            print(result["ascii_qr"])
            print(f"Secret: {result['secret']}")
            print(f"URI: {result['uri']}")
            
        elif args.tool == "setup_totp_verify":
            if not args.secret or not args.code:
                print("Error: --secret and --code required")
                return
            result = mcp.call_tool("setup_totp_verify", {"secret": args.secret, "code": args.code})
            print(json.dumps(result, indent=2))
            
        else:
            print(f"Unknown tool: {args.tool}")

if __name__ == "__main__":
    import json
    main()
