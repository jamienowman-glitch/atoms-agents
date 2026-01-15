# Modes: CrewAI

## 1. Sequential
Tasks are executed one after another.
- **Param**: `process=Process.sequential`

## 2. Hierarchical
A manager agent coordinates the crew.
- **Param**: `process=Process.hierarchical`
- **Requires**: `manager_llm` or `manager_agent`
