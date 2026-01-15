import inspect
try:
    from crewai.flow.persistence import persist
    print(f"persist signature: {inspect.signature(persist)}")
    print(f"persist doc: {persist.__doc__}")
except ImportError:
    print("ImportError")
