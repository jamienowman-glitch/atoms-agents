import inspect
try:
    from crewai.flow.persistence import SQLiteFlowPersistence
    print(f"Methods: {dir(SQLiteFlowPersistence)}")
except ImportError:
    print("ImportError")
