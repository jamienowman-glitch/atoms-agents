import inspect
try:
    from crewai.flow.persistence import SQLiteFlowPersistence
    print(f"Signature: {inspect.signature(SQLiteFlowPersistence.load_state)}")
except ImportError:
    print("ImportError")
