import crewai
import inspect

try:
    import crewai.flow.flow as flow_pkg
    print(f"crewai.flow.flow contents: {dir(flow_pkg)}")
    
    if hasattr(flow_pkg, "persist"):
        print("FOUND persist in crewai.flow.flow")
    else:
        print("MISSING persist in crewai.flow.flow")

    # Check root
    print(f"crewai version: {crewai.__version__}")

except ImportError as e:
    print(f"ImportError: {e}")

# Try to find it
import importlib
def find_persist(module_name):
    try:
        mod = importlib.import_module(module_name)
        if hasattr(mod, "persist"):
            print(f"FOUND persist in {module_name}")
    except: pass

find_persist("crewai.flow.persistence")
find_persist("crewai.flow.flow")
find_persist("crewai.flow")
