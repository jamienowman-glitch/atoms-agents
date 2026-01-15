import sys
import os
print(f"Start debug. CWD: {os.getcwd()}", flush=True)
print(f"Path: {sys.path}", flush=True)

try:
    import runtime
    print("Imported runtime pkg", flush=True)
    from runtime.crewai.adapter import CrewAIAdapter
    print("Imported CrewAIAdapter", flush=True)
except Exception as e:
    print(f"FAIL: {e}", flush=True)
    import traceback
    traceback.print_exc()
