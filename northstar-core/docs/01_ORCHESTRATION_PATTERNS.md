# Orchestration Patterns

`northstar-core` supports multiple runtime orchestration patterns. Each pattern is exposed via a thin adapter that adheres to the `RuntimeAdapter` interface (see [runtimes.md](./runtimes.md)).

## Selection Criteria

| Runtime | Primary Use Case | Complexity | When to Use |
| :--- | :--- | :--- | :--- |
| **LangGraph** | Cyclic Graphs | High | Complex logic, cyclic dependencies, state machines, "agentic" loops (plan-execute-reflect). |
| **ADK (Vertex)** | Enterprise Agents | Medium | When running strictly on Google Vertex AI infrastructure, leveraging proprietary extensions/connectors. |
| **Strands** | Linear Sequences | Low | Deterministic pipelines, data processing chains, simple request-response flows without backtracking. |
| **AutoGen** | Multi-Agent Swarms | High | Negotiations, role-playing simulations, complex multi-party interactions where agents "automonomously" converse. |

## Usage

Core invokes all runtimes uniformly. The choice of runtime is determined by the `type` or configuration within the Card, or by the specific service calling the adapter.

### Common Interface
```python
# Pseudo-code example of how Core calls an adapter
result = adapter.invoke(
    card_id="registry/cards/my-flow.yaml",
    input_data={"query": "Hello"},
    context={"tenant_id": "t_demo", "env": "dev"}
)
```

### LangGraph (`runtime/langgraph`)
*   **Backing Framework**: LangGraph (LangChain ecosystem).
*   **Card Role**: Defines the graph structure (nodes, edges) and initial state.
*   **Adapter Role**: Builds the graph from the Card definition and invokes `app.invoke()`.

### ADK (`runtime/adk`)
*   **Backing Framework**: Google Vertex AI Agent Development Kit.
*   **Card Role**: Defines the agent configuration (model, tools, instructions).
*   **Adapter Role**: Authenticates with GCP and wrappers the ADK client.

### Strands (`runtime/strands`)
*   **Backing Framework**: Internal linear execution engine (or simple list processing).
*   **Card Role**: Defines a list of linear steps.
*   **Adapter Role**: Iterates through steps sequentially.

### AutoGen (`runtime/autogen`)
*   **Backing Framework**: Microsoft AutoGen.
*   **Card Role**: Defines agents (Assistant, UserProxy) and their interaction rules (speaker selection).
*   **Adapter Role**: Instantiates agents and initiates the chat.
