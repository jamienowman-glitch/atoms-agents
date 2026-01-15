# Expected Shapes: LangGraph

## Inputs
Dict matching the `state_schema`.
```python
{"messages": [...], "aggregate": "..."}
```

## Outputs
Dict returning the final state (or chunks if streaming).

## Events
- `values`: Full state snapshot.
- `updates`: Node output delta.
