import inspect
try:
    from crewai.flow.persistence import SQLiteFlowPersistence
    print(f"Signature: {inspect.signature(SQLiteFlowPersistence.__init__)}")
except ImportError:
    print("ImportError")
