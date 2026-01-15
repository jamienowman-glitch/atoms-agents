import importlib
import inspect

def find_class(module_name, class_name):
    try:
        mod = importlib.import_module(module_name)
        if hasattr(mod, class_name):
            print(f"FOUND {class_name} in {module_name}")
            return
        
        # Check submodules?
        # print(f"Dir {module_name}: {dir(mod)}")
    except ImportError:
        pass

targets = [
    "crewai.flow.persistence",
    "crewai.flow.persistence.sqlite_flow_persistence",
    "crewai.flow.flow",
    "crewai.flow"
]

for t in targets:
    find_class(t, "SQLiteFlowPersistence")
