# AGENTS.md

## Vault Law
This repository (`atoms-agents`) serves as the strict contract boundary for Agent Definitions and Runtime execution. It is the single source of truth for Agent Identity, Reasoning Profiles, and Capability Licensing.

## Cards Only
All entities in this registry must be defined as **Atomic Cards** (YAML files with a `card_type`).
*   Agents are compositions of other cards (Models, Personas, Tasks, Reasoning Profiles).
*   No monolithic configuration files are allowed.
*   Logic resides in the Runtime, State resides in the Cards.

## Repo Boundary
`atoms-agents` is a self-contained unit comprising:
1.  **Registry**: The database of atomic cards.
2.  **Runtime**: The execution engine (adapters, providers, modes).
3.  **Workbench**: The API surface for interacting with agents.

This repository consumes `atoms-core` (if applicable) but maintains strict separation from `northstar-engines` (stateful OS) and `agentflow` (UI).
