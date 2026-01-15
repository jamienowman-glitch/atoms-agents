# Modes: LangGraph

## 1. StateGraph (General)
The core orchestration engine. Defines nodes and edges.
- **Param**: `state_schema` (Pydantic/TypedDict)
- **Streaming**: `stream_mode="values"`, `stream_mode="updates"`

## 2. CompiledGraph
The runnable artifact produced by `graph.compile()`.
- **Invoke**: `.invoke(input)`
- **Stream**: `.stream(input)`
