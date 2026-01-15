# Modes: AutoGen

## 1. RoundRobinGroupChat
Agents speak in a fixed cycle.
- **Class**: `GroupChat` with `speaker_selection_method="round_robin"`

## 2. SelectorGroupChat (Auto)
LLM selects the next speaker.
- **Class**: `GroupChat` with `speaker_selection_method="auto"`
